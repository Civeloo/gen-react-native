import { ProductList } from '@/components/products/product-list';
import { ProductForm } from '@/components/products/product-form';
import { getLocalizedText } from '@/languages/languages';
import Products from '@/services/database/products.model';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, ScrollView } from 'react-native';
import {Product} from "@/types/types";

export default function ProductPage(props) {
    const getData = () => Products.all();
    const refreshData = () => setData(getData());

    const [data, setData] = useState<Product[]>([]);
    const [product, setProduct] = useState(false);

    const handleSave = (values: Product, id: string) => {
        if (id) {
            Products.add(values, id);
        } else {
            Products.add(values);
        }
        setProduct(false);
        refreshData();
    };

    const handleRemove = (id: string) => {
        Products.remove(id);
        setProduct(false);
        refreshData();
    };

    const handleEdit = (item: Product) => {
        setProduct(item);
    };

    useEffect(() => { refreshData() }, [props]);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Button
                title={product ? getLocalizedText("cancel") : getLocalizedText("create")}
                onPress={() => setProduct(!product)}
                color={product ? 'red' : '#2196F3'} />
            {product
                ? <ProductForm product={product} onSave={handleSave} onRemove={handleRemove}/>
                : <ProductList
                    data={data} 
                    onEdit={handleEdit}
                    onRefresh={()=>refreshData()} />
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