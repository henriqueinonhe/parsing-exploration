import { Grammar } from "../src/Core/Grammar";
import { CYKRecognizer } from "../src/Recognizers/CYKRecognizer";
import { TokenString } from "../src/Core/TokenString";

test("", () =>
{
  const nonTerminals = ["Number", "Integer", "Real", "Fraction", "Scale", "Digit", "Sign", "Empty"];
  const terminals = [".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "e"];
  const rules = [
    {lhs: "Number", rhs: ["Integer", "Real"]},
    {lhs: "Integer", rhs: ["Digit", "Integer Digit"]},
    {lhs: "Real", rhs: ["Integer Fraction Scale"]},
    {lhs: "Fraction", rhs: [". Integer"]},
    {lhs: "Scale", rhs: ["e Sign Integer", "Empty"]},
    {lhs: "Digit", rhs: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]},
    {lhs: "Sign", rhs: ["+", "-"]},
    {lhs: "Empty", rhs: [""]}
  ];
  const startSymbol = "Number";
  const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
  const recognizer = new CYKRecognizer(grammar);
  
  const table = recognizer.buildTable(TokenString.fromString("3 2 . 5 e + 1"));
  const serializedTable : Array<Array<Array<string>>> = [];
  
  for(const length in table)
  {
    serializedTable.push([]);
    for(const startIndex in table[length])
    {
      serializedTable[length].push([]);
      for(const token of table[length][startIndex])
      {
        serializedTable[length][startIndex].push(token);
      }
    }
  }

  expect(serializedTable).toStrictEqual( [
    [
      [
        "Empty",
        "Scale"
      ],
      [
        "Empty",
        "Scale"
      ],
      [
        "Empty",
        "Scale"
      ],
      [
        "Empty",
        "Scale"
      ],
      [
        "Empty",
        "Scale"
      ],
      [
        "Empty",
        "Scale"
      ],
      [
        "Empty",
        "Scale"
      ],
      [
        "Empty",
        "Scale"
      ]
    ],
    [
      [
        "Digit",
        "Integer",
        "Number"
      ],
      [
        "Digit",
        "Integer",
        "Number"
      ],
      [],
      [
        "Digit",
        "Integer",
        "Number"
      ],
      [],
      [
        "Sign"
      ],
      [
        "Digit",
        "Integer",
        "Number"
      ]
    ],
    [
      [
        "Integer",
        "Number"
      ],
      [],
      [
        "Fraction"
      ],
      [],
      [],
      []
    ],
    [
      [],
      [
        "Real",
        "Number"
      ],
      [],
      [],
      [
        "Scale"
      ]
    ],
    [
      [
        "Real",
        "Number"
      ],
      [],
      [],
      []
    ],
    [
      [],
      [],
      []
    ],
    [
      [],
      [
        "Real",
        "Number"
      ]
    ],
    [
      [
        "Real",
        "Number"
      ]
    ]
  ]);
  expect(recognizer.recognizes(TokenString.fromString("3 2  . 5 e + 1"))).toBe(true);
});