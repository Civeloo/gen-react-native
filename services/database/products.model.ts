import { indexes } from './database';
import Model from './model';
import { PRODUCTS_TABLE } from './schema';

indexes.setIndexDefinition(
    'byPriority',
    PRODUCTS_TABLE,
    'priority'
);

const Products = (() => {
    // our base functionality...
    const baseProducts = Model(PRODUCTS_TABLE);

    // get all the todo ids associated with this project
    const priorities = () =>
        indexes.getSliceIds('byPriority');
    const idsByPriority = (priority) =>
        indexes.getSliceRowIds('byPriority', priority);
    const byPriority = (priority) =>
        idsByPriority(priority).map(baseProducts.byId)

    return {
        ...baseProducts,
        priorities,
        byPriority
    }
})();

export default Products;
