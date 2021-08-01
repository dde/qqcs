/**
 * Created by danevans on 4/4/20.
 */
class LogicErr extends Error
{
  constructor(msg) {
    super(msg);
  }
}
// class GatErr extends Error
// {
//   constructor(msg, lex) {
//     super(msg + ' at line ' + String(lex.linenumber) + ':' + String(lex.position));
//   }
// }
class QDeskInterpret
{
  constructor(cfg) {
    let qq = require('./quantum.js');
    if (undefined === QDeskInterpret.single)
    {
      QDeskInterpret.single = this;
    }
    else
    {
      return QDeskInterpret.single;
    }
    this.util = require('util');
    this.Quantum = qq.Quantum;
    this.Complex = qq.Complex;
    this.Matrix = qq.Matrix;
    this.Qubit = Qubit;
    this.Gate = Gate;
    this.NamedGate = NamedGate;
    this.GateFactor = GateFactor;
    this.Ket = Ket;
    if (undefined === cfg)
    {
      this.cfg = {trace:false, kdisp:false, ualt:false, rzeroes:false};
    }
    else
    {
      if (typeof cfg !== 'object')
        this.cfg = {};
      else
        this.cfg = cfg;
      if (typeof cfg.kdisp !== 'boolean')
        this.cfg.kdisp = false;
      if (typeof cfg.trace !== 'boolean')
        this.cfg.trace = false;
      if (typeof cfg.ualt !== 'boolean')
        this.cfg.ualt = false;
      this.Quantum.setUMatrix(this.cfg.ualt);
      if (typeof cfg.rzeroes !== 'boolean')
        this.cfg.rzeroes = false
      this.Matrix.setReplaceZeroes(cfg.rzeroes);
    }
    if (this.cfg.test)
    {
      this.write = this.testwriter;
    }
    else
    {
      this.write = this.writer;
    }
    this.test_out = null;
    this.base_set = {
      'C': null,
      'Cr': null,
      'Cx': null,
      'D': null,
      'Fr':null,
      'H': this.Quantum.hGate,
      'I': this.Quantum.iGate,
      'Im': null,
      'M': null,
      'Rx': null,
      'Ry': null,
      'Rz': null,
      'S': this.Quantum.sGate,
      'Sa': this.Quantum.sGate.adjoint(),
      'Sw': null,
      'T': this.Quantum.tGate,
      'Ta': this.Quantum.tGate.adjoint(),
      'Tf': null,
      'U': null,
      'X': this.Quantum.xGate,
      'Y': this.Quantum.yGate,
      'Z': this.Quantum.zGate,
      '_': this.Quantum.iGate,
    };
    this.inst_set = {};
    this.sym = {};
    this.sym.None = 0;
    this.sym.Eol = this.sym.None + 1;
    this.sym.Gate = this.sym.Eol + 1;
    this.sym.Lparen = this.sym.Gate + 1;
    this.sym.Rparen = this.sym.Lparen + 1;
    this.sym.Comma = this.sym.Rparen + 1;
    this.sym.Minus = this.sym.Comma + 1;
    this.sym.Digit = this.sym.Minus + 1;
    this.sym.Decimal = this.sym.Digit + 1;
    // this.lex = {cix:0,
    //   cln:0,
    //   pbk:null,
    //   token:'',
    //   symbol:this.sym.None,
    //   next_token:this.gate_lexer,
    //   pushback:this.push_back};
  }
  clearFlags() {
    this.cfg.trace = false;
    this.cfg.kdisp = false;
    this.cfg.ualt = false;
    this.Quantum.setUMatrix(this.cfg.ualt);
    this.cfg.rzeroes = false;
    this.Matrix.setReplaceZeroes(this.cfg.rzeroes);
  }
  setFlags(cfg) {
    if (undefined !== cfg.trace)
      this.cfg.trace = Boolean(cfg.trace);
    if (undefined !== cfg.kdisp)
      this.cfg.kdisp = Boolean(cfg.kdisp);
    if (undefined !== cfg.ualt)
    {
      this.cfg.ualt = Boolean(cfg.ualt);
      this.Quantum.setUMatrix(this.cfg.ualt);
    }
    if (undefined !== cfg.rzeroes)
    {
      this.cfg.rzeroes = Boolean(cfg.rzeroes);
      this.Matrix.setReplaceZeroes(this.cfg.rzeroes);
    }
  }
  commentProcessor(cmt) {
    let mch = [];
    mch[0] = cmt.indexOf('$trace');
    mch[1] = cmt.indexOf('$kdisp');
    mch[2] = cmt.indexOf('$ualt');
    mch[3] = cmt.indexOf('$none');
    mch[4] = cmt.indexOf('$rzeroes');
    if (-1 < mch[0])
    {
      this.cfg.trace = !this.cfg.trace;
    }
    if (-1 < mch[1])
    {
      this.cfg.kdisp = !this.cfg.kdisp;
    }
    if (-1 < mch[2])
    {
      this.cfg.ualt = !this.cfg.ualt;
      this.Quantum.setUMatrix(this.cfg.ualt);
      this.inst_set = {};  // clear the cache of any previous U() definitions
    }
    if (-1 < mch[3])
    {
      this.cfg.trace = false;
      this.cfg.kdisp = false;
      this.cfg.ualt = false;
      this.Quantum.setUMatrix(this.cfg.ualt);
      this.cfg.rzeroes = false;
      this.Matrix.setReplaceZeroes(this.cfg.rzeroes);
      this.inst_set = {};  // clear the cache of any previous U() definitions
    }
    if (-1 < mch[4])
    {
      this.cfg.rzeroes = !this.cfg.rzeroes;
      //configReplaceZeroes = !configReplaceZeroes;
      this.Matrix.setReplaceZeroes(this.cfg.rzeroes);
    }
    if (this.cfg.interactive)
    {
      if (0 <= cmt.indexOf('$gate'))
      {
        process.stdout.write('single qubit gates: _ H X Y Z I S T Sa Ta Rx(r) Ry(r) Rz(r) U(r[,r[,r]]) Kp(r) Rp(r) Tp(r)\n');
        process.stdout.write('    r - real multiple of pi, gates may have a control suffix\n');
        process.stdout.write('larger gates: Cx Cr Cct Swct Tfcct Imq Qfq Qaq - c control, t target, q qubits\n');
      }
    }
  }
  getCommentProcessor()
  {
    return this.commentProcessor.bind(this);
  }
  writer(line)
  {
    process.stdout.write(line);
  }
  testwriter(line)
  {
    this.test_out.push(line);
  }
  buildPermutationMatrix(op, qb) {
    let n, sz, ix, pm, prs;
    function scan(str) {
      let cr, st, ln, ch, fs, lft, rgt, pairs;
      fs = lft = rgt = -1;
      pairs = [];
      cr = st = 0;
      ln = str.length;
      scn:
          while (cr < ln)
          {
            ch = str.charAt(cr);
            switch (st)
            {
            case 0: // scanning for left paren
              if (ch === '(')
                st = 1;
              break;
            case 1: // first digit of left pair
              if (ch >= '0' && ch <= '9')
              {
                fs = cr;
                st = 2;
              }
              else
                throw new Error(`state ${st} found ${ch} when expecting digit`);
              break;
            case 2: // period of pair
              if (ch === '.')
              {
                lft = parseInt(str.substring(fs, cr));
                st = 3;
              }
              else if (ch === ',')
              {
                lft = parseInt(str.substring(fs, cr));
                rgt = 0;
                pairs.push([lft, rgt]);
                st = 1;
              }
              else if (ch === ')')
              {
                lft = parseInt(str.substring(fs, cr));
                rgt = 0;
                pairs.push([lft, rgt]);
                st = 5;
              }else if (ch < '0' || ch > '9')
                throw new Error(`state ${st} found ${ch} when expecting digit or period`);
              break;
            case 3: // first digit of right pair
              if (ch >= '0' && ch <= '9')
              {
                fs = cr;
                st = 4;
              }
              else
                throw new Error(`state ${st} found ${ch} when expecting digit`);
              break;
            case 4: // comma or right paren of pair
              if (ch === ',')
              {
                rgt = parseInt(str.substring(fs, cr));
                pairs.push([lft, rgt]);
                st = 1;
              }
              else if (ch === ')')
              {
                rgt = parseInt(str.substring(fs, cr));
                pairs.push([lft, rgt]);
                st = 5;
                break scn;
              }
              else if (ch < '0' || ch > '9')
                throw new Error(`found ${ch} when expecting digit, comma, or right paren`);
              break;
            }
            cr += 1;
          }
      if (st !== 5)
        throw new Error(`state ${st} is not correct termination state`);
      return pairs;
    }
    pm = this.Quantum.buildIn(qb);  /* n-qubit Identity matrix */
    prs = scan(op);
    sz = pm.rows();
    n = prs.length;
    for (ix = 0; ix < n; ++ix)
    {
      if (prs[ix][0] >= sz || prs[ix][1] >= sz)
        throw new Error(`permutation reference (${prs[ix][0]},${prs[ix][1]}) out of range`);
      pm.sub(prs[ix][0], prs[ix][0], this.Quantum.ZERO);
      pm.sub(prs[ix][0], prs[ix][1], this.Quantum.ONE);
    }
    return pm;
  }
  /*
   * A Deutsch Oracle is basically a permutation matrix.  For each basis vector in a |x,y> n-qubit column matrix,
   * where x is the first n-1 bits and y is the last bit, it computes f(x), where f is either a constant or a
   * balanced function, and computes y xor f(x).  If the result is equal to y, no permutation occurs, otherwise
   * the two bases, ...0 and ...1 are swapped.
 */
  buildDeutschOracle(qb, t) {
    let constant, sz, val, ix, jx, cv, icv, oracle, zero, one;
    if (qb < 2)
      throw new Error('number of qubits must be >= 2 for Deutsch oracle');
    sz = Math.pow(2, qb - 1);
    val = new Array(sz);
    constant = Math.random() <= .5;
    cv = Math.floor(Math.random() + .5);
    if (t !== undefined)
    {
      if (t === 0 || t === 1)
      {
        constant = true;
        cv = t;
      }
      else
        constant = false;
    }
    icv = Math.abs(cv - 1);
    for (ix = 0; ix < val.length; ++ix)
    {
      val[ix] = cv;
    }
    if (!constant)
    {
      ix = 0;
      while (ix < val.length / 2)
      {
        jx = Math.floor(Math.random() * val.length);
        while (val[jx] === icv)
        {
          if (++jx === val.length)
            jx = 0;
        }
        val[jx] = icv;
        ++ix;
      }
    }
    // console.log('val:%s', val);
    oracle = this.Quantum.buildIn(qb);  /* n-qubit Identity matrix */
    zero = this.Quantum.ZERO;
    one = this.Quantum.ONE;
    for (ix = 0; ix < val.length; ++ix)
    {
      if (1=== val[ix])
      {
        jx = 2 * ix;
        oracle.sub(jx, jx, zero);
        oracle.sub(jx + 1, jx + 1, zero);
        oracle.sub(jx, jx + 1, one);
        oracle.sub(jx + 1, jx, one);
      }
    }
    return oracle;
  }
  /*
 * A Bernstein-Vazirani Oracle, like Deutsch, is a permutation matrix.  For each basis vector in a |x,y>
 * n-qubit column matrix, where x is the first n-1 bits and y is the last bit, it computes f(x), where
 * f is the dot product of a hidden string s of length n-1 and x.  The result of the dot product is applied
 * as y xor f(x).  If the result is equal to y, no permutation occurs, otherwise
 * the two bases, ...0 and ...1 are swapped.
 */
  buildBernsteinOracle(n, t) {
    let sz, s, ix, jx, oracle, zero, one;
    function permute(x, s) {
      let r, ix;
      r = 0;
      for (ix = 0; ix < s.length; ++ix)
      {
        if (x[ix] === '1' && s[ix] === '1')
          r += 1;
      }
      return (r % 2) === 1;
    }
    if (n < 2)
      throw new Error('number of qubits must be >= 2 for Bernstein-Vazirani oracle');
    sz = Math.pow(2, n - 1);
    ix = Math.floor(Math.random() * sz);
    if (t !== undefined && (t >= 0 && t < sz))
    {
      ix = Math.floor(t);
    }
    s = Number(ix).toString(2);
    s = '0'.repeat(n - 1 - s.length) + s;
    oracle = this.Quantum.buildIn(n);  /* n-qubit Identity matrix */
    zero = this.Quantum.ZERO;
    one = this.Quantum.ONE;
    for (ix = 0; ix < sz; ++ix)
    {
      jx = Number(ix).toString(2);
      jx = '0'.repeat(n - 1 - jx.length) + jx;
      if (permute(jx, s))
      {
        jx = 2 * ix;
        oracle.sub(jx, jx, zero);
        oracle.sub(jx + 1, jx + 1, zero);
        oracle.sub(jx, jx + 1, one);
        oracle.sub(jx + 1, jx, one);
      }
    }
    return oracle;
  }
  buildSimonOracle(n, t) {
    let sz, v, ix, jx, n2, fx, zero, one, oracle;
    function simonFunction(n, t) {
      let sz, vs, v, fx, r, xt, ix, jx;
      function  xorTableBin(n) {
        let tbl, sz;
        sz = Math.pow(2, n);
        tbl = new Array(sz);
        for (ix = 0; ix < sz; ++ix)
        {
          tbl[ix] = new Array(sz);
          for (jx = 0; jx < sz; ++jx)
          {
            tbl[ix][jx] = ix ^ jx;
          }
        }
        return tbl;
      }
      sz = Math.pow(2, n);
      fx = new Array(sz);
      r = Math.floor(Math.random() * (sz - 1)) + 1;
      if (t !== undefined)
        r = t
      xt = xorTableBin(n);
      vs = [];
      for (ix = 0; ix < fx.length; ++ix)
      {
        if (fx[ix] !== undefined)
          continue;
        jx = 0;
        v = sz;
        while (jx >= 0)
        {
          if (t === undefined) // generate random function unless t has been specified
            v = Math.floor(Math.random() * sz);
          else
            v = v - 1;
          jx = vs.indexOf(v)
        }
        vs.push(v);
        jx = xt[ix].indexOf(r);
        if (jx < 0)
          throw new Error(`logic:${r} not found in xor table row ${ix}`);
        fx[ix] = v;
        fx[jx] = v;
      }
      return fx;
      }
    if (n < 2 || (n % 2 !== 0))
      throw new Error('number of qubits must be even and >= 2 for Simon oracle');
    n2 = n / 2;
    sz = Math.pow(2, n2);
    fx = simonFunction(n2, t);
    oracle = this.Quantum.buildIn(n);  /* n-qubit Identity matrix */
    zero = this.Quantum.ZERO;
    one = this.Quantum.ONE;
    for (ix = 0; ix < sz; ++ix)
    {
      jx = ix << n2;
      v = jx ^ fx[ix];
      oracle.sub(jx, jx, zero);
      oracle.sub(v, v, zero);
      oracle.sub(jx, v, one);
      oracle.sub(v, jx, one);
    }
    return oracle;
  }
  analyze_opcode(gat) {
    let bas, ph, sf, op, c1, c2, t1;
    let opc;
    function tpower(pwr, mt) {
      let pw, ct, op = null;
      pw = parseInt(pwr);
      if (pw < 2)
        return mt;
      ct = 1;
      while (ct < pw)
      {
        if (null == op)
          op = mt.clone();
        op = op.tensorprod(mt);
        ++ct;
      }
      return op;
    }
    function suffix(ths, sf, op, opc) {
      let c1, t1, qb;
      if (sf.length > 0)
      {
        if (1 === sf.length)
        {
          op = tpower(sf, op);
        }
        else if (2 === sf.length)
        {
          c1 = parseInt(sf.charAt(0));
          t1 = parseInt(sf.charAt(1));
          qb = Math.max(c1, t1) + 1;
          op = ths.Quantum.buildControlled(qb, c1, t1, op);
        }
        else
          throw new Error('gate ' + opc + ' is unknown');
      }
      return op;
    }
    function ver_tf(arr, tg) {
      let ix, jx, mx, vl;
      mx = tg;
      for (ix = 0; ix < arr.length; ++ix)
      {
        vl = arr[ix];
        if (vl === tg)
          throw new Error('Toffoli lines must be unique');
        for (jx = ix - 1; jx >= 0; --jx)
        {
          if (vl === arr[jx])
            throw new Error('Toffoli lines must be unique');
        }
        if (mx < vl)
          mx = vl;
      }
      return mx;
    }
    opc = gat.opcode;
    if (undefined !== this.inst_set[opc])
      return;
    bas = gat.name;
    sf = gat.getSuffix();
    ph = gat.getAngles();
    switch (bas)
    {
    case 'Kp':
    case 'Rp':
    case 'Rx':
    case 'Ry':
    case 'Rz':
    case 'Tp':
      if (ph.length !== 1)
        throw new Error('gate ' + bas + ' requires 1 angular parameter');
      break;
    case 'Ob':
    case 'Od':
    case 'Os':
    case 'P':
      break;
    case 'U':
      if (ph.length < 1 || ph.length > 3)
        throw new Error('gate ' + bas + ' requires 1, 2, or 3 angular parameters');
      break;
    default:
      if (ph.length !== 0)
        throw new Error('gate ' + bas + ' does not take an angular parameter');
      break;
    }
    switch (bas)
    {
    case 'H':
    case 'I':
    case 'S':
    case 'Sa':
    case 'T':
    case 'Ta':
    case 'X':
    case 'Y':
    case 'Z':
    case '_':
      op = this.base_set[bas];
      op = suffix(this, sf, op, opc);
      break;
    case 'Cx':
      op = this.Quantum.controlledNotGate;
      break;
    case 'Cr':
      op = this.Quantum.buildCNOT(2, 1, 0);
      break;
    case 'C':
      if (2 !== sf.length)
        throw new Error('opcode ' + opc + ' is unknown');
      c1 = parseInt(sf.charAt(0));
      t1 = parseInt(sf.charAt(1));
      op = this.Quantum.buildCNOT(Math.max(c1, t1) + 1, c1, t1);
      break;
    case 'Im':
      if (sf.length > 1)
        throw new Error('opcode ' + opc + ' is unknown');
      if (1 === sf.length)
        c1 = parseInt(sf);
      else
        c1 = 1;
      op = this.Quantum.buildMeanInversion(c1);
      break;
    case 'Qf':
    case 'Qa':
      if (sf.length > 1)
        throw new Error('opcode ' + opc + ' is unknown');
      if (1 === sf.length)
        c1 = parseInt(sf);
      else
        c1 = 1;
      op = this.Quantum.buildQFT(c1);
      if (bas === 'Qa')
        op = op.adjoint();
      break;
    case 'Sw':
      if (2 !== sf.length)
        throw new Error('opcode ' + opc + ' is unknown');
      c1 = parseInt(sf.charAt(0));
      c2 = parseInt(sf.charAt(1));
      t1 = Math.max(c1, c2) + 1;
      // op = this.Quantum.buildSwap(Math.abs(c1 - c2) + 1, c1, c2);
      op = this.Quantum.buildSwap(t1, c1, c2);
      break;
    case 'Fr':
      if (0 !== sf.length)
      {
        if (3 !== sf.length)
          throw new Error('opcode ' + opc + ' is unknown');
        c1 = parseInt(sf.charAt(0));
        c2 = parseInt(sf.charAt(1));
        t1 = parseInt(sf.charAt(2));
      }
      else
      {
        c1 = 0;
        c2 = 1;
        t1 = 2;
      }
      op = this.Quantum.buildFred(Math.max(c1, c2, t1) + 1, c1, c2, t1);
      break;
    case 'Tf':
      if (0 !== sf.length)
      {
        // if (3 !== sf.length)
        //   throw new Error('opcode ' + opc + ' is unknown');
        c1 = [];
        for (t1 = 0; t1 < sf.length; ++t1)
        {
          c1.push(parseInt(sf.charAt(t1)));
        }
        t1 = c1.pop();
      }
      else
      {
        c1 = [0, 1];
        t1 = 2;
      }
      op = this.Quantum.buildToffoli(ver_tf(c1, t1) + 1, c1, t1);
      break;
    case 'M':
      return;
    case 'Kp':
      op = this.Quantum.buildGlobalPhase(ph[0] * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Rp':
      op = this.Quantum.buildRotation(ph[0] * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Tp':
      op = this.Quantum.buildPhaseRotation(ph[0] * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Rx':
      op = this.Quantum.buildRx(ph[0] * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Ry':
      op = this.Quantum.buildRy(ph[0] * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Rz':
      op = this.Quantum.buildRz(ph[0] * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Ob':
      if (1 !== sf.length)
        throw new Error(opc + ' missing qubit size');
      c1 = parseInt(sf.charAt(0));
      c2 = (ph.length > 0) ? ph[0] : undefined;
      op = this.buildBernsteinOracle(c1, c2);
      break;
    case 'Od':
      if (1 !== sf.length)
        throw new Error(opc + ' missing qubit size');
      c1 = parseInt(sf.charAt(0));
      c2 = (ph.length > 0) ? ph[0] : undefined;
      op = this.buildDeutschOracle(c1, c2);
      break;
    case 'Os':
      if (1 !== sf.length)
        throw new Error(opc + ' missing qubit size');
      c1 = parseInt(sf.charAt(0));
      c2 = (ph.length > 0) ? ph[0] : undefined;
      op = this.buildSimonOracle(c1, c2);
      break;
    case 'P':
      if (1 !== bas.length)
        throw new Error(opc + ' unimplemented');
      if (1 !== sf.length)
        throw new Error(opc + ' missing qubit size');
      op = this.buildPermutationMatrix(opc, parseInt(sf.charAt(0)));
      break;
    case 'U':
      if (1 === ph.length)
      {
        op = this.Quantum.buildU(0, 0, ph[0] * Math.PI);
      }
      else if (2 === ph.length)
      {
        op = this.Quantum.buildU(Math.PI / 2, ph[0] * Math.PI, ph[1] * Math.PI);
      }
      else
      {
        op = this.Quantum.buildU(ph[0] * Math.PI, ph[1] * Math.PI, ph[2] * Math.PI);
      }
      op = suffix(this, sf, op, opc);
      break;
    case '/':
      break;
    // case '0':
    //   break;
    // case 'D':
    //   if (0 !== sf.length)
    //     c1 = parseInt(sf);
    //   else
    //     c1 = 2;
    //   op = this.Quantum.buildDGate(c1);
    //   break;
    default:
      if (undefined === this.inst_set[bas])
        throw new Error(opc + ' unimplemented');
      return this.inst_set[bas];
    }
    this.inst_set[opc] = op;
    return op;
  }
  stepDisplay(eq, lst) {
    if (this.cfg.trace)
    {
      if (this.cfg.kdisp || 1 === eq.columns())
      {
        if (1 === eq.columns())
          this.write(this.util.format('%s [%s]\n', lst, eq.qdisp()));
        else if (33 > eq.columns())
          this.write(this.util.format('%s [%s]\n', lst, eq.disp()));
        else
          this.write(this.util.format('large %dx%d matrix display suppressed\n', eq.rows(), eq.columns()));
      }
      else
      {
        if (33 > eq.columns())
          this.write(this.util.format('%s=\n%s\n', lst, eq.edisp()));
        else
          this.write(this.util.format('large %dx%d matrix display suppressed\n', eq.rows(), eq.columns()));
      }
    }
  }
  finalDisplay(eq, init, lst) {
    //if (!this.cfg.trace)
    {
      if (1 === eq.columns())
      {
        if (33 > eq.columns())
        {
          if (this.cfg.kdisp)
            this.write(this.util.format('[%s] %s %s\n', init, lst, eq.qdisp()));
          else
            this.write(this.util.format('[%s] %s [%s]\n', init, lst, eq.transpose().disp()));
        }
        else
          this.write(this.util.format('large %dx%d quantum state display suppressed\n', eq.rows(), eq.columns()));
      }
      else
      {
        if (33 > eq.columns())
          this.write(this.util.format('[%s] %s [\n%s]\n', init, lst, eq.edisp()));
        else
          this.write(this.util.format('large %dx%d matrix display suppressed\n', eq.rows(), eq.columns()));
      }
    }
    // else
    // {
    //   if (33 > eq.columns())
    //     this.write(this.util.format('[%s] %s [\n%s]\n', init, lst, eq.edisp()));
    //   else
    //     this.write(this.util.format('large %dx%d matrix display suppressed\n', eq.rows(), eq.columns()));
    // }
  }
  run(pgm, qst) {
    let eq, ix, first, nm, lst, init, ms, mc;
    if (arguments.length >= 2 && null != qst)
    {
      if (qst[0].columns() !== 1)
        throw new Error('quantum state vector should have only one column');
      eq = qst[0].clone();
      first = false;
      lst = '';
      if (this.cfg.kdisp)
        init = eq.qdisp();
      else
        init = eq.transpose().disp();
      if (this.cfg.trace)
        this.write(this.util.format('[%s]\n', eq.qdisp()));
      for (ix = 1; ix < qst.length; ++ix)
      {
        eq = eq.tensorprod(qst[ix]);
        if (this.cfg.trace)
          this.write(this.util.format('[%s]\n', eq.qdisp()));
      }
    }
    else
    {
      first = true;
      init = '';
    }
    for (mc = ix = 0; ix < pgm.length; ++ix)
    {
      nm = pgm[ix];
      if (undefined === this.inst_set[nm])
      {
        this.analyze_opcode(nm)
      }
      else if (typeof this.inst_set[nm] === 'function')
      {
        ms = this.inst_set[nm](eq);
        if (nm === '/')
        {
          eq = ms
        }
        else
        {
          this.write(this.util.format('  M%d={%s}\n', ++mc, ms[0].join(', ')));
        }
        continue;
      }
      if (first)
      {
        eq = this.inst_set[nm].clone();
        lst = nm;
        first = false;
      }
      else
      {
        eq = this.inst_set[nm].prod(eq);
        // lst = nm + '(' + lst + ')';
        lst += ' ' + nm;
      }
      this.stepDisplay(eq, lst);
    }
    this.finalDisplay(eq, init, lst);
    return eq;
  }
  exec (stmt) {
    // assemble a chain of circuit steps into an executable program
    let sq,
        qst = null,
        ng = null,
        eq,
        pgm = [];
    this.test_out = [];
    if (stmt instanceof Qubit)
    {
      qst = [stmt.vector];
      sq = stmt.next;
      while (null !== sq && sq instanceof Qubit)
      {
        qst.push(sq.vector);
        sq = sq.next;
      }
    }
    else
    {
      sq = stmt;
    }
    if (null !== sq)
    {
      if (sq instanceof NamedGate)
      {
        ng = sq;
        sq = sq.next;
      }
      while (null !== sq.next)
      {
        if (!(sq instanceof Gate))
          throw new Error('logic: not Gate object in Gate sequence');
        pgm.push(sq.opcode);
        sq = sq.next;
      }
      if (sq instanceof GateFactor)
      {
        pgm.push(sq.build());
      }
      else
      {
        if (!(sq instanceof Gate))
          throw new Error('logic: not Gate object in Gate sequence');
        pgm.push(sq.opcode);
      }
    }
    if (ng !== null)
    {
      eq = this.run(pgm, null, {trace: false, kdisp: false});
      // this.base_set[ng.name] = eq;
      this.inst_set[ng.name] = eq;
    }
    else
    {
      this.run(pgm, qst);
    }
    return this.test_out;
  }
}
// QDeskInterpret.Quantum = require('./quantum.js').Quantum;
class Operand
{
  constructor(op)
  {
    this._opcode = op;
    this._next = null;
    // this._oprs = null;  // filled in by instructions that have an operand list
  }
  get opcode()
  {
    return this._opcode;
  }
  set opcode(opc)
  {
    this._opcode = opc;
    return this._opcode;
  }
  get next()
  {
    return this._next;
  }
  set next(val)
  {
    if (undefined === val)
      val = null;
    this._next = val;
  }
  toString() {
    return '';
  }
}
Operand.QUBIT = 1;
Operand.GATE = 2;
Operand.KET = 3;
Operand.GFACTOR = 4;
Operand.NMGATE = 5;
Operand.UNGATE = '_';
Operand.MGATE = 'M';
class Qubit extends Operand
{
  constructor(ka) {
    let _bts, _k, _mn, _mx;
    super(Operand.QUBIT);
    if (!(ka instanceof Array))
      throw new LogicErr('Qubit parameter must be a ket array');
    for (_k of ka)
    {
      if (!(_k instanceof Ket))
        throw new LogicErr('Qubit ket array parameter contains non-Ket\'s');
    }
    this._ident = '';
    this._next = null;
    _mn = _mx = ka[0].qubits;
    for (_k of ka)
    {
      _bts = _k.qubits;
      if (_bts > _mx)
        _mx = _bts;
      if (_bts < _mn)
        _mn = _bts;
    }
    if (_mn !== _mx)
    {
      for (_k of ka)
      {
        _k.qubits = _mx;
      }
    }
    if (_mx > QDeskInterpret.single.Quantum.qubits)
      throw Error('current support is limited to ' + QDeskInterpret.single.Quantum.qubits + ' qubits');
    this._vector = new QDeskInterpret.single.Matrix(Math.pow(2, _mx), 1);
    for (_k of ka)
    {
      // this._vector.mat[_k.basis][0] = new QDeskInterpret.single.Complex(_k.coeff);
      // this._vector.sub(_k.basis, 0, new QDeskInterpret.single.Complex(_k.coeff));
      this._vector.sub(_k.basis, 0, _k.coeff.sum(this._vector.sub(_k.basis, 0)));
    }
    _bts = new QDeskInterpret.single.Complex(0);
    for (_mn = 0; _mn < this.vector.rows(); ++_mn)
    {
      if (undefined === this._vector.sub(_mn, 0))
        this._vector.sub(_mn, 0, _bts);
    }
  }
  get ident() {
    return this._ident;
  }
  get next() {
    return this._next;
  }
  get bits() {
    return this._bits;
  }
  set next(val) {
    if (undefined === val)
      val = null;
    this._next = val;
  }
  get name() {
    return this._ident;
  }
  get vector() {
    return this._vector
  }
  toString() {
    // let _o, _k;
    // _o = [];
    // for (_k of this._ket)
    // {
    //   _o.push(_k.toString());
    // }
    // return _o.join('');
    return this.vector.qdisp();
  }
}
class Gate extends Operand
{
  constructor(nm, sf) {
    let t1;
    super(Operand.GATE);
    this._name = nm;
    this._suffix = '';
    this._angles = [];
    this._measure = false;
    if (null != sf)
    {
      if (typeof sf !== 'object')
        throw new Error('gate ' + nm + ' is unknown');
      if (null !== sf[0])
        this._angles = sf[0];
      if (null !== sf[1])
        this._suffix = sf[1];
    }
    if (nm === Operand.MGATE)
    {
      this._measure = true;
      if (null != sf)
      {
        t1 = parseInt(sf);
        if (t1 < 1 || t1 > 9)
          throw new Error('gate ' + nm + sf + ' is unknown');
      }
    }
    this.opcode = this.opCode();
    try
    {
      QDeskInterpret.single.analyze_opcode(this);
    }
    catch (e)
    {
      // this.write(e.message);
      // return;
      throw e;
    }
  }
  measure(gat) {
    function validMeasureStep(opc) {
      let ix;
      ix = 0;
      while (ix < opc.length)
      {
        if (opc[ix] !== Operand.UNGATE)
          return false;
        ix += 1;
      }
      return true;
    }
    if (this._measure && gat._measure)
      return;
    if (this._measure)
    {
      if (!validMeasureStep(gat.opcode))
        throw new Error(gat.opcode + ' gate not valid in measure step');
    }
    else
    {
      if (!validMeasureStep(this.opcode))
        throw new Error(this.opcode + ' gate not valid in measure step');
      this._measure = true;
    }
  }
  combine(gat) {
    let rgt, op, opc;
    if (null == gat)
      return;
    opc = this.opcode + gat.opcode;
    if (this._measure || gat._measure)
    {
      this.measure(gat);
      this.opcode = opc;
      return;
    }
    if (undefined !== QDeskInterpret.single.inst_set[opc])
    {
      this.opcode = opc;
      return;
    }
    rgt = QDeskInterpret.single.inst_set[gat.opcode];
    op = QDeskInterpret.single.inst_set[this.opcode].tensorprod(rgt);
    this.opcode = opc;
    QDeskInterpret.single.inst_set[opc] = op;
  }
  finish() {
    let op, str;
    // a circuit step is complete
    if (this._measure)
    {
      str = this.opcode.replace(new RegExp(Operand.UNGATE, 'g'), '0');
      str = str.replace(new RegExp(Operand.MGATE, 'g'), '1');
      op = QDeskInterpret.single.Quantum.measure.bind(null, str);
      QDeskInterpret.single.inst_set[this.opcode] = op;
    }
  }
  get name() {
    return this._name;
  }
  set name(nm) {
    this._name = nm;
  }
  getSuffix() {
    return this._suffix;
  }
  // getQubits() {
  // }
  // addSuffix(sf) {
  //   this._suffix += sf;
  // }
  getAngles() {
    return this._angles;
  }
  addAngles(an) {
    this._angles.concat(an);
  }
  opCode() {
    let str, ix;
    str = this._name;
    if (0 !== this._angles.length)
    {
      str += '(';
      for (ix = 0; ix < this._angles.length; ++ix)
      {
        if (0 !== ix)
          str += ',';
        str += this._angles[ix];
      }
      str += ')';
    }
    if (0 !== this._suffix.length)
    {
      if (str === Operand.MGATE)
      {
        ix = parseInt(this._suffix);
        return Operand.MGATE.repeat(ix);
      }
      str += this._suffix;
    }
    return str;
  }
  toString() {
    return ':' + this.opCode();
  }
}
class NamedGate extends Operand
{
  constructor(nm, gs) {
    super(Operand.NMGATE);
    this._name = nm;
    this.next = gs;
  }
  get name() {
    return this._name;
  }
  toString() {
    return this._name;
  }
}
class Ket extends Operand
{
  constructor(b) {
    super(Operand.KET);
    this.basis = parseInt(b, 2);
    this._bstring = null;
    this._qubits = b.length;
    this._coeff = new QDeskInterpret.single.Complex(1);
  }
  get coeff() {
    return this._coeff;
  }
  set coeff(v) {
    this._coeff = new QDeskInterpret.single.Complex(v);
  }
  get qubits() {
    return this._qubits;
  }
  basisString() {
    this._bstring = Number(this.basis).toString(2);
    while (this._bstring.length < this._qubits)
      this._bstring = '0' + this._bstring;
  }
  set qubits(sz) {
    if (this._qubits !== sz)
    {
      this._qubits = sz;
      this.basisString();
    }
  }
  negate() {
    // negate only real part unless it is 0.0, then negate complex part
    this._coeff.conjugateq();
    if (0.0 !== this._coeff.Re())
      this._coeff.negateq();
  }
  toString() {
    let str = '';
    if (!this._coeff.isOne())
    {
      str = QDeskInterpret.single.Complex.format(this.coeff);
    }
    if (null == this._bstring)
    {
      this.basisString();
    }
    return str + '|' + this._bstring + '>';
   }
}
class GateFactor extends Operand {
  constructor(b) {
    super(Operand.GFACTOR);
    this._factor = new QDeskInterpret.single.Complex(b);
  }
  get factor() {
    return this._factor;
  }
  negate() {
    // negate only real part unless it is 0, then negate complex part
    this._factor.conjugateq();
    if (0.0 !== this._factor.Re())
      this._factor.negateq();
  }
  build() {
    let r, nm, op;
    r = new QDeskInterpret.single.Complex(1).quo(this._factor);
    nm = '/';
    op = QDeskInterpret.single.Matrix.scprod.bind(null, r);
    QDeskInterpret.single.inst_set[nm] = op;
    return nm;
  }
}
module.exports.QDeskInterpret = QDeskInterpret;
