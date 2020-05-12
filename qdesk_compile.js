class SynErr extends Error
{
  constructor(msg, lex) {
    super(msg + ' at line ' + String(lex.linenumber) + ':' + String(lex.position));
  }
}
class QDeskCompile
{
  constructor(lex, sym, exe) {
    this.lex = lex;
    this.sym = sym;
    this.exe = exe;
  }
r_assoc2(_op, _lft, _tail)
{
  if (null != _tail)
  {                             //    op
    _tail.left = _lft;          //    tail
    _op.rght = _tail;           //    lft
  }
  else
  {
    _op.rght = _lft;            //    op
  }                             //    lft
  return _op;
}
l_assoc2(op, lft, tail)
{
  let sq;
  if (null != tail)
  {
    sq = tail;
    while (null != sq.left)
      sq = sq.left;
    sq.left = op;
    op.rght = lft;
    return tail;
  }
  op.rght = lft;
  return op;
}
r_assoc1(_lft, _tail)
{
  // if (null != _exp)
  //   _exp.left = _lft;
  // else
  //   _exp = _lft;
  if (null != _tail)         //     tail
    _tail.left = _lft;       //   lft
  else
    _tail = _lft;            //     lft
  return _tail;
}
l_assoc1(_lft, _tail)
{
  let sq;
  // if (null != _exp)
  //   _exp.left = _lft;
  // else
  //   _exp = _lft;
  if (null != _tail)
  {
    sq = _tail;
    while (null != sq.left)
      sq = sq.left;
    sq.left = _lft;
  }
  else
    _tail = _lft;
  return _tail;
}
_assoc1(_lft, _tail)
{
  // return this.r_assoc1(_lft, _tail);
  return this.l_assoc1(_lft, _tail);
}
_assoc2(_op, _lft, _tail)
{
  // return this.r_assoc2(_op, _lft, _tail)
  return this.l_assoc2(_op, _lft, _tail)
}
_append(_sv, _el)
{
  let _sq;
  _sq = _sv;
  while (null != _sq.next)
  {
    _sq = _sq.next;
  }
  _sq.next = _el;
  return _sv;
}
_pgm()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _rt = this._stmt();
  //e-codepoint 1
  _rt = this._stmt_list();
  //g-codepoint 2
  _tk = this.lex.next_token();
  if (this.sym['none'] !== _tk.symbol)
    throw new SynErr("expected eof, not " + _tk, this.lex);
  //c0-codepoint 3
  return _rt;
}
_stmt()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['none'] === _tk.symbol || this.sym['eol'] === _tk.symbol)
  {
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['integer'] === _tk.symbol || this.sym['colon'] === _tk.symbol || this.sym['complex'] === _tk.symbol || this.sym['minus'] === _tk.symbol || this.sym['divide'] === _tk.symbol || this.sym['bar'] === _tk.symbol || this.sym['lparen'] === _tk.symbol)
  {
    this.lex.pushBack(_tk);
    _rt = this._circuit();
    //d-codepoint 1
  }
  else if (this.sym['ident'] === _tk.symbol)
  {
    _rt = this._gate_sequence();
    //f-codepoint 2
    _rt = new this.exe.NamedGate(_tk.token, _rt);
  }
  else
    throw new SynErr("expected [integer, :, complex, -, ident, /, |, (], not " + _tk, this.lex);
  return _rt;
}
_stmt_list()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['none'] === _tk.symbol)
  {
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['eol'] === _tk.symbol)
  {
    _rt = this._stmt();
    //g-codepoint 1
    _sv = _rt;
    _rt = this._stmt_list();
    //f-codepoint 2
    if (null != _sv)
    {
      _sv.next = _rt;
      _rt = _sv;
    }
  }
  else
    throw new SynErr("expected [eol], not " + _tk, this.lex);
  return _rt;
}
_circuit()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['none'] === _tk.symbol || this.sym['eol'] === _tk.symbol)
  {
    //a0-codepoint 0
    return _rt;
  }
  _rt = this._initial_value();
  //e-codepoint 1
  _sv = _rt;
  _rt = this._gate_sequence();
  //f-codepoint 2
  if (null == _sv)
    return _rt;
  _rt = this._append(_sv, _rt);
  return _rt;
}
_gate_sequence()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['none'] === _tk.symbol || this.sym['eol'] === _tk.symbol)
  {
    //a0-codepoint 0
    return _rt;
  }
  _rt = this._g_seq_tail();
  //e-codepoint 1
  _sv = _rt;
  _rt = this._g_factor();
  //f-codepoint 2
  _rt = this._append(_sv, _rt);
  return _rt;
}
_initial_value()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['none'] === _tk.symbol || this.sym['colon'] === _tk.symbol || this.sym['eol'] === _tk.symbol || this.sym['divide'] === _tk.symbol)
  {
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['integer'] === _tk.symbol || this.sym['complex'] === _tk.symbol || this.sym['minus'] === _tk.symbol || this.sym['bar'] === _tk.symbol)
  {
    this.lex.pushBack(_tk);
    _rt = this._q_state();
    //d-codepoint 1
  }
  else if (this.sym['lparen'] === _tk.symbol)
  {
    this.lex.pushBack(_tk);
    _rt = this._q_state_list();
    //d-codepoint 2
  }
  return _rt;
}
_q_state()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _rt = this._unop();
  //e-codepoint 1
  _sv = _rt;
  _rt = this._v_comp();
  //g-codepoint 2
  if (null != _sv)
    _rt.negate();
  _sv = _rt;
  _rt = this._p_state_tail();
  //f-codepoint 3
  _rt.unshift(_sv);
  _rt = new this.exe.Qubit(_rt);
  return _rt;
}
_q_state_list()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['none'] === _tk.symbol || this.sym['colon'] === _tk.symbol || this.sym['eol'] === _tk.symbol || this.sym['divide'] === _tk.symbol)
  {
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['lparen'] === _tk.symbol)
  {
    _rt = this._q_state();
    //g-codepoint 1
    _sv = _rt;
    _tk = this.lex.next_token();
    if (this.sym['rparen'] !== _tk.symbol)
      throw new SynErr("expected ), not " + _tk, this.lex);
    //c1-codepoint 2
    _rt = this._q_state_list();
    //f-codepoint 3
    _sv.next = _rt;
    _rt = _sv;
  }
  else
    throw new SynErr("expected [(], not " + _tk, this.lex);
  return _rt;
}
_g_seq_tail()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['none'] === _tk.symbol || this.sym['eol'] === _tk.symbol || this.sym['divide'] === _tk.symbol)
  {
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['colon'] === _tk.symbol)
  {
    _rt = this._gate();
    //g-codepoint 1
    _sv = _rt;
    _rt = this._g_seq_tail();
    //f-codepoint 2
    _sv.next = _rt;
    _rt = _sv;
  }
  else
    throw new SynErr("expected [:], not " + _tk, this.lex);
  return _rt;
}
_g_factor()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['none'] === _tk.symbol || this.sym['eol'] === _tk.symbol)
  {
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['divide'] === _tk.symbol)
  {
    _rt = this._unop();
    //g-codepoint 1
    _sv = _rt;
    _tk = this.lex.next_token();
    if (this.sym['complex'] !== _tk.symbol)
      throw new SynErr("expected complex, not " + _tk, this.lex);
    //c0-codepoint 2
    _rt = new this.exe.GateFactor(_tk.token);
    if (null != _sv)
      _rt.negate();
  }
  else
    throw new SynErr("expected [/], not " + _tk, this.lex);
  return _rt;
}
_gate()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _rt = this._sub_gate();
  //e-codepoint 1
  _sv = _rt;
  _rt = this._gates();
  //f-codepoint 2
  _sv.combine(_rt);
  _rt = _sv;
  return _rt;
}
_unop()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['integer'] === _tk.symbol || this.sym['complex'] === _tk.symbol || this.sym['bar'] === _tk.symbol)
  {
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['minus'] === _tk.symbol)
  {
    //b-codepoint 1
    _rt = 1.0;
  }
  return _rt;
}
_v_comp()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _rt = this._coeff();
  //e-codepoint 1
  _sv = _rt;
  _rt = this._ket();
  //f-codepoint 2
  _rt.coeff = _sv;
  return _rt;
}
_p_state_tail()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['none'] === _tk.symbol || this.sym['colon'] === _tk.symbol || this.sym['eol'] === _tk.symbol || this.sym['rparen'] === _tk.symbol || this.sym['divide'] === _tk.symbol)
  {
    //a0-codepoint 0
    _rt = [];
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['minus'] === _tk.symbol || this.sym['plus'] === _tk.symbol)
  {
    this.lex.pushBack(_tk);
    _rt = this._addop();
    //d-codepoint 1
    _sv = _rt;
    _rt = this._v_comp();
    //g-codepoint 2
    if (_sv < 0)
      _rt.negate();
    _sv = _rt;
    _rt = this._p_state_tail();
    //f-codepoint 3
    _rt.unshift(_sv);
  }
  else
    throw new SynErr("expected [-, +], not " + _tk, this.lex);
  return _rt;
}
_addop()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _tk = this.lex.next_token();
  if (this.sym['plus'] === _tk.symbol)
  {
    //b-codepoint 1
    _rt = 1.0;
  }
  else if (this.sym['minus'] === _tk.symbol)
  {
    //b-codepoint 2
    _rt = -1.0;
  }
  return _rt;
}
_sub_gate()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _tk = this.lex.next_token();
  if (this.sym['ident'] === _tk.symbol)
  {
    //b-codepoint 1
    _rt = new this.exe.Gate(_tk.token);
  }
  return _rt;
}
_gates()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['none'] === _tk.symbol || this.sym['colon'] === _tk.symbol || this.sym['eol'] === _tk.symbol || this.sym['divide'] === _tk.symbol)
  {
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['comma'] === _tk.symbol)
  {
    _rt = this._sub_gate();
    //g-codepoint 1
    _sv = _rt;
    _rt = this._gates();
    //f-codepoint 2
    _sv.combine(_rt);
    _rt = _sv;
  }
  else
    throw new SynErr("expected [,], not " + _tk, this.lex);
  return _rt;
}
_coeff()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.next_token();
  this.lex.pushBack(_tk);
  if (this.sym['bar'] === _tk.symbol)
  {
    //a0-codepoint 0
    _rt = Number(1.0);
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['complex'] === _tk.symbol)
  {
    //b-codepoint 1
    _rt = _tk.token;
  }
  else if (this.sym['integer'] === _tk.symbol)
  {
    //b-codepoint 2
    _rt = _tk.token;
  }
  return _rt;
}
_ket()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _tk = this.lex.next_token();
  if (this.sym['bar'] === _tk.symbol)
  {
    _tk = this.lex.next_token();
    if (this.sym['integer'] !== _tk.symbol)
      throw new SynErr("expected integer, not " + _tk, this.lex);
    //c1-codepoint 1
    _sv = new this.exe.Ket(_tk.token);
    _tk = this.lex.next_token();
    if (this.sym['great'] !== _tk.symbol)
      throw new SynErr("expected >, not " + _tk, this.lex);
    //c0-codepoint 2
    _rt = _sv;
  }
  else
    throw new SynErr("expected [|], not " + _tk, this.lex);
  return _rt;
}
}
module.exports.QDeskCompile = QDeskCompile;
module.exports.SynErr = SynErr;
