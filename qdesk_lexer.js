/**
 * Created by danevans on 3/23/20.
 */
function QlxSymbol (sym, str, flg) {
  // this.symbol = sym;
  if (arguments.length >= 2)
    this.token = str;
  else
    this.token = QlxSymbol.tokens[sym];
  if (arguments.length >= 3)
    this.flag = flg;
  else
    this.flag = false;
  this.symbol = sym;
}
QlxSymbol.none = 0;
QlxSymbol.empty = QlxSymbol.none + 1;
QlxSymbol.eol = QlxSymbol.empty + 1;
QlxSymbol.ident = QlxSymbol.eol + 1;
QlxSymbol.assign = QlxSymbol.ident + 1;
QlxSymbol.equal = QlxSymbol.assign + 1;
QlxSymbol.comma = QlxSymbol.equal + 1;
QlxSymbol.lbrak = QlxSymbol.comma + 1;
QlxSymbol.rbrak = QlxSymbol.lbrak + 1;
QlxSymbol.lbrac = QlxSymbol.rbrak + 1;
QlxSymbol.rbrac = QlxSymbol.lbrac + 1;
QlxSymbol.lparen = QlxSymbol.rbrac + 1;
QlxSymbol.rparen = QlxSymbol.lparen + 1;
QlxSymbol.colon = QlxSymbol.rparen + 1;
QlxSymbol.semi = QlxSymbol.colon + 1;
QlxSymbol.arrow = QlxSymbol.semi + 1;
QlxSymbol.plus = QlxSymbol.arrow + 1;
QlxSymbol.minus = QlxSymbol.plus + 1;
QlxSymbol.times = QlxSymbol.minus + 1;
QlxSymbol.divide = QlxSymbol.times + 1;
QlxSymbol.power = QlxSymbol.divide + 1;
QlxSymbol.string = QlxSymbol.power + 1;
QlxSymbol.integer = QlxSymbol.string + 1;
QlxSymbol.real = QlxSymbol.integer + 1;
QlxSymbol.complex = QlxSymbol.real + 1;
QlxSymbol.bar = QlxSymbol.complex + 1;
QlxSymbol.less = QlxSymbol.bar + 1;
QlxSymbol.great = QlxSymbol.less + 1;
QlxSymbol.reg = QlxSymbol.great + 1;
QlxSymbol.barrier = QlxSymbol.reg + 1;
QlxSymbol.reset = QlxSymbol.barrier + 1;
QlxSymbol.creg = QlxSymbol.reset + 1;
QlxSymbol.gate = QlxSymbol.creg + 1;
QlxSymbol['if'] = QlxSymbol.gate + 1;
QlxSymbol.include = QlxSymbol['if'] + 1;
QlxSymbol.measure = QlxSymbol.include + 1;
QlxSymbol.opaque = QlxSymbol.measure + 1;
QlxSymbol.qreg = QlxSymbol.opaque + 1;
QlxSymbol.CX = QlxSymbol.qreg + 1;
QlxSymbol.U = QlxSymbol.CX + 1;
QlxSymbol.OPENQASM = QlxSymbol.U + 1;
QlxSymbol.pi = QlxSymbol.OPENQASM + 1;
QlxSymbol.sin = QlxSymbol.pi + 1;
QlxSymbol.cos = QlxSymbol.sin + 1;
QlxSymbol.tan = QlxSymbol.cos + 1;
QlxSymbol.exp = QlxSymbol.tan + 1;
QlxSymbol.ln = QlxSymbol.exp + 1;
QlxSymbol.sqrt = QlxSymbol.ln + 1;

QlxSymbol.exprKeys = {
  'pi':QlxSymbol.pi,
  'sin':QlxSymbol.sin,
  'cos':QlxSymbol.cos,
  'tan':QlxSymbol.tan,
  'exp':QlxSymbol.exp,
  'ln':QlxSymbol.ln,
  'sqrt':QlxSymbol.sqrt};
QlxSymbol.tokens = [
  "none",
  "$",
  "eol",
  "sym",
  "=",
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
  ">",
  "~"
];
QlxSymbol.tkn_names = {
  "none":QlxSymbol.none,
  "$":QlxSymbol.empty,
  "eol":QlxSymbol.eol,
  "sym":QlxSymbol.sym,
  "=":QlxSymbol.assign,
  "==":QlxSymbol.equal,
  ",":QlxSymbol.comma,
  "[":QlxSymbol.lbrak,
  "]":QlxSymbol.rbrak,
  "{":QlxSymbol.lbrac,
  "}":QlxSymbol.rbrac,
  "(":QlxSymbol.lparen,
  ")":QlxSymbol.rparen,
  ":":QlxSymbol.colon,
  ";":QlxSymbol.semi,
  "->":QlxSymbol.arrow,
  "+":QlxSymbol.plus,
  "-":QlxSymbol.minus,
  "*":QlxSymbol.times,
  "/":QlxSymbol.divide,
  "^":QlxSymbol.power,
  "string":QlxSymbol.string,
  "integer":QlxSymbol.integer,
  "real":QlxSymbol.real,
  "complex":QlxSymbol.complex,
  "|":QlxSymbol.bar,
  "<":QlxSymbol.less,
  ">":QlxSymbol.great,
  "~":QlxSymbol.reg
};
QlxSymbol.prototype.toString = function ()
{
  return this.token;
};
QlxSymbol.prototype.isEOL = function()
{
  return this.symbol === QlxSymbol.eol;
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
   * sequence of PL/0 TerminalQlxSymbols (@see TerminalQlxSymbol) lexed from the input.
   * @throws FileNotFoundException if the input file cannot be opened
   */
  constructor(inp, cmt)  // throws FileNotFoundException
  {
    this.QlxSymbol = QlxSymbol;
    this.prv = new this.QlxSymbol(this.QlxSymbol.none);  // previous token for semicolon insertion
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
    return !(this.ltk.symbol === this.QlxSymbol.semi ||
        this.ltk.symbol === this.QlxSymbol.lbrac ||
        this.ltk.symbol === this.QlxSymbol.rbrac);
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
    //   this.ltk = new this.QlxSymbol(this.QlxSymbol.semi);
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
  setLookAhead(_ch)
  {
    if (0 !== this.lka)
      throw new LexErr('depth 2 lookahead not supported');
    this.lka = _ch;
  }
  lookAhead() {  // look at the next input symbol without consuming it
    let _tk;
    if (null === this.pbk)
    {
      _tk = this.next_token();
      this.pushBack(_tk);
    }
    return this.pbk;
  }
  listline()
  {
    let ix, pfx, lin, wid = 2;
    lin = String(this.line);
    ix = wid - lin.length;
    pfx = '[' + ((ix > 0) ? ' '.repeat(ix) : '') + lin + '] ';
    //pfx = '[' + (' '.repeat(wid - lin.length)) + lin + ']\ ';
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
   * in the next call to the lexer. Each call to the lexer, first skips any white space.  Then QlxSymbol of the next
   * character is examined. if it is a letter, the next token may be a variable name or a keyword, If it is a digit, the
   * next token may be a number.  Otherwise, the token may be single or multiple character language operator.  The lexer
   * loops, accumulating input characters until it is able to determine the next token, which is then returned as a
   * TerminalQlxSymbol.  The token character string is available from the token() method.  The lexer also supports one token
   * symbol pushback.  A caller may call the lexer and receive a token, then decide that it needs to push the token back so
   * that it will be returned again on the next call to the lexer.  The lexer closes the input file and throws LexEOF when
   * the input is exhausted.  If a caller ends lex'ing before EOF, the caller should call the lexer close() method.
   *
   * @return {QlxSymbol} a terminal symbol representing the next input token
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
        /*
        if (_ch !== QDeskLexer.EQ)
          throw new Error("lexerr: unrecognized token:'" + QDeskLexer.EQ + _ch + '\' at ' + String(this.linenumber) + ':' + String(this.position));
        */
        if (_ch === QDeskLexer.EQ)
        {
          this.ltk = new this.QlxSymbol(this.QlxSymbol.equal);
        }
        else
        {
          this.setLookAhead(_ch)
          this.ltk = new this.QlxSymbol(this.QlxSymbol.assign);
        }
        break;
      case QDeskLexer.PLU:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.plus);
        break;
      case QDeskLexer.MUL:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.times);
        break;
      case QDeskLexer.POW:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.power);
        break;
      case QDeskLexer.REG:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.reg);
        break;
      case QDeskLexer.DSH:
        _ch = this.next();
        if (_ch !== QDeskLexer.GT)
        {
          this.setLookAhead(_ch);
          this.ltk = new this.QlxSymbol(this.QlxSymbol.minus);
        }
        else
        //throw new Error("lexerr: unrecognized token:'" + QDeskLexer.DSH + _ch + '\' at ' + String(this.linenumber) + ':' + String(this.position));
          this.ltk = new this.QlxSymbol(this.QlxSymbol.arrow);
        break;
      case QDeskLexer.SLS:
        _ch = this.next();
        if (_ch !== QDeskLexer.SLS)
        {
          this.setLookAhead(_ch);
          this.ltk = new this.QlxSymbol(this.QlxSymbol.divide);
          break;
        }
        // throw new Error("lexerr: unrecognized token:'" + QDeskLexer.SLS + _ch + '\' at ' + String(this.linenumber) + ':' + String(this.position));
        _ch = this.next();
        while (_ch !== QDeskLexer.NL && _ch !== QDeskLexer.CR && _ch !== QDeskLexer.EOF)
        {
          _ch = this.next();
        }
        _scn = true;
        continue;
      case QDeskLexer.HASH:
        this.mark();
        _ch = this.next();
        while (_ch !== QDeskLexer.NL && _ch !== QDeskLexer.CR && _ch !== QDeskLexer.EOF)
        {
          _ch = this.next();
        }
        if (null != this._cmt_processor)
          // this._cmt_processor.call(null, this.source_line.substring(this._mark, this._cix));
          this._cmt_processor(this.source_line.substring(this._mark, this._cix));
        // this.setLookAhead(_ch);
        _scn = true;
        continue;
      case QDeskLexer.CM:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.comma);
        break;
      case QDeskLexer.EMP:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.empty);
        break;
      case QDeskLexer.LK:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.lbrak);
        break;
      case QDeskLexer.RK:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.rbrak);
        break;
      case QDeskLexer.LB:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.lbrac);
        break;
      case QDeskLexer.RB:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.rbrac);
        break;
      case QDeskLexer.LP:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.lparen);
        break;
      case QDeskLexer.RP:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.rparen);
        break;
      case QDeskLexer.CLN:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.colon);
        break;
      case QDeskLexer.BAR:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.bar);
        break
      case QDeskLexer.LESS:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.less);
        break;
      case QDeskLexer.GREAT:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.great);
        break;
      case QDeskLexer.SEM:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.semi);
        break;
      case QDeskLexer.NL:
        this.ltk = new this.QlxSymbol(this.QlxSymbol.eol);
        break;
      case QDeskLexer.CR:
        if (!this.interactive)
        {
          _id = this.next();
          if (_id !== QDeskLexer.NL)
            this.setLookAhead(_id);
        }
        this.ltk = new this.QlxSymbol(this.QlxSymbol.eol);
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
        this.ltk = new this.QlxSymbol(this.QlxSymbol.none);
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
      // if (_ch === QDeskLexer.QT || _ch === QDeskLexer.DQT)
      // {
      //   _dl = _ch;
      //   this.tkn = [];
      //   _id = this.next();
      //   while (_id !== _dl)
      //   {
      //     if (_id === QDeskLexer.NL)
      //       throw new LexErr("missing closing quote at " + String(this.linenumber) + ':' + String(this.position));
      //     this.tkn.push(_id);
      //     _id = this.next();
      //   }
      //   this.ltk = new this.QlxSymbol(this.QlxSymbol.string, this.tkn.join(''), true);
      //   // console.log('lex:%s', this.ltk.toString());
      //   return this.ltk;
      // }
      // _ch = this.next();
      if ((_ch >= QDeskLexer.UCA && _ch <= QDeskLexer.UCZ) || (_ch >= QDeskLexer.LCA && _ch <= QDeskLexer.LCZ) ||
           _ch === QDeskLexer.UNDER)
      {
        if (undefined !== QDeskLexer.gateName1[_ch])
        {
          if (QDeskLexer.G1 === QDeskLexer.gateName1[_ch])
          {
            this.ltk = new this.QlxSymbol(this.QlxSymbol.gate, _ch);
            return this.ltk;
          }
          _tk = _ch;
          this.tkn.push(_ch);
          _ch = this.next();
          if (_ch >= QDeskLexer.LCA && _ch <= QDeskLexer.LCZ)
          {
            if (undefined !== QDeskLexer.gateName2[_tk + _ch])
            {
              this.ltk = new this.QlxSymbol(this.QlxSymbol.gate, _tk + _ch);
              return this.ltk;
            }
            else if (QDeskLexer.G12 === QDeskLexer.gateName1[_tk])
            {
              this.setLookAhead(_ch);
              this.ltk = new this.QlxSymbol(this.QlxSymbol.gate, _tk);
              return this.ltk;
            }
          }
          else
          {
            this.setLookAhead(_ch);
            this.ltk = new this.QlxSymbol(this.QlxSymbol.gate, _tk);
            return this.ltk;
          }
        }
        while ((_ch >= QDeskLexer.UCA && _ch <= QDeskLexer.UCZ) || (_ch >= QDeskLexer.LCA && _ch <= QDeskLexer.LCZ)) // ||
               //(_ch >= QDeskLexer.ZERO && _ch <= QDeskLexer.NINE))
        {
          this.tkn.push(_ch);
          _ch = this.next();
        }
        this.setLookAhead(_ch);
        _id = this.tkn.join('');
        //if (undefined !== this.QlxSymbol.exprKeys[_id])
        //  this.ltk = new this.QlxSymbol(this.QlxSymbol[_id], _id);
        //else
          this.ltk = new this.QlxSymbol(this.QlxSymbol.ident, _id);
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
          // this.ltk = new this.QlxSymbol(this.QlxSymbol.complex, '0+'+ this.tkn.join(''));
          this.ltk = new this.QlxSymbol(this.QlxSymbol.complex, this.tkn.join(''));
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
            this.ltk = new this.QlxSymbol(this.QlxSymbol.complex, this.tkn.join('') + _tk.join(''));
            this.lka = 0;
            return this.ltk;
          }
          this.unmark();
          this.setLookAhead(_tk[0]);
        }
        else
          this.setLookAhead(_ch);
        if (_dl === 0)
        {
          this.ltk = new this.QlxSymbol(this.QlxSymbol.integer, this.tkn.join(''));
          // console.log('lex:%s', this.ltk.toString());
          return this.ltk;
        }
        this.ltk = new this.QlxSymbol(this.QlxSymbol.real, this.tkn.join(''));
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
QDeskLexer.REG = '~';
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
QDeskLexer.G1 = 1;
QDeskLexer.G2 = 2;
QDeskLexer.G12 = 3;
QDeskLexer.gateName1 = {
  'C': QDeskLexer.G12,
  'D': QDeskLexer.G1,
  'F': QDeskLexer.G2,
  'G': QDeskLexer.G1,
  'H': QDeskLexer.G1,
  'I': QDeskLexer.G12,
  'K': QDeskLexer.G2,
  'M': QDeskLexer.G1,
  'O': QDeskLexer.G2,
  'P': QDeskLexer.G1,
  'Q': QDeskLexer.G2,
  'R': QDeskLexer.G2,
  'S': QDeskLexer.G12,
  'T': QDeskLexer.G12,
  'U': QDeskLexer.G1,
  'X': QDeskLexer.G1,
  'Y': QDeskLexer.G1,
  'Z': QDeskLexer.G1,
  '_': QDeskLexer.G1,
};
QDeskLexer.gateName2 = {
  'Cr': true,
  'Cx': true,
  'Fr': true,
  'Kp': true,
  'Im': true,
  'Ob': true,
  'Od': true,
  'Og': true,
  'Os': true,
  'Qa': true,
  'Qf': true,
  'Rp': true,
  'Rx': true,
  'Ry': true,
  'Rz': true,
  'Sa': true,
  'Sw': true,
  'Ta': true,
  'Tf': true,
  'Tp': true,
};
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
//     compiler = new QDeskCompile(lex, QlxSymbol);
//     compiler._pgm();
//     console.log('---compilation complete---')
//     //console.log(compiler.pgm.toString());
//     // sym = lex.next_token();
//     // while (sym.symbol != QlxSymbol.eol && sym.symbol != QlxSymbol.none)
//     // {
//     //   console.log(sym.toString());
//     //   sym = lex.next_token();
//     // }
//     // compiler = new QASMCompile(lex, sym.QlxSymbol);
//     // compiler._qasm_program();
//     // console.log('---Progam toString()---')
//     // console.log(compiler.pgm.toString());
//   }
// }
module.exports.QDeskLexer = QDeskLexer;
module.exports.QlxSymbol  = QlxSymbol;
