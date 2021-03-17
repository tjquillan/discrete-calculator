import type { List, Set } from "immutable"

export type SetElement = string | Set<SetElement> | List<string>

export function getNamedSet(id: string, set: Set<SetElement>) {
  const obj: { [id: string]: Set<SetElement> } = {}
  obj[id] = set
  return obj
}
