import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { SearchList } from "../search-list";
import { getLocalizedText } from "@/languages/languages";

type Props = {
    data: Product[];
    onRemove: (id: string) => void;
};

export const ListProduct: React.FC<Props> = ({ data, onRemove }) => {

    const [selected, setSelected] = useState({});

    const renderItem = ({ item }: { item: Product }) =>
        <View style={styles.item}>
            <Text style={styles.text}>{item.productName}</Text>
            <Text style={styles.text}>{item.quantity}</Text>
            <Text style={styles.text}>{item.price}</Text>
            <Button
                title="-"
                color="red"
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
        backgroundColor: 'silver'
    },
    text: {
        fontSize: 20,
    },
});
