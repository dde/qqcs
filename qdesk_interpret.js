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
    let qq;
    if (undefined !== QDeskInterpret.single)
      return QDeskInterpret.single;
    QDeskInterpret.single = this;
    qq = require('./quantum.js');
    this.util = require('util');
    this.Quantum = qq.Quantum;
    this.Complex = qq.Complex;
    this.Matrix = qq.Matrix;
    this.Qubit = Qubit;
    this.Gate = Gate;
    this.NamedGate = NamedGate;
    this.GateFactor = GateFactor;
    this.Ket = Ket;
    this.LineRef = LineRef;
    this.Register = Register;
    if (undefined === cfg)
    {
      this.cfg = {trace:false, kdisp:false, ualt:false, rzeroes:false, qrev:false, nomrr:false};
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
      if (typeof cfg.ocache !== 'boolean')
        this.cfg.ocache = false;
      if (typeof cfg.qrev !== 'boolean')
        this.cfg.qrev = false;
      if (typeof cfg.nomrr !== 'boolean')
        this.cfg.nomrr = false;
      this.Quantum.setUMatrix(this.cfg.ualt);
      if (typeof cfg.rzeroes !== 'boolean')
        this.cfg.rzeroes = false
      this.Matrix.setReplaceZeroes(cfg.rzeroes);
    }
    if (this.cfg.test)
    {
      this.write = this.testwriter;
      this.test_out = [];
    }
    else
    {
      this.write = this.writer;
      this.test_out = null;
    }
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
    this.mrr = '~mrr';
    this.inst_set[this.mrr] = undefined;
  }
  clearFlags() {
    this.cfg.trace = false;
    this.cfg.kdisp = false;
    this.cfg.ualt = false;
    this.Quantum.setUMatrix(this.cfg.ualt);
    this.cfg.rzeroes = false;
    this.cfg.ocache = false;
    this.cfg.nomrr = false;
    this.Matrix.setReplaceZeroes(this.cfg.rzeroes);
    this.inst_set = {};  // clear the cache of any previous U() definitions
  }
  commentProcessor(cmt) {
    let prp, sval;
    function invertOption(ths, prp) {
      ths.cfg[prp] = !ths.cfg[prp];
      if (ths.cfg.interactive)
        ths.write(`${sval}==${ths.cfg[prp]}\n`);
    }
    for (prp in this.cfg)
    {
      sval = '$' + prp;
      if (-1 >= cmt.indexOf(sval))
        continue;
      switch (prp)
      {
      case 'trace':
      case 'kdisp':
      case 'ocache':
        invertOption(this, prp)
        break;
      case 'nomrr':
        invertOption(this, prp)
        this.inst_set[this.mrr] = undefined;  // clear any mrr
        break;
      case 'qrev':
        invertOption(this, prp)
        this.inst_set = {};  // clear the cache of any previous U() definitions
        break;
      case 'ualt':
        invertOption(this, prp)
        this.Quantum.setUMatrix(this.cfg[prp]);
        this.inst_set = {};  // clear the cache of any previous U() definitions
        break;
      case 'rzeroes':
        invertOption(this, prp);
        //configReplaceZeroes = !configReplaceZeroes;
        this.Matrix.setReplaceZeroes(this.cfg[prp]);
        break;
      case 'none':
        this.cfg.trace = false;
        this.cfg.kdisp = false;
        this.cfg.ualt = false;
        this.cfg.nomrr = false;
        this.Quantum.setUMatrix(this.cfg.ualt);
        this.cfg.rzeroes = false;
        this.cfg.ocache = false;
        this.Matrix.setReplaceZeroes(this.cfg.rzeroes);
        this.inst_set = {};  // clear the cache of any previous U() definitions
        break;
      case 'gate':
        if (this.cfg.interactive)
        {
          this.write('single qubit gates: _ H X Y Z I S T Sa Ta Rx(r) Ry(r) Rz(r) U(r[,r[,r]]) Kp(r) Rp(r) Tp(r)\n');
          this.write('    r - real multiple of pi, gates may have a control suffix\n');
          this.write('larger gates: Cx Cr Cct Swtt Tfcct Frctt Imq Qfq Qaq - c control, t target, q qubits\n');
          this.write('oracles: Obq Bernstein-Vazirani, Odq Deutsch-Jozsa, Ogq Grover, Osq Simon\n');
          this.write('    optional (n) parameter forces behavior\n');
        }
        break;
      case 'help':
        if (this.cfg.interactive)
        {
          this.write('$kdisp - display in ket format\n');
          this.write('$trace - trace quantum state after each gate\n');
          this.write('$ualt - use alternative definition of 1-qubit unitary matrix for U, Rx, Ry, and Rz\n');
          this.write('$rzeroes - replace 0 values with .\'s in matrix displays\n');
          this.write('$ocache - cache random oracles once they are generated\n');
          this.write('$qrev - number qubits using big-endian subscripts\n');
          this.write('$nomrr - disable most recent result operation\n');
          this.write('$none - reset all options to false and clear cache\n');
          this.write('$gate - show a summary of all gates\n');
        }
        break;
      default:
        break;
      }
    }
  }
  getCommentProcessor() {
    return this.commentProcessor.bind(this);
  }
  writer(line) {
    process.stdout.write(line);
  }
  testwriter(line) {
    this.test_out.push(line);
  }
  starttest() {
    this.test_out = [];
  }
  endtest() {
    return this.test_out;
  }
  buildPermutationMatrix(op, qb) {
    let n, sz, ix, pm, prs;
    function pm_scan(str) {
      let cr, st, ln, ch, fs, lft, rgt, pairs, ng;
      ng = 1;
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
        case 1: // first digit of left pair or sign
          if (ch >= '0' && ch <= '9')
          {
            fs = cr;
            st = 2;
          }
          else if (ch === '-')
          {
            ng = -1;
          }
          else if (ch === '.')
          {
            lft = 0;
            st = 3;
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
            pairs.push([lft, rgt, ng]);
            ng = st = 1;
          }
          else if (ch === ')')
          {
            lft = parseInt(str.substring(fs, cr));
            rgt = 0;
            pairs.push([lft, rgt, ng]);
            ng = 1;
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
            pairs.push([lft, rgt, ng]);
            ng = st = 1;
          }
          else if (ch === ')')
          {
            rgt = parseInt(str.substring(fs, cr));
            pairs.push([lft, rgt, ng]);
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
    //console.log(op);
    prs = pm_scan(op);
    sz = pm.rows();
    n = prs.length;
    for (ix = 0; ix < n; ++ix)
    {
      if (prs[ix][0] >= sz || prs[ix][1] >= sz)
        throw new Error(`permutation reference (${prs[ix][0]},${prs[ix][1]}) out of range`);
      pm.sub(prs[ix][0], prs[ix][0], this.Quantum.ZERO);
      pm.sub(prs[ix][0], prs[ix][1], (prs[ix][2] < 0) ? this.Quantum.M_ONE : this.Quantum.ONE);
    }
    return pm;
  }
  buildGenericMatrix(op, qb) {
    let sz, ix, jx, gn, vals;
    function gn_scan(ths, str) {
      let cr, st, ln, ch, fs, values;
      fs = -1;
      values = [];
      cr = st = 0;
      ln = str.length;
      scn: while (cr < ln)
      {
        ch = str.charAt(cr);
        switch (st)
        {
        case 0: // scanning for left paren
          if (ch === '(')
          {
            fs = cr + 1;
            st = 4;
          }
          break;
        case 4: // comma or right paren
          if (ch === ',')
          {
            values.push(new ths.Complex(str.substring(fs, cr)));
            fs = cr + 1;
          }
          else if (ch === ')')
          {
            values.push(new ths.Complex(str.substring(fs, cr)));
            st = 5;
            break scn;
          }
          break;
        }
        cr += 1;
      }
      if (st !== 5)
        throw new Error(`state ${st} is not correct termination state`);
      return values;
    }
    gn = this.Quantum.buildIn(qb);  /* n-qubit Identity matrix */
    vals = gn_scan(this, op);
    sz = Math.pow(2, qb);
    if (sz * sz !== vals.length)
      throw new Error(`${qb} qubit matrix needs ${sz * sz} parameters`);
    for (ix = 0; ix < sz; ++ix)
    {
      for (jx = 0; jx < sz; ++jx)
      {
        gn.sub(ix, jx, vals[ix * sz + jx]);
      }
    }
    return gn;
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
      t = Number(t)
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
    if (t !== undefined)
    {
      t = Number(t)
      if  (t >= 0 && t < sz)
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
        r = Number(t)
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
  /*
   * A Grover Oracle is an identity matrix with one entry negated.  This inverts the phase of a random basis
   * vector of the quantum state on which it operates.
  */
  buildGroverOracle(n, t) {
    let sz, ix, oracle;
    if (n < 1)
      throw new Error('number of qubits must be >= 1 for Grover oracle');
    sz = Math.pow(2, n);
    ix = Math.floor(Math.random() * sz);
    if (t !== undefined)
    {
      t = Number(t)
      if (t >= 0 && t < sz)
        ix = Math.floor(t);
    }
    oracle = this.Quantum.buildIn(n);  /* n-qubit Identity matrix */
    oracle.sub(ix, ix).negateq();
    return oracle;
  }
  analyze_opcode(gat) {
    let op, c1, c2, t1, qb;
    let opc = gat.opcode,
        bas = gat.name,
        sf,
        ph;
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
    function unique(a) {
      // verify that each element of the passed array is unique
      // return the maximum line
      let ln = a.length - 1, mx = a[ln];
      for (let ix = 0; ix < ln; ++ix)
      {
        if (a[ix] > mx)
          mx = a[ix];
        for (let jx = ix + 1; jx <= ln; ++jx)
        {
          if (a[ix] === a[jx])
            throw new Error('lines must be unique');
        }
      }
      return mx;
    }
    function suffix(ths, sf, op, opc) {
      let c1, t1, qb, ix;
      if (null === sf)
        return op;
      if (sf.isRepl())
      {
        op = tpower(sf.repl, op);
      }
      else if (2 <= sf.lines)
      {
        c1 = [];
        for (ix = 0; ix < sf.lines; ++ix)
        {
          c1.push(sf.getLine(ix))
        }
        qb = unique(c1);
        t1 = c1.pop();
        op = ths.Quantum.buildControlled(qb + 1, c1, t1, op, ths.cfg.qrev);
      }
      else
        throw new Error('gate ' + opc + ' is unknown');
      return op;
    }
    function ver_pm(pm) {
      let rws = pm.rows(), cls = pm.columns(), ix, jx, ct;
      for (ix = 0; ix < rws; ++ix)
      {
        ct = 0;
        for (jx = 0; jx < cls; ++jx)
        {
          if (!pm.sub(ix, jx).isZero())
            ++ct;
        }
        if (1 !== ct)
          return false;
      }
      for (jx = 0; jx < cls; ++jx)
      {
        ct = 0;
        for (ix = 0; ix < rws; ++ix)
        {
          if (!pm.sub(ix, jx).isZero())
            ++ct;
        }
        if (1 !== ct)
          return false;
      }
      return true;
    }
    function need_real(ph) {
      let rx, cx;
      for (rx of ph)
      {
        cx = new QDeskInterpret.single.Complex(rx);
        if (!cx.isReal())
          return false;
      }
      return true;
    }
    if (undefined !== this.inst_set[opc] && (bas.charAt(0) !== 'O' ||
        this.cfg.ocache))  // cacheing oracles
      return;
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
      if (!need_real(ph))
        throw new Error('gate ' + bas + ' requires real angular parameters');
      break;
    case 'G':
    case 'Ob':
    case 'Od':
    case 'Og':
    case 'Os':
    case 'P':
      break;
    case 'U':
      if (ph.length < 1 || ph.length > 3)
        throw new Error('gate ' + bas + ' requires 1, 2, or 3 angular parameters');
      if (!need_real(ph))
        throw new Error('gate ' + bas + ' requires real angular parameters');
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
      op = suffix(this, sf, this.base_set[bas], opc);
      break;
    case 'Cx':
      op = this.Quantum.controlledNotGate;
      break;
    case 'Cr':
      op = this.Quantum.buildCNOT(2, 1, 0);
      break;
    case 'C':
      if (null === sf || 2 !== sf.lines)
        throw new Error('opcode ' + opc + ' is unknown');
      c1 = gat.getLine(0)
      t1 = gat.getLine(1);
      op = this.Quantum.buildCNOT(Math.max(c1, t1) + 1, c1, t1, this.cfg.qrev);
      break;
    case 'Im':
      if (null === sf)
        c1 = 1;
      else if (!sf.isRepl())
        throw new Error('opcode ' + opc + ' is unknown');
      else
        c1 = sf.repl;
      op = this.Quantum.buildMeanInversion(c1);
      break;
    case 'Qf':
    case 'Qa':
      if (null === sf)
        c1 = 1;
      else if (!sf.isRepl())
        throw new Error('opcode ' + opc + ' is unknown');
      else
        c1 = sf.repl;
      op = this.Quantum.buildQFT(c1);
      if (bas === 'Qa')
        op = op.adjoint();
      break;
    case 'Sw':
      if (null == sf || 2 !== sf.lines)
        throw new Error('opcode ' + opc + ' is unknown');
      c1 = [];
      for (t1 = 0; t1 < sf.lines; ++t1)
      {
        c1.push(gat.getLine(t1));
      }
      qb = unique(c1);
      c2 = c1.pop();
      c1 = c1[0];
      // op = this.Quantum.buildSwap(Math.abs(c1 - c2) + 1, c1, c2);
      op = this.Quantum.buildSwap(qb + 1, c1, c2, this.cfg.qrev);
      break;
    case 'Fr':
      if (null !== sf && 3 === sf.lines)
      {
        c1 = [];
        for (t1 = 0; t1 < sf.lines; ++t1)
        {
          c1.push(gat.getLine(t1));
        }
      }
      else if (null === sf || 3 > sf.lines)
      {
        c1 = [0, 1, 2];
        if (this.cfg.qrev)
          c1 = c1.reverse()
      }
      else
         throw new Error('opcode ' + opc + ' is unknown');
      qb = unique(c1);
      t1 = c1.pop();
      c2 = c1.pop();
      c1 = c1[0];
      op = this.Quantum.buildFred(qb + 1, c1, c2, t1, this.cfg.qrev);
      break;
    case 'Tf':
      if (null !== sf && 3 <= sf.lines)
      {
        c1 = [];
        for (t1 = 0; t1 < sf.lines; ++t1)
        {
          c1.push(gat.getLine(t1));
        }
      }
      else
      {
        c1 = [0, 1, 2];
        if (this.cfg.qrev)
          c1 = c1.reverse()
      }
      qb = unique(c1);
      t1 = c1.pop();
      op = this.Quantum.buildToffoli(qb + 1, c1, t1, this.cfg.qrev);
      break;
    case 'M':
      return;
    case 'Kp':
      op = this.Quantum.buildGlobalPhase(Number(ph[0]) * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Rp':
      op = this.Quantum.buildRotation(Number(ph[0]) * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Tp':
      op = this.Quantum.buildPhaseRotation(Number(ph[0]) * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Rx':
      op = this.Quantum.buildRx(Number(ph[0]) * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Ry':
      op = this.Quantum.buildRy(Number(ph[0]) * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Rz':
      op = this.Quantum.buildRz(Number(ph[0]) * Math.PI);
      op = suffix(this, sf, op, opc);
      break;
    case 'Ob':
      if (null === sf || 0 === (c1 = sf.qubits))
        throw new Error(opc + ' missing qubit size');
      c2 = (ph.length > 0) ? ph[0] : undefined;
      op = this.buildBernsteinOracle(c1, c2);
      break;
    case 'Od':
      if (null === sf || 0 === (c1 = sf.qubits))
        throw new Error(opc + ' missing qubit size');
      c2 = (ph.length > 0) ? ph[0] : undefined;
      op = this.buildDeutschOracle(c1, c2);
      break;
    case 'Og':
      if (null === sf || 0 === (c1 = sf.qubits))
        throw new Error(opc + ' missing qubit size');
      c2 = (ph.length > 0) ? ph[0] : undefined;
      op = this.buildGroverOracle(c1, c2);
      break;
    case 'Os':
      if (null === sf || 0 === (c1 = sf.qubits))
        throw new Error(opc + ' missing qubit size');
      c2 = (ph.length > 0) ? ph[0] : undefined;
      op = this.buildSimonOracle(c1, c2);
      break;
    case 'P':
      if (1 !== bas.length)
        throw new Error(opc + ' unimplemented');
      if (null === sf || !sf.isRepl())
        throw new Error(opc + ' missing qubit size');
      op = this.buildPermutationMatrix(opc, sf.repl);
      if (!ver_pm(op))
        throw new Error(opc + ' incorrect permutation');
      break;
    case 'G':
      if (1 !== bas.length)
        throw new Error(opc + ' unimplemented');
      if (null === sf || !sf.isRepl())
        throw new Error(opc + ' missing qubit size');
      op = this.buildGenericMatrix(opc, sf.repl);
      // if (!ver_gm(op))
      //   throw new Error(opc + ' not unitary');
      break;
    case 'U':
      if (1 === ph.length)
      {
        op = this.Quantum.buildU(0, 0, Number(ph[0]) * Math.PI);
      }
      else if (2 === ph.length)
      {
        op = this.Quantum.buildU(Math.PI / 2, Number(ph[0]) * Math.PI, Number(ph[1]) * Math.PI);
      }
      else
      {
        op = this.Quantum.buildU(Number(ph[0]) * Math.PI, Number(ph[1]) * Math.PI, Number(ph[2]) * Math.PI);
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
        throw new Error(opc + ' is not an implemented gate');
      if (undefined === this.inst_set[opc])
        op = suffix(this, sf, this.inst_set[bas], opc);
      break;
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
        /*if (1 === eq.columns())
          this.write(this.util.format('%s [%s]\n', lst, eq.transpose().disp()));
        else */if (33 > eq.columns())
          this.write(this.util.format('%s=\n%s\n', lst, eq.edisp()));
        else
          this.write(this.util.format('large %dx%d matrix display suppressed\n', eq.rows(), eq.columns()));
      }
    }
  }
  finalDisplay(eq, init, lst) {
    //if (!this.cfg.trace)
    // {
      if (1 === eq.columns())
      {
        // if (33 > eq.columns())
        // {
          if (this.cfg.kdisp)
            this.write(this.util.format('[%s] %s %s\n', init, lst, eq.qdisp()));
          else
            this.write(this.util.format('[%s] %s [%s]\n', init, lst, eq.transpose().disp()));
        // }
        // else
        //   this.write(this.util.format('large %dx%d quantum state display suppressed\n', eq.rows(), eq.columns()));
      }
      else
      {
        if (33 > eq.columns())
          this.write(this.util.format('[%s] %s [\n%s]\n', init, lst, eq.edisp()));
        else
          this.write(this.util.format('large %dx%d matrix display suppressed\n', eq.rows(), eq.columns()));
      }
    // }
    // else
    // {
    //   if (33 > eq.columns())
    //     this.write(this.util.format('[%s] %s [\n%s]\n', init, lst, eq.edisp()));
    //   else
    //     this.write(this.util.format('large %dx%d matrix display suppressed\n', eq.rows(), eq.columns()));
    // }
  }
  mrrIsCompat(opcode) {
    let op,
        mrr = this.inst_set[this.mrr];
    if (null === mrr)
      console.log('null mmr');
    op = this.inst_set[opcode];
    return (mrr !== undefined && mrr.columns() === 1 &&
        op instanceof this.Matrix && mrr.rows() === op.columns());
  }
  run(pgm, qst) {
    let eq, ix, nm, lst, init, ms, mc, gt;
    lst = '';
    if (null !== qst)
    {
      // if there is an initial value, the vectors are combined by tensor product into an initial quantum state
      eq = new this.Qubit(qst[0]);
      if (qst[0].gate != null)
      {
        eq = this.exec([[null, [eq], qst[0].gate]]);
      }
      if (this.cfg.trace)
        this.write(this.util.format('[%s]\n', eq.qdisp()));
      for (ix = 1; ix < qst.length; ++ix)
      {
        mc = new this.Qubit(qst[ix]);
        if (qst[ix].gate != null)
        {
          mc = this.exec([[null, [mc], qst[ix].gate]]);
        }
        eq = eq.tensorprod(mc);
        if (this.cfg.trace)
          this.write(this.util.format('[%s]\n', eq.qdisp()));
      }
      init = (this.cfg.kdisp) ? eq.qdisp() : eq.transpose().disp();
      ix = 0;
    }
    else
    {
      // there is no initial value
      if (!this.cfg.nomrr && pgm.length > 0 && this.mrrIsCompat(pgm[0].opcode))
      {
        // there is a compatible previous quantum state
        eq = this.inst_set[this.mrr];
        init = (this.cfg.kdisp) ? eq.qdisp() : eq.transpose().disp();
        ix = 0;
      }
      else
      {
        // no compatible previous q-state, start with the first gate
        this.inst_set[this.mrr] = undefined;
        nm = pgm[0].opcode;
        eq = this.inst_set[nm];
        lst = nm;
        init = '';
        ix = 1;
      }
    }
    // execute the program by selecting each opcode, and getting the corresponding entry in the instruction cache;
    // if the instruction is a function call, it is either a measurement or a factoring operation;
    // call it with the current quantum state; factoring returns a new quantum state; measurement returns an
    // array of strings which are displayed with an id, and the quantum state is unchanged
    mc = 0;  // measurement counter
    for (/* ix already set as 0 or 1 */; ix < pgm.length; ++ix)
    {
      nm = pgm[ix].opcode;
      gt = this.inst_set[nm];
      if (undefined === gt)
        throw new Error(`logic: instruction ${nm} not in instruction set`);
      if (typeof gt === 'function')
      {
        if (nm.charAt(0) === '/')
        {
          eq = gt(eq);
        }
        else
        {
          ms = gt(eq.vector);
          this.write(this.util.format('  M%d={%s}\n', ++mc, ms[0].join(', ')));
        }
        continue;
      }
      // execute instruction
      if (eq instanceof this.Qubit)
        eq = new this.Qubit(gt.prod(eq.vector));
      else
        eq = gt.prod(eq);
      lst += ' ' + nm;  // accumulate opcode
      this.stepDisplay(eq, lst);
    }
    if (null !== eq)
      this.finalDisplay(eq, init, lst);
    return eq;
  }
  /*
   * c_stmt - null, or an array of statements [[stmt],[stmt], . . ., [stmt]]
   * stmt - an array representing a single statement [target, initial, gates]
   * target - a NamedGate object or a Register object, or null
   * initial - an array of Qubit objects to produce a tensor product initial value, or null
   * gates - an array of Gate objects or null
   */
  exec (c_stmt) {
    // assemble a chain of circuit steps into an executable program
    let sq,
        stmt,
        qst,
        rg,
        eq,
        pgm;
    if (null === c_stmt)  // an empty input line
    {
      // display most recent result if exists and optioned
      if (!this.cfg.nomrr && undefined !== (eq = this.inst_set[this.mrr]))
        this.finalDisplay(eq, '', '');
      return null;
    }
    eq = null;
    for (stmt of c_stmt)  // multiple statements on a single line, each separately executed
    {
      rg = null;
      // an initial value quantum state, array of one or more qubits, converted to an initial quantum state
      // by tensor products
      qst = stmt[1]
      pgm = stmt[2];  // the gate sequence
      if (null !== pgm)
      {
        // the final element could be a Gate or a GateFactor
        sq = pgm[pgm.length - 1];
        if (sq instanceof GateFactor)
        {
          sq.build();
        }
      }
      else
        pgm = [];
      if (stmt[0] instanceof NamedGate)
      {
        // for a named gate, the gate equivalent is computed and assigned as a custom gate, becoming an instruction
        // in the instruction set; any initial quantum state is ignored, and the MRR is cleared.
        this.inst_set[this.mrr] = undefined;
        eq = this.run(pgm, null);
        if (!(eq instanceof this.Matrix))
          throw new Error('Named Gate can only be assigned a Matrix');
        this.inst_set[stmt[0].name] = eq;
      }
      else
      {
        // without a named gate, the program (gate sequence) is run with an optional initial quantum state
        // if there is a register and no initial quantum state, the register becomes the IQS
        if (stmt[0] instanceof Register)
        {
          // for a register, intialize the quantum state from the register
          // if it exists or from most recent reference
          rg = stmt[0];
          if (qst === null)
          {
            qst = [rg.valueOf()];
            rg = null;
          }
        }
        eq = this.run(pgm, qst);
        if (eq instanceof Qubit)
        {
          if (null != eq.gate)
            throw new Error('logic: Qubit gate is set at end of statement computation');
          if (null != rg)
            this.inst_set[rg.name] = eq;
          this.inst_set[this.mrr] = eq;
        }
      }
    }
    return eq;
  }
}
class Operand
{
  constructor(op)
  {
    this._opcode = op;
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
  toString() {
    return '';
  }
}
Operand.QUBIT = 1;
Operand.GATE = 2;
Operand.GATES = 3;
Operand.KET = 4;
Operand.GFACTOR = 5;
Operand.NMGATE = 6;
Operand.LINEREF = 7;
Operand.REGISTER = 8;
Operand.UNGATE = '_';
Operand.MGATE = 'M';
class Qubit extends Operand
{
  constructor(ka) {
    let _k, _mx;
    super(Operand.QUBIT);
    if (ka instanceof Qubit)
    {
      this._ident = ka._ident;
      this._next = null;
      this._gate = null;
      this._vector = ka._vector;
      return;
    }
    if (ka instanceof QDeskInterpret.single.Matrix)
    {
      this._ident = '';
      this._next = null;
      this._gate = null;
      this._vector = ka;
      return;
    }
    if (!(ka instanceof Array))
      throw new LogicErr('Qubit constructor requires a Ket array');
    this._ident = '';
    this._next = null;
    this._gate = null;
    _mx = ka[0].qubits;
    for (_k of ka)
    {
      if (!(_k instanceof Ket))
        throw new LogicErr('Qubit Ket array contains non-Ket\'s');
      if (_k.qubits > _mx)
        _mx = _k.qubits;
    }
    if (_mx > QDeskInterpret.single.Quantum.qubits)
      throw Error('current support is limited to ' + QDeskInterpret.single.Quantum.qubits + ' qubits');
    this._vector = new QDeskInterpret.single.Matrix(Math.pow(2, _mx), 1);
    for (_k of ka)
    {
      if (_k.qubits !== _mx)
        _k.qubits = _mx;
      // add the coefficient of each ket to the corresponding basis in the qubit under construction
      // avoids issues with duplicate bases in the ket array
      this._vector.sub(_k.basis, 0, _k.coeff.sum(this._vector.sub(_k.basis, 0)));
    }
  }
  disp() { // pass through a call to the vector
    return this._vector.disp();
  }
  edisp() { // pass through a call to the vector
    return this._vector.edisp();
  }
  qdisp() { // pass through a call to the vector
    return this._vector.qdisp();
  }
  prod(qs) { // pass through a call to the vector product
    return new Qubit(this._vector.prod(qs._vector));
  }
  scprod(qs) { // pass through a call to the scalar-vector product
    return new Qubit(this._vector.scprod(qs));
  }
  tensorprod(qs) { // pass through a call to the vector tensor product
    return new Qubit(this._vector.tensorprod(qs._vector));
  }
  transpose() { // pass through a call to the vector transpose
    return new Qubit(this._vector.transpose());
  }
  rows() { // pass through a call to the vector rows()
    return this._vector.rows();
  }
  columns() { // pass through a call to the vector rows()
    return this._vector.columns();
  }
  get ident() {
    return this._ident;
  }
  get vector() {
    return this._vector;
  }
  get name() {
    return this._ident;
  }
  get gate() {
    return this._gate
  }
  set gate(val) {
    this._gate = val;
  }
  toString() {
    return this.vector.qdisp();
  }
}
class LineRef extends Operand {
  /**
   * Construct a Line Reference, a gate suffix of one or more lines, referring to lines in the current register or
   * to other registers.
   * @param ln1 an array of an integer in character form, and a (possibly null) register reference, a string;
   * the special case of a null second element and a null ln2 is for backward compatibility to earlier
   * releases representing single digit line references with no registers; a single digit only is a gate replication
   * factor
   * @param ln2 an array (possibly null) of arrays of the same form as ln1, representing lines 2 through n in a sequence
   * of line (and register) references
   */
  constructor(ln1, ln2) {
    let _k;
    super(Operand.LINEREF);
    this._lines = [];
    this._repl = -1;
    if (0 === arguments.length)
      return this;
    if (!(ln1 instanceof Array))
      throw new LogicErr('LineRef parameter 1 must be an array');
    if (null === ln1[1] && (null === ln2 || 0 === ln2[0].length))
    {
      if (1 === ln1[0].length || (null !== ln2 && 0 === ln2[0].length))
      {
        this._repl = parseInt(ln1[0]);
      }
      else
      {
        for (_k = 0; _k < ln1[0].length; ++_k)
        {
          this._lines.push([parseInt(ln1[0][_k]), null]);
        }
      }
    }
    else
    {
      this._lines.push([parseInt(ln1[0]), (null === ln1[1]) ? null : ln1[1]]);
      for (_k = 0; _k < ln2.length; ++_k)
      {
        if (0 === ln2[_k].length)
          break;
        this._lines.push([parseInt(ln2[_k][0]), (null === ln2[_k][1]) ? null : ln2[_k][1]]);
      }
    }
  }
  isRepl() {
    return 0 < this._repl;
  }
  get repl() {
    return this._repl;
  }
  get qubits() {
    return (0 !== this._lines.length) ? this._lines.reduce((pv, cv) => pv + cv[0], 0) : this._repl;
  }
  get lines() {
    return this._lines.length;
  }
  hasLine(ix) {
    return !(ix < 0 || ix >= this._lines);
  }
  hasReg(ix) {
    return !(ix < 0 || ix >= this._lines || this._lines[ix][1] === null);
  }
  getLine(ix) {
    return this._lines[ix][0];
  }
  getReg(ix) {
    return this._lines[ix][1];
  }
  toString() {
    let lrg, ix, lins;
    if (this.isRepl())
    {
      if (this._repl < 10)
        return `${this._repl}`;
      return `${this._repl},`;
    }
    lrg = false;
    for (ix = 0; ix < this._lines.length; ++ix)
    {
      if (this.getLine(ix) > 9 || this.hasReg(ix))
      {
        lrg = true;
        break;
      }
    }
    lins = [];
    if (lrg)
    {
      for (ix = 0; ix < this._lines.length; ++ix)
      {
        if (this.hasReg(ix))
          lins.push(`${this.getLine(ix)}${this.getReg(ix)}`)
        else
          lins.push(`${this.getLine(ix)}`)
      }
      return lins.join(',');
    }
    for (ix = 0; ix < this._lines.length; ++ix)
    {
      lins.push(`${this.getLine(ix)}`)
    }
    return lins.join('');
  }
}
class Gate extends Operand {
  constructor(nm, sf) {
    super(Operand.GATE);
    this._name = nm;
    this._suffix = null;
    this._angles = [];
    this._measure = false;
    this._gates = 1;
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
      if (null != this._suffix)
      {
        if (!this._suffix.isRepl() || this._suffix.repl < 1 || this._suffix.repl > 9)
          throw new Error(`gate ${nm}${this._suffix.toString()} is unknown`);
      }
    }
    this.opcode = this.opCodeStr();
    try
    {
      QDeskInterpret.single.analyze_opcode(this);
    }
    catch (e)
    {
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
    if (null === gat)
      return;
    opc = this.opcode + gat.opcode;
    this._gates += 1;
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
  get qubits() {
    return (null !== this._suffix) ? this._suffix.qubits : this._gates;
  }
  getSuffix() {
    return this._suffix;
  }
  getAngles() {
    return this._angles;
  }
  addAngles(an) {
    this._angles.concat(an);
  }
  getLine(ix) {
    return this._suffix.getLine(ix);
  }
  opCodeStr() {
    let str, ss, lst;
    str = this._name;
    if (0 !== this._angles.length)
    {
      lst = [];
      for (let an of this._angles)
      {
        ss = String(an);
        lst.push(ss);
      }
      str = str + '(' + lst.join(',') + ')';
    }
    if (null !== this._suffix)
    {
      if (str === Operand.MGATE)
      {
        return Operand.MGATE.repeat(this._suffix.repl);
      }
      str += this._suffix.toString();
    }
    return str;
  }
  toString() {
    return ':' + this.opcode;
  }
}
class NamedGate extends Operand
{
  constructor(nm) {
    super(Operand.NMGATE);
    this._name = nm;
  }
  get name() {
    return this._name;
  }
  toString() {
    return this._name;
  }
}
class Register extends Operand
{
  constructor(nm) {
    super(Operand.REGISTER);
    this._name = '~' + nm;
  }
  get name() {
    return this._name;
  }
  valueOf() {
    let vl;
    vl = QDeskInterpret.single.inst_set[this._name];
    if (vl === undefined)
      throw new Error('register ' + this._name + ' is not defined');
    return vl;
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
    super('/');
    this._factor = new QDeskInterpret.single.Complex(b);
    this._opcode += this._factor.disp();
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
    let r, op;
    r = new QDeskInterpret.single.Complex(1).quo(this._factor);
    op = QDeskInterpret.single.Matrix.scprod.bind(null, r);
    QDeskInterpret.single.inst_set[this._opcode] = op;
    return this._opcode;
  }
}
module.exports.QDeskInterpret = QDeskInterpret;
