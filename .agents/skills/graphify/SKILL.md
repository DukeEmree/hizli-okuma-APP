---
name: graphify
description: Converts any input (codebase, document, notes, conversation) into a persistent knowledge graph of entities and relationships at .graphify/graph.md. Trigger with /graphify. Re-running on the same target updates the graph incrementally instead of rebuilding it.
---

# graphify

Turns the given input into a knowledge graph: entities (nodes) + relationships
(edges), stored as one Markdown file with a Mermaid diagram plus a plain
entity table.

## Usage

`/graphify [target]` — target defaults to the current project root.

## Output location

`<target>/.graphify/graph.md` — create the directory if it doesn't exist.

## Steps

1. Resolve target: the given arg, else the current project root.
2. If `.graphify/graph.md` already exists, read it first — this is an
   update, not a rebuild. Keep entities/edges whose source is unchanged.
3. Scan the target:
   - Codebase: walk source files, skip `node_modules`, `.git`, `dist`,
     `build`, `vendor`, lockfiles.
   - Document/notes input: read the file(s) directly.
4. Extract entities: files, key modules/classes/functions, and domain
   concepts explicitly present in the input (e.g. actors, requirements,
   entities named in a spec).
5. Extract relationships: imports/calls between code entities,
   defines/references between docs and code, and domain relationships
   stated in the input (e.g. "User places Reservation").
6. Write/update `.graphify/graph.md`:
   - A ```mermaid graph TD``` block with nodes and edges.
   - A short table: entity, type, one-line description, source
     file (and line if applicable).
7. Stay proportional — a small input gets a small graph. Never invent an
   entity or relationship that isn't grounded in the input.

## Incremental updates

On re-run, compare against current source state; only re-derive entities whose source
changed. Leave the rest of the file untouched.
