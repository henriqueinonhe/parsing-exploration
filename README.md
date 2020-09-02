# Parsing Exploration

This a project to explore parsing techniques and related structures like grammars and finite state automata.

The module is divided into the following sections:

1. Core
2. Recognizers
3. Analyzers
4. Transformers
5. Parsers
6. Generators
7. Automata

## Core

Contains core classes used to model tokens, token strings, production rules, grammars and parse trees.

## Recognizers

Contains recognizers, that is, modules that is used to decide whether a given sentence belongs or not to a language defined by a grammar.

## Analyzers

Contains grammar analyzers that can report stuff like whether a given grammar has non productive rules/non terminals (and list them), whether the grammar has direct loops and others.

## Transformers

Contains grammar transformers that perform conservative transformations, that is, they preserve the language described by the grammar.

## Parsers

Contains parsers like CYK, LL(0), LL(1), LR (no lookahead).

## Generators

Contains modules that generate sentences from a language described by a grammar.

## Automata

Contains finite state automata.

