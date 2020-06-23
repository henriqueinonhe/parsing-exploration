import { Grammar } from "../Core/Grammar";
import { TokenString } from "../Core/TokenString";
import { TokenSort } from "../Core/TokenSortTable";

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
    const sentences = [] as Array<TokenString>;
    const sententialFormQueue = [new TokenString([startSymbol])] as Array<TokenString>;
    
    while(sentences.length < quantity)
    {
      const currentSententialForm = sententialFormQueue[0];
      for(const rule of rules)
      {
        for(let index = 0; index < currentSententialForm.size(); index++)
        {
          if(this.tokenStringHasMatchAtIndex(currentSententialForm, rule.getLhs(), index))
          {
            for(const alternative of rule.getRhs())
            {
              const sententialFormLeftPart = currentSententialForm.slice(0, index);
              const sententialFormRightPart = currentSententialForm.slice(index + rule.getLhs().size());
              const rewrittenSententialForm = new TokenString([...sententialFormLeftPart.getTokenList(), ...alternative.getTokenList(), ...sententialFormRightPart.getTokenList()]);

              if(this.tokenStringIsSentence(rewrittenSententialForm) && 
                 !sentences.some(tokenString => tokenString.isEqual(rewrittenSententialForm)))
              {
                sentences.push(rewrittenSententialForm);
              }

              sententialFormQueue.push(rewrittenSententialForm);
            }
          }
        }
      }
      sententialFormQueue.shift();
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