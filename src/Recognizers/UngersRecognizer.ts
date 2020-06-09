import { Grammar } from "../Core/Grammar";
import { TokenString } from "../Core/TokenString";
import { TokenSort } from "../Core/TokenTable";
import { Utils } from "../Core/Utils";

/**
 * General undirectional context free
 * recognizer.
 * Works on any context free grammar, without
 * constraints.
 * 
 */
export class UngersRecognizer
{
  constructor(grammar : Grammar)
  {
    this.grammar = grammar;
  }

  public recognizes(inputString : TokenString) : boolean
  {
    const startSymbol = this.grammar.getStartSymbol();
    return this.matchSentence(new TokenString([startSymbol]), inputString);
  }
  
  private matchSentence(matchSentence : TokenString, inputSubstring : TokenString) : boolean
  {
    //Try to prune tree as much as possible with some
    //checks.
    const numberOfGroups = matchSentence.size();
    if(numberOfGroups > inputSubstring.size())
    {
      return false;
    }
    else if(!this.matchSentenceBeginning(matchSentence, inputSubstring) ||
    !this.matchSentenceEnd(matchSentence, inputSubstring))
    {
      return false;
    }
    else if(!this.matchSentenceTerminals(matchSentence, inputSubstring))
    {
      return false;
    }
    
    //Generate partitions over sentence tokens
    const partitions = Utils.listPartitions(inputSubstring.getTokenList(), numberOfGroups, true);

    //Try to match the rest
    return partitions.some(partition =>
    {
      return partition.every((inputSubstringTokenList, index) => 
      {
        return this.matchToken(new TokenString([matchSentence.tokenAt(index)]), new TokenString(inputSubstringTokenList));
      });
    });
  }

  private matchToken(token : TokenString, inputSubstring : TokenString) : boolean
  {
    const tokenTable = this.grammar.getTokenTable();
    if(tokenTable[token.toString()] === TokenSort.Terminal)
    {
      return token.isEqual(inputSubstring);
    }
    else
    {
      const correspondingRule = this.grammar.queryRule(token);
      if(correspondingRule === undefined)
      {
        return false;
      }
      else
      {
        const rhs = correspondingRule.getRhs();
        return rhs.some(option => this.matchSentence(option, inputSubstring));
      }
    }
  }

  private matchSentenceBeginning(sentence : TokenString, inputSubstring : TokenString) : boolean
  {
    const tokenTable = this.grammar.getTokenTable();
    let index = 0;
    while(index < sentence.size() &&
          tokenTable[sentence.tokenAt(index).toString()] === TokenSort.Terminal)
    {
      index++;
    }

    return inputSubstring.startsWith(sentence.slice(0, index));
  }

  private matchSentenceEnd(sentence : TokenString, inputSubstring : TokenString) : boolean
  {
    const tokenTable = this.grammar.getTokenTable();
    let index = sentence.size() - 1;
    while(index >= 0 &&
          tokenTable[sentence.tokenAt(index).toString()] === TokenSort.Terminal)
    {
      index--;
    }

    return inputSubstring.endsWith(sentence.slice(index + 1));
  }

  private matchSentenceTerminals(sentence : TokenString, inputSubstring : TokenString) : boolean
  {
    const tokenTable = this.grammar.getTokenTable();
    const sententialFormTerminalCountTable : {[key : string] : number} = {};
    for(let index = 0; index < sentence.size(); index++)
    {
      const currentToken = sentence.tokenAt(index);
      if(tokenTable[currentToken.toString()] === TokenSort.Terminal)
      {
        const currentTerminalCount = sententialFormTerminalCountTable[currentToken.toString()];
        if(currentTerminalCount === undefined)
        {
          sententialFormTerminalCountTable[currentToken.toString()] = 1;
        }
        else
        {
          sententialFormTerminalCountTable[currentToken.toString()]++;
        }
      }
    }

    const inputSubstringTerminalCountTable : {[key : string] : number} = {};
    for(let index = 0; index < inputSubstring.size(); index++)
    {
      const currentToken = inputSubstring.tokenAt(index);
      if(tokenTable[currentToken.toString()] === TokenSort.Terminal)
      {
        const currentTerminalCount = inputSubstringTerminalCountTable[currentToken.toString()];
        if(currentTerminalCount === undefined)
        {
          inputSubstringTerminalCountTable[currentToken.toString()] = 1;
        }
        else
        {
          inputSubstringTerminalCountTable[currentToken.toString()]++;
        }
      }
    }

    for(const currentSententialFormTerminalString in sententialFormTerminalCountTable)
    {
      const currentSententialFormTerminalCount = sententialFormTerminalCountTable[currentSententialFormTerminalString];
      const currentInputSubstringTerminalCount = inputSubstringTerminalCountTable[currentSententialFormTerminalString];

      if(currentInputSubstringTerminalCount === undefined ||
         currentSententialFormTerminalCount > currentInputSubstringTerminalCount)
      {
        return false;
      }
    }

    return true;
  }

  private grammar : Grammar;
}