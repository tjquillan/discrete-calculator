import type { List, Set } from "immutable"

export type SetElement = string | Set<SetElement> | List<string>
