import { Grammar } from "../Core/Grammar";
import { TokenString } from "../Core/TokenString";
import { TokenSort } from "../Core/TokenSortTable";
import { Utils } from "../Core/Utils";

export class SentenceGenerator
{
  constructor(grammar : Grammar)
  {
    this.grammar = grammar;
  }

  public generate(quantity : number) : Array<TokenString>
  {
    const startSymbol = this.grammar.getStartSymbol();
    const rules = this.grammar.getRules();
    let sentences = [] as Array<TokenString>;
    let sententialFormQueue = [new TokenString([startSymbol])] as Array<TokenString>;
    let sententialFormBuffer = [] as Array<TokenString>;
    
    while(sentences.length < quantity)
    {
      // const currentSententialForm = sententialFormQueue[0];

      for(const sententialForm of sententialFormQueue)
      {
        for(const rule of rules)
        {
          for(let index = 0; index < sententialForm.size(); index++)
          {
            if(this.tokenStringHasMatchAtIndex(sententialForm, rule.getLhs(), index))
            {
              for(const alternative of rule.getRhs())
              {
                const sententialFormLeftPart = sententialForm.slice(0, index);
                const sententialFormRightPart = sententialForm.slice(index + rule.getLhs().size());
                const rewrittenSententialForm = new TokenString([...sententialFormLeftPart.getTokenList(), ...alternative.getTokenList(), ...sententialFormRightPart.getTokenList()]);

                sententialFormBuffer.push(rewrittenSententialForm);
              }
            }
          }
        }
      }

      sentences.push(...sententialFormBuffer.filter(sententialForm => this.tokenStringIsSentence(sententialForm)));
      sentences = Utils.removeArrayDuplicates(sentences, (str1, str2) => str1.isEqual(str2));
      sententialFormBuffer = sententialFormBuffer.filter(sententialForm => !this.tokenStringIsSentence(sententialForm));

      sententialFormQueue = sententialFormBuffer;
      sententialFormBuffer = [];

    }

    return sentences.slice(0, quantity);
  }

  private tokenStringIsSentence(tokenString : TokenString) : boolean
  {
    const tokenSortTable = this.grammar.getTokenSortTable();
    return tokenString.every(token => tokenSortTable[token.toString()] === TokenSort.Terminal);
  }

  private tokenStringHasMatchAtIndex(searchedString : TokenString, targetString : TokenString, index : number) : boolean
  {
    return searchedString.slice(index, index + targetString.size()).isEqual(targetString);
  }

  readonly grammar : Grammar;
}