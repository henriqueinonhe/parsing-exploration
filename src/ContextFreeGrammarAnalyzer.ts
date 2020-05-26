import { Grammar } from "./Grammar";

export class ContextFreeGrammarAnalyzer
{
  private static validateGrammar(grammar : Grammar) : void
  {
    if(!grammar.isContextFree())
    {
      throw new Error("Given grammar is not context free!");
    }
  }

  constructor(grammar : Grammar)
  {
    ContextFreeGrammarAnalyzer.validateGrammar(grammar);
    this.tokenAdjacencyMatrix = ContextFreeGrammarAnalyzer.buildAdjacencyMatrix(grammar);
  }

  private static initializeTokenMatrix(grammar : Grammar) : TokenMatrix
  {
    const tokenTable = grammar.getTokenTable();
    const tokenMatrix : TokenMatrix = {};
    for(const departureToken in tokenTable)
    {
      tokenMatrix[departureToken] = {};
      for(const arrivalToken in tokenTable)
      {
        tokenMatrix[departureToken][arrivalToken] = false;
      }
    }

    return tokenMatrix;
  }

  private static buildAdjacencyMatrix(grammar : Grammar) : TokenMatrix
  {
    const rules = grammar.getRules();
    const adjacencyMatrix = ContextFreeGrammarAnalyzer.initializeTokenMatrix(grammar);

    for(const rule of rules)
    {
      const lhsToken = rule.getLhs().toString();
      for(const option of rule.getRhs())
      {
        for(let index = 0; index < option.size(); index++)
        {
          const optionToken = option.tokenAt(index).toString();
          adjacencyMatrix[lhsToken][optionToken] = true;
        }
      }
    }

    return adjacencyMatrix;
  }

  public getTokenAdjacencyMatrix() : TokenMatrix
  {
    return this.tokenAdjacencyMatrix;
  }

  private static buildTransitiveClosureMatrix(adjacencyMatrix : TokenMatrix) : TokenMatrix
  {
    const visitedTokens = [];
  }

  private tokenAdjacencyMatrix : TokenMatrix;
  private tokenTransitiveClosureMatrix : TokenMatrix;
}

interface TokenMatrix
{
  [departureToken : string] : {[arrivalToken : string] : boolean};
}