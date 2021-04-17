package buildtools;

public enum Category
{
  none,
  empty,
  eol,
  sym,
  equal,
  comma,
  lbrac,
  rbrac,
  colon,
  tilde,
  code;
private static final String[] tokens = {
    "none",
    "$",
    "eol",
    "sym",
    "=",
    ",",
    "[",
    "]",
    ":",
    "~",
    "@"
};
public String toString()
{
  return tokens[this.ordinal()];
}
}
