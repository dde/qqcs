package buildtools;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

public class Symbol implements Iterable<Production>
{
  static int seq = -1;
  Category category;
  String token;
  String name;
  int sequence;
  boolean quote;
  boolean nullable;
  boolean terminal;
  boolean keyword;

  Set<Symbol> first = new HashSet<>();
  Set<Symbol> follow = new HashSet<>();
  List<ProdMeta> appearances = new ArrayList<>();

Symbol(Category cat, String tkn, boolean qt)
{
  this.category = cat;
  this.token = tkn;
  this.quote = qt;
  this.sequence = ++seq;
}
Symbol(Category cat, String tkn)
{
  this(cat, tkn, false);
}
Symbol(Category cat)
{
  this(cat, cat.toString(), false);
}
void addProduction(Production prd, int pos)
{
  appearances.add(new ProdMeta(prd, pos));
}
public Category getCategory()
{
  return category;
}
public List<ProdMeta> getAppearances()
{
  return appearances;
}
public int getAppearanceCount()
{
  return appearances.size();
}
public String getToken()
{
  return token;
}
public boolean
isNullable()
{
  return nullable;
}
public void
setNullable(final boolean nul)
{
  this.nullable = nul;
}
public String toString()
{
  if (quote)
    return '\'' + token + '\'';
  return token;
}
public Set<Symbol> getFirst()
{
  return first;
}
public void setFirst(Symbol frst)
{
  first.add(frst);
}
public Set<Symbol> getFollow()
{
  return follow;
}
public void setFollow(Symbol flw)
{
  follow.add(flw);
}
public boolean isTerminal()
{
  return terminal;
}
public void setTerminal(final boolean trm)
{
  this.terminal = trm;
}
public String getName()
{
  return name;
}
public void setName(final String name)
{
  if ("key".equals(name))
  {
    keyword = true;
    this.name = this.token;
  }
  else
  {
    this.name = name;
  }
}
public boolean isKeyword()
{
  return keyword;
}
static Comparator<Symbol>
getComparator()
{
  return new SymbolOrder();
}
@Override
public Iterator<Production> iterator()
{
  return new LeftIterator();
}
private class LeftIterator implements Iterator<Production>
{
  int sz;
  int nx;
  LeftIterator()
  {
    sz = appearances.size();
    nx = 0;
  }
  @Override
  public Production next()
  {
    ProdMeta meta;
    if (nx >= sz)
      throw new NoSuchElementException();
    meta = appearances.get(nx++);
    return meta.prod;
  }
  @Override
  public boolean hasNext()
  {
    ProdMeta meta;
    if (nx >= sz)
      return false;
    meta = appearances.get(nx);
    while (0 != meta.pos)
    {
      if (++nx >= sz)
        return false;
      meta = appearances.get(nx);
    }
    return true;
  }
}
static class ProdMeta
{
  final Production prod;
  final int pos;
  ProdMeta(Production prod, int pos)
  {
    this.prod = prod;
    this.pos = pos;
  }
  public Production getProduction()
  {
    return prod;
  }
  public int getPosition()
  {
    return pos;
  }
}
static class SymbolOrder implements Comparator<Symbol>
{
  @Override
  public int compare(final Symbol left, final Symbol right)
  {
    return Integer.compare(left.sequence, right.sequence);
  }
}
}
