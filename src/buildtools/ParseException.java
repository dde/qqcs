package buildtools;

/**
 * Created by danevans on 12/5/16.
 */
public class ParseException extends Exception
{
  private static final long serialVersionUID = 770000000001L;
  ParseException()
  {
  }
  ParseException(String msg)
  {
    super(msg);
  }
}
