import {TouchableOpacity} from "react-native";
import {router} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

export const BackButton = ({onPress}) => {
    const handleOnPress = () => {
        onPress ? onPress() : router.back();
    }

    return (
        <TouchableOpacity style={{padding: 10}} onPress={handleOnPress}>
            <Ionicons name="arrow-back" size={32} color="black"/>
        </TouchableOpacity>
    )
}