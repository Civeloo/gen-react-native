import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

export const SearchList = (props) => {
    const { data, selected, elementKey, placeholder, renderItem } = props;
    const [searchQuery, setSearchQuery] = useState("");
    const [filtered, setFiltered] = useState(data);
    
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
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
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
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
});