import {getFieldKey, getUUIDv4} from '@/utils/utils';
import * as SQLite from "expo-sqlite";
import {SQLiteDatabase} from "expo-sqlite";
// import {db, relations} from './database';

type Data = { [x: string]: any; status?: string; };

const setRow = (db: SQLiteDatabase, table: string, data: Data) => {
    const fields = Object.keys(data);
    const values = fields.map(key => `"${data[key]}"`).join(',');
    const sql = `INSERT INTO ${table} (${fields})
                 VALUES (${values})`;
    db.execSync(sql);
}

const setPartialRow = (db: SQLiteDatabase, table: string, id: string, data: Data) => {
    const tableID = getFieldKey(table) + 'ID';
    const {[tableID]: _, ...newData} = data;
    const fields = Object.keys(newData);
    const values = fields.map(key => `${key} = "${newData[key]}"`).join(', ');
    const sql = `
        UPDATE ${table}
        SET ${values}
        WHERE ${tableID} = "${id}";
    `;
    db.execSync(sql);
}

const get = (db: SQLiteDatabase, table: string, fields: { key: string, value: string, condition: string }[], separator='OR') => {
    const sql = `SELECT *
                 FROM ${table}
                 WHERE ${fields.map(e =>
                         `${e.key} ${e.condition || '='} "${(e.condition === 'LIKE') ? `%${e.value}%` : e.value}"`).join(` ${separator} `)}`;
    return db.getAllSync(sql);// as [{ [x: string]: any; }];
}

const getRow = (db: SQLiteDatabase, table: string, id: string) => {
    const tableID = getFieldKey(table) + 'ID';
    const fields = [{key: tableID, value: id, condition: '='}];
    return get(db, table, fields);
}

const getTable = (db: SQLiteDatabase, table: string) => {
    const sql = `SELECT *
                 FROM ${table}`;
    return db.getAllSync(sql) as unknown[];
}

const delRow = (db: SQLiteDatabase, table: string, id: string) => {
    const tableID = getFieldKey(table) + 'ID';
    const sql = `
        DELETE
        FROM ${table}
        WHERE ${tableID} = $value;
    `;
    return db.runSync(sql, {$value: id});
}

// const transaction = (db: SQLiteDatabase, fn: () => SQLite.SQLiteRunResult | undefined) => {
//     Promise.all([
//         db.withTransactionAsync(async () => {
//             fn
//         })
//     ]);
// }

const Model = (table: string) => {

    const add = (db: SQLiteDatabase, values: any) => {
        const tableID = getFieldKey(table) + 'ID';
        const id = values[tableID];
        if (!id) values[tableID] = getUUIDv4();
        setRow(db, table, values);
        // return { [id]: values };
    }

    const update = (db: SQLiteDatabase, values: { [x: string]: any; }) => {
        const tableID = getFieldKey(table) + 'ID';
        const id = values[tableID];
        setPartialRow(db, table, id, values);
    }

    const save = (db: SQLiteDatabase, values: { [x: string]: any; }) => {
        const tableID = getFieldKey(table) + 'ID';
        const id = values[tableID];
        if (id)
            setPartialRow(db, table, id, values);
        else
            add(db, values);
    }


    const remove = (db: SQLiteDatabase, id: string) => delRow(db, table, id);

    // const removeWithRelationships = (id: string, relationship: string) =>
    //     db.transaction(() => {
    //         const localTableId = relations.getLocalTableId(relationship);
    //         if (!localTableId) return;
    //         const localRowIds = relations.getLocalRowIds(relationship, id);
    //         localRowIds.forEach((localRowId) => db.delRow(localTableId, localRowId));
    //         const remoteTableId = relations.getRemoteTableId(relationship);
    //         if (!remoteTableId) return;
    //         return db.delRow(remoteTableId, id);
    //     });

    const byId = (db: SQLiteDatabase, id: string) =>
        getRow(db, table, id);

    const inner = (db: SQLiteDatabase, id: string, relation: string, relationID: string) => {
        const tableID = getFieldKey(table) + 'ID';
        const sql = `
            SELECT *
            FROM ${table}
                     INNER JOIN ${relation} ON ${table}.${relationID} = ${table}.${relationID}
            WHERE ${tableID} = "${id}"`;
        return db.getAllSync(sql) as unknown[];
        //     const localTableId = relations.getLocalTableId(relationship);
        //     if (!localTableId) return;
        //     const localRowIds = relations.getLocalRowIds(relationship, id);
        //     return localRowIds.map((localRowId) => db.getRow(localTableId, localRowId)) as unknown;
    };

    const all = (db: SQLiteDatabase) => {
        // return Object.entries(db.getTable(table))
        //   .map(([id, value]) => ({
        //     id,
        //     ...value
        //   }));
        return getTable(db, table);
    };

    const where = (db: SQLiteDatabase, fields: { key: string, value: string, condition: string }[], separator='OR') =>
        get(db, table, fields, separator);

    return {
        add,
        update,
        save,
        remove,
        // removeWithRelationships,
        byId,
        inner,
        all,
        where
    }
}

export default Model;
