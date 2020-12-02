/*
*
*    Ekran prikazan ukoliko se poslodavac pokuša prijaviti u aplikaciju za posloprimce
*
*/

import { Linking } from 'expo';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { resetErrors } from '../../actions/error';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const mapDispatchToProps = {
    logout,
    resetErrors
}

const LoginRecruiter = ( props ) => {

    useEffect( ( ) => {
        props.resetErrors( );
        props.logout( ); // Remove the user's info from the redux state
        return ( ) => props.resetErrors( );
    }, [ ] );

    return ( <>
            <ScrollView contentContainerStyle={ styles.container }>
                <Text style={ styles.subtitle }>JobJoin za poslodavce dostupan je putem našeg web sučelja.</Text>
                <TouchableOpacity onPress={ ( ) => Linking.openURL('https://jobjoin.hr') } activeOpacity={ 0.7 } style={ styles.button }>
                    <Text style={ styles.buttonText }>Prijavite se online</Text>
                </TouchableOpacity>
            </ScrollView>
            </>
    );
};

const styles = StyleSheet.create( {
    container: {
        minHeight: '100%',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#ffffff',
        paddingVertical: 20
    },
    subtitle: {
        width: width - 40,
        color: '#808080',
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'NotoSans'
    },
    inputContainer: {
        width: width - 40,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E4E4E4',
        marginTop: 15,
        marginBottom: 10
    },
    inputText: {
        color: '#808080',
        fontSize: 18,
        fontFamily: 'NotoSans',
        alignSelf: "flex-start"
    },
    input: {
        color: '#0B323C',
        fontSize: 20,
        fontWeight: "normal",
    },
    inputError: {
        marginTop: 5,
        color: '#ff4a49',
        fontSize: 18,
        fontFamily: 'NotoSans'
    },
    button: {
        width: width - 40,
        backgroundColor: '#068CDD',
        height: 70,
        marginTop: 20,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4,
        elevation: 5,

        marginVertical: 10
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: 'NotoSans'
    }
} );

export default connect( null, mapDispatchToProps )( LoginRecruiter );