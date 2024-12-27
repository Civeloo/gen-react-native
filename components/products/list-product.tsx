import { Button, FlatList, StyleSheet, Text, View } from "react-native";

// A list component to show all the products.
export const ListProduct = ({ data, onRemove }) => {
    const renderItem = ({ item }) =>
        <View style={styles.item}>
            <Text style={styles.text}>{item['ProductName']}</Text>
            <Text style={styles.text}>{item['Unit']}</Text>
            <Text style={styles.text}>{item['Price']}</Text>
            <Button
                title="-"
                color="red"
                onPress={() => onRemove(item?.id)} />
        </View>;
    return (
    <View style={styles.container}>
        <FlatList
            data={data}
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
