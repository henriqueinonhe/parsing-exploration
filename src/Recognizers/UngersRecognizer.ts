import { Grammar } from "../Core/Grammar";
import { TokenString } from "../Core/TokenString";
import { TokenSort } from "../Core/TokenSortTable";
import { Utils } from "../Core/Utils";

enum MatchTableEntryValue
{
  Match,
  NoMatch,
  Trying
}

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
    //Initialize Match Table
    const tokenSortTable = this.grammar.getTokenSortTable();
    const matchTable = {} as MatchTable;
    for(const token in tokenSortTable)
    {
      matchTable[token] = {};
    }

    const startSymbol = this.grammar.getStartSymbol();
    return this.matchSentence(new TokenString([startSymbol]), inputString, matchTable);
  }
  
  private matchSentence(matchSentence : TokenString, inputSubstring : TokenString, matchTable : MatchTable) : boolean
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
        return this.matchToken(new TokenString([matchSentence.tokenAt(index)]), new TokenString(inputSubstringTokenList), matchTable);
      });
    });
  }

  private matchToken(token : TokenString, inputSubstring : TokenString, matchTable : MatchTable) : boolean
  {
    const tokenSortTable = this.grammar.getTokenSortTable();
    if(tokenSortTable[token.toString()] === TokenSort.Terminal)
    {
      return token.isEqual(inputSubstring);
    }
    else //Non Terminal
    {
      const matchTableEntryValue = matchTable[token.toString()][inputSubstring.toString()];
      if(matchTableEntryValue === undefined)
      {
        const correspondingRule = this.grammar.queryRule(token);
        if(correspondingRule === undefined)
        {
          matchTable[token.toString()][inputSubstring.toString()] = MatchTableEntryValue.NoMatch;
          return false;
        }
        else
        {
          matchTable[token.toString()][inputSubstring.toString()] = MatchTableEntryValue.Trying;
          const rhs = correspondingRule.getRhs();
          const anyOptionMatch = rhs.some(option => this.matchSentence(option, inputSubstring, matchTable));
          
          matchTable[token.toString()][inputSubstring.toString()] = anyOptionMatch ? MatchTableEntryValue.Match : MatchTableEntryValue.NoMatch;
          return anyOptionMatch;
        }
      }
      else if(matchTableEntryValue === MatchTableEntryValue.Match)
      {
        return true;
      }
      else if(matchTableEntryValue === MatchTableEntryValue.NoMatch)
      {
        return false;
      }
      else //if (matchTableEntryValue === MatchTableEntryValue.Trying)
      {
        //This addresses loops and E rules
        matchTable[token.toString()][inputSubstring.toString()] = MatchTableEntryValue.NoMatch;
        return false;
      }
    }
  }

  private matchSentenceBeginning(sentence : TokenString, inputSubstring : TokenString) : boolean
  {
    const tokenSortTable = this.grammar.getTokenSortTable();
    let index = 0;
    while(index < sentence.size() &&
          tokenSortTable[sentence.tokenAt(index).toString()] === TokenSort.Terminal)
    {
      index++;
    }

    return inputSubstring.startsWith(sentence.slice(0, index));
  }

  private matchSentenceEnd(sentence : TokenString, inputSubstring : TokenString) : boolean
  {
    const tokenSortTable = this.grammar.getTokenSortTable();
    let index = sentence.size() - 1;
    while(index >= 0 &&
          tokenSortTable[sentence.tokenAt(index).toString()] === TokenSort.Terminal)
    {
      index--;
    }

    return inputSubstring.endsWith(sentence.slice(index + 1));
  }

  private matchSentenceTerminals(sentence : TokenString, inputSubstring : TokenString) : boolean
  {
    const tokenSortTable = this.grammar.getTokenSortTable();
    const sententialFormTerminalCountTable : {[key : string] : number} = {};
    for(let index = 0; index < sentence.size(); index++)
    {
      const currentToken = sentence.tokenAt(index);
      if(tokenSortTable[currentToken.toString()] === TokenSort.Terminal)
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
      if(tokenSortTable[currentToken.toString()] === TokenSort.Terminal)
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



interface MatchTable 
{
  [token : string] : {[tokenString : string] : MatchTableEntryValue};
}