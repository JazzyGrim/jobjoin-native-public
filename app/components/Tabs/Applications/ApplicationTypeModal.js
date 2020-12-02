/*
*
*    Prikazuje modul za odabir vrste prijave
*
*/

import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from "react-native-modal";

const { width, height } = Dimensions.get( 'window' ); // Get the window dimensions

const ApplicationModal = ( { visible, closeModal, type, setAppType } ) => {

    return <Modal
        isVisible={ visible }
        onBackButtonPress={ closeModal }
        onBackdropPress={ closeModal }
        onSwipeComplete={closeModal}
        swipeDirection={ [ 'down' ] }
        style={ styles.modal }
        backdropOpacity={ 0.5 }
        useNativeDriver={ true }
    >
        <View style={ styles.content }>
            <TouchableOpacity activeOpacity={ 0.8 } style={ styles.button } onPress={ ( ) => setAppType( 4 ) }>
                <Text style={ type == '4' ? { ...styles.buttonText, color: "#068CDD" } : styles.buttonText }>Sve prijave</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={ 0.8 } style={ styles.button } onPress={ ( ) => setAppType( 0 ) }>
                <Text style={ type == '0' ? { ...styles.buttonText, color: "#068CDD" } : styles.buttonText }>Aktivne prijave</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={ 0.8 } style={ styles.button } onPress={ ( ) => setAppType( 1 ) }>
                <Text style={ type == '1' ? { ...styles.buttonText, color: "#068CDD" } : styles.buttonText }>Prijave u užem odabiru</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={ 0.8 } style={ styles.button } onPress={ ( ) => setAppType( 2 ) }>
                <Text style={ type == '2' ? { ...styles.buttonText, color: "#068CDD" } : styles.buttonText }>Odbijene prijave</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={ 0.8 } style={ styles.button } onPress={ ( ) => setAppType( 3 ) }>
                <Text style={ type == '3' ? { ...styles.buttonText, color: "#068CDD" } : styles.buttonText }>Istekle prijave</Text>
            </TouchableOpacity>
        </View>
    </Modal>
};

const styles = StyleSheet.create( {
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        width: width,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: "center",
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    button: {
        width: '100%',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
        borderWidth: 1,
        borderColor: '#E4E4E4'
    },
    buttonText: {
        color: '#0B323C',
        fontSize: 14,
        fontFamily: 'NotoSans-Bold',
    }
} );

export default ApplicationModal;