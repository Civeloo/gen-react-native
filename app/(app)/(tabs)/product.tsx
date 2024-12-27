import { ListProduct } from '@/components/products/list-product';
import { NewProductForm } from '@/components/products/new-product-form';
import Products from '@/services/database/products.model';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProductPage() {
    const getData = () => Products.all();
    const [data, setData] = useState(getData());
    const refreshData = () => setData(getData());
    const handleSave = (data) => {
        Products.add(data);
        refreshData();
    };
    const handleRemove = (id) => {
        Products.remove(id);
        refreshData();
    }
    return (
        <View style={styles.container}>
            <NewProductForm onSave={handleSave} />
            <ListProduct data={data} onRemove={handleRemove} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        alignItems: "center",
    },
});