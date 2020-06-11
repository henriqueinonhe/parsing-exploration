import { Grammar } from "../Core/Grammar";
import { TokenString } from "../Core/TokenString";
import { Utils } from "../Core/Utils";
import { Token } from "../Core/Token";
import { TokenSort } from "../Core/TokenSortTable";

type Partition = Array<Array<Token>>;

export class CYKRecognizer
{
  constructor(grammar : Grammar)
  {
    if(!grammar.isContextFree())
    {
      throw new Error("CYK Recognizer only works on context free grammars and the grammar passed is NOT context free!");
    }

    this.grammar = grammar;
  }

  public recognizes(inputString : TokenString) : boolean
  {
    const table = this.buildTable(inputString);
    const startSymbol = this.grammar.getStartSymbol().toString();
    return table[inputString.size()][0].has(startSymbol);
  }

  private initializeTable(inputString : TokenString) : CYKTable
  {
    const table : CYKTable = {};
    for(let substringLength = 0; substringLength <= inputString.size(); substringLength++)
    {
      table[substringLength] = {};
      const maxStartIndex = inputString.size() - substringLength;
      for(let startIndex = 0; startIndex <= maxStartIndex; startIndex++)
      {
        table[substringLength][startIndex] = new Set<string>();
      }
    }
    return table;
  }

  public buildTable(inputString : TokenString) : CYKTable
  {
    const table = this.initializeTable(inputString);

    //Empty String Row
    this.fillEmptyStringRow(inputString.size(), table);
    
    //Rest of the rows
    const rules = this.grammar.getRules();
    for(let substringLength = 1; substringLength <= inputString.size(); substringLength++)
    {
      const maxStartIndex = inputString.size() - substringLength;
      for(let startIndex = 0; startIndex <= maxStartIndex; startIndex++)
      {
        const endIndex = startIndex + substringLength;
        const substring = inputString.slice(startIndex, endIndex);
        let hasNewInformation : boolean;
        do
        {
          hasNewInformation = false;
          for(const rule of rules)
          {
            const currentRuleLhsNonTerminal = rule.getLhs().toString();

            //In subsequent passes of the algorithm due to
            //new information, this conditional 
            //makes sure it won't be stuck forever in the loop
            if(table[substringLength][startIndex].has(currentRuleLhsNonTerminal))
            {
              continue;
            }

            for(const option of rule.getRhs())
            {
              //Cannot list partitions of empty string
              if(option.isEmpty())
              {
                continue;
              }

              const partitions = Utils.listPartitions(substring.getTokenList(), option.size(), true);
              for(const partition of partitions)
              {
                const groupStartIndexListInRespectToInputString = this.generatePartitionGroupsStartIndexListInRespectToInputString(startIndex, partition);
  
                if(this.optionAdheresToPartition(option, partition, table, groupStartIndexListInRespectToInputString))
                {
                  table[substringLength][startIndex].add(currentRuleLhsNonTerminal);
                  hasNewInformation = true;
                }
              }
            }
          } 
        } while(hasNewInformation);
      }
    }
    return table;
  }

  private optionDerivesEmptyString(option : TokenString, table : CYKTable) : boolean
  {
    return option.isEqual(TokenString.fromString("")) ||
           option.every(token => table[0][0].has(token.toString()));
  }

  private fillEmptyStringRow(inputStringSize : number, /*out*/ table : CYKTable) : void
  {
    //Empty String
    const rules = this.grammar.getRules();
    let hasNewInformation : boolean;
    do
    {
      hasNewInformation = false;
      for(const rule of rules)
      {
        const ruleLhsNonTerminal = rule.getLhs().tokenAt(0).toString();
        if(table[0][0].has(ruleLhsNonTerminal))
        {
          continue;
        }

        const options = rule.getRhs();
        for(const option of options)
        {
          if(this.optionDerivesEmptyString(option, table))
          {
            for(let startIndex = 0; startIndex <= inputStringSize; startIndex++)
            {
              //Adds non terminal to every index, since 
              //as we're dealing with the empty string,
              //it really applies to any index.
              table[0][startIndex].add(ruleLhsNonTerminal);
            }
            hasNewInformation = true;
          }
        }
      }
    } while(hasNewInformation);
  }

  private generatePartitionGroupsStartIndexListInRespectToInputString(inputStringStartIndex : number, partition : Partition) : Array<number>
  {
    const indexList = [inputStringStartIndex];
    for(const group of partition)
    {
      indexList.push(indexList[indexList.length - 1] + group.length);
    }
    return indexList;
  }

  private optionAdheresToPartition(option : TokenString, partition : Partition, table : CYKTable, groupStartIndexListInRespectToInputString : Array<number>) : boolean
  {
    return partition.every( (group, groupIndex) => 
    {
      const tokenSortTable = this.grammar.getTokenSortTable();
      const inputStringStartIndex = groupStartIndexListInRespectToInputString[groupIndex];
      const groupCorrespondingOptionToken = option.tokenAt(groupIndex).toString();

      if(tokenSortTable[groupCorrespondingOptionToken] === TokenSort.NonTerminal)
      {
        return table[group.length][inputStringStartIndex].has(groupCorrespondingOptionToken);
      }
      else
      {
        return groupCorrespondingOptionToken === new TokenString(group).toString();
      }
    });
  }

  private readonly grammar : Grammar;
}

/**
 * Keeps the information of which non terminals 
 * derive which substrings of the input string.
 */
interface CYKTable
{
  [length : number] : {[index : number] : Set<string>};
}