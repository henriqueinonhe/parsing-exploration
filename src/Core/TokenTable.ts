export enum TokenSort
{
  NonTerminal,
  Terminal
}

export interface TokenTable
{
  [tokenString : string] : TokenSort;
}
