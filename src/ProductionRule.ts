/**
 * File Status
 * Refactoring: MEDIUM
 * Documentation: HIGH
 * Testing: HIGH
 * 
 */

import { TokenString } from "./TokenString";
import { Token } from "./Token";
import { Utils } from "./Utils";
import { TokenTable, TokenSort } from "./TokenTable";
import { ParsingException } from "./ParsingException";

/**
 * Represents a production rule that will
 * be incorporated by a grammar.
 * 
 * Production rules are composed by a left hand side
 * and a right hand side, where the left hand side
 * represents the [[TokenString]] to be substituted and
 * the right hand side represents the [[TokenString]] 
 * options that will substitute the left hand side string.
 */
export class ProductionRule
{
  /**
   * Enforces class invariant.
   * The only lhs restriction is that it cannot be empty.
   * 
   * @param lhs 
   */
  private static validateLhs(lhs : TokenString) : void
  {
    if(lhs.isEmpty())
    {
      throw new Error("Left hand side of rule cannot be empty!");
    }
  }

  /**
   * Enforces class invariant.
   * The only rhs restriction is that it cannot be empty,
   * that is, it must contain at least one option.
   * 
   * @param rhs 
   */
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

  /**
   * Alternative constructor that uses strings
   * to build the ProductionRule, instead of
   * [[TokenString]]s.
   * 
   * @param lhs 
   * @param rhs 
   */
  public static fromString(lhs : string, rhs : Array<string>) : ProductionRule
  {
    const tokenizedLhs = TokenString.fromString(lhs);
    const tokenizedRhs = rhs.map(string => TokenString.fromString(string));
    return new ProductionRule(tokenizedLhs, tokenizedRhs);
  }
  
  /**
   * Returns left hand side [[TokenString]] by value.
   */
  public getLhs() : TokenString
  {
    return this.lhs.clone();
  }

  /**
   * Sets left hand side [[TokenString]].
   * @param lhs 
   */
  public setLhs(lhs : TokenString) : void
  {
    ProductionRule.validateLhs(lhs);
    this.lhs = lhs;
  }

  /**
   * Returns right hand side [[TokenString]] array by value.
   */
  public getRhs() : Array<TokenString>
  {
    return Utils.cloneArray(this.rhs);
  }

  /**
   * Sets right hand side [[TokenString]] array.
   * @param rhs 
   */
  public setRhs(rhs : Array<TokenString>) : void
  {
    ProductionRule.validateRhs(rhs);
    Utils.removeArrayDuplicates(rhs, (tokenString1, tokenString2) => tokenString1.isEqual(tokenString2));
    this.rhs = rhs;
  }

  /**
   * Given a [[TokenTable]] as a contexts,
   * check the validity of the production rule,
   * that is, every token that occurs in
   * the productionrule must be present in the
   * table either as a terminal or as a non terminal.
   * 
   * Throws an exception listing the missing tokens.
   * 
   * @param tokenTable 
   */
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
   * in lhs and rhs token strings.
   */
  public everyTokenList() : Array<Token>
  {
    //Maybe use a hash table to speed up things
    const tokenList = this.lhs.getTokenList(); 
    for(const tokenString of this.rhs)
    {
      tokenList.push(... tokenString.getTokenList());
    }
    
    return Utils.removeArrayDuplicates(tokenList, (token1, token2) => token1.isEqual(token2));
  }

  /**
   * Merge rules with the same left hand side such
   * that the right hand side of both rules are fused
   * together like set union, that is, if there are duplicates
   * only a single instance is present in the merged rule.
   * 
   * @param other 
   */
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

  /**
   * Returns whether the rule is monotonic, that is, 
   * if the size of all options in the right hand side is
   * greater or equal than the size of the left hand side.
   * 
   * @param tokenTable 
   */
  public isMonotonic(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.rhs.every(option => option.size() >= this.lhs.size());
  }

  /**
   * Returns whether any of the right hand side
   * options is an empty string.
   * 
   * @param tokenTable 
   */
  public isERule(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.rhs.some(option => option.isEqual(TokenString.fromString("")));
  }

  /**
   * Returns whether the rule is context free, that is,
   * its left hand side consists of a single token.
   * 
   * @param tokenTable 
   */
  public isContextFree(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.lhs.size() === 1 &&
           tokenTable[this.lhs.tokenAt(0).toString()] === TokenSort.NonTerminal;
  }

  /**
   * Returns whether the rule is right regular, that is,
   * the left hand side consists of a single token
   * and every right hand side option is composed
   * solely by terminals and optionally a single non terminal
   * that occurs at the end of the string.
   * 
   * @param tokenTable 
   */
  public isRightRegular(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.isContextFree(tokenTable) &&
           this.rhs.every(option => option.slice(0, -1).every(token => tokenTable[token.toString()] === TokenSort.Terminal));
  }

  /**
   * Returns whether the rule is left regular, that is,
   * the left hand side consists of a single token
   * and every right hand side option is composed
   * solely by terminals and optionally a single non terminal
   * that occurs at the beginning of the string.
   * 
   * @param tokenTable 
   */
  public isLeftRegular(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.isContextFree(tokenTable) &&
           this.rhs.every(option => option.slice(1).every(token => tokenTable[token.toString()] === TokenSort.Terminal));
  }

  /**
   * Returns whether the rule is context sensitive,
   * that is, the left hand side consists of 
   * a possibly empty sequence of terminals/non terminals
   * followed by a mandatory non terminal and then again
   * followed by another possibly empty sequence of 
   * terminals/non terminals, where every option 
   * of the right hand side consists of the same 
   * sequences that "sandwich" the mandatory non terminal
   * and this mandatory non terminal substituted by
   * anything other than the empty string (must be monotonic).
   * 
   * @param tokenTable 
   */
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
  }

  /**
   * Deep copy.
   */
  public clone() : ProductionRule
  {
    const lhs = this.lhs.toString();
    const rhs = this.rhs.map(tokenString => tokenString.toString());
    return ProductionRule.fromString(lhs, rhs);
  }

  /**
   * Deep Equality
   * @param other 
   */
  public isEqual(other : ProductionRule) : boolean
  {
    return other instanceof ProductionRule &&
           this.lhs.isEqual(other.getLhs()) &&
           this.getRhs().every((option, index) => option.isEqual(other.getRhs()[index]));
  }

  private lhs : TokenString;
  private rhs : Array<TokenString>;
}

//This is not crucial right now so it will be postponed
export class ProductionRuleParser
{
  // public static fromString(string : string) : ProductionRule
  // {
  //   const trimmedString = string.trim();
    
  //   if(trimmedString[0] !== `"`)
  //   {
  //     throw new ParsingException(`The first character is expected to be a '"' (quotation mark) that encloses the rule's left hand side token string!`, 0, 0, trimmedString);
  //   }

  //   const lhsRightQuotationMarkIndex = ProductionRuleParser.findSubstringBeginIndex(string, "\"", 1)
    

    
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


