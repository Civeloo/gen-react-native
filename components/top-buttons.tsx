import React, {FC} from "react";
import {Button, StyleSheet, View} from "react-native";
import {getLocalizedText} from "@/languages/languages";

interface Props {
    create: boolean;
    onCancel?: () => void;
    onCreate?: () => void;
    onImport?: () => void;
    onExport?: () => void;
}

export const TopButtons: FC<Props> = ({create, onCancel, onCreate, onImport, onExport}) => {

    return (<>
        {create ?
            <Button title={getLocalizedText("cancel")} onPress={onCancel} color={'red'}/>
            :
            <View style={styles.buttons}>
                {onCreate && <Button title={getLocalizedText("create")} onPress={onCreate}/>}
                <Button title={getLocalizedText('import')} onPress={onImport} color={'green'}/>
                <Button title={getLocalizedText('export')} onPress={onExport} color={'orange'}/>
            </View>
        }
    </>);
}

const styles = StyleSheet.create({
    buttons: {
        backgroundColor: 'silver',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});
