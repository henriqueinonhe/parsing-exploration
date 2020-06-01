import { Grammar } from "./Grammar";
import { Token } from "./Token";
import { TokenString } from "./TokenString";
import { Utils } from "./Utils";

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

  public buildTable(inputString : TokenString) : CYKTable
  {
    //Initialize Table
    const table : CYKTable = {};
    for(let substringLength = 0; substringLength <= inputString.size(); substringLength++)
    {
      table[substringLength] = {};
      for(let startIndex = 0; startIndex <= inputString.size() - substringLength; startIndex++)
      {
        table[substringLength][startIndex] = new Set<string>();
      }
    }

    //Empty String
    const rules = this.grammar.getRules();
    let elementAdded : boolean;
    do
    {
      elementAdded = false;
      for(const rule of rules)
      {
        if(table[0][0].has(rule.getLhs().tokenAt(0).toString()))
        {
          continue;
        }

        const options = rule.getRhs();
        for(const option of options)
        {
          if(option.isEqual(TokenString.fromString("")) ||
             option.every(token => table[0][0].has(token.toString())))
          {
            const lhsNonTerminal = rule.getLhs().tokenAt(0).toString();
            for(let i = 0; i <= inputString.size(); i++)
            {
              table[0][i].add(lhsNonTerminal);
            }
            elementAdded = true;
          }
        }
      }
    } while(elementAdded);

    //Rest
    for(let substringLength = 1; substringLength <= inputString.size(); substringLength++)
    {
      for(let startIndex = 0; startIndex <= inputString.size() - substringLength; startIndex++)
      {
        const endIndex = startIndex + substringLength;
        const substring = inputString.slice(startIndex, endIndex);
        let newElementAdded = false;
        do
        {
          newElementAdded = false;
          for(const rule of rules)
          {
            if(table[substringLength][startIndex].has(rule.getLhs().toString()))
            {
              continue;
            }

            for(const option of rule.getRhs())
            {
              if(option.isEmpty())
              {
                continue;
              }

              const partitions = Utils.listPartitions(substring.getTokenList(), option.size(), true);
  
              for(const partition of partitions)
              {
                const indexList = [startIndex];
                for(const group of partition)
                {
                  indexList.push(indexList[indexList.length - 1] + group.length);
                }
  
                if(partition.every( (group, groupIndex) => table[group.length][indexList[groupIndex]].has(option.tokenAt(groupIndex).toString())  || 
                   option.slice(groupIndex, groupIndex + 1).isEqual(new TokenString(group))) )
                {
                  table[substringLength][startIndex].add(rule.getLhs().tokenAt(0).toString());
                  newElementAdded = true;
                }
              }
            }
          } 
        } while(newElementAdded);
      }
    }
    return table;

  }

  private readonly grammar : Grammar;
}

interface CYKTable
{
  [length : number] : {[index : number] : Set<string>};
}