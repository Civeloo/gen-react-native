import { indexes } from './database';
import Model from './model';

indexes.setIndexDefinition(
    'byPriority',
    'customers',
    'priority'
);

const Customers = (() => {
    // our base functionality...
    const base = Model('customers');

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

export default Customers;