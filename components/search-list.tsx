import React, {useEffect, useState} from "react";
import {ActivityIndicator, Button, FlatList, StyleSheet, TextInput, View} from "react-native";

type Data = { [x: string]: any; }[]

interface Props {
    id: string;
    data: Data;
    selected: any;
    elementKey: string;
    placeholder: string;
    renderItem: any;
    onRefresh: any;
}

export const SearchList = (props: Props) => {
    const {id, data, selected, elementKey, placeholder, renderItem, onRefresh} = props;
    const [searchQuery, setSearchQuery] = useState("");
    const [filtered, setFiltered] = useState(data);
    const [animating, setAnimating] = useState(false);

    const handleRefresh = () => {
        setSearchQuery('');
        onRefresh();
    }

    useEffect(() => {
        if (data) {
            setAnimating(true);
            const lowercasedQuery = searchQuery.toLowerCase()
            const newFiltered = data.filter((e) =>
                lowercasedQuery
                    ? e[elementKey]?.toLowerCase().includes(lowercasedQuery) || selected[e[id]] > 0
                    : selected[e[id]] > 0
            ).sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
                const aIncludes = a[elementKey]?.toLowerCase().includes(lowercasedQuery);
                const bIncludes = b[elementKey]?.toLowerCase().includes(lowercasedQuery);
                if (aIncludes && !bIncludes) return -1;
                if (!aIncludes && bIncludes) return 1;
                return 0;
            });
            setAnimating(false);
            setFiltered(newFiltered);
        }
    }, [searchQuery]);

    useEffect(() => {
        setSearchQuery(typeof selected == 'string' ? selected : "");
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
                {onRefresh && <Button title="⚡" testID='refresh' onPress={handleRefresh}/>}
            </View>
            <FlatList
                data={filtered}
                renderItem={renderItem}
                keyExtractor={(item) => item[id]}
                scrollEnabled={false}
            />
            <ActivityIndicator size="large" animating={animating}/>
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