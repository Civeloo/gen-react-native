import { indexes } from './database';
import Model from './model';

indexes.setIndexDefinition(
    'byPriority',
    'orders',
    'priority'
);

const Orders = (() => {
    // our base functionality...
    const base = Model('orders');

    // get all the todo ids associated with this project
    const priorities = () =>
        indexes.getSliceIds('byPriority');
    const idsByPriority = (priority) =>
        indexes.getSliceRowIds('byPriority', priority);
    const byPriority = (priority) =>
        idsByPriority(priority).map(base.byId)

    return {
        ...base,
        priorities,
        byPriority
    }
})();

export default Orders;