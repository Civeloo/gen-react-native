import { db } from './database';
import * as Crypto from 'expo-crypto';

const Model = (table) => {

  const add = (object) => {
    const id = Crypto.randomUUID();
    db.setRow(table, id, object)
    return { [id]: object };
  }

  const update = (id, object) =>
    db
      .setPartialRow(table, id, object)
      .getRow(table, id);

  const remove = (id) => db.delRow(table, id);

  const byId = (id) => db.getRow(table, id);

  const all = () => {
    return Object.entries(db.getTable(table))
      .map(([id, value]) => ({
        id,
        ...value
      }));
  }

  return {
    add,
    update,
    remove,
    byId,
    all
  }
}

export default Model;
