package buildtools;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * Super class that factors common methods and data used by all context free grammar analyzers.
 */
public class CFAnalyzer
{
  final Map<Symbol,List<Production>> alternates = new HashMap<>();
  final List<Production> grammar = new ArrayList<>();
  final Set<Symbol> terminal_set = new TreeSet<>(Symbol.getComparator());
  final Set<Symbol> nonterminal_set = new TreeSet<>(Symbol.getComparator());
  GramLexer0 lex;
  Symbol startSymbol, eofSymbol;
  final PrintWriter pw;
  boolean tracing;
  String codeKey = "@";

CFAnalyzer(GramLexer0 lex)
{
  this(lex, null);
}
CFAnalyzer(GramLexer0 lex, boolean trc)
{
  this(lex, null, trc);
}
CFAnalyzer(GramLexer0 lex, PrintWriter pw)
{
  this(lex, pw, false);
}
CFAnalyzer(GramLexer0 lex, PrintWriter pw, boolean trc)
{
  this.lex = lex;
  if (null == pw)
  {
    this.pw = new PrintWriter(System.out, true);
  }
  else
  {
    this.pw = pw;
  }
  this.tracing = trc;
}
void read_productions()
    throws ParseException
{
  Symbol sym, lsy;
  Category cat;
  int cd;
  ArrayList<Symbol> production = new ArrayList<>();
  List<Production> alts;
  Production prd;
  try
  {
    cd = 0;
    lsy = null;
    sym = lex.next_token();
    cat = sym.getCategory();
    //noinspection InfiniteLoopStatement
    for (; true; lsy = sym, sym = lex.next_token(), cat = sym.getCategory())
    {
      if (Category.eol != cat)
      {
        if (Category.equal == cat)
        {
          nonterminal_set.add(lsy);
        }
        else if (Category.sym != cat)
        {
          throw new LexErr("unexpected production symbol:", sym.toString(), lex.linenumber(), lex.position());
        }
        if (codeKey.equals(sym.token))
        {
          cd += 1;
          pw.println(String.format("@%s-%d", production.get(0).getToken(), cd));
          continue;
        }
        production.add(sym);
      }
      else
      {
        if (0 != production.size())
        {
          if (2 > production.size())
            throw new LexErr("production size invalid", production.toString(), lex.linenumber(), lex.position());
          prd = new Production(production);
          production.clear();
          grammar.add(prd);
          if (null == (alts = alternates.get(prd.getLeft())))
          {
            alts = new ArrayList<>();
            alternates.put(prd.getLeft(), alts);
            cd = 0;
          }
          alts.add(prd);
        }
      }
    }
  }
  catch (LexEOF eofx)
  {
    /* empty */
  }
//  finally
//  {
//    if (0 != production.size())
//    {
//      if (2 > production.size())
//        throw new LexErr("production size invalid", production.toString(), lex.linenumber(), lex.position());
//      grammar.add(new Production(production));
//    }
//  }
}
Production findStartSymbol()
{
  Production stp = null;
  Symbol start = null;
  Symbol lft;
  for (Production prd : grammar)
  {
    lft = prd.getLeft();
    if (1 == lft.getAppearanceCount())
    {
      if (null == start)
      {
        start = lft;
        stp = prd;
      }
      else
      {
        pw.println(String.format("multiple start symbols: %s and %s", start.getToken(), lft.getToken()));
      }
    }
  }
  return stp;
}
void classify()
    throws ParseException
{
  Production prd0;
  Symbol sym;
  int ix;
  for (Production p1 : grammar)
  {
    sym = p1.get(0);
    sym.addProduction(p1, 0);
    nonterminal_set.add(sym);
    if (p1.producesEmpty())
      sym.setNullable(true);
  }
  for (Production p1 : grammar)
  {
    ix = 1;
    sym = p1.get(ix);
    while (sym != null)
    {
      sym.addProduction(p1, ix);
      if (!(nonterminal_set.contains(sym)))
      {
        terminal_set.add(sym);
        sym.setTerminal(true);
      }
      ix += 1;
      sym = p1.get(ix);
    }
  }
  prd0 = findStartSymbol();
  if (null == prd0)
  {
    throw new LexErr("grammar has no start symbol", "", 0, 0);
  }
  startSymbol = prd0.getLeft();
  pw.println(String.format("\nStart symbol:%s", startSymbol.toString()));
  sym = prd0.getLast();
  if (sym.isTerminal())
  {
    eofSymbol = sym;
    pw.println(String.format("\nEOF symbol:%s", sym.toString()));
  }
  pw.println("\nNonTerminals");
  for (Symbol s1 : nonterminal_set)
  {
    pw.println(s1.getToken());
  }
  pw.println("\nTerminals");
  for (Symbol s1 : terminal_set)
  {
    pw.println(s1.getToken());
  }
  pw.println("\nProductions");
  for (Production p1 : grammar)
  {
    pw.println(p1.toString());
  }
}
/**
 * Symbols from the right set are added to the left set.
 * @param lft the left set
 * @param rgt the right set
 * @return the augmented left set
 */
private boolean
unionUpdate(Set<Symbol> lft, Set<Symbol> rgt)
{
  boolean modified;
  modified = false;
  for (Symbol s1 : rgt)
  {
    modified = lft.add(s1) || modified;
  }
  return modified;
}
private String toFirstString(Symbol s1)
{
  Set<Symbol> fset;
  StringBuilder sb = new StringBuilder();
  boolean first;
  sb.append("first{");
  fset = s1.getFirst();
  first = true;
  for (Symbol s2 : fset)
  {
    if (first)
      first = false;
    else
      sb.append(",");
    sb.append(s2.getToken());
  }
  sb.append("}");
  return sb.toString();
}
private String toFollowString(Symbol s1)
{
  Set<Symbol> fset;
  StringBuilder sb = new StringBuilder();
  boolean first;
  sb.append("follow{");
  fset = s1.getFollow();
  first = true;
  for (Symbol s2 : fset)
  {
    if (first)
      first = false;
    else
      sb.append(",");
    sb.append(s2.getToken());
  }
  sb.append("}");
  return sb.toString();
}
private void displayFF(Symbol s1)
{
  pw.println(String.format("%s%s %s %s", s1.getToken(), (s1.isNullable()) ? " nullable" : "",
      toFirstString(s1), toFollowString(s1)));
}
void first_follow()
{
  boolean changing, nullable, changed;
  int pass;
  Symbol lft, rgt, nxt;
  Symbol[] rgt_side;
  Set<Symbol> fset;
  int ix;
  for (Symbol s1 : terminal_set)
  {
    s1.setFirst(s1);
  }
  changing = true;
  while (changing)
  {
    changing = false;
    for (Production p1 : grammar)
    {
      lft = p1.getLeft();
      if (!lft.isNullable())
      {
        if (p1.producesEmpty(1))
        {
          lft.setNullable(true);
          changing = true;
          if (tracing)
          {
            pw.println("add nullable production " + p1.toString());
          }
        }
      }
    }
  }
  // First symbols
  // for all productions A->s1, A->s2, ... first(A)=first(s1) + first(s1) + ...
  changing = true;
  pass = 0;
  while (changing)
  {
    changing = false;
    if (tracing)
      pw.println("  -- firsts pass " + (++pass));
    for (Production p1 : grammar)
    {
      if (tracing)
        pw.println("  -> production " + p1.toString());
      lft = p1.getLeft();
      rgt_side = p1.getRight();
      nullable = true;
      for (ix = 0; ix < rgt_side.length && nullable; ix += 1)
      {
        rgt = rgt_side[ix];
        changed = unionUpdate(lft.getFirst(), rgt.getFirst());
        if (changed && tracing)
        {
          pw.println("  added " + toFirstString(rgt) + " of " + rgt.toString() + " to " + lft.toString() + " " + toFirstString(lft));
        }
        changing = changed || changing;
        nullable = rgt.isNullable();
      }
    }
  }
  // follow symbols
  // for any production X ->rABs, if B is nullable, then follow(A) must be augmented by follow(B); if s is empty,
  // then follow(B) is augmented by follow(X)
  pass = 0;
  changing = true;
  while (changing)
  {
    changing = false;
    if (tracing)
      pw.println("  -- follows phase 1 pass " + (++pass));
    for (Production p1 : grammar)
    {
      if (tracing)
        pw.println("  -> production " + p1.toString());
      rgt_side = p1.getRight();
      for (ix = 0; ix < rgt_side.length; ix += 1)
      {
        rgt = rgt_side[ix];
        if (rgt.isTerminal())
          continue;
        if (ix + 1 < rgt_side.length)
        {
          nxt = rgt_side[ix + 1];
          fset = rgt.getFollow();
          changed = unionUpdate(fset, nxt.getFirst());
          if (changed && tracing)
          {
            pw.println("  add(1) " + toFirstString(nxt) + " of " + nxt.toString() + " to " + rgt.toString() + " " + toFollowString(rgt));
          }
          changing = changed || changing;
          if (nxt.isNullable())
          {
            changed = unionUpdate(fset, nxt.getFollow());
            if (changed && tracing)
            {
              pw.println("  add(2) " + toFollowString(nxt) + " of " + nxt.toString() + " to " + rgt.toString() + " " + toFollowString(rgt));
            }
            changing = changed || changing;
          }
        }
      }
    }
    if (tracing)
      pw.println("  -- follows phase 2 pass " + pass);
    for (Production p1 : grammar)
    {
      if (tracing)
        pw.println("  -> production " + p1.toString());
      lft = p1.getLeft();
      rgt = p1.getLast();
      if (null == rgt)
        continue;
      if (!rgt.isTerminal())  // skip this to avoid propagation of follows from left side to last right nonterminals
      {
        changed = unionUpdate(rgt.getFollow(), lft.getFollow());
        if (changed && tracing)
        {
          pw.println("  add(4) " + toFollowString(lft) + " of " + lft.toString() + " to " + rgt.toString() + " " + toFollowString(rgt));
        }
      }
      rgt_side = p1.getRight();
      for (ix = rgt_side.length - 1; ix > 0; --ix)
      {
        if (!rgt_side[ix].isNullable())
          break;
        rgt = rgt_side[ix - 1];
        changed = unionUpdate(rgt.getFollow(), lft.getFollow());
        if (changed && tracing)
        {
          pw.println("  add(3) " + toFollowString(lft) + " of " + lft.toString() + " to " + rgt.toString() + " " + toFollowString(rgt));
        }
        changing = changed || changing;
      }
    }
  }
  pw.println("\nFirst/Follow Symbols");
  for (Symbol s1 : nonterminal_set)
  {
    displayFF(s1);
    if (s1.getFirst().size() == 0)
      pw.println("    " + s1.toString() + " first set is empty");
    if (s1 != startSymbol && s1.getFollow().size() == 0)
      pw.println("    " + s1.toString() + " follow set is empty");
  }
//  for (Symbol s1 : terminal_set)
//  {
//    displayFF(s1);
//  }
}
enum GDelim
{
  EQ("::="), OR("|", " |"), OPTL("[", " [ "), OPTR("]", " ]"), SPC(" ", " ");
  String tkn;
  String dlm;
  GDelim(String t, String d)
  {
    this.tkn = t;
    this.dlm = d;
  }
  GDelim(String t)
  {
    this.tkn = t;
    this.dlm = " " + t + " ";
  }
  String getToken()
  {
    return tkn;
  }
  String getDelim()
  {
    return dlm;
  }
static boolean needEscape(String tkn)
{
  for (GDelim enm : GDelim.values())
  {
    if (tkn.equals(enm.getToken()))
      return true;
  }
  return false;
}
}
String displayGrammar()
{
  List<Production> alts;
  Symbol[] rgt;
  boolean notFirst;
  StringBuilder sb = new StringBuilder();
  for (Symbol nt : nonterminal_set)
  {
    alts = alternates.get(nt);
    sb.append(nt.getToken());
    sb.append(GDelim.EQ.getDelim());
    if (nt.isNullable())
    {
      sb.append("epsilon");
      notFirst = true;
    }
    else
      notFirst = false;
    for (Production prd : alts)
    {
      rgt = prd.getRight();
      if (0 == rgt.length)
      {
        continue;
      }
      if (notFirst)
      {
        sb.append(GDelim.OR.getDelim());
      }
      else
      {
        notFirst = true;
      }
      for (Symbol sym : rgt)
      {
        if (nt == sym)
        {
          sb.append(GDelim.OPTL.getDelim());
          sb.append(sym.getToken());
          sb.append(GDelim.OPTR.getDelim());
        }
        else
        {
          sb.append(GDelim.SPC.getToken());
          if (sym.isTerminal())
          {
            if (GDelim.needEscape(sym.getToken()))
            {
              sb.append("'");
              sb.append(sym.getToken());
              sb.append("'");
            }
            else
            {
              sb.append(sym.getToken());
            }
          }
          else
          {
            sb.append(sym.getToken());
          }
        }
      }
    }
    sb.append("\n");
  }
  return sb.toString();
}
@SuppressWarnings("unused")
public Symbol getStartSymbol()
{
  return startSymbol;
}
@SuppressWarnings("unused")
public Symbol getEofSymbol()
{
  return eofSymbol;
}
public List<Production>
getGrammar()
{
  return grammar;
}
public Map<Symbol,List<Production>>
getAlternates()
{
  return alternates;
}
public Set<Symbol> getTerminal_set()
{
  return terminal_set;
}
public Set<Symbol> getNonterminal_set()
{
  return nonterminal_set;
}
}
