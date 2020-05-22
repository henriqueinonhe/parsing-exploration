import { ProductionRule } from "./ProductionRule";
import { TokenSort } from "./TokenTable";

const tokenTable = {
  "S" : TokenSort.NonTerminal,
  "A" : TokenSort.NonTerminal,
  "a" : TokenSort.Terminal,
  "b" : TokenSort.Terminal
};

ProductionRule.constructFromString("S", [""]).isContextSensitive(tokenTable);