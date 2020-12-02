/*
*
*    Univerzalan gumb bez ikone
*
*/

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const IconButton = ( { onPress, text, active } ) => {
    
    return (
        <TouchableOpacity onPress={ onPress } style={ !active ? styles.button : { ...styles.button, backgroundColor: '#068CDD' } }>
            <Text style={ !active ? styles.text : { ...styles.text, color: '#ffffff' } }>{ text }</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create( {
    button: {
        backgroundColor: '#E6E6E6',
        borderRadius: 5,

        paddingVertical: 5,
        paddingHorizontal: 10,

        marginRight: 10
    },
    text: {
        color: '#0B323C',
        fontSize: 14,
        fontFamily: 'NotoSans'
    }
} );

export default IconButton;