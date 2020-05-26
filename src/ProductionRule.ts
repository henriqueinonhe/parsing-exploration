import { TokenString } from "./TokenString";
import { Token } from "./Token";
import { Utils } from "./Utils";
import { TokenTable, TokenSort } from "./TokenTable";
import { ParsingException } from "./ParsingException";

export class ProductionRule
{
  private static validateLhs(lhs : TokenString) : void
  {
    if(lhs.isEmpty())
    {
      throw new Error("Left hand side of rule cannot be empty!");
    }
  }

  private static validateRhs(rhs : Array<TokenString>) : void
  {
    if(rhs.length === 0)
    {
      throw new Error("Right hand side of rule cannot be empty!");
    }
  }

  constructor(lhs : TokenString, rhs : Array<TokenString>)
  {
    ProductionRule.validateLhs(lhs);
    ProductionRule.validateRhs(rhs);
    const rhsWithoutDuplicates = Utils.removeArrayDuplicates(rhs, (tokenString1, tokenString2) => tokenString1.isEqual(tokenString2));

    this.lhs = lhs;
    this.rhs = rhsWithoutDuplicates;
  }

  public static fromString(lhs : string, rhs : Array<string>) : ProductionRule
  {
    const tokenizedLhs = TokenString.fromString(lhs);
    const tokenizedRhs = rhs.map(string => TokenString.fromString(string));
    return new ProductionRule(tokenizedLhs, tokenizedRhs);
  }
  
  public getLhs() : TokenString
  {
    return this.lhs;
  }

  public getRhs() : Array<TokenString>
  {
    return this.rhs;
  }

  public checkValidityWithinContext(tokenTable : TokenTable) : void
  {
    const missingTokens = [] as Array<Token>;
    for(const token of this.everyTokenList())
    {
      if(tokenTable[token.toString()] === undefined)
      {
        missingTokens.push(token);
      }
    }

    if(missingTokens.length !== 0)
    {
      throw new Error(`This rule is not valid in the context of the given token table, because the following tokens are occur in the rule but are absent from the table: "${missingTokens.map(token => token.toString()).join(`", "`)}"!`);
    }
  }

  /**
   * Returns a list without duplicates of every token present 
   * in lhs and rhs token lists.
   */
  public everyTokenList() : Array<Token>
  {
    //Maybe use a hash table to speed up things
    const tokenList = this.lhs.getTokenList().slice(); //Make copy

    for(const tokenString of this.rhs)
    {
      tokenList.push(... tokenString.getTokenList());
    }
    
    return Utils.removeArrayDuplicates(tokenList, (token1, token2) => token1.isEqual(token2));
  }

  public mergeRule(other : ProductionRule) : ProductionRule
  {
    if(!this.getLhs().isEqual(other.getLhs()))
    {
      throw new Error(`Cannot merge rules as their left hand sides differ!
      "${this.getLhs().toString()}" !== "${other.getLhs().toString()}"`);
    }

    const thisRhs = this.getRhs();
    const otherRhs = other.getRhs();
    const mergedRhs = [... thisRhs];
    for(const option of otherRhs)
    {
      if(mergedRhs.every(elem => !elem.isEqual(option)))
      {
        mergedRhs.push(option);
      }
    }
    return new ProductionRule(this.getLhs(), mergedRhs);
  }

  public isMonotonic(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.rhs.every(option => option.size() >= this.lhs.size());
  }

  //FIXME!
  public isERule(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.rhs.some(option => option.isEqual(TokenString.fromString("")));
  }

  public isContextFree(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.lhs.size() === 1 &&
           tokenTable[this.lhs.tokenAt(0).toString()] === TokenSort.NonTerminal;
  }

  public isRightRegular(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.isContextFree(tokenTable) &&
           this.rhs.every(option => option.slice(0, -1).every(token => tokenTable[token.toString()] === TokenSort.Terminal));
  }

  public isLeftRegular(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.isContextFree(tokenTable) &&
           this.rhs.every(option => option.slice(1).every(token => tokenTable[token.toString()] === TokenSort.Terminal));
  }

  public isContextSensitive(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    //Correct, but unoptimized version
    const lhs = this.lhs;
    for(const option of this.rhs)
    {
      let foundCorrectSubstitution = false;
      for(let index = 0; index < lhs.size() && index < option.size(); index++)
      {
        const currentLhsToken = lhs.tokenAt(index);
        if(tokenTable[currentLhsToken.toString()] === TokenSort.NonTerminal)
        {
          const oneAfterPivotIndex = index + 1;
          const leftContext = lhs.slice(0, index);
          const rightContext = lhs.slice(oneAfterPivotIndex);
          if(option.startsWith(leftContext) && 
             option.endsWith(rightContext))
          {
            foundCorrectSubstitution = true;
            break;
          }
        }
      }
      if(!foundCorrectSubstitution)
      {
        return false;
      }
    }

    return true && this.isMonotonic(tokenTable);

    //Optimized Version But Not Correct Yet
    // const lhs = this.lhs;
    // const rhs = this.rhs;
    // for(const option of rhs)
    // {
    //   //Must be monotonic
    //   if(lhs.size() > option.size())
    //   {
    //     return false;
    //   }

    //   const nonTerminalIndexes = [];
    //   let longestLeftContextSize = 0;
    //   let longestRightContextSize = 0; 
    //   for(let index = 0; index < lhs.size() - 1; index++)
    //   {
    //     const currentLhsToken = lhs.tokenAt(index);
    //     const currentOptionToken = option.tokenAt(index);
    //     if(tokenTable[currentLhsToken.toString()] === TokenSort.NonTerminal)
    //     {
    //       nonTerminalIndexes.push(index);
    //     }

    //     if(currentLhsToken.isEqual(currentOptionToken))
    //     {
    //       longestLeftContextSize++;
    //     }
    //     else
    //     {
    //       break;
    //     }
    //   }

    //   const rightmostScannedTokenIndex = longestLeftContextSize;
    //   for(let index = lhs.size() - 1; index > longestLeftContextSize; index--)
    //   {
    //     const currentLhsToken = lhs.tokenAt(index);
    //     const currentOptionToken = option.tokenAt(index);
    //     if(tokenTable[currentLhsToken.toString()] === TokenSort.NonTerminal)
    //     {
    //       nonTerminalIndexes.push(index);

    //     }
    //     if(currentLhsToken.isEqual(currentOptionToken))
    //     {
    //       longestRightContextSize++;
    //     }
    //     else
    //     {
    //       break;
    //     }
    //   }
    // }
  }

  private readonly lhs : TokenString;
  private readonly rhs : Array<TokenString>;
}

export class ProductionRuleParser
{
  // public static fromString(string : string) : ProductionRule
  // {
  //   const trimmedString = string.trim();
    
  //   if(trimmedString[0] !== `"`)
  //   {
  //     throw new ParsingException(`The first character is expected to be a '"' (quotation mark) that encloses the rule's left hand side token string!`, 0, 0, trimmedString);
  //   }

  //   const [lhsString, lhsRightQuotationMarkIndex] = this.extractQuotationMarkEnclosedSubstring(0, trimmedString);
  //   const rightArrowEndIndex = this.findRightArrowEndIndex(trimmedString, lhsRightQuotationMarkIndex + 1);
  
  //   //This is a very complex endeavor!
  //   let rhsStringList = [];
    

    
  // }

  // private static findQuotationMarkIndex(string : string, startIndex) : number
  // {

  // }

  /**
   * Finds the right arrow that separates
   * the rule's left and right hand sides begin index.
   * 
   * It is expected that this right arrow
   * is found right after the left hand side
   * "group", with possibly whitespace in the between.
   * 
   * Throws exception if it finds anything other than
   * whitespace before the right arrow or if
   * the right arrow is could not be found at all.
   * 
   * @param string 
   * @param startIndex 
   */
  private static findRightArrowBeginIndex(string : string, startIndex : number) : number
  {
    let index = startIndex;
    while(true)
    {
      if(index === string.length)
      {
        throw new ParsingException(`String ended prematurely at the place where "->" was expected!`, index - 1, index - 1, string);
      }
      else if(string[index] === " ")
      {
        index++;
      }
      else if(string[index] === "-")
      {
        const rightArrowEndIndex = index + 1;
        if(rightArrowEndIndex === string.length)
        {
          throw new ParsingException(`String ended prematurely at the place where "->" was expected!`, index, index, string);
        }
        else if(string[rightArrowEndIndex] === ">")
        {
          return index;
        }
        else
        {
          throw new ParsingException(`Found "${string[index]}${string[rightArrowEndIndex]}" where a "->" was expected!`, index, rightArrowEndIndex, string);
        }
      }
      else
      {
        throw new ParsingException(`Found "${string[index]}" where a "-" was expected!`, index, index, string);
      }
    }
  }

  /**
   * Returns the begin index of the first occurrence
   * of the substring in the searched string or throws an exception
   * if none was found.
   * 
   * @param whereString String in which the substring will be searched
   * @param findString Substring to be searched for
   * @param startIndex Index from which the search will begin in whereString
   */
  private static findSubstringBeginIndex(whereString : string, findString : string, startIndex = 0) : number
  {
    const matchedCharactersGoal = findString.length;
    let matchedCharactersCount = 0;

    let whereStringIndex = startIndex;
    let findStringIndex = 0;
    while(true)
    {
      if(whereStringIndex === whereString.length)
      {
        throw new ParsingException(`Couldn't find substring ${findString} from index ${startIndex}!`, startIndex, whereString.length - 1, whereString);
      }
      else if(whereString[whereStringIndex] === findString[findStringIndex])
      {
        matchedCharactersCount++;
        if(matchedCharactersCount === matchedCharactersGoal)
        {
          const substringBeginIndex = whereStringIndex - findString.length + 1;
          return substringBeginIndex;
        }

        findStringIndex++;
        whereStringIndex++;
      }
      else
      {
        findStringIndex = 0;
        matchedCharactersCount = 0;
        whereStringIndex++;
      }
    }
  }
}


