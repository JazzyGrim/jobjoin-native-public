/*
*
*    Prikazuje formu za promijenu lozinke u slučaju zaboravljene lozinke
*
*/

import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { forgotPassword } from '../../actions/auth';
import { resetErrors } from '../../actions/error';
import { createErrorMessageSelector, createSuccessMessageSelector } from '../../actions/selector';
import messageStyles from '../../styles/messages';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const errorSelector = createErrorMessageSelector( [ 'FORGOT_PASSWORD' ] );
const successSelector = createSuccessMessageSelector( [ 'FORGOT_PASSWORD' ] );

const mapStateToProps = ( state ) => {
    return {
        successMessage: successSelector( state ),
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    forgotPassword,
    resetErrors
}

const LoginReset = ( props ) => {

    const [ email, setEmail ] = useState( 'mateo.sindicic@gmail.com' );

    useEffect( ( ) => {
        props.resetErrors( );
        return ( ) => props.resetErrors( );
    }, [ ] );

    return ( <>
            { ( props.successMessage ) && <Text style={ messageStyles.success }>{ props.successMessage }</Text> }
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <ScrollView keyboardShouldPersistTaps='never' contentContainerStyle={ styles.container }>
                <Text style={ styles.subtitle }>Unesite e-mail adresu vašeg računa na koju ćete primiti e-mail s instrukcijama za promjenu lozinke.</Text>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>E-mail</Text>
                    <TextInput style={ styles.input } value={ email } keyboardType="email-address" onChangeText={ setEmail } autoCapitalize='none' placeholder="Unesite e-mail adresu" />
                    { props.errorMessage.resetEmail && <Text style={ styles.inputError }>{ props.errorMessage.resetEmail }</Text> }
                </View>
                <TouchableOpacity onPress={ ( ) => props.forgotPassword( email ) } activeOpacity={ 0.7 } style={ styles.button }>
                    <Text style={ styles.buttonText }>Pošalji mail</Text>
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

export default connect( mapStateToProps, mapDispatchToProps )( LoginReset );