import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";

export const SearchList = (props) => {
    const { data, selected, elementKey, placeholder, renderItem, onRefresh } = props;
    const [searchQuery, setSearchQuery] = useState("");
    const [filtered, setFiltered] = useState(data);
    const handleRefresh = () => {
        setSearchQuery('');
        onRefresh();
    }

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase()
        const filtered = data?.filter(e =>
            lowercasedQuery
                ? e[elementKey]?.toLowerCase().includes(lowercasedQuery) || selected[e.id] > 0
                : selected[e.id] > 0
        ).sort((a, b) => {
            const aIncludes = a[elementKey]?.toLowerCase().includes(lowercasedQuery);
            const bIncludes = b[elementKey]?.toLowerCase().includes(lowercasedQuery);
            if (aIncludes && !bIncludes) return -1;
            if (!aIncludes && bIncludes) return 1;
            return 0;
        });
        setFiltered(filtered);
    }, [searchQuery]);

    useEffect(() => {
        setSearchQuery("");
    }, [selected]);

    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {onRefresh && <Button title="⚡" onPress={handleRefresh} />}
            </View>
            <FlatList
                data={filtered}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    input: {
        backgroundColor: "#ffffff",
        flex: 1,
        fontSize: 16,
        padding: 8,
        height: '100%'

    },
    search: {
        borderRadius: 8,
        marginVertical: 16,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center'
    }
});