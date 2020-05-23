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

  private grammar : Grammar;
}