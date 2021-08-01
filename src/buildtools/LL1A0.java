package buildtools;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LL1A0 extends CFAnalyzer
{
  Map<String,List<String>> compileCode = new HashMap<>();
LL1A0(GramLexer0 lex)
{
  super(lex);
  this.lex = lex;
}
LL1A0(GramLexer0 lex, PrintWriter pw)
{
  super(lex, pw);
  this.lex = lex;
}
LL1A0(GramLexer0 lex, PrintWriter pw, boolean trc)
{
  super(lex, pw, trc);
  this.lex = lex;
}
boolean disjoint(Set<Symbol> lft, Set<Symbol> rgt)
{
  for (Symbol s1 : lft)
  {
    if (rgt.contains(s1))
      return false;
  }
  return true;
}
boolean disjoint(ArrayList<Set<Symbol>> sets)
{
  int sz = sets.size();
  int ix, jx;
  Set<Symbol> lft, rgt;
  if (1 == sz)
    return true;
  for (ix = 0; ix < sz; ix += 1)
  {
    for (jx = ix + 1; jx < sz; jx += 1)
    {
      lft = sets.get(ix);
      rgt = sets.get(jx);
      for (Symbol s1 : lft)
      {
        if (rgt.contains(s1))
          return false;
      }
    }
  }
  return true;
}
boolean conflict()
{
  ArrayList<Set<Symbol>> sets = new ArrayList<>();
  Symbol[] rgt;
  boolean conflict, anyconflict;
  pw.println("\nConflicts");
  anyconflict = false;
  // first symbol conflict
  for (Symbol s1 : nonterminal_set)
  {
    sets.clear();
    for (Production p1 : grammar)
    {
      if (s1 == p1.getLeft())
      {
        rgt = p1.getRight();
        if (0 < rgt.length)
          sets.add(rgt[0].getFirst());
      }
    }
    conflict = !disjoint(sets);
    if (conflict)
    {
      pw.println(String.format("first symbols for %s productions are not disjoint", s1.getToken()));
      anyconflict = true;
    }
    if (s1.isNullable())
    {
      conflict = !disjoint(s1.getFirst(), s1.getFollow());
      if (conflict)
      {
        pw.println(String.format("first and follow symbols for nullable symbol %s are not disjoint", s1.getToken()));
        anyconflict = true;
      }
    }
  }
  if (!anyconflict)
    pw.println("\nthe grammar has no conflicts");
  return anyconflict;
}
boolean analyze()
    throws ParseException
{
  boolean noconflict;
  try
  {
    pw.println("Grammar");
    this.read_productions();
  }
  catch (ParseException psx)
  {
    pw.println(String.format("parse exception:%s", psx.getMessage()));
  }
  classify();
  first_follow();
  noconflict = !conflict();
  return noconflict;
}
void addProduction(ArrayList<Symbol> prd)
{
  grammar.add(new Production(prd));
}
void terminalNames()
{
  List<String> comments;
  Map<String,Symbol> dict;
  Pattern map_pattern = Pattern.compile("^ *# *([^ ]+) +([^ ]+)");
  Matcher mtch;
  String tkn, nm;
  Symbol sym;
  boolean mapping;
  String genkey;
  List<String> stmts;
  comments = lex.getComments();
  dict = lex.getDictionary();
  stmts = null;
  mapping = false;
  for (String cmt : comments)
  {
    if (null != stmts)
    {
      if (!cmt.startsWith("#@"))
        stmts.add(cmt.substring(1));
    }
    if (mapping)
    {
      if (cmt.contains("end-mapping"))
      {
        mapping = false;
        continue;
      }
      mtch = map_pattern.matcher(cmt);
      if (mtch.matches())
      {
        tkn = mtch.group(1);
        nm = mtch.group(2);
        sym = dict.get(tkn);
        if (null != sym)
        {
          sym.setName(nm);
        }
        else
        {
          pw.println(String.format("can't find mapping for terminal %s", tkn));
        }
      }
      else
      {
        pw.println(String.format("mapping not recognized %s", cmt));
      }
    }
    else if (cmt.contains("Terminal-mapping"))
    {
      mapping = true;
    }
    else
    {
      if (cmt.startsWith("#@"))
      {
        if (5 == cmt.length() && cmt.substring(2).equals("end"))
        {
          stmts = null;
          continue;
        }
        genkey = cmt.substring(2);
        stmts = new ArrayList<>();
        compileCode.put(genkey, stmts);
      }
    }
  }
}
static public void main(String[] args)
{
  final String usage = "Usage: " +
                       "java buildtools.LL1A0 [options] files\n" +
                       "  files are one or more grammar files to be analyzed\n" +
                       "where options include\n" +
                       "  -o <file> write result to output file (default stdout)\n" +
                       "  -g <file> generate code to output file\n" +
                       "  -gc <name> class name for generated code\n" +
                       "  -n nullify a previous -g option\n";
  String[] files;
  LL1Options opt = null;
  boolean noconflict = false;
  GramLexer0 lex;
  LL1A0 ll1;
  PrintWriter pw, cg;
  CodeGen cgen;
  File codeFile;
  try
  {
    opt = new LL1Options(args, usage);
  }
  catch (IllegalArgumentException iax)
  {
    LL1Options.usage();
    System.exit(1);
  }
  files = opt.getFilelist();
  try
  {
    lex = new GramLexer0(files[0]);
    lex.setListing(true);
  }
  catch(FileNotFoundException fnfx)
  {
    System.out.println(fnfx.getMessage());
    return;
  }
  pw = new PrintWriter(System.out);
  ll1 = new LL1A0(lex, pw, opt.getTrace());
  try
  {
    noconflict = ll1.analyze();
  }
  catch (ParseException prsx)
  {
    pw.println(prsx.getMessage());
    pw.flush();
    return;
  }
  pw.flush();
  if (noconflict && null != opt.getCodeFile())
  {
    ll1.terminalNames();
    try
    {
      codeFile = ll1.checkOutputFile(new File(opt.getCodeFile()));
      cg = new PrintWriter(codeFile);
      cgen = new CodeGen(ll1, cg, pw, opt);
      cgen.generate(ll1.compileCode);
      cg.close();
      pw.println(String.format("\ncode written to %s", opt.getCodeFile()));
    }
    catch (Exception fnfx)
    {
      pw.println(fnfx.getClass().getName() + ": " + fnfx.getMessage());
    }
  }
  pw.flush();
}
/**
 * If the intended output file exists, rename it to a backup file.
 * @param codeFile the intended output file
 * @return either the passed File if no backup was needed, or a new File after the existing File is backed up
 */
File checkOutputFile(File codeFile)
{
  String backup;
  String codeFileName;
  File backupFile;
  boolean success;
  if (!codeFile.exists())
    return codeFile;
  codeFileName = codeFile.getName();
  backup = codeFileName + ".BAK";
  backupFile = new File(codeFile.getParentFile(), backup);
  if (backupFile.exists())
  {
    backupFile.delete();
  }
  success = codeFile.renameTo(backupFile);
  return new File(codeFile.getParentFile(), codeFileName);
}
}
