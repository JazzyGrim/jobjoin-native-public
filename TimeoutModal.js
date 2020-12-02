/*
*
*   Prikazuje modul ukoliko komunikacija sa serverom nije moguća
*
*/

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { createErrorMessageSelector } from './app/actions/selector';
import { resetErrors } from './app/actions/error'

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const errorSelector = createErrorMessageSelector( [ 'connection' ] );

const mapStateToProps = ( state ) => {
    return {
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    resetErrors
}

const TimeoutModal = ( props ) => {

    const [ visible, setModalVisible ] = useState( false );

    const close = ( ) => {
        setModalVisible( false );
        props.resetErrors( );
    }

    useEffect( ( ) => {
        if ( props.errorMessage ) {
            setModalVisible( true );
        }
    }, [ props.errorMessage ] );

    return <Modal
        isVisible={ visible }
        onBackButtonPress={ close }
        onBackdropPress={ close }
        onSwipeComplete={ close }
        swipeDirection={ [ 'down' ] }
        style={ styles.modal }
        useNativeDriver={ true }
    >
        <View style={ styles.container }>
            <Image resizeMode="cover" style={ styles.image } source={ require( './assets/timeout.png' ) } />
            <Text style={ styles.titleText }>Veza nije moguća</Text>
            <Text style={ styles.subtitleText }>Provjerite imate li pristup internetu i pokušajte ponovo</Text>
        </View>
        <TouchableOpacity activeOpacity={ 0.8 } onPress={ close } style={ styles.button }>
            <Text style={ styles.buttonText }>Shvaćam</Text>
        </TouchableOpacity>
    </Modal>
};

const imageWidth = width / 3 * 1.3;

const styles = StyleSheet.create( {
    modal: {
        alignItems: "center",
        justifyContent: 'center',
        margin: 0
    },
    container: {
        backgroundColor: '#ffffff',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: width / 3 * 2,
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    image: {
        width: imageWidth,
        height: ( imageWidth / 847 ) * 512, // Ratio ( width in window / width of image ) times height,
        marginVertical: 20
    },
    titleText: {
        color: '#0B323C',
        fontSize: 20,
        fontFamily: 'NotoSans-Bold',
        marginTop: 5,
        textAlign: "center"
    },
    subtitleText: {
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans',
        marginTop: 5,
        textAlign: "center"
    },
    button: {
        width: width / 3  * 2,
        paddingVertical: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopWidth: 1,
        borderColor: '#E4E4E4',
        backgroundColor: '#ffffff',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: '#0B323C',
        fontSize: 20,
        fontFamily: 'NotoSans',
    }
} );

export default  connect( mapStateToProps, mapDispatchToProps )( TimeoutModal );