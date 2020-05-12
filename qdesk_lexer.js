/**
 * Created by danevans on 3/23/20.
 */
function Symbol (sym, str, flg) {
  this.symbol = sym;
  if (arguments.length >= 2)
    this.token = str;
  else
    this.token = Symbol.tokens[sym];
  if (arguments.length >= 3)
    this.flag = flg;
  else
    this.flag = false;
}
Symbol.none = 0;
Symbol.empty = Symbol.none + 1;
Symbol.eol = Symbol.empty + 1;
Symbol.ident = Symbol.eol + 1;
Symbol.equal = Symbol.ident + 1;
Symbol.comma = Symbol.equal + 1;
Symbol.lbrak = Symbol.comma + 1;
Symbol.rbrak = Symbol.lbrak + 1;
Symbol.lbrac = Symbol.rbrak + 1;
Symbol.rbrac = Symbol.lbrac + 1;
Symbol.lparen = Symbol.rbrac + 1;
Symbol.rparen = Symbol.lparen + 1;
Symbol.colon = Symbol.rparen + 1;
Symbol.semi = Symbol.colon + 1;
Symbol.arrow = Symbol.semi + 1;
Symbol.plus = Symbol.arrow + 1;
Symbol.minus = Symbol.plus + 1;
Symbol.times = Symbol.minus + 1;
Symbol.divide = Symbol.times + 1;
Symbol.power = Symbol.divide + 1;
Symbol.string = Symbol.power + 1;
Symbol.integer = Symbol.string + 1;
Symbol.real = Symbol.integer + 1;
Symbol.complex = Symbol.real + 1;
Symbol.bar = Symbol.complex + 1;
Symbol.less = Symbol.bar + 1;
Symbol.great = Symbol.less + 1;
Symbol.barrier = Symbol.great + 1;
Symbol.reset = Symbol.barrier + 1;
Symbol.creg = Symbol.reset + 1;
Symbol.gate = Symbol.creg + 1;
Symbol['if'] = Symbol.gate + 1;
Symbol.include = Symbol['if'] + 1;
Symbol.measure = Symbol.include + 1;
Symbol.opaque = Symbol.measure + 1;
Symbol.qreg = Symbol.opaque + 1;
Symbol.CX = Symbol.qreg + 1;
Symbol.U = Symbol.CX + 1;
Symbol.OPENQASM = Symbol.U + 1;
Symbol.pi = Symbol.OPENQASM + 1;
Symbol.sin = Symbol.pi + 1;
Symbol.cos = Symbol.sin + 1;
Symbol.tan = Symbol.cos + 1;
Symbol.exp = Symbol.tan + 1;
Symbol.ln = Symbol.exp + 1;
Symbol.sqrt = Symbol.ln + 1;

Symbol.exprKeys = {
  'pi':Symbol.pi,
  'sin':Symbol.sin,
  'cos':Symbol.cos,
  'tan':Symbol.tan,
  'exp':Symbol.exp,
  'ln':Symbol.ln,
  'sqrt':Symbol.sqrt};
Symbol.tokens = [
  "none",
  "$",
  "eol",
  "sym",
  "==",
  ",",
  "[",
  "]",
  "{",
  "}",
  "(",
  ")",
  ":",
  ";",
  "->",
  "+",
  "-",
  "*",
  "/",
  "^",
  "string",
  "integer",
  "real",
  "complex",
  "|",
  "<",
  ">"
];
Symbol.tkn_names = {
  "none":Symbol.none,
  "$":Symbol.empty,
  "eol":Symbol.eol,
  "sym":Symbol.sym,
  "==":Symbol.equal,
  ",":Symbol.comma,
  "[":Symbol.lbrak,
  "]":Symbol.rbrak,
  "{":Symbol.lbrac,
  "}":Symbol.rbrac,
  "(":Symbol.lparen,
  ")":Symbol.rparen,
  ":":Symbol.colon,
  ";":Symbol.semi,
  "->":Symbol.arrow,
  "+":Symbol.plus,
  "-":Symbol.minus,
  "*":Symbol.times,
  "/":Symbol.divide,
  "^":Symbol.power,
  "string":Symbol.string,
  "integer":Symbol.integer,
  "real":Symbol.real,
  "complex":Symbol.complex,
  "|":Symbol.bar,
  "<":Symbol.less,
  ">":Symbol.great
};
Symbol.prototype.toString = function ()
{
  return this.token;
};
Symbol.prototype.isEOL = function()
{
  return this.symbol === Symbol.eol;
};
class LexErr extends Error
{
  constructor(msg) {
    super();
    this.message = msg;
  }
}
class TestReader
{
  constructor(fn, fs) {
    let n;
    if (fn === 'interactive')
    {
      this.source = '';
    }
    // else
    // if (fn.length > 4 && 'test' === fn.substring(0, 4))
    // {
    //   n = parseInt(fn.substring(4));
    //   this.source = tests[n];
    // }
    else
    {
      try
      {
        this.source = fs.readFileSync(fn, {"encoding":'utf8', "flag":'r'});
      }
      catch (iox)
      {
        console.log(iox.message);
        this.source = '';
      }
      // this.pgm_file = new FileReader(new File(this.fname));
    }
    this.len = this.source.length;
    this._line_no = 0;
    this.fix = 0;
  }
  reset(src)
  {
    this.source = src;
    this.len = this.source.length;
    this._line_no = 0;
    this.fix = 0;
  }
  read_line()
  {
    let ix, strt;
    ++this._line_no;
    ix = strt = this.fix;
    while (ix < this.len && this.source[ix] !== '\n')
    {
      ++ix;
    }
    if (ix < this.len)
      this.fix = ix + 1;
    else
      this.fix = this.len;
    this.current_line = this.source.substring(strt, this.fix);
    return this.current_line;
  }
  close()
  {
    this.source = '';
  }
}
/**
 * QDeskLexer will lex the tokens of a grammar
 */
class QDeskLexer
{
  /**
   * Construct the QDeskLexer object and open the passed input file.  The primary method is next_token(), which returns a
   * sequence of PL/0 TerminalSymbols (@see TerminalSymbol) lexed from the input.
   * @throws FileNotFoundException if the input file cannot be opened
   */
  constructor(inp, cmt)  // throws FileNotFoundException
  {
    this.Symbol = Symbol;
    this.prv = new this.Symbol(this.Symbol.none);  // previous token for semicolon insertion
    this.fs = require('fs');
    if (arguments.length < 1)
      throw new Error('QDeskLexer contruction requires an input file name');
    this.reinit(inp, true);
    this.input_stack = [];
    this._boundary = false;
    this._mark = 0;
    this._cmt_processor = (undefined === cmt) ? null : ((typeof cmt !== 'function') ? null : cmt);
    this.interactive = (inp === 'interactive');
  }
  reinit(inp, lst)
  {
    this.fname = inp;
    if (null !== inp)
      this.pgm_file = new TestReader(inp, this.fs);
    this.line = 0;
    this._cix = 0;
    this.ltk = this.prv;  // previous token for semicolon insertion
    this.lka = 0;
    this._listing = lst;
    this.tkn = [];
    this.source_line = '';
    this.pbk = null;
  }
  semiInsert()
  {
    return !(this.ltk.symbol === this.Symbol.semi ||
        this.ltk.symbol === this.Symbol.lbrac ||
        this.ltk.symbol === this.Symbol.rbrac);
  }

  /**
   * Set the source line from an interactive (sysin) source
   * @param src
   */
  setSourceLine(src)
  {
    if (undefined === this.pgm_file)
    {
      this.pgm_file = new TestReader(this.fname, src);
      // this.line = 1;
    }
    else
    {
      this.pgm_file.reset(src);
    }
    this._cix = 0;
    this.ltk = this.prv;  // previous token for semicolon insertion
    this.lka = 0;
    this._listing = false;
    this.tkn = [];
    this.source_line = '';
    this.pbk = null;
  }
  /**
   * Scan the input skipping characters that are in the set whitespace.
   * @return {String} the next non-whitespace character
   */
  skip_white() // throws IOException, LexEOF
  {
    let _ch;
    this._boundary = false;
    _ch = this.next();
    while (this.isIn(_ch, QDeskLexer.whitespace))
    {
      if (_ch === '\n')
        this._boundary = true;
      _ch = this.next();
    }
    // if (this._boundary && this.semiInsert())
    // {
    //   if (this.lka != 0)
    //     throw new Error('logic: lookahead not empty on semi insertion');
    //   this.ltk = new this.Symbol(this.Symbol.semi);
    //   this.lka = _ch;
    //   return QDeskLexer.SEM;
    // }
    return _ch;
  }
  pushBack(_tk)
  {
    if (null !== this.pbk)
      throw new LexErr('depth 2 pushback not supported');
    this.pbk = _tk;
  }
  lookahead(_ch)
  {
    if (0 !== this.lka)
      throw new LexErr('depth 2 lookahead not supported');
    this.lka = _ch;
  }
  listline()
  {
    let ix, pfx, lin, wid = 2;
    lin = String(this.line);
    pfx = '[' + (' '.repeat(wid - lin.length)) + lin + ']\ ';
    ix = this.source_line.length - 1;
    if ('\n' === this.source_line[ix])
      console.log(pfx + this.source_line.substring(0, ix));
    else
      console.log(pfx + this.source_line);
  }
  get boundary()
  {
    return this._boundary;
  }
  /**
   * Read the next character from the input. Update the character index and possibly the line counter.
   * @return {String} the next input character
   * @throws LexEOF on end-of-input
   */
  next()  // throws IOException, LexEOF
  {
    let _ch, mtch, stack;
    if (this._cix >= this.source_line.length && this.lka === 0)
    {
      stack = true;
      while (stack)
      {
        stack = false;
        this.source_line = this.pgm_file.read_line();
        this.line += 1;
        this._cix = 0;
        if (this._listing && this.source_line.length > 0)
        {
          this.listline();
        }
        if (0 === this.source_line.length)
        {
          if (0 === this.input_stack.length)
          {
            _ch = '\0';
            return _ch;
          }
          mtch = this.input_stack.pop();
          this.pgm_file = mtch.pgm_file;
          this.listing = mtch.listing;
          this.fname = mtch.fname;
          this._cix = mtch._cix;
          this.source_line = mtch.source_line;
          this.lka = mtch.lka;
          this.ltk = mtch.ltk;
          this.line = mtch.line;
          this.token = mtch.token;
          this.pbk = mtch.pbk;
          // stack = true;
          // continue;
        }
        // mtch = this.source_line.match(/^ *include +"([^"]+)" *;? *\n$/);
        // if (null != mtch)
        // {
        //   if (this._listing)
        //     this.listline();
        //   this.input_stack.push({"input": this.pgm_file, "listing": this._listing, "fname": this.fname});
        //   this.fname = mtch[1];
        //   this.pgm_file = new TestReader(this.fname);
        //   this._listing = false;
        //   stack = true;
        //   continue;
        // }
        mtch = this.source_line.match(/^ *\n$/);
        if (null != mtch)
        { // blank line
          // if (this.fname === 'interactive')
          //   return '\n';
          stack = true;
        }
      }
    }
    if (this.lka !== 0)
    {
      _ch = this.lka;
      this.lka = 0;
    }
    else
    {
      _ch = this.source_line[this._cix++];
    }
    return _ch;
  }
  mark() {
    this._mark = this._cix;  // save the index of the next character
  }
  unmark() {
    this._cix = this._mark;  // restore the index of the next character
    this._mark = 0;
  }
  setInclude(fn) {
    // if (this._listing)
    //   this.listline();
    if (this.pbk != null)
    {
      if (0 !== this.lka)
      {
        this._cix -= 1;
        this.lka = 0;
      }
      this._cix -= this.pbk.token.length;
      this.pbk = null;
    }
    this.input_stack.push(
        {"pgm_file": this.pgm_file,
          "listing": this._listing,
          "fname": this.fname,
          "_cix":this._cix,
          "source_line":this.source_line,
          "lka":this.lka,
          "ltk":this.ltk,
          "line":this.line,
          "token":this.token,
          "pbk":this.pbk
        });
    this.reinit(fn, false);
  }
  get source() {
    return this.source_line;
  }
  /**
   * Check if the passed mbr character is in the arrayed set of characters.
   * @param mbr the character to be checked
   * @param set the arrayed character set
   * @return {Boolean} if mbr is a member of set, false otherwise
   */
  isIn(mbr, set)
  {
    let ix;
    for (ix = 0; ix < set.length; ++ix)
    {
      if (mbr === set[ix])
        return true;
    }
    return false;
  }
  /**
   * Lex the next token from the input string.  The lexer can generally make a decision based on the next character in the
   * input.  The decision is either 1) accumulate the character as part of the token being scanned, 2) stop scanning and
   * return the next token.  The next input character is the "lookahead" character.  Sometimes, the decision can be made without
   * scanning the next character.  Sometimes, the next character is scanned and not accumulated, and remains to be used
   * in the next call to the lexer. Each call to the lexer, first skips any white space.  Then Symbol of the next
   * character is examined. if it is a letter, the next token may be a variable name or a keyword, If it is a digit, the
   * next token may be a number.  Otherwise, the token may be single or multiple character language operator.  The lexer
   * loops, accumulating input characters until it is able to determine the next token, which is then returned as a
   * TerminalSymbol.  The token character string is available from the token() method.  The lexer also supports one token
   * symbol pushback.  A caller may call the lexer and receive a token, then decide that it needs to push the token back so
   * that it will be returned again on the next call to the lexer.  The lexer closes the input file and throws LexEOF when
   * the input is exhausted.  If a caller ends lex'ing before EOF, the caller should call the lexer close() method.
   *
   * @return {Symbol} a terminal symbol representing the next input token
   * @throws LexEOF on input end-of-file
   * @throws LexErr on an invalid token sequence or IOException
   */
  next_token()  // throws LexErr, LexEOF
  {
    let _ch, _id, _dl, _tk, _scn = true, _nfd;
    if (null != this.pbk)
    {
      _tk = this.pbk;
      this.pbk = null;
      // console.log('bck:%s', _tk.toString());
      return _tk;
    }
    while (_scn)
    {
      _scn = false;
      _nfd = false;
      this.tkn = [];
      _ch = this.skip_white();
      switch (_ch)
      {
      case QDeskLexer.EQ:
        _ch = this.next();
        if (_ch !== QDeskLexer.EQ)
          throw new Error("lexerr: unrecognized token:'" + QDeskLexer.EQ + _ch + '\' at ' + String(this.linenumber) + ':' + String(this.position));
        this.ltk = new this.Symbol(this.Symbol.equal);
        break;
      case QDeskLexer.PLU:
        this.ltk = new this.Symbol(this.Symbol.plus);
        break;
      case QDeskLexer.MUL:
        this.ltk = new this.Symbol(this.Symbol.times);
        break;
      case QDeskLexer.POW:
        this.ltk = new this.Symbol(this.Symbol.power);
        break;
      case QDeskLexer.DSH:
        _ch = this.next();
        if (_ch !== QDeskLexer.GT)
        {
          this.lookahead(_ch);
          this.ltk = new this.Symbol(this.Symbol.minus);
        }
        else
        //throw new Error("lexerr: unrecognized token:'" + QDeskLexer.DSH + _ch + '\' at ' + String(this.linenumber) + ':' + String(this.position));
          this.ltk = new this.Symbol(this.Symbol.arrow);
        break;
      case QDeskLexer.SLS:
        _ch = this.next();
        if (_ch !== QDeskLexer.SLS)
        {
          this.lookahead(_ch);
          this.ltk = new this.Symbol(this.Symbol.divide);
          break;
        }
        // throw new Error("lexerr: unrecognized token:'" + QDeskLexer.SLS + _ch + '\' at ' + String(this.linenumber) + ':' + String(this.position));
        _ch = this.next();
        while (_ch !== QDeskLexer.NL)
        {
          _ch = this.next();
        }
        _scn = true;
        continue;
      case QDeskLexer.HASH:
        this.mark();
        _ch = this.next();
        while (_ch !== QDeskLexer.NL)
        {
          _ch = this.next();
        }
        if (null != this._cmt_processor)
          this._cmt_processor.call(null, this.source_line.substring(this._mark, this._cix));
        _scn = true;
        continue;
      case QDeskLexer.CM:
        this.ltk = new this.Symbol(this.Symbol.comma);
        break;
      case QDeskLexer.EMP:
        this.ltk = new this.Symbol(this.Symbol.empty);
        break;
      case QDeskLexer.LK:
        this.ltk = new this.Symbol(this.Symbol.lbrak);
        break;
      case QDeskLexer.RK:
        this.ltk = new this.Symbol(this.Symbol.rbrak);
        break;
      case QDeskLexer.LB:
        this.ltk = new this.Symbol(this.Symbol.lbrac);
        break;
      case QDeskLexer.RB:
        this.ltk = new this.Symbol(this.Symbol.rbrac);
        break;
      case QDeskLexer.LP:
        this.ltk = new this.Symbol(this.Symbol.lparen);
        break;
      case QDeskLexer.RP:
        this.ltk = new this.Symbol(this.Symbol.rparen);
        break;
      case QDeskLexer.CLN:
        this.ltk = new this.Symbol(this.Symbol.colon);
        break;
      case QDeskLexer.BAR:
        this.ltk = new this.Symbol(this.Symbol.bar);
        break
      case QDeskLexer.LESS:
        this.ltk = new this.Symbol(this.Symbol.less);
        break;
      case QDeskLexer.GREAT:
        this.ltk = new this.Symbol(this.Symbol.great);
        break;
      case QDeskLexer.SEM:
        this.ltk = new this.Symbol(this.Symbol.semi);
        break;
      case QDeskLexer.NL:
        this.ltk = new this.Symbol(this.Symbol.eol);
        break;
      case QDeskLexer.CR:
        if (!this.interactive)
        {
          _id = this.next();
          if (_id !== QDeskLexer.NL)
            this.lookahead(_id);
        }
        this.ltk = new this.Symbol(this.Symbol.eol);
        break;
      case QDeskLexer.EOF:
        try
        {
          this.close();
        }
        catch (iox)
        {
          throw new LexErr(iox.message + ' at ' + String(this.linenumber) + String(this.position));
        }
        this.ltk = new this.Symbol(this.Symbol.none);
        break;
      default:
        _nfd = true;
        break;
      }
      if (!_nfd)
      {
        // console.log('lex:%s', this.ltk.toString());
        return this.ltk;
      }
      if (_ch === QDeskLexer.QT || _ch === QDeskLexer.DQT)
      {
        _dl = _ch;
        this.tkn = [];
        _id = this.next();
        while (_id !== _dl)
        {
          if (_id === QDeskLexer.NL)
            throw new LexErr("missing closing quote at " + String(this.linenumber) + ':' + String(this.position));
          this.tkn.push(_id);
          _id = this.next();
        }
        this.ltk = new this.Symbol(this.Symbol.string, this.tkn.join(''), true);
        // console.log('lex:%s', this.ltk.toString());
        return this.ltk;
      }
      // _ch = this.next();
      if ((_ch >= QDeskLexer.UCA && _ch <= QDeskLexer.UCZ) || (_ch >= QDeskLexer.LCA && _ch <= QDeskLexer.LCZ) ||
           _ch === QDeskLexer.UNDER)
      {
        while ((_ch >= QDeskLexer.UCA && _ch <= QDeskLexer.UCZ) || (_ch >= QDeskLexer.LCA && _ch <= QDeskLexer.LCZ) ||
               (_ch >= QDeskLexer.ZERO && _ch <= QDeskLexer.NINE) || _ch === QDeskLexer.UNDER)
        {
          this.tkn.push(_ch);
          _ch = this.next();
        }
        this.lookahead(_ch);
        _id = this.tkn.join('');
        if (undefined !== this.Symbol.exprKeys[_id])
          this.ltk = new this.Symbol(this.Symbol[_id], _id);
        else
          this.ltk = new this.Symbol(this.Symbol.ident, _id);
        // console.log('lex:%s', this.ltk.toString());
        return this.ltk;
      }
      if ((_ch >= QDeskLexer.ZERO && _ch <= QDeskLexer.NINE) || _ch === QDeskLexer.PER)
      {
        _dl = 0;
        do
        {
          if (_ch === QDeskLexer.PER)
            ++_dl;
          this.tkn.push(_ch);
          _ch = this.next();
        }
        while ((_ch >= QDeskLexer.ZERO && _ch <= QDeskLexer.NINE) || _ch === QDeskLexer.PER);
        if (_dl > 1)
          throw new Error("lexerr: unrecognized token:'" + this.tkn.join('') + '\' at ' + String(this.linenumber) + ':' + String(this.position));
        if (_ch === QDeskLexer.IMAG)
        {
          // an imaginary number
          this.tkn.push(_ch);
          this.ltk = new this.Symbol(this.Symbol.complex, '0+'+ this.tkn.join(''));
          return this.ltk;
        }
        else if (_ch === QDeskLexer.PLU || _ch === QDeskLexer.DSH)
        {
          this.mark();
          _tk = [_ch];
          _ch = this.next();
          while ((_ch >= QDeskLexer.ZERO && _ch <= QDeskLexer.NINE) || _ch === QDeskLexer.PER)
          {
            _tk.push(_ch);
            _ch = this.next();
          }
          if (_ch === QDeskLexer.IMAG && _tk.length > 1)
          {
            _tk.push(_ch);
            // a complex number
            this.ltk = new this.Symbol(this.Symbol.complex, this.tkn.join('') + _tk.join(''));
            this.lka = 0;
            return this.ltk;
          }
          this.unmark();
          this.lookahead(_tk[0]);
        }
        else
          this.lookahead(_ch);
        if (_dl === 0)
        {
          this.ltk = new this.Symbol(this.Symbol.integer, this.tkn.join(''));
          // console.log('lex:%s', this.ltk.toString());
          return this.ltk;
        }
        this.ltk = new this.Symbol(this.Symbol.complex, this.tkn.join('') + '+0i');
        // console.log('lex:%s', this.ltk.toString());
        return this.ltk;
      }
      throw new LexErr('bad character ' + _ch + ' at ' + String(this.linenumber) + ':' + String(this.position));
    }
  }
  /**
   * Token string accessor.
   * @return {String} representation of the most recently scanned token
   */
  token() {
    return this.tkn.join('');
  }
  /**
   * Line number accessor.
   * @return {Number} the current line number
   */
  get linenumber() {
    return this.line;
  }
  /**
   * Character index accessor.
   * @return {Number} the current character index
   */
  get position() {
    return this._cix;
  }
  /**
   * File name accessor.
   * @return {String} the input file name
   */
  get fileName()
  {
    return this.fname;
  }
  /**
   * Close the input file.  This only needs to be called if lex'ing did not end with an EOF.
   * @throws IOException on a close error
   */
  close() // throws IOException
  {
    this.pgm_file.close();
  }
  /**
   * Set the listing option to true or false.
   * @param opt the listing flag value to be set
   */
  set listing(opt)
  {
    this._listing = opt;
  }
}
QDeskLexer.EOF = '\0';
QDeskLexer.NL = '\n';
QDeskLexer.CR = '\r';
QDeskLexer.TAB = '\t';
QDeskLexer.SPC = ' ';
QDeskLexer.EQ = '=';
QDeskLexer.EMP = '$';
QDeskLexer.CLN = ':';
QDeskLexer.SEM = ';';
QDeskLexer.LK = '[';
QDeskLexer.RK = ']';
QDeskLexer.LB = '{';
QDeskLexer.RB = '}';
QDeskLexer.LP = '(';
QDeskLexer.RP = ')';
QDeskLexer.CM = ',';
QDeskLexer.QT = '\'';
QDeskLexer.DQT = '"';
QDeskLexer.DSH = '-';
QDeskLexer.PLU = '+';
QDeskLexer.MUL = '*';
QDeskLexer.SLS = '/';
QDeskLexer.GT = '>';
QDeskLexer.PER = '.';
QDeskLexer.POW = '^';
QDeskLexer.BAR = '|';
QDeskLexer.LESS = '<';
QDeskLexer.GREAT = '>';
QDeskLexer.HASH = '#';
QDeskLexer.ZERO = '0';
QDeskLexer.NINE = '9'
QDeskLexer.IMAG = 'i';
QDeskLexer.UNDER = '_';
QDeskLexer.UCA = 'A';
QDeskLexer.UCZ = 'Z';
QDeskLexer.LCA = 'a';
QDeskLexer.LCZ = 'z';


QDeskLexer.whitespace = [QDeskLexer.SPC, QDeskLexer.TAB];
QDeskLexer.symender = [QDeskLexer.EQ, QDeskLexer.EMP, QDeskLexer.CLN, QDeskLexer.LB, QDeskLexer.RB, QDeskLexer.CM,
  QDeskLexer.QT, QDeskLexer.NL];
QDeskLexer.keywords = {
  'barrier': 0, 'creg': 0, 'gate': 0, 'if': 0, 'include': 0, 'measure': 0, 'opaque': 0, 'qreg': 0, 'reset':0,
  'CX': 1, 'U': 1
};
QDeskLexer.exprKeys = {'pi': 0, 'sin': 0, 'cos': 0, 'tan': 0, 'exp': 0, 'ln': 0, 'sqrt': 0};
// function test() {
//   let tfil, ix;
//   let qq = require('./qdesk_compile.js'),
//       QDeskCompile = qq.QDeskCompile,
//       SynErr = qq.Synerr;
//   let lex, sym;
//   for (ix = 1; ix < 2; ++ix)
//   {
//     tfil = 'qdesk_test' + String(ix) + '.txt';
//     console.log('---test file:%s---', tfil)
//     lex = new QDeskLexer(tfil);
//     compiler = new QDeskCompile(lex, Symbol);
//     compiler._pgm();
//     console.log('---compilation complete---')
//     //console.log(compiler.pgm.toString());
//     // sym = lex.next_token();
//     // while (sym.symbol != Symbol.eol && sym.symbol != Symbol.none)
//     // {
//     //   console.log(sym.toString());
//     //   sym = lex.next_token();
//     // }
//     // compiler = new QASMCompile(lex, sym.Symbol);
//     // compiler._qasm_program();
//     // console.log('---Progam toString()---')
//     // console.log(compiler.pgm.toString());
//   }
// }
module.exports.QDeskLexer = QDeskLexer;
module.exports.Symbol     = Symbol;
