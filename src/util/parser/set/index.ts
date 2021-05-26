import type { Node, SetElement, SetExprNode } from "./ast"
import * as nearley from "nearley"
import grammar from "./grammar"
import { List, Set } from "immutable"

type Sets = Map<string, Set<SetElement>>

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
const BASE_STATE = parser.save()

function parse<T>(string: string): T {
  parser.restore(BASE_STATE)
  parser.feed(string)
  return parser.results[0]
}

export function parseSetAssignment(string: string): [string, Set<SetElement>] {
  if (string.charAt(1) !== "=") {
    throw new Error("Set expression was passed instead of an assignment!")
  }
  return parse(string)
}

export function parseSetExpression(string: string): SetExprNode {
  if (string.charAt(1) === "=") {
    throw new Error("Set assignment was passed instead of an expression!")
  }
  return parse(string)
}

export function elementToString(element: SetElement): string {
  if (typeof element === "string") {
    return element
  } else if (Set.isSet(element) && element.isEmpty()) {
    return "\\emptyset"
  }

  const children = element
    .toJSON()
    .reduce((prevValue, value) => (prevValue ? `${prevValue}, ${elementToString(value)}` : elementToString(value)), "")
  return List.isList(element) ? `(${children})` : `\\lbrace ${children}\\rbrace`
}

function boolToString(bool: boolean): string {
  return bool ? "True" : "False"
}

function evalNode(node: Node, sets: Sets): Set<SetElement> {
  if (List.isList(node)) {
    throw new Error("A list should not be passed to evalNode")
  } else if (Set.isSet(node)) {
    return node
  } else if (typeof node !== "string") {
    const leftNode = evalNode(node.left, sets)
    const rightNode = evalNode(node.right, sets)
    switch (node.id) {
      case "union":
        return leftNode.union(rightNode)
      case "intersect":
        return leftNode.intersect(rightNode)
      case "difference":
        return leftNode.filter((value) => !rightNode.contains(value))
      default:
        throw new Error(`Invalid ID: ${node.id}`)
    }
  } else {
    const set = sets.get(node)
    if (set) {
      return set
    } else {
      throw new Error(`Invalid set: ${node}`)
    }
  }
}

export function evalSetExpression(exprAST: SetExprNode, sets: Sets): string {
  if (typeof exprAST !== "string") {
    let leftNode: Set<SetElement>, rightNode: Set<SetElement>
    switch (exprAST.id) {
      case "elementof":
        return boolToString(evalNode(exprAST.right, sets).contains(exprAST.left as SetElement))
      case "psupset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToString(leftNode.isSuperset(rightNode) && leftNode.size > rightNode.size)
      case "supset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToString(leftNode.isSuperset(rightNode))
      case "npsupset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToString(!(leftNode.isSuperset(rightNode) && leftNode.size > rightNode.size))
      case "nsupset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToString(!leftNode.isSuperset(rightNode))
      case "psubset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToString(leftNode.isSubset(rightNode) && leftNode.size < rightNode.size)
      case "subset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToString(leftNode.isSubset(rightNode))
      case "npsubset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToString(!(leftNode.isSubset(rightNode) && leftNode.size < rightNode.size))
      case "nsubset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToString(!leftNode.isSubset(rightNode))
    }
  }
  return elementToString(evalNode(exprAST, sets))
}
