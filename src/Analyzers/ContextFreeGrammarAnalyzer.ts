import { Grammar } from "../Core/Grammar";
import { TokenSort } from "../Core/TokenTable";
import { TokenString } from "../Core/TokenString";

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
    this.tokenReachabilityMatrix = ContextFreeGrammarAnalyzer.buildReachabilityMatrix(grammar, this.tokenAdjacencyMatrix);
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

  private static buildReachabilityMatrix(grammar : Grammar, adjacencyMatrix : TokenMatrix) : TokenMatrix
  {
    //Floyd Warshall Algorithm

    //Initialize Reachability Matrix
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

  public getTokenReachabilityMatrix() : TokenMatrix
  {
    return this.tokenReachabilityMatrix;
  }

  public grammarIsRecursive() : boolean
  {
    for(const token in this.tokenReachabilityMatrix)
    {
      if(this.tokenReachabilityMatrix[token][token] === true)
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
    for(const arrivalToken in this.tokenReachabilityMatrix)
    {
      if(startSymbol !== arrivalToken && 
        !this.tokenReachabilityMatrix[startSymbol][arrivalToken])
      {
        unreachableTokens.push(arrivalToken);
      }
    }
    
    return unreachableTokens;
  }

  public computeRecursiveTokens() : Array<string>
  {
    const recursiveTokens = [];
    for(const token in this.tokenReachabilityMatrix)
    {
      if(this.tokenReachabilityMatrix[token][token])
      {
        recursiveTokens.push(token);
      }
    }

    return recursiveTokens;
  }

  public computeUndefinedNonTerminals() : Array<string>
  {
    const nonTerminals = this.grammar.listNonTerminals().map(nonTerminal => nonTerminal.toString());
    const rules = this.grammar.getRules();
    return nonTerminals.filter(nonTerminal => rules.every(rule => rule.getLhs().toString() !== nonTerminal));
  }

  public computeNonProductiveNonTerminals() : Array<string>
  {
    const tokenTable = this.grammar.getTokenTable();
    const nonTerminals = this.grammar.listNonTerminals().map(nonTerminal => nonTerminal.toString());
    const nonTerminalsTable : {[nonTerminal : string] : string} = {};

    //Compute
    let noUnclassifiedNonTerminalsLeft = true;
    do
    {
      for(const nonTerminal in nonTerminalsTable)
      {
        if(nonTerminalsTable[nonTerminal] !== undefined)
        {
          //Try to Analyze
          const tokenizedNonTerminal = TokenString.fromString(nonTerminal);
          const nonTerminalCorrespondingRule = this.grammar.queryRule(tokenizedNonTerminal);
          
          //Unreachable Non Terminals are Non Productive as well
          if(nonTerminalCorrespondingRule === undefined)
          {
            nonTerminalsTable[nonTerminal] = "NonProductive";
          }
          else
          {
            //Core Part
            for(const option of nonTerminalCorrespondingRule.getRhs())
            {
              for(const token of option.getTokenList())
              {
                if(nonTerminalsTable[token.toString()] === "NonProductive")
                {
                  nonTerminalsTable[nonTerminal] = "NonProductive";
                }
              }
            }
          }
        }
        else //Already Classified Rules
        {
          continue;
        }
      }
    } while(!noUnclassifiedNonTerminalsLeft);
  } 

  private readonly grammar : Grammar;
  private readonly tokenAdjacencyMatrix : TokenMatrix;
  private readonly tokenReachabilityMatrix : TokenMatrix;
}

interface TokenMatrix
{
  [departureToken : string] : {[arrivalToken : string] : boolean};
}
