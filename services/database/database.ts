import { Platform } from "react-native";
import { Store, ValuesSchema, createIndexes, createRelationships, createStore } from 'tinybase';
import {
    useCreatePersister
} from 'tinybase/ui-react';
import { tablesSchema } from "./schema";

const valuesSchema: ValuesSchema = {
    title: { type: 'string' },
} as const; // NB the `as const` modifier
const TITLE_VALUES = Object.keys(valuesSchema)[0];
const TODO_TABLE = Object.keys(tablesSchema)[0];
const TEXT_CELL = Object.keys(tablesSchema[TODO_TABLE])[0];
const DONE_CELL = Object.keys(tablesSchema[TODO_TABLE])[1];

const useAndStartPersister = (store: Store) =>
    // Persist store to Expo SQLite or local storage; load once, then auto-save.
    useCreatePersister(
        store,
        (store) =>
            Platform.OS === 'web'
                ? require('tinybase/persisters/persister-indexed-db').createIndexedDbPersister(store, 'todos')
                : require('tinybase/persisters/persister-expo-sqlite').createExpoSqlitePersister(store, require('expo-sqlite').openDatabaseSync('todos.db')),
        [],
        (persister) => persister.load().then(persister.startAutoSave)
    );

// Initialize the (memoized) TinyBase store and persist it.
const store = createStore();
const db = store.setSchema(tablesSchema, valuesSchema);
const indexes = createIndexes(db);
const relations = createRelationships(db);

export { DONE_CELL, TEXT_CELL, TITLE_VALUES, TODO_TABLE, db, indexes, relations, useAndStartPersister };

