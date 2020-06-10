export enum TokenSort
{
  NonTerminal,
  Terminal
}

export interface TokenSortTable
{
  [tokenString : string] : TokenSort;
}
