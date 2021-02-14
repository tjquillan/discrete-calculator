import { Column } from "react-table";
import { evaluate, getVars, parse } from "./parser/truthtable";
import { Results } from "./parser/truthtable/ast";

// asciimath2tex has no type defintion
// @ts-ignore 7016
import AsciiMathParser from 'asciimath2tex';

/**
 * Genetates a boolean matrix
 *
 * This function was modified from: https://github.com/andrejewski/truth-table/blob/5fe6cbd5073a5d28eb5aabd54cd654ab37da933a/index.js#L45
 *
 * @param n Number of columns
 */
function boolMatrix(n: number) {
  var mat = [];
  (function _boolMatrix(set: boolean[], c) {
    if(c === 0) {
      mat.push(set)
      return
    }
    _boolMatrix(set.concat([true]), c - 1);
    _boolMatrix(set.concat([false]), c - 1);
  })([], n);
  return mat;
}

function generateValues(vars: Array<string>) {
  return boolMatrix(vars.length).map((value) => {
    const values: Results = {}
    for (let i = 0; i < vars.length; i++) {
      values[vars[i]] = value[i]
    }
    return values
  }, [])
}

export function buildTable(proposition: string): [Array<Column>, Array<any>] {
  const asciiParser = new AsciiMathParser();
  const columns: Array<Column> = []
  const data = []

  const ast = parse(proposition)
  const vars = getVars(ast)
  const values = generateValues(vars)
  for (let value of values) {
    const results = evaluate(ast, value)

    // Columns should only be populated once
    if (columns.length === 0) {
      for (let key of Object.keys(results)) {
        columns.push({
          Header: asciiParser.parse(key),
          accessor: key
        })
      }
    }

    const transformedResults: {[id: string]: string} = {}
    Object.keys(results).forEach((value) => {
      const boolValue = results[value]
      transformedResults[value] = boolValue ? "T" : "F"
    })
    data.push(transformedResults)
  }

  return [columns, data]
}
