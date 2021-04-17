package buildtools;

/**
 * Created by danevans on 12/4/16.
 */
public class LexErr extends ParseException
{
  private static final long serialVersionUID = 770000000003L;

public LexErr(String msg, String sym, int line, int pos) {
    super(msg + sym + " at line " + line + " position " + pos);
  }
public LexErr(String msg, char sym, int line, int pos) {
    super(msg + sym + " at line " + line + " position " + pos);
  }
}
