import { getLocalizedText } from "@/languages/languages";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SearchList } from "../search-list";

type Props = {
    data: Product[];
    onRemove: (id: string) => void;
    onEdit: (item: Product) => void;
    onRefresh: () => void;
};

export const ListProduct: React.FC<Props> = ({ data, onRemove, onEdit, onRefresh }) => {

    const [selected, setSelected] = useState({});

    const renderItem = ({ item }: { item: Product }) =>
        <View style={styles.item}>
            <TouchableOpacity style={styles.values} onPress={() => onEdit(item)}>
                <Text style={styles.text}>{item.quantity}</Text>
                <Text style={styles.text}>{item.productName}</Text>
                <Text style={styles.text}>${item.price}</Text>
            </TouchableOpacity>
            <Button
                color="red"
                title="  -  "
                onPress={() => onRemove(item?.id)} />
        </View>;

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
    values: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'silver'
    },
    text: {
        fontSize: 20,
    },
});
