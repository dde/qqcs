/**
 * Created by danevans on 4/4/20.
 */
let qq = require('./quantum.js');
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
  analyze_opcode(gat) {
    let bas, ph, sf, op, c1, c2, t1;
    let opc;
    function tpower(pwr, mt)
    {
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
    case 'Tp':
    case 'Rx':
    case 'Ry':
    case 'Rz':
      if (ph.length !== 1)
        throw new Error('gate ' + bas + ' requires 1 angular parameter');
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
    case 'Tf':
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
      if ('Tf' === bas)
        op = this.Quantum.buildToffoli(Math.max(c1, c2, t1) + 1, c1, c2, t1);
      else
        op = this.Quantum.buildFred(Math.max(c1, c2, t1) + 1, c1, c2, t1);
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
      while (null != sq && sq instanceof Qubit)
      {
        qst.push(sq.vector);
        sq = sq.next;
      }
    }
    else
    {
      sq = stmt;
    }
    if (null != sq)
    {
      if (sq instanceof NamedGate)
      {
        ng = sq;
        sq = sq.next;
      }
      while (null != sq.next)
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
    if (ng != null)
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
    this._oprs = null;  // filled in by instructions that have an operand list
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
