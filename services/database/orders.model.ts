import Model from './model';
import {SQLiteDatabase} from "expo-sqlite";

// indexes.setIndexDefinition(
//     'byPriority',
//     'orders',
//     'priority'
// );

const Orders = (() => {
    // our base functionality...
    const base = Model('orders');

    // get all ids associated with this project
    // const priorities = () =>
    //     indexes.getSliceIds('byPriority');
    // const idsByPriority = (priority) =>
    //     indexes.getSliceRowIds('byPriority', priority);
    // const byPriority = (priority) =>
    //     idsByPriority(priority).map(base.byId)

    // const getTableCellIds = () => {
    //     const cellIds = db.getTableCellIds('orders');
    //     // TODO: get cell ids
    //     return cellIds?.length>0 ? cellIds : ['orderCode', 'customerID', 'employeeID', 'orderDate', 'shipperID', 'status'];
    // }
    // queries.setQueryDefinition('notCancelledOrders', 'orders', ({ select, where }) => {
    //     getTableCellIds().map((cellId) => select(cellId));
    //     where((getCell) => getCell('status') != 'cancelled');
    // });
    const getNotCancelledOrders = (db: SQLiteDatabase) =>
        base.where(db, [{key: 'orderStatus', value: 'cancelled', condition: '!='}]);

    const cancel = (db: SQLiteDatabase, id: string) =>
        base.update(db, {orderID: id, orderStatus: 'cancelled'});

    return {
        ...base,
        // priorities,
        // byPriority,
        cancel,
        getNotCancelledOrders
    }
})();

export default Orders;