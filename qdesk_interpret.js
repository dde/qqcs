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
class QDeskInterpret
{
  constructor(cfg)
  {
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
      this.cfg = {trace:false, kdisp:false};
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
      'I': this.Quantum.iGate,
      'X': this.Quantum.xGate,
      'Y': this.Quantum.yGate,
      'Z': this.Quantum.zGate,
      'H': this.Quantum.hGate,
      'M': null,
      'S': this.Quantum.sGate,
      'T': this.Quantum.tGate,
      's': this.Quantum.sGate.adjoint(),
      't': this.Quantum.tGate.adjoint(),
      'C': null,
      'Cr': null,
      'Cx': null,
      'Im':null,
      'Sw': null,
      'Tf': null,
      'Rx': null,
      'Ry': null,
      'Rz': null,
      // 'D': null,
    };
    this.inst_set = [];
  }
  clearFlags() {
    this.cfg.trace = false;
    this.cfg.kdisp = false;
  }
  setFlags(cfg) {
    if (undefined !== cfg.trace)
      this.cfg.trace = Boolean(cfg.trace);
    if (undefined !== cfg.kdisp)
      this.cfg.kdisp = Boolean(cfg.kdisp);
  }
  commentProcessor(cmt)
  {
    let mch = [];
    mch[0] = cmt.indexOf('$trace');
    mch[1] = cmt.indexOf('$kdisp');
    mch[2] = cmt.indexOf('$none');
    if (-1 < mch[0])
      this.cfg.trace = true;
    if (-1 < mch[1])
      this.cfg.kdisp = true;
    if (-1 < mch[2])
    {
      this.cfg.trace = false;
      this.cfg.kdisp = false;
    }
    if (this.cfg.interactive)
    {
      if (0 === cmt.indexOf('gate'))
      {
        process.stdout.write(':H :X :Y :Z :I :S :T :s :t :Cx :Cr :Cct Swct Tfcct Imq - c control, t target, q qubits\n');
        process.stdout.write('single qubit gates :H :X :Y :Z :I :S :T :s :t may also have a control suffix\n');
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
  analyze_opcode(opc) {
    let ch, pw, ix, jx, kx, bas, pf, sf, ln, op, c1, c2, t1;
    function tpower(pwr, mt)
    {
      let pw, ct, op = null;
      pw = parseInt(pwr);
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
    ln = opc.length - 1;
    for (ix = 0; ix <= ln; ++ix)  // find the i prefix
    {
      if ('i' !== opc.charAt(ix))
        break;
    }
    for (jx = ln; jx >= 0; --jx)  // find the i suffix
    {
      if ('i' !== opc.charAt(jx))
        break;
    }
    for (kx = jx; kx >= 0; --kx)  // find the digit string suffix if any
    {
      ch = opc.charAt(kx);
      if (ch < '0' || ch > '9')
        break;
    }
    bas = opc.substring(ix, kx + 1);  // extract the base gate name
    if (undefined === this.base_set[bas])  // if the gate name is not known, see if we can build it
    {
      for (kx = jx; kx >= ix; --kx)
      {
        ch = opc.charAt(kx);
        if (undefined !== this.base_set[ch])
        {
          if (kx < jx)
            op = this.base_set[ch].tensorprod(op);
          else
            op = this.base_set[ch]
          continue;
        }
        if (kx > 0 && (ch === 'f' || ch === 'm' || ch === 'r' || ch === 'x' || ch === 'y' || ch === 'z' || ch === 'w'))
        {
          ch += opc.charAt(--kx);
        }
        if (undefined !== this.base_set[ch])
        {
          if (kx < ln)
            op = this.base_set[ch].tensorprod(op);
          else
            op = this.base_set[ch]
        }
        else
          throw new Error('gate ' + opc + ' is unknown');
      }
      bas = '0';
    }
    pf = (ix > 0) ? this.Quantum.buildIn(ix) : null;
    sf = (jx < ln) ? this.Quantum.buildIn(ln - jx) : null;
    switch (bas)
    {
    case 'I':
    case 'X':
    case 'Y':
    case 'Z':
    case 'H':
    case 'S':
    case 'T':
    case 's':
    case 't':
      op = this.base_set[bas];
      if (kx < jx)
      {
        try
        {
          if (1 === jx - kx)
          {
            op = tpower(opc.substring(kx + 1, jx + 1), this.base_set[bas]);
          }
          else if (2 === jx - kx)
          {
            c1 = parseInt(opc.charAt(kx + 1));
            t1 = parseInt(opc.charAt(kx + 2));
            op = this.Quantum.buildControlled(Math.abs(c1 - t1) + 1, c1, t1, this.base_set[bas]);
          }
          else
            throw new Error('gate ' + opc + ' is unknown');
        }
        catch (e)
        {
          throw new Error('gate ' + opc + ' is unknown');
        }
      }
      break;
    case 'Cx':
      op = this.Quantum.controlledNotGate;
      break;
    case 'Cr':
      op = this.Quantum.buildCNOT(2, 1, 0);
      break;
    case 'C':
      if (2 !== jx - kx)
        throw new Error('opcode ' + opc + ' is unknown');
      c1 = parseInt(opc.charAt(kx + 1));
      t1 = parseInt(opc.charAt(kx + 2));
      op = this.Quantum.buildCNOT(Math.abs(c1 - t1) + 1, c1, t1);
      break;
    case 'Im':
      c1 = parseInt(opc.charAt(kx + 1));
      if (isNaN(c1))
        c1 = 1;
      op = this.Quantum.buildMeanInversion(c1);
      break;
    case 'Sw':
      if (2 !== jx - kx)
        throw new Error('opcode ' + opc + ' is unknown');
      c1 = parseInt(opc.charAt(kx + 1));
      c2 = parseInt(opc.charAt(kx + 2));
      op = this.Quantum.buildSwap(Math.abs(c1 - c2) + 1, c1, c2);
      break;
    case 'Tf':
      if (3 !== jx - kx)
        throw new Error('opcode ' + opc + ' is unknown');
      c1 = parseInt(opc.charAt(kx + 1));
      c2 = parseInt(opc.charAt(kx + 2));
      t1 = parseInt(opc.charAt(kx + 3));
      op = this.Quantum.buildToffoli(Math.max(c1, c2, t1) - Math.min(c1, c2, t1) + 1, c1, c2, t1);
      break;
    case 'M':
      // measurement
      pw = [];
      pw.push('0'.repeat(ix));
      if (kx < jx)
      {
        try
        {
          pw.push('1'.repeat(parseInt(opc.substring(kx + 1, jx + 1))));
        }
        catch (e)
        {
          throw new Error('gate ' + opc + ' is unknown');
        }
      }
      else
      {
        for (kx = 0; kx < bas.length; ++kx)
        {
          ch = bas.charAt(kx);
          if ('M' === ch)
          {
            pw.push('1');
          }
        }
      }
      pw.push('0'.repeat(ln - jx));
      op = QDeskInterpret.single.Quantum.measure.bind(null, pw.join(''));
      pf = null;
      sf = null;
      break;
    case '/':
      break;
    case '0':
      break;
    // case 'D':
    //   c1 = parseInt(opc.charAt(kx + 1));
    //   if (isNaN(c1))
    //     c1 = 1;
    //   op = this.Quantum.buildDGate(c1);
    //   break;
    default:
      if (undefined === this.base_set[bas])  // if the gate name is not known, see if we can build it
        throw new Error(opc + ' unimplemented');
      op = this.base_set[bas];  // will be reset below
      break;
    }
    if (null !== pf)
    {
      op = pf.tensorprod(op);
    }
    if (null !== sf)
    {
      op = op.tensorprod(sf);
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
      /*if (this.cfg.trace)
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
      }*/
    }
    this.finalDisplay(eq, init, lst);
    return eq;
  }
  exec (stmt) {
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
        while (null != sq)
        {
          if (sq instanceof Gate)
          {
            pgm.push(sq.name);
          }
          else if (sq instanceof GateFactor)
          {
            break;  // GateFactor will be ignored on gate sequence assignment
          }
          else
            throw new Error('logic: not Gate object in Gate sequence');
          sq = sq.next;
        }
        eq = this.run(pgm, null, {trace:false, kdisp:false});
        this.base_set[ng.name] = eq;
        return this.test_out;
      }
      while (null != sq.next)
      {
        if (!(sq instanceof Gate))
          throw new Error('logic: not Gate object in Gate sequence');
        pgm.push(sq.name);
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
        pgm.push(sq.name);
      }
    }
    this.run(pgm, qst);
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
      this._vector.sub(_k.basis, 0, new QDeskInterpret.single.Complex(_k.coeff));
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
  constructor(nm) {
    super(Operand.GATE);
    this._name = nm;
    try
    {
      QDeskInterpret.single.analyze_opcode(this._name);
    }
    catch (e)
    {
      // this.write(e.message);
      // return;
      throw e;
    }
  }
  combine(gat) {
    let rgt, op;
    if (null == gat)
      return;
    rgt = QDeskInterpret.single.inst_set[gat.name];
    op = QDeskInterpret.single.inst_set[this._name].tensorprod(rgt);
    this._name += ',' + gat.name;
    QDeskInterpret.single.inst_set[this._name] = op;
  }
  get name() {
    return this._name;
  }
  toString() {
    return ':' + this._name;
  }
}
class NamedGate extends Operand
{
  constructor(nm, gs) {
    super(Operand.NMGATE);
    this._name = nm;
    this._gate_seq = gs;
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
