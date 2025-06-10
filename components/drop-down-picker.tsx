import {FC, useState} from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type Item = {
    label: string;
    value: string;
}

interface DropDownPickerProps {
    data: Item[];
    placeholder: string;
    value?: string;
    onChange?: (value: string) => void;
}

export const DropDownPicker: FC<DropDownPickerProps> = ({data, placeholder, value = '', onChange}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const label = data?.find((item) => item.value === value)?.label || placeholder;

    const handleSelect = (item: Item) => {
        onChange && onChange(item?.value);
        setModalVisible(false);
    };

    const renderItem = ({item}: { item: Item }) => (
        <View style={styles.item}>
            <TouchableOpacity
                key={item?.value}
                onPress={() => handleSelect(item)}>
                <Text style={styles.itemText}>{item?.label}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View
            style={styles.container}>
            <TouchableOpacity
                style={styles.picker}
                onPress={() => setModalVisible(true)}>
                <Text style={[
                    styles.label,
                    (label === placeholder) && styles.placeholder
                ]}>{label}</Text>
                <Ionicons name="chevron-down-circle" size={24} color="black"/>
            </TouchableOpacity>

            <Modal animationType="fade" transparent={true} visible={modalVisible}>
                <View style={styles.modal}>
                    <View style={styles.list}>
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minWidth: 200,
        width: '100%',
        paddingRight: 50
    },
    picker: {
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'silver',
    },
    placeholder: {color: 'gray'},
    label: {fontSize: 16},
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    list: {
        backgroundColor: 'white',
        width: '95%',
        maxHeight: '95%',
        borderRadius: 12,
        alignItems: 'center',
        gap: 10,
        paddingVertical: 20,
    },
    item: {margin: 10},
    itemText: {
        textAlign: 'center',
        fontSize: 16,
    }
})