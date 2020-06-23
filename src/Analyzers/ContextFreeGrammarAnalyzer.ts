import { Grammar } from "../Core/Grammar";
import { TokenSort } from "../Core/TokenSortTable";
import { TokenString } from "../Core/TokenString";

/**
 * Class that analyzes and extract properties
 * of a given context free grammar, like
 * non productive tokens, unreachable rules
 * and etc.
 */
export class ContextFreeGrammarAnalyzer
{
  /**
   * Enforces class invariant, making sure that 
   * the grammar passed is actually context free.
   * 
   * @param grammar 
   */
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

  /**
   * Initializes a given token string from the
   * grammars TokenSortTable.
   * 
   * @param grammar 
   */
  private static initializeTokenMatrix(grammar : Grammar) : TokenMatrix
  {
    const tokenSortTable = grammar.getTokenSortTable();
    const tokenMatrix : TokenMatrix = {};
    for(const departureToken in tokenSortTable)
    {
      tokenMatrix[departureToken] = {};
      for(const arrivalToken in tokenSortTable)
      {
        tokenMatrix[departureToken][arrivalToken] = false;
      }
    }

    return tokenMatrix;
  }

  /**
   * Builds grammar's token adjacency matrix.
   * 
   * @param grammar 
   */
  private static buildAdjacencyMatrix(grammar : Grammar) : TokenMatrix
  {
    const rules = grammar.getRules();
    const adjacencyMatrix = ContextFreeGrammarAnalyzer.initializeTokenMatrix(grammar);

    for(const rule of rules)
    {
      const lhsToken = rule.getLhs().toString();
      for(const alternative of rule.getRhs())
      {
        for(let index = 0; index < alternative.size(); index++)
        {
          const alternativeToken = alternative.tokenAt(index).toString();
          adjacencyMatrix[lhsToken][alternativeToken] = true;
        }
      }
    }

    return adjacencyMatrix;
  }

  /**
   * Returns token adjacency matrix by value.
   */
  public getTokenAdjacencyMatrix() : TokenMatrix
  {
    return this.tokenAdjacencyMatrix;
  }

  /**
   * Build grammar's token reachability matrix.
   * 
   * @param grammar 
   * @param adjacencyMatrix 
   */
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

  /**
   * Returns token reachability matrix by value.
   */
  public getTokenReachabilityMatrix() : TokenMatrix
  {
    return this.tokenReachabilityMatrix;
  }

  /**
   * Returns whether the grammar in analysis 
   * has any recursive rules/non terminals, that is,
   * if any non terminal expands to a string containing itself.
   */
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

  /**
   * Returns a list of unreachable tokens,
   * that is, tokens that can never appear in any
   * production process.
   */
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

  /**
   * Returns a list of all recursive non terminals,
   * that is, non terminals whose rules (should one exist)
   * expand to a string containing itself.
   */
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

  /**
   * Returns a list of all non terminals that 
   * do not have rules associated with them 
   * and therefore cannot be expanded to anything.
   */
  public computeUndefinedNonTerminals() : Array<string>
  {
    const nonTerminals = this.grammar.listNonTerminals().map(nonTerminal => nonTerminal.toString());
    const rules = this.grammar.getRules();
    return nonTerminals.filter(nonTerminal => rules.every(rule => rule.getLhs().toString() !== nonTerminal));
  }

  /**
   * Returns a list of all non productive non 
   * terminals, that is, non terminals whose 
   * associated sub languages are empty.
   */
  public computeNonProductiveNonTerminals() : Array<string>
  {
    const tokenClassificationTable = this.classifyNonTerminalsProductivity();
    const tokenSortTable = this.grammar.getTokenSortTable();
    const nonProductiveNonTerminals = [];
    for(const token in tokenClassificationTable)
    {
      if(tokenSortTable[token] === TokenSort.NonTerminal && 
        tokenClassificationTable[token] === "NonProductive")
      {
        nonProductiveNonTerminals.push(token);
      }
    }

    return nonProductiveNonTerminals;
  } 

  private initializeTokenClassificationTable() : {[token : string] : string}
  {
    const tokenSortTable = this.grammar.getTokenSortTable();
    const tokenClassificationTable : {[token : string] : string} = {};
    //Initialize Classification Table
    for(const token in tokenSortTable)
    {
      if(tokenSortTable[token] === TokenSort.Terminal)
      {
        tokenClassificationTable[token] = "Productive";
      }
      else
      {
        tokenClassificationTable[token] = "Unclassified";
      }
    }
    return tokenClassificationTable;
  }

  private classifyAlternativeProductivity(alternative : TokenString, tokenClassificationTable : {[token : string] : string}) : string
  {
    if(alternative.every(token => tokenClassificationTable[token.toString()] === "Productive"))
    {
      return "Productive";
    }
    else if(alternative.some(token => tokenClassificationTable[token.toString()] === "NonProductive"))
    {
      return "NonProductive";
    }
    else if(alternative.isEmpty()) //Empty string is productive
    {
      return "Productive";
    }
    else //Not every token is productive, nor there is any non productive token, which means that there is at least one unclassified token and the rest are productive tokens
    {
      return "Unclassified";
    }
  }

  public classifyNonTerminalsProductivity() : {[token : string] : string}
  {
    const tokenClassificationTable = this.initializeTokenClassificationTable();
    const nonTerminals = this.grammar.listNonTerminals().map(token => token.toString());

    let unclassifiedNonTerminalsLeft;
    let hasNewInformation;
    do
    {
      unclassifiedNonTerminalsLeft = false;
      hasNewInformation = false;
      for(const nonTerminal of nonTerminals)
      {
        if(tokenClassificationTable[nonTerminal] === "Unclassified")
        {
          const tokenizedNonTerminal = TokenString.fromString(nonTerminal);
          const nonTerminalCorrespondingRule = this.grammar.queryRule(tokenizedNonTerminal);
          
          if(nonTerminalCorrespondingRule === undefined)
          {
            //Undefined non terminals are non productive
            tokenClassificationTable[nonTerminal] = "NonProductive";
            hasNewInformation = true;
          }
          else
          {
            const alternatives = nonTerminalCorrespondingRule.getRhs();
            if(alternatives.some(alternative => this.classifyAlternativeProductivity(alternative, tokenClassificationTable) === "Productive"))
            {
              tokenClassificationTable[nonTerminal] = "Productive";
              hasNewInformation = true;
            }
            else if(alternatives.every(alternative => this.classifyAlternativeProductivity(alternative, tokenClassificationTable) === "NonProductive"))
            {
              tokenClassificationTable[nonTerminal] = "NonProductive";
              hasNewInformation = true;
            }
            else
            {
              unclassifiedNonTerminalsLeft = true;
            }
          }
        }
      }
    } while(unclassifiedNonTerminalsLeft && hasNewInformation);

    for(const token in tokenClassificationTable)
    {
      if(tokenClassificationTable[token] === "Unclassified")
      {
        tokenClassificationTable[token] = "NonProductive";
      }
    }

    return tokenClassificationTable;
  }

  private readonly grammar : Grammar;
  private readonly tokenAdjacencyMatrix : TokenMatrix;
  private readonly tokenReachabilityMatrix : TokenMatrix;
}

/**
 * Represents a boolean matrix
 * where each row/column is a token.
 */
interface TokenMatrix
{
  [departureToken : string] : {[arrivalToken : string] : boolean};
}
