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
CodeGen(CFAnalyzer analyzer, PrintWriter cg, PrintWriter pw, LL1Options opt)
{
  this.cg = cg;
  this.cfa = analyzer;
  this.pw = pw;
  this.opt = opt;
}
void genThrowSyntaxErr(String indent, String expect)
{
  cg.println(String.format("%sthrow new SynErr(\"expected %s, not \" + _tk, this.lex);", indent, expect));
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
        sb.append(String.format("this.sym.isKeyword(_tk.symbol)"));
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
void genCompileCode(String key, int point, Map<String,List<String>> cc, String ind)
{
  String codeKey;
  List<String> code;
  codeKey = key + "-" + point;
  code = cc.get(codeKey);
  if (null != code)
  {
    for (String str : code)
    {
      cg.println(ind + str);
    }
  }
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
  cg.println("  if (null != _tail)");
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
  cg.println("  if (null != tail)");
  cg.println("  {");
  cg.println("    sq = tail;");
  cg.println("    while (null != sq.left)");
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
  cg.println("  // if (null != _exp)");
  cg.println("  //   _exp.left = _lft;");
  cg.println("  // else");
  cg.println("  //   _exp = _lft;");
  cg.println("  if (null != _tail)         //     tail");
  cg.println("    _tail.left = _lft;       //   lft");
  cg.println("  else");
  cg.println("    _tail = _lft;            //     lft");
  cg.println("  return _tail;");
  cg.println("}");
  cg.println("l_assoc1(_lft, _tail)");
  cg.println("{");
  cg.println("  let sq;");
  cg.println("  // if (null != _exp)");
  cg.println("  //   _exp.left = _lft;");
  cg.println("  // else");
  cg.println("  //   _exp = _lft;");
  cg.println("  if (null != _tail)");
  cg.println("  {");
  cg.println("    sq = _tail;");
  cg.println("    while (null != sq.left)");
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
  cg.println("  while (null != _sq.next)");
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
void  generate(Map<String,List<String>> compileCode)
{
  List<Production> prds;
  Symbol sym;
  Symbol[] right;
  Set<Symbol> firsts, follows;
  Set<Symbol> nonterm;
  Map<Symbol,List<Production>> alts;
  int ix, px, ln, alt_count, cp;
  boolean alt, pshbk, tail_recurse;
  String indent;
//  prds = cfa.getGrammar();
//  start = cfa.getStartSymbol();
  nonterm = cfa.getNonterminal_set();
  alts = cfa.getAlternates();
  genTerminalObject();
  introCode();
  for (Symbol left : nonterm)
  {
    indent = "";
    cg.println(String.format("%s()", jsname(left.getToken())));
    cg.println("{");
    indent += "  ";
    cg.println(String.format("%slet _tk, _sv, _sq, _rt = null;", indent));
//    cg.println(String.format("%sif (undefined ===_tk)", indent));
//    cg.println(String.format("%s_tk = this.lex.next_token();", indent + "  "));
    alt = false;
    cp = 0;
    if (left.isNullable())
    {
      follows = left.getFollow();
      if (follows.size() > 0)
      {
        cg.println(String.format("%s_tk = this.lex.next_token();", indent));
        cg.println(String.format("%sthis.lex.pushBack(_tk);", indent));
        cg.println(String.format("%sif %s", indent, tokenCompare(follows, null)));
        cg.println(String.format("%s{", indent));
        indent += "  ";
        cg.println(String.format("%s//a0-codepoint %d", indent, cp));
        genCompileCode(left.getToken(), cp++, compileCode, indent);
        cg.println(String.format("%sreturn _rt;", indent));
        indent = indent.substring(0, indent.length() - 2);
        cg.println(String.format("%s}", indent));
        alt = true;
      }
    }
    if (!alt)
    {
      cg.println(String.format("%s//a1-codepoint %d", indent, cp));
      genCompileCode(left.getToken(), cp++, compileCode, indent);
    }
    alt = false;
    pshbk = false;
    prds = alts.get(left);
    alt_count = prds.size();
    for (px = 0; px < alt_count; ++px)
    { // loop thru the alternate productions for a single nonterminal
      right = prds.get(px).getRight();
      ln = right.length - 1;
      if (ln < 0 && 0 == left.getFollow().size())
      { // an empty production with no follow symbols
        pshbk = true;
      }
      tail_recurse = (ln > 0 && left == right[ln]);
      for (ix = 0; ix <= ln; ++ix)
      { // process the right-hand symbols of the alternate production [px]
        sym = right[ix];
        if (tail_recurse)
        {
//          cg.println(String.format("%s//a2-codepoint %d", indent, cp));
//          genCompileCode(left.getToken(), cp++, compileCode, indent);
        }
        if (sym.isTerminal())
        {  // handle terminal symbols on the right-hand side
          if (0 == ix)
          { // this is the left-most right-hand symbol (and also a terminal)
            if (0 == px) // if this is the first of the alternate productions, get the token
              cg.println(String.format("%s_tk = this.lex.next_token();", indent));
            cg.println(String.format("%s%sif (this.sym['%s'] === _tk.symbol)",
                indent, (0 == px) ? "" : "else ", sym.getName()));
            cg.println(String.format("%s{", indent));
            if (0 == ln)
            {
              cg.println(String.format("%s//b-codepoint %d", indent + "  ", cp));
              genCompileCode(left.getToken(), cp++, compileCode, indent + "  ");
              cg.println(String.format("%s}", indent));
            }
            else
            {
              indent += "  ";
              alt = true;
            }
          }
          else if (ln == ix)
          { // the last right-hand symbol, and also a terminal
            cg.println(String.format("%s_tk = this.lex.next_token();", indent));
            cg.println(String.format("%sif (this.sym['%s'] !== _tk.symbol)", indent, sym.getName()));
            genThrowSyntaxErr(indent + "  ", sym.getToken());
            cg.println(String.format("%s//c0-codepoint %d", indent, cp));
            genCompileCode(left.getToken(), cp++, compileCode, indent);
            if (alt)
            {
              indent = indent.substring(0, indent.length() - 2);
              cg.println(String.format("%s}", indent));
            }
          }
          else
          { // an intermediate right-hand side terminal symbol
            cg.println(String.format("%s_tk = this.lex.next_token();", indent));
            cg.println(String.format("%sif (this.sym['%s'] !== _tk.symbol)", indent, sym.getName()));
            genThrowSyntaxErr(indent + "  ", sym.getToken());
            cg.println(String.format("%s//c1-codepoint %d", indent, cp));
            genCompileCode(left.getToken(), cp++, compileCode, indent);
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
              if (0 == px) // this is the first of the alternates, get the token
                cg.println(String.format("%s_tk = this.lex.next_token();", indent));
              cg.println(String.format("%s%sif %s",
                  indent, (0 == px) ? "" : "else ", tokenCompare(firsts, follows)));
              cg.println(String.format("%s{", indent));
              indent += "  ";
              cg.println(String.format("%sthis.lex.pushBack(_tk);", indent));
              cg.println(String.format("%s_rt = this.%s();", indent, jsname(sym.getToken())));
              cg.println(String.format("%s//d-codepoint %d", indent, cp));
              genCompileCode(left.getToken(), cp++, compileCode, indent);
              if (0 == ln)
              {
                indent = indent.substring(0, indent.length() - 2);
                cg.println(String.format("%s}", indent));
              }
              else
              {
                alt = true;
              }
            }
            else
            {
              cg.println(String.format("%s_rt = this.%s();", indent, jsname(sym.getToken())));
              cg.println(String.format("%s//e-codepoint %d", indent, cp));
              genCompileCode(left.getToken(), cp++, compileCode, indent);
            }
          }
          else if (ln == ix)
          { // last nonterminal symbol on the right-hand side
            if (tail_recurse)
            {
              cg.println(String.format("%s//tail-recursion %d", indent, cp));
            }
            cg.println(String.format("%s_rt = this.%s();", indent, jsname(sym.getToken())));
            cg.println(String.format("%s//f-codepoint %d", indent, cp));
            genCompileCode(left.getToken(), cp++, compileCode, indent);
            if (alt)
            {
              indent = indent.substring(0, indent.length() - 2);
              cg.println(String.format("%s}", indent));
            }
          }
          else
          { // an intermediate right-hand nonterminal symbol
            cg.println(String.format("%s_rt = this.%s();", indent, jsname(sym.getToken())));
            cg.println(String.format("%s//g-codepoint %d", indent, cp));
            genCompileCode(left.getToken(), cp++, compileCode, indent);
          }
        }
      }
    }
    if (alt_count > 1)
    {
      cg.println(String.format("%selse", indent));
      genThrowSyntaxErr(indent + "  ", left.getFirst().toString());
    }
    if (pshbk && !alt)
    {
      cg.println(String.format("%selse", indent));
      cg.println(String.format("%sthis.lex.pushBack(_tk);", indent + "  "));
    }
    cg.println(String.format("%sreturn _rt;", indent));
    cg.println(String.format("}"));
  }
  cg.println(String.format("}"));
  cg.println(String.format("module.exports.%1$s = %1$s;", opt.getClassName()));
  cg.println(String.format("module.exports.SynErr = SynErr;"));
  cg.flush();
}
}
