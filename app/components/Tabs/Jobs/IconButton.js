/*
*
*    Univerzalan gumb s ikonom
*
*/

import React from 'react';
import Icon from '@expo/vector-icons/FontAwesome5';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const IconButton = ( { onPress, disabled, icon, text, solid } ) => {
    
    return (
        <TouchableOpacity disabled={ disabled } onPress={ onPress } style={ disabled ? { ...styles.button, opacity: 0.7 } : styles.button }>
            <Icon style={ styles.icon } name={ icon } size={ 16 } color={ '#111111' } solid={ solid } />
            <Text style={ styles.text }>{ text }</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create( {
    button: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        paddingVertical: 5,
        paddingHorizontal: 10,

        marginRight: 10
    },
    icon: {
        marginRight: 5
    },
    text: {
        color: '#0B323C',
        fontSize: 14,
        fontFamily: 'NotoSans'
    }
} );

export default IconButton;