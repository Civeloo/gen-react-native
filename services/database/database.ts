import {Platform} from "react-native";
// import ReconnectingWebSocket from 'reconnecting-websocket';
import {
    createIndexes,
    createMergeableStore,
    createQueries,
    createRelationships,
    MergeableStore,
    ValuesSchema
} from 'tinybase';
import {tablesSchema} from "./schema";
import {INITIAL_CUSTOMERS, INITIAL_ORDER_CODES, INITIAL_PRODUCTS} from "./data";
import {createWsSynchronizer} from 'tinybase/synchronizers/synchronizer-ws-client';
import {useCreatePersister,} from 'tinybase/ui-react';
import ReconnectingWebSocket from "reconnecting-websocket";
import { RefObject } from "react";

const valuesSchema: ValuesSchema = {
    title: {type: 'string'},
} as const; // NB the `as const` modifier
const TITLE_VALUES = Object.keys(valuesSchema)[0];
const DB_NAME = 'GeN';

const useCustomPersister = (store: MergeableStore, dbName = DB_NAME) =>
    // Persist store to Expo SQLite or local storage; load once, then auto-save.
    useCreatePersister(
        store,
        (store) =>
            Platform.OS === 'web'
                ? require('tinybase/persisters/persister-indexed-db').createIndexedDbPersister(store, dbName)
                : require('tinybase/persisters/persister-expo-sqlite').createExpoSqlitePersister(store, require('expo-sqlite').openDatabaseSync(dbName + '.db')),
        [],
        (persister) => persister.load().then(persister.startAutoSave)
    );

const SYNC_SERVER = process.env.EXPO_PUBLIC_SYNC_SERVER;
if (!SYNC_SERVER) {
    throw new Error(
        "Please set EXPO_PUBLIC_SYNC_SERVER in .env to the URL of the sync server"
    );
}

const customSynchronizer = (store: MergeableStore, synchronizerRef: RefObject<any>, userId: string) => {
    const ws = new ReconnectingWebSocket(SYNC_SERVER + '/' + DB_NAME + userId);
    createWsSynchronizer(store, ws, 1)
        .then((synchronizer) =>
            synchronizer.startSync()
                .then(() => {
                        ws.addEventListener('open', () => {
                            synchronizer.load().then(() => synchronizer.save());
                        });
                        synchronizerRef.current = synchronizer;
                        console.log('🔄 Synchronizer started');
                    }
                )
        )
};

// Initialize the (memoized) TinyBase store and persist it.
// const store = createStore();
const store = createMergeableStore(DB_NAME);
const db = store
    .setSchema(tablesSchema, valuesSchema)
    .setTables({
        products: INITIAL_PRODUCTS,
        customers: INITIAL_CUSTOMERS,
        // orders: INITIAL_ORDERS,
        // orderDetails: INITIAL_ORDER_DETAILS,
        orderCodes: INITIAL_ORDER_CODES,
        // company: INITIAL_COMPANY,
    });

const indexes = createIndexes(db);
const relations = createRelationships(db);
relations
    .setRelationshipDefinition(
        'orderWithDetails', // relationshipId
        'orderDetails', // localTableId to link from
        'orders', // remoteTableId to link to
        'orderID', // cellId containing remote key
    );
const queries = createQueries(db);

export {TITLE_VALUES, db, indexes, relations, queries, useCustomPersister, customSynchronizer};