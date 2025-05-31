import {FC, useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SearchList} from "../search-list";
import {getLocalizedText} from "@/languages/languages";
import {Customer} from "@/types/types";

type Props = {
    data: Customer[];
    onEdit: (item: Customer) => void;
    onRefresh: () => void;
};

export const CustomerList: FC<Props> = ({data, onEdit, onRefresh}) => {

    const [selected, setSelected] = useState({});

    const renderItem = ({item}: { item: Customer }) =>
        <TouchableOpacity style={styles.item} onPress={() => onEdit(item)}>
            <Text style={styles.text}>{item.customerName}</Text>
            <Text style={styles.text}>{item.contact}</Text>
            <Text style={styles.text}>{item.tin}</Text>
        </TouchableOpacity>;

    useEffect(() => {
        setSelected({});
    }, [data]);

    return (
        <View style={styles.container}>
            <SearchList
                data={data}
                selected={selected}
                elementKey="customerName"
                placeholder={getLocalizedText('search_customers')}
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
        padding: 10,
        gap: 10,
        backgroundColor: 'silver',
        marginTop: 10,
    },
    text: {
        fontSize: 16,
    },
});
