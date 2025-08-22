import {ProductList} from '@/components/products/product-list';
import {ProductForm} from '@/components/products/product-form';
import {getLocalizedText} from '@/languages/languages';
import Products from '@/services/database/products.model';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Button, ScrollView, StyleSheet, View} from 'react-native';
import {Product} from "@/types/types";
import {useSQLiteContext} from "expo-sqlite";
import {csvToDb, dataToCsv, getVersion, loadTextFromFile, MimeTypes, saveTextToFile} from "@/utils/utils";

export default function ProductPage() {
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

    const handleImport = async () => {
        const csv = await loadTextFromFile(MimeTypes.csv);
        setIsLoading(true);
        if (csv) csvToDb(db, 'products', csv);
        setIsLoading(false);
        refreshData();
    }

    const handleExport = async () => {
        setIsLoading(true);
        const content = dataToCsv(data);
        await saveTextToFile(content, `products${getVersion()}.csv`, MimeTypes.csv);
        setIsLoading(false);
    }

    useEffect(() => {
        refreshData()
    }, []);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {product
                ? <>
                    <Button
                        title={getLocalizedText("cancel")}
                        onPress={() => setProduct(null)}
                        color={'red'}/>
                    <ProductForm product={product} onSave={handleSave} onRemove={handleRemove}/>
                </>
                : <>
                    <View style={styles.buttons}>
                        <Button
                            title={getLocalizedText("create")}
                            onPress={() => setProduct({} as Product)}/>
                        <Button title={'import'} onPress={handleImport} color={'green'}/>
                        <Button title={'export'} onPress={handleExport} color={'orange'}/>
                    </View>
                    <ProductList
                        data={data}
                        onEdit={handleEdit}
                        onRefresh={() => refreshData()}/>
                </>
            }
            <ActivityIndicator size="large" animating={isLoading}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    buttons: {
        backgroundColor: 'silver',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});