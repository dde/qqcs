package buildtools;

import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

public class CodeGen
{
  PrintWriter cg;
  PrintWriter pw;
  CFAnalyzer cfa;
  LL1Options opt;
  StringBuilder sb = new StringBuilder();
  String indent = "";
  int codegen_index;
  Map<String,List<String>> compileCode;
  boolean undent_last = false;
CodeGen(CFAnalyzer analyzer, PrintWriter cg, PrintWriter pw, LL1Options opt)
{
  this.cg = cg;
  this.cfa = analyzer;
  this.pw = pw;
  this.opt = opt;
}
void doIndent()
{
  indent += "  ";
}
void unIndent()
{
  try
  {
    indent = indent.substring(0, indent.length() - 2);
  }
  catch(Exception ex)
  {
    System.out.println(ex.getMessage());
  }
}
String jsname(String nm)
{
  return "_" + nm.replace("-", "_");
}
String tokenCompare(Set<Symbol> first, Set<Symbol> follow)
{
  boolean doOr, keyword;
  Set<Symbol> all;
  if (null != follow)
  {
    all = new TreeSet<>(Symbol.getComparator());
    all.addAll(first);
    all.addAll(follow);
  }
  else
    all = first;
  sb.setLength(0);
  sb.append('(');
  keyword = doOr = false;
  for (Symbol frst : all)
  {
    if (false && frst.isKeyword())
    {
      if (!keyword)
      {
        if (doOr)
          sb.append(" || ");
        else
          doOr = true;
        sb.append("this.sym.isKeyword(_tk.symbol)");
        keyword = true;
      }
    }
    else
    {
      if (doOr)
        sb.append(" || ");
      else
        doOr = true;
      sb.append(String.format("this.sym['%s'] === _tk.symbol", frst.getName()));
    }
  }
  sb.append(')');
  return sb.toString();
}
void genCompileCode(String key, int point, String pointId)
{
  String codeKey;
  List<String> code;
  cg.println(String.format("%s//%s %d", indent, pointId, point));
  codeKey = key + "-" + point;
  code = compileCode.get(codeKey);
  if (null != code)
  {
    for (String str : code)
    {
      cg.println(String.format("%s%s", indent, str));
    }
  }
}
void genTemplateCode(String code, Object... parms)
{
  cg.print(indent);
  cg.println(String.format(code, parms));
}
void genThrowSyntaxErr(String expect)
{
  genTemplateCode("  throw new SynErr(\"expected %s, not \" + _tk, this.lex);", expect);
}
void introCode ()
{
  cg.println("class SynErr extends Error");
  cg.println("{");
  cg.println("  constructor(msg, lex) {");
  cg.println("    super(msg + ' at line ' + String(lex.linenumber) + ':' + String(lex.position));");
  cg.println("  }");
  cg.println("}");
  cg.println(String.format("class %s", opt.getClassName()));
  cg.println("{");
  cg.println("  constructor(lex, sym, exe) {");
  cg.println("    this.lex = lex;");
  cg.println("    this.sym = sym;");
  cg.println("    this.exe = exe;");
  cg.println("  }");
  cg.println("r_assoc2(_op, _lft, _tail)");
  cg.println("{");
  cg.println("  if (null !== _tail)");
  cg.println("  {                             //    op");
  cg.println("    _tail.left = _lft;          //    tail");
  cg.println("    _op.rght = _tail;           //    lft");
  cg.println("  }");
  cg.println("  else");
  cg.println("  {");
  cg.println("    _op.rght = _lft;            //    op");
  cg.println("  }                             //    lft");
  cg.println("  return _op;");
  cg.println("}");
  cg.println("l_assoc2(op, lft, tail)");
  cg.println("{");
  cg.println("  let sq;");
  cg.println("  if (null !== tail)");
  cg.println("  {");
  cg.println("    sq = tail;");
  cg.println("    while (null !== sq.left)");
  cg.println("      sq = sq.left;");
  cg.println("    sq.left = op;");
  cg.println("    op.rght = lft;");
  cg.println("    return tail;");
  cg.println("  }");
  cg.println("  op.rght = lft;");
  cg.println("  return op;");
  cg.println("}");
  cg.println("r_assoc1(_lft, _tail)");
  cg.println("{");
  cg.println("  // if (null !== _exp)");
  cg.println("  //   _exp.left = _lft;");
  cg.println("  // else");
  cg.println("  //   _exp = _lft;");
  cg.println("  if (null !== _tail)         //     tail");
  cg.println("    _tail.left = _lft;       //   lft");
  cg.println("  else");
  cg.println("    _tail = _lft;            //     lft");
  cg.println("  return _tail;");
  cg.println("}");
  cg.println("l_assoc1(_lft, _tail)");
  cg.println("{");
  cg.println("  let sq;");
  cg.println("  // if (null !== _exp)");
  cg.println("  //   _exp.left = _lft;");
  cg.println("  // else");
  cg.println("  //   _exp = _lft;");
  cg.println("  if (null != _tail)");
  cg.println("  {");
  cg.println("    sq = _tail;");
  cg.println("    while (null !== sq.left)");
  cg.println("      sq = sq.left;");
  cg.println("    sq.left = _lft;");
  cg.println("  }");
  cg.println("  else");
  cg.println("    _tail = _lft;");
  cg.println("  return _tail;");
  cg.println("}");
  cg.println("_assoc1(_lft, _tail)");
  cg.println("{");
  cg.println("  // return this.r_assoc1(_lft, _tail);");
  cg.println("  return this.l_assoc1(_lft, _tail);");
  cg.println("}");
  cg.println("_assoc2(_op, _lft, _tail)");
  cg.println("{");
  cg.println("  // return this.r_assoc2(_op, _lft, _tail)");
  cg.println("  return this.l_assoc2(_op, _lft, _tail)");
  cg.println("}");
  cg.println("_append(_sv, _el)");
  cg.println("{");
  cg.println("  let _sq;");
  cg.println("  _sq = _sv;");
  cg.println("  while (null !== _sq.next)");
  cg.println("  {");
  cg.println("    _sq = _sq.next;");
  cg.println("  }");
  cg.println("  _sq.next = _el;");
  cg.println("  return _sv;");
  cg.println("}");
}
void genTerminalObject()
{
  String last, sym;
  String clsName = "Term";
  Set<Symbol> terms = cfa.getTerminal_set();
  cg.println(String.format("function %s()", clsName));
  cg.println("{");
  cg.println("}");
//  last = "none";
//  cg.println(String.format("%s.%s = 0;", clsName, last));
//  cg.println(String.format("%1$s.empty = %1$s.none + 1;", clsName));
//  cg.println(String.format("%1$s.%2$s = %1$s.empty + 1;", clsName, last));
  last = null;
  for (Symbol term : terms)
  {
    sym = term.getName();
    if (null != last)
      cg.println(String.format("%1$s.%2$s = %1$s.%3$s + 1;", clsName, sym, last));
    else
      cg.println(String.format("%s.%s = 0;", clsName, sym));
    last = sym;
  }
}
void genRightTerminal(Symbol sym, Symbol left, ProdContext pc)
{  // handle terminal symbols on the right-hand side
  if (pc.isFirst())
  { // this is the left-most right-hand symbol
    if (pc.hasAlts())
    {
      if (pc.isFirstProd()) // if this is the first of the alternate productions, get the token
        genTemplateCode("_tk = this.lex.next_token();");
      genTemplateCode("%sif (this.sym['%s'] === _tk.symbol)", (pc.isFirstProd()) ? "" : "else ", sym.getName());
      genTemplateCode("{");
      doIndent();
      if (pc.isOneSymbol())
      {
        genCompileCode(left.getToken(), codegen_index++, "b-codepoint");
        unIndent();
        genTemplateCode("}");
      }
      else
      {
        undent_last = true;
      }
    }
    else
    {
      genTemplateCode("_tk = this.lex.next_token();");
      genTemplateCode("if (this.sym['%s'] !== _tk.symbol)", sym.getName());
      genThrowSyntaxErr(sym.getToken());
      genCompileCode(left.getToken(), codegen_index++, "c0-codepoint");
    }
  }
  else if (pc.isLast())
  { // the last right-hand symbol, and also a terminal
    genTemplateCode("_tk = this.lex.next_token();");
    genTemplateCode("if (this.sym['%s'] !== _tk.symbol)", sym.getName());
    genThrowSyntaxErr(sym.getToken());
    genCompileCode(left.getToken(), codegen_index++, "c2-codepoint");
    if (undent_last)
    {
      unIndent();
      genTemplateCode("}");
    }
  }
  else
  { // an intermediate right-hand side terminal symbol
    genTemplateCode("_tk = this.lex.next_token();");
    genTemplateCode("if (this.sym['%s'] !== _tk.symbol)", sym.getName());
    genThrowSyntaxErr(sym.getToken());
    genCompileCode(left.getToken(), codegen_index++, "c1-codepoint");
  }
}
void genRightTerminalX(Symbol sym, Symbol left, ProdContext pc)
{  // handle terminal symbols on the right-hand side
  if (pc.isFirst())
  { // this is the left-most right-hand symbol (and also a terminal)
    if (pc.isFirstProd()) // if this is the first of the alternate productions, get the token
      genTemplateCode("_tk = this.lex.next_token();");
    genTemplateCode("%sif (this.sym['%s'] === _tk.symbol)", (pc.isFirstProd()) ? "" : "else ", sym.getName());
    genTemplateCode("{");
    doIndent();
//    genCompileCode(left.getToken(), codegen_index++, "b-codepoint");
//    if (!pc.hasAlts())
    if (pc.isOneSymbol())
    {
//      genCompileCode(left.getToken(), codegen_index++, "c1-codepoint");
      genCompileCode(left.getToken(), codegen_index++, "b-codepoint");
      unIndent();
      genTemplateCode("}");
//      genTemplateCode("else");
//      genThrowSyntaxErr(sym.getToken());
    }
    else
    {
      undent_last = true;
    }
  }
  else if (pc.isLast())
  { // the last right-hand symbol, and also a terminal
    genTemplateCode("_tk = this.lex.next_token();");
    genTemplateCode("if (this.sym['%s'] !== _tk.symbol)", sym.getName());
    genThrowSyntaxErr(sym.getToken());
    genCompileCode(left.getToken(), codegen_index++, "c0-codepoint");
    if (undent_last)
    {
      unIndent();
      genTemplateCode("}");
//      genTemplateCode("else");
//      genThrowSyntaxErr(sym.getToken());
    }
  }
  else
  { // an intermediate right-hand side terminal symbol
    genTemplateCode("_tk = this.lex.next_token();");
    genTemplateCode("if (this.sym['%s'] !== _tk.symbol)", sym.getName());
    genThrowSyntaxErr(sym.getToken());
    genCompileCode(left.getToken(), codegen_index++, "c1-codepoint");
  }
}
void genRightNonTerminal(Symbol sym, Symbol left, ProdContext pc)
{ // the right-hand symbol is a nonterminal
  Set<Symbol> firsts;
  Set<Symbol> follows;
  if (pc.isFirst())
  { // this is the left-most right-hand symbol
    if (pc.hasAlts())
    {  // there is more than one production in the set of alternates
      firsts = sym.getFirst();
      follows =  (sym.isNullable()) ? sym.getFollow() : null;
      if (pc.isFirstProd()) // this is the first of the alternates, get the token
        genTemplateCode("_tk = this.lex.next_token();");
      genTemplateCode("%sif %s", (pc.isFirstProd()) ? "" : "else ", tokenCompare(firsts, follows));
      genTemplateCode("{");
      doIndent();
      genTemplateCode("this.lex.pushBack(_tk);");
      genTemplateCode("_rt = this.%s();", jsname(sym.getToken()));
      genCompileCode(left.getToken(), codegen_index++, "d-codepoint");
      if (pc.isOneSymbol())
      {
        unIndent();
        genTemplateCode("}");
      }
      else
        undent_last = true;
    }
    else
    {
      genTemplateCode("_rt = this.%s();", jsname(sym.getToken()));
      genCompileCode(left.getToken(), codegen_index++, "e-codepoint");
    }
  }
  else if (pc.isLast())
  { // last nonterminal symbol on the right-hand side
    if (!pc.isTailRecursive())
    {
      genTemplateCode("_rt = this.%s();", jsname(sym.getToken()));
      genCompileCode(left.getToken(), codegen_index++, "f-codepoint");
    }
    if (undent_last)
    {
      unIndent();
      genTemplateCode("}");
    }
  }
  else
  { // an intermediate right-hand nonterminal symbol
    genTemplateCode("_rt = this.%s();", jsname(sym.getToken()));
    genCompileCode(left.getToken(), codegen_index++, "g-codepoint");
  }
}
void genProduction(Symbol left, Production prd, int alt_count, boolean first_prod)
{ // loop thru the alternate productions for a single left nonterminal
  Symbol sym;
  Symbol[] right;
  Set<Symbol> firsts;
  int ix, ln;
  boolean tail_recurse;
  ProdContext prctx = new ProdContext();
  undent_last = false;
  right = prd.getRight();
  ln = right.length - 1;
  tail_recurse = (ln > 0 && left == right[ln]);
  if (tail_recurse)
  {
    sym = right[0];
    firsts = sym.getFirst();
    genTemplateCode("// tail-recursion");
    genTemplateCode("_tk = this.lex.next_token();");
    genTemplateCode("if %s", tokenCompare(firsts, null));
    genTemplateCode("{");
    doIndent();
    genCompileCode(left.getToken(), codegen_index++, "t-codepoint");
    genTemplateCode("while %s", tokenCompare(firsts, null));
    genTemplateCode("{");
    doIndent();
    genTemplateCode("this.lex.pushBack(_tk);");
  }
  for (ix = 0; ix <= ln; ++ix)
  { // process the right-hand sides of the alternate productions of a left nonterminal
    sym = right[ix];
    prctx.set(0 == ix, ln == ix, 0 == ln, first_prod, 1 != alt_count, tail_recurse);
    if (sym.isTerminal())
    {  // handle terminal symbols on the right-hand side
      genRightTerminal(sym, left, prctx);
    }
    else
    { // handle nonterminal symbols on the right-hand side
      genRightNonTerminal(sym, left, prctx);
    }
  }
  if (tail_recurse)
  {
    genTemplateCode("_tk = this.lex.next_token();");
    unIndent();
    genTemplateCode("}");
    genTemplateCode("this.lex.pushBack(_tk);");
    unIndent();
    genTemplateCode("}");
  }
}
void genProductionX(Symbol left, Production prd, int alt_count, boolean first_prod)
{ // loop thru the alternate productions for a single left nonterminal
  Set<Symbol> firsts, follows;
  Symbol sym;
  Symbol[] right;
  boolean tail_recurse;
  // boolean alt;
  AltSwitch alt;
  int ix, ln;
  // alt = false;
  alt = new AltSwitch();
  right = prd.getRight();
  ln = right.length - 1;
  tail_recurse = (ln > 0 && left == right[ln]);
  for (ix = 0; ix <= ln; ++ix)
  { // process the right-hand sides of the alternate productions of a left nonterminal
    sym = right[ix];
    if (sym.isTerminal())
    {  // handle terminal symbols on the right-hand side
      if (0 == ix)
      { // this is the left-most right-hand symbol (and also a terminal)
        if (first_prod) // if this is the first of the alternate productions, get the token
          cg.println(String.format("%s_tk = this.lex.next_token();", indent));
        cg.println(String.format("%s%sif (this.sym['%s'] === _tk.symbol)",
                indent, (first_prod) ? "" : "else ", sym.getName()));
        cg.println(String.format("%s{", indent));
        if (0 == ln)
        {
          doIndent();
          genCompileCode(left.getToken(), codegen_index++, "b-codepoint");
          unIndent();
          cg.println(String.format("%s}", indent));
        }
        else
        {
          doIndent();
          // alt = true;  // need unindent for productions having more than one right symbol
          alt = new AltSwitch(true, true, 1 == alt_count);
        }
      }
      else if (ln == ix)
      { // the last right-hand symbol, and also a terminal
        cg.println(String.format("%s_tk = this.lex.next_token();", indent));
        cg.println(String.format("%sif (this.sym['%s'] !== _tk.symbol)", indent, sym.getName()));
        genThrowSyntaxErr(sym.getToken());
        genCompileCode(left.getToken(), codegen_index++, "c0-codepoint");
        //if (alt)
        if (alt.isAlt())
        {
          unIndent();
          cg.println(String.format("%s}", indent));
          System.out.println(String.format("%s,last=terminal", alt.toString()));
        }
      }
      else
      { // an intermediate right-hand side terminal symbol
        cg.println(String.format("%s_tk = this.lex.next_token();", indent));
        cg.println(String.format("%sif (this.sym['%s'] !== _tk.symbol)", indent, sym.getName()));
        genThrowSyntaxErr(sym.getToken());
        genCompileCode(left.getToken(), codegen_index++, "c1-codepoint");
      }
    }
    else
    { // the right-hand symbol is a nonterminal
      if (0 == ix)
      { // this is the left-most right-hand symbol (and also a nonterminal)
        if (1 != alt_count)
        {  // there is more than one production in the set of alternates
          firsts = sym.getFirst();
          if (sym.isNullable())
            follows = sym.getFollow();
          else
            follows = null;
          if (first_prod) // this is the first of the alternates, get the token
            cg.println(String.format("%s_tk = this.lex.next_token();", indent));
          cg.println(String.format("%s%sif %s",
                  indent, (first_prod) ? "" : "else ", tokenCompare(firsts, follows)));
          cg.println(String.format("%s{", indent));
          doIndent();
          cg.println(String.format("%sthis.lex.pushBack(_tk);", indent));
          cg.println(String.format("%s_rt = this.%s();", indent, jsname(sym.getToken())));
          genCompileCode(left.getToken(), codegen_index++, "d-codepoint");
          if (0 == ln)
          {
            unIndent();
            cg.println(String.format("%s}", indent));
          }
          else
          {
            // alt = true;  // need unindent for productions having more than one right symbol
            alt = new AltSwitch(true, false, 1 == alt_count);
          }
        }
        else
        {
          cg.println(String.format("%s_rt = this.%s();", indent, jsname(sym.getToken())));
          genCompileCode(left.getToken(), codegen_index++, "e-codepoint");
        }
      }
      else if (ln == ix)
      { // last nonterminal symbol on the right-hand side
        if (tail_recurse)
        {
          firsts = sym.getFirst();
          genCompileCode(left.getToken(), codegen_index++, "f-codepoint");
          cg.println(String.format("%s// tail-recursion", indent));
          cg.println(String.format("%s_tk = this.lex.next_token();", indent));
          cg.println(String.format("%swhile %s", indent, tokenCompare(firsts, null)));
          cg.println(String.format("%s{", indent));
          doIndent();
          cg.println(String.format("%s_rt = this.%s();", indent, jsname(sym.getToken())));
          genCompileCode(left.getToken(), codegen_index++, "t-codepoint");
          cg.println(String.format("%s_tk = this.lex.next_token();", indent));
          unIndent();
          cg.println(String.format("%s}", indent));
          cg.println(String.format("%sthis.lex.pushBack(_tk);", indent));
        }
        else
        {
          cg.println(String.format("%s_rt = this.%s();", indent, jsname(sym.getToken())));
          genCompileCode(left.getToken(), codegen_index++, "f-codepoint");
        }
        // if (alt)
        if (alt.isAlt())
        {
          unIndent();
          cg.println(String.format("%s}", indent));
          System.out.println(String.format("%s,last=nonterminal", alt.toString()));
        }
      }
      else
      { // an intermediate right-hand nonterminal symbol
        cg.println(String.format("%s_rt = this.%s();", indent, jsname(sym.getToken())));
        genCompileCode(left.getToken(), codegen_index++, "g-codepoint");
      }
    }
  }
}
void genLeftNonTerminal(Symbol left, Map<Symbol,List<Production>> alts)
{
  List<Production> prds;
  Production prd;
  Set<Symbol> follows;
  boolean alt, pshbk;
  int alt_count, px;
  indent = "";
  genTemplateCode("%s()", jsname(left.getToken()));
  genTemplateCode("{");
  doIndent();
  genTemplateCode("let _tk, _sv, _sq, _rt = null;");
//    cg.println(String.format("%sif (undefined ===_tk)", indent));
//    cg.println(String.format("%s_tk = this.lex.next_token();", indent + "  "));
  codegen_index = 0;
  alt = false;
  prds = alts.get(left);
  alt_count = prds.size();
  if (left.isNullable())
  {
    follows = left.getFollow();
    if (follows.size() > 0)
    {
      genTemplateCode("_tk = this.lex.next_token();");
      genTemplateCode("this.lex.pushBack(_tk);");
      genTemplateCode("if %s", tokenCompare(follows, null));
      genTemplateCode("{");
      doIndent();
      genCompileCode(left.getToken(), codegen_index++, "a0-codepoint");
      genTemplateCode("return _rt;");
      unIndent();
      genTemplateCode("}");
      alt = true;
    }
  }
  if (!alt)
  {
    genCompileCode(left.getToken(), codegen_index++, "a1-codepoint");
  }
  alt = false;
  pshbk = false;
  for (px = 0; px < alt_count; ++px)
  {
    prd = prds.get(px);
    // an empty production with no follow symbols
    pshbk |= (0 == prd.getRight().length && 0 == left.getFollow().size());
    genProduction(left, prd, alt_count, px == 0);
  }
  if (alt_count > 1)
  {
    genTemplateCode("else");
    genThrowSyntaxErr(left.getFirst().toString());
  }
  if (pshbk && !alt)  // should genProduction() return alt??
  {
    genTemplateCode("else");
    genTemplateCode("%sthis.lex.pushBack(_tk);","  ");
  }
  genTemplateCode("return _rt;");
  unIndent();
  genTemplateCode("}");
}
void  generate(Map<String,List<String>> compileCode)
{
  Set<Symbol> nonterm;
  Map<Symbol,List<Production>> alts;
//  prds = cfa.getGrammar();
//  start = cfa.getStartSymbol();
  this.compileCode = compileCode;
  nonterm = cfa.getNonterminal_set();
  alts = cfa.getAlternates();
  genTerminalObject();
  introCode();
  for (Symbol left : nonterm)
  {
    genLeftNonTerminal(left, alts);
  }
  cg.println("}");
  cg.println(String.format("module.exports.%1$s = %1$s;", opt.getClassName()));
  cg.println("module.exports.SynErr = SynErr;");
  cg.flush();
}
class ProdContext
{
  boolean first;  // processing first (left-most) right-hand symbol
  boolean last;   // processing last (right-most) right-hand symbol
  boolean first_prod;  // processing first (or only) production for a left non-terminal
  boolean tail;   // this is a tail recursive production
  boolean single;  // this production has only a single right-hand symbol
  boolean alts;   // the current left symbol has alternate productions
ProdContext()
{
}
void set(boolean f, boolean l, boolean s, boolean fp, boolean a, boolean t)
{
  // genRightNonTerminal(sym, left, 0 == ix, ln == ix, 0 == ln, first_prod,
  //              1 != alt_count, tail_recurse);
  first = f;
  last = l;
  single = s;
  first_prod = fp;
  alts = a;
  tail = t;
}
boolean isFirst()
{
  return first;
}
boolean isLast()
{
  return last;
}
boolean isOneSymbol()
{
  return single;
}
boolean isFirstProd()
{
  return first_prod;
}
boolean isTailRecursive()
{
  return tail;
}
boolean hasAlts()
{
  return alts;
}
}
class AltSwitch
{
  boolean alt;
  boolean term;
  boolean single;
AltSwitch()
{
}
AltSwitch(boolean sw, boolean term, boolean single)
{
  alt = sw;
  this.term = term;
  this.single = single;
}
boolean isAlt()
{
  return alt;
}
public String toString()
{
  return String.format("alt=%b,symbol=%s,single=%b", alt, (term) ? "terminal" : "nonterminal", single);
}
}
}
