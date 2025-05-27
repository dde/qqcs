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
_pgm()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _rt = this._stmt();
  //e-codepoint 1
  if (null === _rt)
    return null;
  _sq = _rt;
  _rt = this._stmt_list();
  //g-codepoint 2
  if (null !== _rt)
    _rt.unshift(_sq);
  else
    _rt = [_sq];
  _sv = _rt;
  _rt = this._eos();
  //f-codepoint 3
  _rt = _sv;
  return _rt;
}
_stmt()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['none']:
  case this.sym['eol']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['ident'] === _tk.symbol)
  {
    _rt = this._gate_sequence();
    //f-codepoint 1
    _rt = [new this.exe.NamedGate(_tk.token, null), null, _rt];
  }
  else if (this.sym['eol'] === _tk.symbol || this.sym['none'] === _tk.symbol || this.sym['semi'] === _tk.symbol || this.sym['ident'] === _tk.symbol || this.sym['colon'] === _tk.symbol || this.sym['divide'] === _tk.symbol || this.sym['lparen'] === _tk.symbol || this.sym['rparen'] === _tk.symbol || this.sym['gate'] === _tk.symbol || this.sym['comma'] === _tk.symbol || this.sym['integer'] === _tk.symbol || this.sym['reg'] === _tk.symbol || this.sym['bar'] === _tk.symbol || this.sym['complex'] === _tk.symbol || this.sym['real'] === _tk.symbol || this.sym['plus'] === _tk.symbol || this.sym['minus'] === _tk.symbol)
  {
    this.lex.pushBack(_tk);
    _rt = this._reg();
    //d-codepoint 2
    _sv = [_rt];
    _rt = this._initial_value();
    //g-codepoint 3
    _sv.push(_rt);
    _rt = this._gate_sequence();
    //f-codepoint 4
    _sv.push(_rt);
    _rt = _sv;
  }
  else
    throw new SynErr("expected [-, ident, real, :, integer, ~, complex, /, +, (, |], not " + _tk, this.lex);
  return _rt;
}
_stmt_list()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['none']:
  case this.sym['eol']:
    //a0-codepoint 0
    return _rt;
  }
  // tail-recursion
  _tk = this.lex.lookAhead();
  if (this.sym['semi'] === _tk.symbol)
  {
    //t-codepoint 1
    _sq = [];
    do
    {
      _tk = this.lex.next_token();
      if (this.sym['semi'] === _tk.symbol)
      {
        _rt = this._stmt();
        //g-codepoint 2
        _sq.push(_rt);
        _rt = _sq;
      }
      _tk = this.lex.lookAhead();
    }
    while (this.sym['semi'] === _tk.symbol);
  }
  else
    throw new SynErr("expected [;], not " + _tk, this.lex);
  return _rt;
}
_eos()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _tk = this.lex.next_token();
  if (this.sym['eol'] === _tk.symbol)
  {
    //b-codepoint 1
  }
  else if (this.sym['none'] === _tk.symbol)
  {
    //b-codepoint 2
  }
  else
    throw new SynErr("expected [none, eol], not " + _tk, this.lex);
  return _rt;
}
_gate_sequence()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
  case this.sym['none']:
  case this.sym['eol']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  _rt = this._g_seq_tail();
  //e-codepoint 1
  _sv = _rt;
  _rt = this._g_factor();
  //f-codepoint 2
  if (null !== _rt)
  {
    if (null === _sv)
      throw new Error('no operand to factor');
    _sv.push(_rt);
  }
  _rt = _sv;
  return _rt;
}
_reg()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['comma']:
  case this.sym['real']:
  case this.sym['eol']:
  case this.sym['integer']:
  case this.sym['plus']:
  case this.sym['bar']:
  case this.sym['semi']:
  case this.sym['minus']:
  case this.sym['rparen']:
  case this.sym['none']:
  case this.sym['ident']:
  case this.sym['gate']:
  case this.sym['colon']:
  case this.sym['complex']:
  case this.sym['divide']:
  case this.sym['lparen']:
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['reg'] === _tk.symbol)
  {
    _tk = this.lex.next_token();
    if (this.sym['ident'] !== _tk.symbol)
      throw new SynErr("expected [ident], not " + _tk, this.lex);
    //c2-codepoint 1
    _rt = new this.exe.Register(_tk.token);
  }
  else
    throw new SynErr("expected [~], not " + _tk, this.lex);
  return _rt;
}
_initial_value()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
  case this.sym['none']:
  case this.sym['eol']:
  case this.sym['colon']:
  case this.sym['divide']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['minus'] === _tk.symbol || this.sym['real'] === _tk.symbol || this.sym['integer'] === _tk.symbol || this.sym['complex'] === _tk.symbol || this.sym['plus'] === _tk.symbol || this.sym['bar'] === _tk.symbol)
  {
    this.lex.pushBack(_tk);
    _rt = this._q_state();
    //d-codepoint 1
    _sv = [_rt];
    _rt = _sv;
  }
  else if (this.sym['eol'] === _tk.symbol || this.sym['none'] === _tk.symbol || this.sym['semi'] === _tk.symbol || this.sym['colon'] === _tk.symbol || this.sym['divide'] === _tk.symbol || this.sym['lparen'] === _tk.symbol || this.sym['rparen'] === _tk.symbol)
  {
    this.lex.pushBack(_tk);
    _rt = this._q_state_list();
    //d-codepoint 2
    // unused code point
  }
  else
    throw new SynErr("expected [-, real, integer, complex, +, (, |], not " + _tk, this.lex);
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
  if (_sv)
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
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
  case this.sym['none']:
  case this.sym['eol']:
  case this.sym['colon']:
  case this.sym['divide']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  // tail-recursion
  _tk = this.lex.lookAhead();
  if (this.sym['lparen'] === _tk.symbol)
  {
    //t-codepoint 1
    _sq = [];
    do
    {
      _tk = this.lex.next_token();
      if (this.sym['lparen'] === _tk.symbol)
      {
        _rt = this._t_val();
        //g-codepoint 2
        // _rt is a Qubit
        _sq.push(_rt);
        _sv = _rt;
        _rt = this._gate_sequence();
        //g-codepoint 3
        if (_rt != null)
          _sv.gate = _rt;
        _rt = _sq;
        _tk = this.lex.next_token();
        if (this.sym['rparen'] !== _tk.symbol)
          throw new SynErr("expected [)], not " + _tk, this.lex);
        //c1-codepoint 4
      }
      _tk = this.lex.lookAhead();
    }
    while (this.sym['lparen'] === _tk.symbol);
  }
  else
    throw new SynErr("expected [(], not " + _tk, this.lex);
  return _rt;
}
_g_seq_tail()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
  case this.sym['none']:
  case this.sym['eol']:
  case this.sym['divide']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  // tail-recursion
  _tk = this.lex.lookAhead();
  if (this.sym['colon'] === _tk.symbol)
  {
    //t-codepoint 1
    _sq = [];
    do
    {
      _tk = this.lex.next_token();
      if (this.sym['colon'] === _tk.symbol)
      {
        _rt = this._gate_list();
        //g-codepoint 2
        _rt.finish()
        _sq.push(_rt);
        _rt = _sq;
      }
      _tk = this.lex.lookAhead();
    }
    while (this.sym['colon'] === _tk.symbol);
  }
  else
    throw new SynErr("expected [:], not " + _tk, this.lex);
  return _rt;
}
_g_factor()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
  case this.sym['none']:
  case this.sym['eol']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['divide'] === _tk.symbol)
  {
    _rt = this._unop();
    //g-codepoint 1
    _sv = _rt;
    _rt = this._Complex();
    //f-codepoint 2
    if (_sv)
      _rt = '-' + _rt;
    _rt = new this.exe.GateFactor(_rt);
  }
  else
    throw new SynErr("expected [/], not " + _tk, this.lex);
  return _rt;
}
_gate_list()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
  case this.sym['none']:
  case this.sym['eol']:
  case this.sym['colon']:
  case this.sym['divide']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  // tail-recursion
  _tk = this.lex.lookAhead();
  if (this.sym['ident'] === _tk.symbol || this.sym['gate'] === _tk.symbol)
  {
    //t-codepoint 1
    _sq = null;
    do
    {
      _tk = this.lex.next_token();
      if (this.sym['ident'] === _tk.symbol || this.sym['gate'] === _tk.symbol)
      {
        this.lex.pushBack(_tk);
        _rt = this._full_gate();
        //d-codepoint 2
        if (null === _sq)
          _sq = _rt;
        else
          _sq.combine(_rt);
        _rt = _sq;
      }
      _tk = this.lex.lookAhead();
    }
    while (this.sym['ident'] === _tk.symbol || this.sym['gate'] === _tk.symbol);
  }
  else
    throw new SynErr("expected [ident, gate], not " + _tk, this.lex);
  return _rt;
}
_unop()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['real']:
  case this.sym['integer']:
  case this.sym['complex']:
  case this.sym['bar']:
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['minus'] === _tk.symbol || this.sym['plus'] === _tk.symbol)
  {
    this.lex.pushBack(_tk);
    _rt = this._addop();
    //d-codepoint 1
    _rt = _rt < 0;
  }
  else
    throw new SynErr("expected [-, +], not " + _tk, this.lex);
  return _rt;
}
_Complex()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _tk = this.lex.next_token();
  if (this.sym['complex'] === _tk.symbol)
  {
    //b-codepoint 1
    _rt = _tk.token;
  }
  else if (this.sym['real'] === _tk.symbol)
  {
    //b-codepoint 2
    _rt = _tk.token;
  }
  else if (this.sym['integer'] === _tk.symbol)
  {
    //b-codepoint 3
    _rt = _tk.token;
  }
  else
    throw new SynErr("expected [real, integer, complex], not " + _tk, this.lex);
  return _rt;
}
_t_val()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
  case this.sym['none']:
  case this.sym['eol']:
  case this.sym['colon']:
  case this.sym['divide']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['minus'] === _tk.symbol || this.sym['real'] === _tk.symbol || this.sym['integer'] === _tk.symbol || this.sym['complex'] === _tk.symbol || this.sym['plus'] === _tk.symbol || this.sym['bar'] === _tk.symbol)
  {
    this.lex.pushBack(_tk);
    _rt = this._q_state();
    //d-codepoint 1
  }
  else if (this.sym['eol'] === _tk.symbol || this.sym['none'] === _tk.symbol || this.sym['semi'] === _tk.symbol || this.sym['ident'] === _tk.symbol || this.sym['colon'] === _tk.symbol || this.sym['divide'] === _tk.symbol || this.sym['lparen'] === _tk.symbol || this.sym['rparen'] === _tk.symbol || this.sym['gate'] === _tk.symbol || this.sym['comma'] === _tk.symbol || this.sym['integer'] === _tk.symbol || this.sym['reg'] === _tk.symbol || this.sym['bar'] === _tk.symbol || this.sym['complex'] === _tk.symbol || this.sym['real'] === _tk.symbol || this.sym['plus'] === _tk.symbol || this.sym['minus'] === _tk.symbol)
  {
    this.lex.pushBack(_tk);
    _rt = this._reg();
    //d-codepoint 2
    _rt = new this.exe.Qubit(_rt.valueOf());
  }
  else
    throw new SynErr("expected [-, real, integer, ~, complex, +, |], not " + _tk, this.lex);
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
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
  case this.sym['none']:
  case this.sym['eol']:
  case this.sym['colon']:
  case this.sym['divide']:
  case this.sym['semi']:
    //a0-codepoint 0
    _rt = [];
    return _rt;
  }
  // tail-recursion
  _tk = this.lex.lookAhead();
  if (this.sym['minus'] === _tk.symbol || this.sym['plus'] === _tk.symbol)
  {
    //t-codepoint 1
    _sq = [];
    do
    {
      _tk = this.lex.next_token();
      if (this.sym['minus'] === _tk.symbol || this.sym['plus'] === _tk.symbol)
      {
        this.lex.pushBack(_tk);
        _rt = this._addop();
        //d-codepoint 2
        _sv = _rt;
        _rt = this._v_comp();
        //g-codepoint 3
        if (_sv < 0)
          _rt.negate();
        _sq.push(_rt);
        _rt = _sq;
      }
      _tk = this.lex.lookAhead();
    }
    while (this.sym['minus'] === _tk.symbol || this.sym['plus'] === _tk.symbol);
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
  else
    throw new SynErr("expected [-, +], not " + _tk, this.lex);
  return _rt;
}
_full_gate()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _rt = this._gate_name();
  //e-codepoint 1
  _sv = _rt;
  _rt = this._gate_suffix();
  //f-codepoint 2
  _rt = new this.exe.Gate(_sv, _rt);
  return _rt;
}
_gate_name()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _tk = this.lex.next_token();
  if (this.sym['gate'] === _tk.symbol)
  {
    //b-codepoint 1
    _rt = _tk.token;
  }
  else if (this.sym['ident'] === _tk.symbol)
  {
    //b-codepoint 2
    _rt = _tk.token;
  }
  else
    throw new SynErr("expected [ident, gate], not " + _tk, this.lex);
  return _rt;
}
_gate_suffix()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
  case this.sym['ident']:
  case this.sym['none']:
  case this.sym['gate']:
  case this.sym['eol']:
  case this.sym['colon']:
  case this.sym['divide']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  _rt = this._gate_angle();
  //e-codepoint 1
  _sv = _rt;  // angle if any
  _rt = this._gate_repl();
  //f-codepoint 2
  _rt = [_sv, _rt];
  return _rt;
}
_gate_angle()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['comma']:
  case this.sym['rparen']:
  case this.sym['ident']:
  case this.sym['none']:
  case this.sym['gate']:
  case this.sym['eol']:
  case this.sym['integer']:
  case this.sym['colon']:
  case this.sym['divide']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['lparen'] === _tk.symbol)
  {
    _rt = this._unop();
    //g-codepoint 1
    _sv = _rt;
    _rt = this._Complex();
    //g-codepoint 2
    if (_sv)
      _rt = '-' + _rt;
    _sv = [_rt];
    _rt = this._cmplxs();
    //g-codepoint 3
    _rt = _sv.concat(_rt);
    _tk = this.lex.next_token();
    if (this.sym['rparen'] !== _tk.symbol)
      throw new SynErr("expected [)], not " + _tk, this.lex);
    //c2-codepoint 4
  }
  else
    throw new SynErr("expected [(], not " + _tk, this.lex);
  return _rt;
}
_gate_repl()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
  case this.sym['ident']:
  case this.sym['none']:
  case this.sym['gate']:
  case this.sym['eol']:
  case this.sym['colon']:
  case this.sym['divide']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  _rt = this._line();
  //e-codepoint 1
  _sv = _rt;
  _rt = this._lines();
  //f-codepoint 2
  _rt = new this.exe.LineRef(_sv, _rt);
  return _rt;
}
_cmplxs()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
    //a0-codepoint 0
    _rt = [];
    return _rt;
  }
  // tail-recursion
  _tk = this.lex.lookAhead();
  if (this.sym['comma'] === _tk.symbol)
  {
    //t-codepoint 1
    _sq = [];
    do
    {
      _tk = this.lex.next_token();
      if (this.sym['comma'] === _tk.symbol)
      {
        _rt = this._unop();
        //g-codepoint 2
        _sv = _rt;
        _rt = this._Complex();
        //g-codepoint 3
        if (_sv)
          _rt = '-' + _rt;
        _sq.push(_rt);
        _rt = _sq;
      }
      _tk = this.lex.lookAhead();
    }
    while (this.sym['comma'] === _tk.symbol);
  }
  else
    throw new SynErr("expected [,], not " + _tk, this.lex);
  return _rt;
}
_line()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['comma']:
  case this.sym['rparen']:
  case this.sym['ident']:
  case this.sym['none']:
  case this.sym['gate']:
  case this.sym['eol']:
  case this.sym['colon']:
  case this.sym['divide']:
  case this.sym['semi']:
    //a0-codepoint 0
    _rt = [];
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['integer'] === _tk.symbol)
  {
    _rt = this._reg();
    //f-codepoint 1
    _rt = [_tk.token, _rt];
  }
  else
    throw new SynErr("expected [integer], not " + _tk, this.lex);
  return _rt;
}
_lines()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['rparen']:
  case this.sym['ident']:
  case this.sym['none']:
  case this.sym['gate']:
  case this.sym['eol']:
  case this.sym['colon']:
  case this.sym['divide']:
  case this.sym['semi']:
    //a0-codepoint 0
    return _rt;
  }
  // tail-recursion
  _tk = this.lex.lookAhead();
  if (this.sym['comma'] === _tk.symbol)
  {
    //t-codepoint 1
    _sv = [];
    do
    {
      _tk = this.lex.next_token();
      if (this.sym['comma'] === _tk.symbol)
      {
        _rt = this._line();
        //g-codepoint 2
        _sv.push(_rt);
        _rt = _sv;
      }
      _tk = this.lex.lookAhead();
    }
    while (this.sym['comma'] === _tk.symbol);
  }
  else
    throw new SynErr("expected [,], not " + _tk, this.lex);
  return _rt;
}
_coeff()
{
  let _tk, _sv, _sq, _rt = null;
  _tk = this.lex.lookAhead();
  switch(_tk.symbol)
  {
  case this.sym['bar']:
    //a0-codepoint 0
    _rt = Number(1.0);
    return _rt;
  }
  _tk = this.lex.next_token();
  if (this.sym['real'] === _tk.symbol || this.sym['integer'] === _tk.symbol || this.sym['complex'] === _tk.symbol)
  {
    this.lex.pushBack(_tk);
    _rt = this._Complex();
    //d-codepoint 1
    _rt = _tk.token;
  }
  else
    throw new SynErr("expected [real, integer, complex], not " + _tk, this.lex);
  return _rt;
}
_ket()
{
  let _tk, _sv, _sq, _rt = null;
  //a1-codepoint 0
  _tk = this.lex.next_token();
  if (this.sym['bar'] !== _tk.symbol)
    throw new SynErr("expected [|], not " + _tk, this.lex);
  //c0-codepoint 1
  _tk = this.lex.next_token();
  if (this.sym['integer'] !== _tk.symbol)
    throw new SynErr("expected [integer], not " + _tk, this.lex);
  //c1-codepoint 2
  _sv = new this.exe.Ket(_tk.token);
  _tk = this.lex.next_token();
  if (this.sym['great'] !== _tk.symbol)
    throw new SynErr("expected [>], not " + _tk, this.lex);
  //c2-codepoint 3
  _rt = _sv;
  return _rt;
}
}
module.exports.QDeskCompile = QDeskCompile;
module.exports.SynErr = SynErr;
