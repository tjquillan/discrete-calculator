import * as nearley from "nearley"
import grammar from "./grammar"

import { List, Set } from "immutable"
import { SetElement } from "./ast"

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
const BASE_STATE = parser.save()

export function parse(string: string): { [id: string]: Set<SetElement> } {
  parser.restore(BASE_STATE)
  parser.feed(string)
  return parser.results[0]
}

export function setToString(element: SetElement): string {
  if (List.isList(element)) {
    return `(${element.toJSON().map(toString).join(", ")})`
  } else if (Set.isSet(element)) {
    return element.isEmpty() ? "\\emptyset" : `\\lbrace ${element.toJSON().map(setToString).join(", ")} \\rbrace`
  } else {
    return element
  }
}
