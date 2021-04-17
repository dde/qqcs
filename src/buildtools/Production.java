package buildtools;

import java.util.ArrayList;

public class Production
{
  private static int sequence = -1;
  Symbol left;
  Symbol[] right;
  int index;
Production(ArrayList<Symbol> prd)
{
  int ix, ln;
  this.index = ++sequence;
  left = prd.get(0);
  ln = prd.size();
  right = new Symbol[ln - 2];
  for (ix = 2; ix < ln; ++ix)
  {
    right[ix - 2] = prd.get(ix);
  }
}
Symbol
get(int idx)
{
  if (idx < 0)
    throw new IllegalArgumentException();
  if (0 == idx)
    return left;
  if (idx > right.length)
    return null;
  return right[idx - 1];
}
Symbol
getLast()
{
  int idx;
  idx = right.length;
  if (0 == idx)
    return null;
  return right[idx - 1];
}
public String toString()
{
  StringBuilder sb = new StringBuilder();
  int ct = 0;
  sb.append(String.format("%d ", index));
  sb.append(left.getToken());
  sb.append(" ->");
  for (Symbol sym : right)
  {
    if (ct > 0)
    {
      ct -= 1;
      continue;
    }
    if (Category.colon == sym.getCategory())
    {
      ct = 3;
      continue;
    }
    sb.append(" ");
    sb.append(sym.toString());
  }
  return sb.toString();
}
Symbol
getLeft()
{
  return left;
}
Symbol[]
getRight()
{
  return right;
}
boolean producesEmpty()
{
  return 0 == right.length;
}
boolean producesEmpty(int st)
{
  Symbol sym;
  sym = get(st);
  while (null != sym)
  {
    if (!sym.isNullable())
      return false;
    sym = get(++st);
  }
  return true;
}
public int
getIndex()
{
  return index;
}
}
