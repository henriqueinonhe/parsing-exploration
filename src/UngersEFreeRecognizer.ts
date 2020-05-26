import { Grammar } from "./Grammar";
import { TokenString } from "./TokenString";
import { listPartitions } from "./Debug";
import { TokenSort } from "./TokenTable";

export class UngersEFreeRecognizer
{
  constructor(grammar : Grammar)
  {
    this.grammar = grammar;
  }

  public recognizes(inputString : TokenString) : boolean
  {
    const startSymbol = this.grammar.getStartSymbol();
    return this.matchSententialForm(new TokenString([startSymbol]), inputString);
  }
  
  private matchSententialForm(sententialForm : TokenString, inputSubstring : TokenString) : boolean
  {
    //Generate partitions over sentential form tokens
    const numberOfGroups = sententialForm.size();
    if(numberOfGroups > inputSubstring.size())
    {
      return false;
    }
    else if(!this.matchSententialFormBeginning(sententialForm, inputSubstring) ||
            !this.matchSententialFormEnd(sententialForm, inputSubstring))
    {
      return false;
    }
    else if(!this.matchSenentialFormTerminals(sententialForm, inputSubstring))
    {
      return false;
    }

    const partitions = listPartitions(inputSubstring.getTokenList(), numberOfGroups);

    //Try to match the rest
    return partitions.some(partition =>
    {
      return partition.every((inputSubstringTokenList, index) => 
      {
        return this.matchToken(new TokenString([sententialForm.tokenAt(index)]), new TokenString(inputSubstringTokenList));
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
        return rhs.some(option => this.matchSententialForm(option, inputSubstring));
      }
    }
  }

  private matchSententialFormBeginning(sententialForm : TokenString, inputSubstring : TokenString) : boolean
  {
    const tokenTable = this.grammar.getTokenTable();
    let index = 0;
    while(index < sententialForm.size() &&
          tokenTable[sententialForm.tokenAt(index).toString()] === TokenSort.Terminal)
    {
      index++;
    }

    return inputSubstring.startsWith(sententialForm.slice(0, index));
  }

  private matchSententialFormEnd(sententialForm : TokenString, inputSubstring : TokenString) : boolean
  {
    const tokenTable = this.grammar.getTokenTable();
    let index = sententialForm.size() - 1;
    while(index >= 0 &&
          tokenTable[sententialForm.tokenAt(index).toString()] === TokenSort.Terminal)
    {
      index--;
    }

    return inputSubstring.endsWith(sententialForm.slice(index + 1));
  }

  private matchSenentialFormTerminals(sententialForm : TokenString, inputSubstring : TokenString) : boolean
  {
    const tokenTable = this.grammar.getTokenTable();
    const sententialFormTerminalCountTable : {[key : string] : number} = {};
    for(let index = 0; index < sententialForm.size(); index++)
    {
      const currentToken = sententialForm.tokenAt(index);
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