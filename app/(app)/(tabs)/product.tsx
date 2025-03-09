import { ListProduct } from '@/components/products/list-product';
import { NewProductForm } from '@/components/products/new-product-form';
import { getLocalizedText } from '@/languages/languages';
import Products from '@/services/database/products.model';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, ScrollView } from 'react-native';

export default function ProductPage(props) {
    const getData = () => Products.all();
    const refreshData = () => setData(getData());

    const [data, setData] = useState<Product[]>([]);
    const [addProduct, setAddProduct] = useState(false);

    const handleSave = (values: Product) => {
        Products.add(values);
        setAddProduct(false);
        refreshData();
    };
    const handleRemove = (id: string) => {
        Products.remove(id);
        refreshData();
    }

    useEffect(() => { refreshData() }, [props]);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Button
                title={addProduct ? getLocalizedText("cancel") : getLocalizedText("create")}
                onPress={() => setAddProduct(!addProduct)}
                color={addProduct ? 'red' : '#2196F3'} />
            {addProduct
                ? <NewProductForm onSave={handleSave} />
                : <ListProduct data={data} onRemove={handleRemove} />
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        // alignItems: "center",
    },
});