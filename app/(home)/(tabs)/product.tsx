import {ProductList} from '@/components/products/product-list';
import {ProductForm} from '@/components/products/product-form';
import {getLocalizedText} from '@/languages/languages';
import Products from '@/services/database/products.model';
import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {Product} from "@/types/types";
import {useSQLiteContext} from "expo-sqlite";

export default function ProductPage(props: object) {
    const [isLoading, setIsLoading] = useState(false);
    const db = useSQLiteContext();
    const getData = () => Products.all(db) as Product[];
    const refreshData = () => {
        setIsLoading(true);
        setData(getData());
        setIsLoading(false);
    }

    const [data, setData] = useState<Product[]>([]);
    const [product, setProduct] = useState<Product | null>();

    const handleSave = (values: Product) => {
        setIsLoading(true);
        Products.save(db, values);
        setProduct(null);
        refreshData();
        setIsLoading(false);
    };

    const handleRemove = (id: string) => {
        setIsLoading(true);
        Products.remove(db, id);
        setProduct(null);
        refreshData();
        setIsLoading(false);
    };

    const handleEdit = (item: Product) => {
        setProduct(item);
    };

    useEffect(() => {
        refreshData()
        setIsLoading(false);
    }, [props]);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Button
                title={product ? getLocalizedText("cancel") : getLocalizedText("create")}
                onPress={() => setProduct(product ? null : {} as Product)}
                color={product ? 'red' : '#2196F3'}/>
            {product
                ? <ProductForm product={product} onSave={handleSave} onRemove={handleRemove}/>
                : <ProductList
                    data={data}
                    onEdit={handleEdit}
                    onRefresh={() => refreshData()}/>
            }
            <ActivityIndicator size="large" animating={isLoading}/>
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