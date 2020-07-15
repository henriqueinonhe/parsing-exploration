import { Grammar } from "../Core/Grammar";
import { FiniteStateAutomaton, TransitionTableEntry } from "../Automata/FiniteStateAutomaton";
import { ProductionRule } from "../Core/ProductionRule";
import { TokenString } from "../Core/TokenString";
import { TokenSortTable, TokenSort } from "../Core/TokenSortTable";

export enum RegularLanguageConverterGrammarDirection
{
  Left,
  Right
}

export class RegularLanguageConverter
{
  public static grammarToNFA(grammar : Grammar) : FiniteStateAutomaton
  {
    if(!grammar.isExtendedChomskyLeftRegular() && !grammar.isExtendedChomskyRightRegular())
    {
      throw new Error("Cannot convert grammar to NFA as it is not regular (extended chomsky's definition)!");
    }

    const states = [`"ACCEPT"`, ...grammar.listNonTerminals().map(token => token.toString())];
    const transitions = this.convertRuleArrayToTransitions(grammar.getRules(), grammar.getTokenSortTable());
    const initialState = grammar.getStartSymbol().toString();
    const acceptState = `"ACCEPT"`;
    
    return new FiniteStateAutomaton(initialState, states, transitions, acceptState);
  }

  private static convertRuleArrayToTransitions(rules : Array<ProductionRule>, tokenSortTable : TokenSortTable) : Array<TransitionTableEntry>
  {
    const transitions : Array<TransitionTableEntry> = [];
    for(const rule of rules)
    {
      transitions.push(...this.convertRuleToTransitions(rule, tokenSortTable));
    }
    return transitions;
  }

  private static convertRuleToTransitions(rule : ProductionRule, tokenSortTable : TokenSortTable) : Array<TransitionTableEntry>
  {
    return rule.getRhs().map(alternative => 
    {
      if(this.alternativeIsSingleTerminal(alternative, tokenSortTable))
      { 
        const currentState = rule.getLhs().toString();
        const condition = alternative.toString();
        const nextState = `"ACCEPT"`;
        return {currentState, condition, nextState};
      }
      else if(this.alternativeIsSingleTerminalFollowedBySingleNonTerminal(alternative, tokenSortTable))
      {
        const currentState = rule.getLhs().toString();
        const condition = alternative.tokenAt(0).toString();
        const nextState = alternative.tokenAt(1).toString();
        return {currentState, condition, nextState};
      }
      else if(this.alternativeIsSingleNonTerminalFollowedBySingleTerminal(alternative, tokenSortTable))
      {
        const currentState = rule.getLhs().toString();
        const condition = alternative.tokenAt(1).toString();
        const nextState = alternative.tokenAt(0).toString();
        return {currentState, condition, nextState};
      }
      else if(ProductionRule.alternativeIsUnitAlternativeSuitable(alternative, tokenSortTable))
      {
        const currentState = rule.getLhs().toString();
        const condition = "";
        const nextState = alternative.toString();
        return {currentState, condition, nextState};
      }
      else if(ProductionRule.alternativeIsEAlternative(alternative))
      {
        const currentState = rule.getLhs().toString();
        const condition = "";
        const nextState = `"ACCEPT"`;
        return {currentState, condition, nextState};
      }
      else //Shouldn't be happening
      {
        throw new Error("This shouldn't happen!");
      }
    });
  }

  private static alternativeIsSingleTerminal(alternative : TokenString, tokenSortTable : TokenSortTable) : boolean
  {
    return alternative.size() === 1 &&
           tokenSortTable[alternative.tokenAt(0).toString()] === TokenSort.Terminal;
  }

  private static alternativeIsSingleNonTerminalFollowedBySingleTerminal(alternative : TokenString, tokenSortTable : TokenSortTable) : boolean
  {
    return alternative.size() === 2 &&
           tokenSortTable[alternative.tokenAt(0).toString()] === TokenSort.NonTerminal &&
           tokenSortTable[alternative.tokenAt(1).toString()] === TokenSort.Terminal;
  }

  private static alternativeIsSingleTerminalFollowedBySingleNonTerminal(alternative : TokenString, tokenSortTable : TokenSortTable) : boolean
  {
    return alternative.size() === 2 &&
    tokenSortTable[alternative.tokenAt(0).toString()] === TokenSort.Terminal &&
    tokenSortTable[alternative.tokenAt(1).toString()] === TokenSort.NonTerminal;
  }

  public static NFAToGrammar(nfa : FiniteStateAutomaton, grammarDirection : RegularLanguageConverterGrammarDirection) : Grammar
  {
    const nonTerminals = nfa.getStates();
    const terminals = nfa.getTransitions().map(transition => transition.condition).filter(string => string !== "");
    const rules = nfa.getTransitions().map(transition => this.convertTransitionToRule(nfa.getAcceptState(), transition, grammarDirection));
    const startSymbol = nfa.getInitialState();
    
    return Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
  }

  private static convertTransitionToRule(acceptState : string, transition : TransitionTableEntry, grammarDirection : RegularLanguageConverterGrammarDirection) : {lhs : string; rhs : Array<string>}
  {
    const lhs = transition.currentState;
    if(transition.condition === "")
    {
      if(transition.nextState === acceptState)
      {
        const rhs = [""];
        return {lhs, rhs};
      }
      else
      {
        const rhs = [transition.nextState];
        return {lhs, rhs};
      }
    }
    else
    {
      if(transition.nextState === acceptState)
      {
        const rhs = [transition.condition];
        return {lhs, rhs};
      }
      else
      {
        if(grammarDirection === RegularLanguageConverterGrammarDirection.Left)
        {
          const rhs = [`${transition.nextState} ${transition.condition}`];
          return {lhs, rhs};
        }
        else
        {
          const rhs = [`${transition.condition} ${transition.nextState}`];
          return {lhs, rhs};
        }
      }
    }
  }


}