import { Grammar } from "../Core/Grammar";

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
    this.grammar = grammar;
    this.tokenAdjacencyMatrix = ContextFreeGrammarAnalyzer.buildAdjacencyMatrix(grammar);
    this.tokenTransitiveClosureMatrix = ContextFreeGrammarAnalyzer.buildTransitiveClosureMatrix(grammar, this.tokenAdjacencyMatrix);
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

  private static buildTransitiveClosureMatrix(grammar : Grammar, adjacencyMatrix : TokenMatrix) : TokenMatrix
  {
    //Floyd Warshall Algorithm

    //Initialize Transitive Closure Matrix
    const transitiveClosureMatrix : TokenMatrix = ContextFreeGrammarAnalyzer.initializeTokenMatrix(grammar);
    for(const row in adjacencyMatrix)
    {
      for(const column in adjacencyMatrix)
      {
        transitiveClosureMatrix[row][column] = adjacencyMatrix[row][column];
      }
    }
    
    //Logic
    for(const intermidiateVertex in transitiveClosureMatrix)
    {
      for(const departureVertex in transitiveClosureMatrix)
      {
        if(transitiveClosureMatrix[departureVertex][intermidiateVertex])
        {
          for(const arrivalVertex in transitiveClosureMatrix)
          {
            transitiveClosureMatrix[departureVertex][arrivalVertex] = 
            transitiveClosureMatrix[departureVertex][arrivalVertex] || transitiveClosureMatrix[intermidiateVertex][arrivalVertex];
          }
        }
      }
    }

    return transitiveClosureMatrix;
  }

  public getTokenTransitiveClosureMatrix() : TokenMatrix
  {
    return this.tokenTransitiveClosureMatrix;
  }

  public grammarIsRecursive() : boolean
  {
    for(const token in this.tokenTransitiveClosureMatrix)
    {
      if(this.tokenTransitiveClosureMatrix[token][token] === true)
      {
        return true;
      }
    }
    return false;
  }

  public computeUnreachableTokens() : Array<string>
  {
    const startSymbol = this.grammar.getStartSymbol().toString();
    const unreachableTokens = [];
    for(const arrivalToken in this.tokenTransitiveClosureMatrix)
    {
      if(startSymbol !== arrivalToken && 
        !this.tokenTransitiveClosureMatrix[startSymbol][arrivalToken])
      {
        unreachableTokens.push(arrivalToken);
      }
    }
    
    return unreachableTokens;
  }

  public computeRecursiveTokens() : Array<string>
  {
    const recursiveTokens = [];
    for(const token in this.tokenTransitiveClosureMatrix)
    {
      if(this.tokenTransitiveClosureMatrix[token][token])
      {
        recursiveTokens.push(token);
      }
    }

    return recursiveTokens;
  }

  private readonly grammar : Grammar;
  private readonly tokenAdjacencyMatrix : TokenMatrix;
  private readonly tokenTransitiveClosureMatrix : TokenMatrix;
}

interface TokenMatrix
{
  [departureToken : string] : {[arrivalToken : string] : boolean};
}
