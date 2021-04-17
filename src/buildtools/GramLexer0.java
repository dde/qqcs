package buildtools;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class GramLexer0
{
  private static final char NL   = '\n';
  private static final char CR   = '\r';
  private static final char TAB  = '\t';
  private static final char SPC  = ' ';
  private static final char DSH  = '-';
  private static final char GT   = '>';
  private static final char HASH = '#';
  private static final char COD = '@';
  private static final int stWS = 1;
  private static final int stTkn = stWS + 1;
  private static final int stArrow = stTkn + 1;
  private static final int stCmt = stArrow + 1;
  private static final int stFinal = stCmt + 1;
  private static final int stFArrow = stFinal;
  private static final int stFTkn = stFArrow + 1;
  private static final int stCod = stFTkn + 1;
  private static final int stFNL = stCod + 1;

  private static final char[] whitespace = {SPC, TAB, CR};
  private HashMap<String,Symbol> dict = new HashMap<>();

  private String fileName;
  private StringBuilder tkn = new StringBuilder();
  private StringBuilder source_line = new StringBuilder();

  private char lka; // lookahead character
  private int line; // line number
  private int cix;  // current line character index
  private int lch;  // last character
  private FileReader pgm_file;
  private boolean listing = false;
  private List<String> comments = new ArrayList<>();
  private List<String> codePoint = new ArrayList<>();

/**
 * Construct the GramLexer0 object and open the passed input file.  The primary method is next_token(), which returns a
 * sequence of Symbols (@see Symbol) lexed from the input.
 * @param inp the full path name of the input file
 * @throws FileNotFoundException if the input file cannot be opened
 */
GramLexer0(final String inp)
    throws FileNotFoundException
{
  fileName = inp;
  pgm_file = new FileReader(fileName);
  cix = -1;
  line = 0;
  lch = 0;
}
/**
 * Read the next character from the input. Update the character index and possibly the line counter.
 *
 * @return the next input character
 * @throws LexEOF on end-of-input
 */
private char next()
    throws IOException, LexEOF
{
  char _ch;
  int rch;
  if (0 == lka)
  {
    if (lch == NL)
    {
      line += 1;
      cix = 0;
      if (listing)
      {
        System.out.print(source_line.toString());
      }
      source_line.setLength(0);
    }
    if (0 > (rch = pgm_file.read()))
    {
      if (lch == NL)
        throw new LexEOF();
      rch = NL;
    }
    _ch = (char)rch;
    source_line.append(_ch);
    cix += 1;
  }
  else
  {
    _ch = lka;
    lka = 0;
  }
  lch = _ch;
  return _ch;
}
/**
 * Check if the passed mbr character is in the arrayed set of characters.
 *
 * @param mbr the character to be checked
 * @param set the arrayed character set
 * @return true if mbr is a member of set, false otherwise
 */
private boolean isIn(final char mbr, final char[] set)
{
  int ix;
  for (ix = 0; ix < set.length; ++ix)
  {
    if (mbr == set[ix])
      return true;
  }
  return false;
}
/**
 * Lex the next token from the input string.  The lexer can generally make a decision based on the next character in the
 * input.  The decision is either 1) accumulate the character as part of the token being scanned, 2) stop scanning and
 * return the next token.  The next input character is the "lookahead" character.  Sometimes, the decision can be made without
 * scanning the next character.  Sometimes, the next character is scanned and not accumulated, and remains to be used
 * in the next call to the lexer. Each call to the lexer, first skips any white space.  Then category of the next
 * character is examined. if it is a letter, the next token may be a variable name or a keyword, If it is a digit, the
 * next token may be a number.  Otherwise, the token may be single or multiple character language operator.  The lexer
 * loops, accumulating input characters until it is able to determine the next token, which is then returned as a
 * TerminalSymbol.  The token character string is available from the token() method.  The lexer also supports one token
 * symbol pushback.  A caller may call the lexer and receive a token, then decide that it needs to push the token back so
 * that it will be returned again on the next call to the lexer.  The lexer closes the input file and throws LexEOF when
 * the input is exhausted.  If a caller ends lex'ing before EOF, the caller should call the lexer close() method.
 *
 * @return the TerminalSymbol representing the next input token
 * @throws LexEOF on input end-of-file
 * @throws LexErr on an invalid token sequence or IOException
 */
public Symbol next_token()
    throws LexErr, LexEOF
{
  Symbol sym;
  String str;
  char _ch;
  int state;
  StringBuilder cmt = null;
  try
  {
    state = stWS;
    while (state < stFinal)
    {
      _ch = next();
      switch (state)
      {
      case stWS:
        if (!isIn(_ch, whitespace))
        {
          tkn.setLength(0);
          tkn.append(_ch);
          if (_ch == DSH)
          {
            state = stArrow;
          }
          else if (_ch == HASH)
          {
            cmt = new StringBuilder();
            cmt.append(_ch);
            state = stCmt;
          }
          else if (_ch == NL)
          {
            state = stFNL;
          }
          else
          {
            state = stTkn;
          }
        }
        break;
      case stTkn:
        if (isIn(_ch, whitespace))
        {
          state = stFTkn;
        }
        else if (NL == _ch)
        {
          lka = _ch;
          state = stFTkn;
        }
        else
          tkn.append(_ch);
        break;
      case stArrow:
        if (_ch == GT)
        {
          tkn.append(_ch);
          state = stFArrow;
        }
        else if (isIn(_ch, whitespace))
        {
          state = stFTkn;
        }
        else if (_ch == NL)
        {
          lka = _ch;
          state = stFTkn;
        }
        else
        {
          tkn.append(_ch);
          state = stTkn;
        }
        break;
      case stCmt:
        if (_ch == NL)
        {
          comments.add(cmt.toString());
          state = stWS;
        }
        else
        {
          cmt.append(_ch);
        }
        break;
      }
    }
    str = tkn.toString();
    sym = dict.get(str);
    if (null != sym)
      return sym;
    switch (state)
    {
    case stFTkn:
      sym = new Symbol(Category.sym, tkn.toString());
      break;
    case stFNL:
      sym = new Symbol(Category.eol, tkn.toString());
      break;
    case stFArrow:
      sym = new Symbol(Category.equal, tkn.toString());
      break;
    default:
      throw new LexErr("lex error", String.format("bad final state %d", state), this.linenumber(), this.position());
    }
    dict.put(str, sym);
    return sym;
  }
  catch (LexEOF eofx)
  {
    try
    {
      this.close();
      throw eofx;
    }
    catch (IOException iox)
    {
      throw new LexErr(iox.getMessage(), "", this.linenumber(), this.position());
    }
  }
  catch (IOException iox)
  {
    throw new LexErr(iox.getMessage(), "", this.linenumber(), this.position());
  }
}
/**
 * Token string accessor.
 *
 * @return the String representation of the most recently scanned token
 */
public String token() {
  return tkn.toString();
}
/**
 * Line number accessor.
 *
 * @return the current line number
 */
public int linenumber() {
  return line;
}
/**
 * Character index accessor.
 *
 * @return the current character index
 */
public int position() {
  return cix;
}
/**
 * File name accessor.
 *
 * @return the input file name
 */
public String getFileName()
{
  return fileName;
}
/**
 * Close the input file.  This only needs to be called if lex'ing did not end with an EOF.
 *
 * @throws IOException on a close error
 */
public void close()
    throws IOException
{
  pgm_file.close();
}
/**
 * Set the listing option to true or false.
 *
 * @param opt the listing flag value to be set
 */
public void setListing(boolean opt)
{
  listing = opt;
}
/**
 * Get the symbol dictionary.
 */
public HashMap<String,Symbol> getDictionary()
{
  return dict;
}
/**
 * Get the comment metadata.
 */
public List<String> getComments()
{
  return comments;
}
}
