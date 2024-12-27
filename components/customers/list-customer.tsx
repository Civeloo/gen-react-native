import { Button, FlatList, StyleSheet, Text, View } from "react-native";

// A list component to show all the customers.
export const ListCustomer = ({ data, onRemove }) => {
    const renderItem = ({ item }) =>
        <View style={styles.item}>
            <Text style={styles.text}>{item['customerName']}</Text>
            <Text style={styles.text}>{item['contact']}</Text>
            <Text style={styles.text}>{item['tin']}</Text>
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