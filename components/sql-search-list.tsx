import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Button,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {BarcodeScanner} from "@/components/barcode-scanner";

type Data = { [x: string]: any; }[]

interface Props {
    id: string;
    selected: any;
    placeholder: string;
    renderItem: any;
    onSearch: any;
}

export const SqlSearchList = (props: Props) => {
    const {id, selected, placeholder, renderItem, onSearch} = props;
    const [searchQuery, setSearchQuery] = useState("");
    const [filtered, setFiltered] = useState<Data>();
    const [animating, setAnimating] = useState(false);
    const [scan, setScan] = useState(false);

    const handleRead = (data: string) => {
        if (data) {
            setSearchQuery(data);
            setScan(false);
        }
    };

    const handleScan = () => {
        setScan(scan => !scan);
    }

    useEffect(() => {
        if (searchQuery?.length > 0) {
            setAnimating(true);
            const data = onSearch(searchQuery);
            if (data?.length > 0) {
                const selectedObject = Object.values(selected);
                const selectedLength = selectedObject.length;
                const dataFilter = selectedLength ?
                    data.filter((d: { [x: string]: string; }) => !selected[d[id]])
                    : data;
                const newFiltered = [
                    ...dataFilter,
                    ...selectedObject
                ];
                setFiltered(newFiltered);
            }
            setAnimating(false);
        }
    }, [searchQuery]);

    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity
                    onPress={handleScan}>
                    <Text style={styles.buttonText}>|||||</Text>
                </TouchableOpacity>
            </View>
            <Modal transparent={true} visible={scan}>
                <BarcodeScanner onScan={handleRead}/>
                <Button title={'close'} onPress={handleScan}/>
            </Modal>
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
    },
    buttonText: {
        height: 'auto',
        padding: 5,
        backgroundColor: 'black',
        fontSize: 20,
        color: 'white'
    },
});