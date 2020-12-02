/*
*
*    Prikazuje zadnju poruku s individualnim poslodavcem
*
*/

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getImageUrl } from '../../../../utils/imageManager';

const MessageCard = React.memo( ( { message } ) => {

    return  <View style={ styles.container }>
                <Image source={ getImageUrl( message.recruiterImagePath ) } style={ styles.image } />
                <View style={ styles.content }>
                    <View style={ styles.row }>
                        <Text style={ styles.nameText }>{ message.recruiterFirstName + ' ' + message.recruiterLastName }</Text>
                        <Text style={ styles.timeText }>{ new Date( message.messageTime ).toTimeString( ).substr( 0, 5 ) }</Text>
                    </View>
                    <Text numberOfLines={ 1 } style={ styles.messageText }>{ message.messageText === 'CF385DEAF06072B2B7E465B88696006BAE21A1868C59F0CF576F3EE526038167' ? <Text style={ styles.startText }>Početak razgovora</Text> : message.messageText }</Text>
                </View>
            </View>
} );

const styles = StyleSheet.create( {
    container: {
        marginHorizontal: '5%',
        marginVertical: 10,
        paddingVertical: 10,
        width: '90%',
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E4'
    },
    image: {
        width: '15%',
        height: '100%',
        borderRadius: 10
    },
    content: {
        width: '100%',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    row: {
        width: '85%',
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    nameText: {
        color: '#808080',
        fontSize: 15,
        fontFamily: 'NotoSans-Bold',
        marginLeft: 10
    },
    timeText: {
        color: '#808080',
        fontSize: 15,
        fontFamily: 'NotoSans'
    },
    messageText: {
        color: '#808080',
        fontSize: 15,
        fontFamily: 'NotoSans',
        marginLeft: 10,
        maxWidth: '80%'
    },
    startText: {
        fontStyle: "italic"
    },
} );

export default MessageCard;