package buildtools;

public class LL1Options
{
  String[] args;
  String[] filelist = new String[0];
  String fileOutput = null;
  String codeOutput = null;
  String className = "";
  boolean trace = false;
  boolean summary = false;
static String use = "";
static void usage()
{
  System.out.print(use);
}
static String[]
expand(String[] orig, int nwsz)
{
  String[] exp;
  exp = new String[nwsz];
  System.arraycopy(orig, 0, exp, 0, Math.min(nwsz, orig.length));
  return exp;
}
static String
optionValue(String[] args, int ix)
{
  if (ix >= args.length)
    throw new IllegalArgumentException();
  return args[ix];
}
LL1Options(String[] args, String usage)
{
  int ix, incr;
  this.args = args;
  if (null != usage)
  {
    LL1Options.use = usage;
  }
  for (ix = 0; ix < args.length; ix += incr)
  {
    incr = 1;
    if (args[ix].charAt(0) == '-')
    {
      if (args[ix].equals("-o"))
      {
        fileOutput = optionValue(args, ix + 1);
        incr = 2;
      }
      else if (args[ix].equals("-g"))
      {
        codeOutput = optionValue(args, ix + 1);
        incr = 2;
      }
      else if (args[ix].equals("-gc"))
      {
        className = optionValue(args, ix + 1);
        incr = 2;
      }
      else if (args[ix].equals("-n"))
      {
        codeOutput = null;
      }
      else if (args[ix].equals("-s"))
      {
        summary = true;
      }
      else if (args[ix].equals("-t"))
      {
        trace = true;
      }
      else
      {
        throw new IllegalArgumentException();
      }
    }
    else
    {
      filelist = expand(filelist, 1 + filelist.length);
      filelist[filelist.length - 1] = args[ix];
    }
  }
  if (0 == filelist.length)
  {
    throw new IllegalArgumentException();
  }
}
public String[] getFilelist()
{
  return filelist;
}
public String getOutputFile()
{
  return fileOutput;
}
public String getCodeFile()
{
  return codeOutput;
}
public String getClassName()
{
  return className;
}
public boolean getTrace()
{
  return trace;
}
public boolean getSummary()
{
  return summary;
}
}
