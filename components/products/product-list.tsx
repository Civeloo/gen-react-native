import {getLocalizedText} from "@/languages/languages";
import {useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SearchList} from "../search-list";
import {Product} from "@/types/types";

type Props = {
    data: Product[];
    onEdit: (item: Product) => void;
    onRefresh: () => void;
};

export const ProductList: React.FC<Props> = ({data, onEdit, onRefresh}) => {

    const [selected, setSelected] = useState({});

    const renderItem = ({item}: { item: Product }) =>
        <TouchableOpacity style={styles.item} onPress={() => onEdit(item)}>
            <Text style={styles.text}>{item.quantity}</Text>
            <Text style={styles.text}>{item.productName}</Text>
            <Text style={styles.text}>${item.price}</Text>
        </TouchableOpacity>;

    useEffect(() => {
        setSelected({});
    }, [data]);

    return (
        <View style={styles.container}>
            <SearchList
                data={data}
                selected={selected}
                elementKey="productName"
                placeholder={getLocalizedText('search-products')}
                renderItem={renderItem}
                onRefresh={() => onRefresh()}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 16,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        gap: 10,
        backgroundColor: 'silver',
        marginTop: 10,
    },
    text: {
        fontSize: 20,
    },
});
