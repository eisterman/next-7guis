export interface Entry {
  name: string,
  surname: string,
}

export interface DB {
  [entryId: string]: Entry;
}

export type AppState = {
  entries: DB;
  nextIndex: number;
}

export type ActionCreate = {
  type: 'create';
  entry: Entry;
}

export type ActionUpdate = {
  type: 'update';
  entryId: string;
  newEntry: Entry;
}

export type ActionDelete = {
  type: 'delete';
  entryId: string;
}

export type Action = ActionCreate | ActionUpdate | ActionDelete;