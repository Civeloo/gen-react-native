import { getUUIDv4 } from '@/utils';
import { db, relations } from './database';


const Model = (table) => {

  const add = (object: any, id?: string) => {
    id = id ?? getUUIDv4();
    db.setRow(table, id, object)
    return { [id]: object };
  }

  const update = (id, object) =>
    db
      .setPartialRow(table, id, object)
      .getRow(table, id);

  const cancel = (id) => db.setPartialRow(table, id, { status: 'cancelled' });

  const remove = (id) => db.delRow(table, id);

  const removeWithRelationships = (id, relationship) =>
    db.transaction(() => {
      const localTableId = relations.getLocalTableId(relationship);
      if (!localTableId) return;
      const localRowIds = relations.getLocalRowIds(relationship, id);
      localRowIds.forEach((localRowId) => db.delRow(localTableId, localRowId));
      const remoteTableId = relations.getRemoteTableId(relationship);
      if (!remoteTableId) return;
      return db.delRow(remoteTableId, id);
    });

  const byId = (id) => db.getRow(table, id);

  const inner = (id, relationship) => {
    const localTableId = relations.getLocalTableId(relationship);
    if (!localTableId) return;
    const localRowIds = relations.getLocalRowIds(relationship, id);
    return localRowIds.map((localRowId) => db.getRow(localTableId, localRowId));
  };

  const all = () => {
    return Object.entries(db.getTable(table))
      .map(([id, value]) => ({
        id,
        ...value
      }));
  };

  return {
    add,
    update,
    cancel,
    remove,
    removeWithRelationships,
    byId,
    inner,
    all
  }
}

export default Model;
