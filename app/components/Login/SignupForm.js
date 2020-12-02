/*
*
*    Prikazuje formu za registraciju na platformu
*
*/

import React, { useEffect, useState, useCallback } from 'react';
import { Dimensions, StatusBar, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { resetErrors } from '../../actions/error';
import { createErrorMessageSelector } from '../../actions/selector';
import messageStyles from '../../styles/messages';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const errorSelector = createErrorMessageSelector( [ 'REGISTER' ] );

const mapStateToProps = ( state ) => {
    return {
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    resetErrors
}

const SignupForm = ( props ) => {

    useFocusEffect( useCallback( ( ) => {
            StatusBar.setBarStyle( 'dark-content' );
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#ffffff');
        }, [ ] )
    );

    const [ name, setName ] = useState( 'Mateo' );
    const [ surname, setSurname ] = useState( 'Sindicic' );
    const [ email, setEmail ] = useState( 'mateo.sindicic@gmail.com' );
    const [ password, setPassword ] = useState( 'laptop11' );
    const [ confirmPassword, setConfirmPassword ] = useState( 'laptop11' );
    const [ matchPassword, setMatchPassword ] = useState( null );

    useEffect( ( ) => {
        return ( ) => props.resetErrors( );
    }, [ ] );

    const handleSubmit = ( ) => {
        if ( password != confirmPassword ) {
            setMatchPassword( 'Lozinke se ne podudaraju!' );
            return;
        }

        props.navigation.navigate( 'SignupFormLocation', { name, surname, email, password } );
    }

    return ( <>
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <ScrollView contentContainerStyle={ styles.container }>
                <Image
                    source={ require( '../../../assets/icon.png' ) }
                    style={ { width: width / 3, margin: 0 } }
                    resizeMode="contain"
                />
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Ime</Text>
                    <TextInput style={ styles.input } value={ name } onChangeText={ setName } placeholder="Unesite vaše ime" />
                    { props.errorMessage.userFirstName && <Text style={ styles.inputError }>{ props.errorMessage.userFirstName }</Text> }
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Prezime</Text>
                    <TextInput style={ styles.input } value={ surname } onChangeText={ setSurname } placeholder="Unesite vaše prezime" />
                    { props.errorMessage.userLastName && <Text style={ styles.inputError }>{ props.errorMessage.userLastName }</Text> }
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>E-mail</Text>
                    <TextInput style={ styles.input } value={ email } keyboardType="email-address" onChangeText={ setEmail } autoCapitalize='none' placeholder="Unesite e-mail adresu" />
                    { props.errorMessage.userEmail && <Text style={ styles.inputError }>{ props.errorMessage.userEmail }</Text> }
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Lozinka</Text>
                    <TextInput style={ styles.input } value={ password } onChangeText={ setPassword } autoCapitalize='none' placeholder="Unesite lozinku" secureTextEntry />
                    { props.errorMessage.userPassword && <Text style={ styles.inputError }>{ props.errorMessage.userPassword }</Text> }
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Potvrdite lozinku</Text>
                    <TextInput style={ styles.input } value={ confirmPassword } onChangeText={ setConfirmPassword } autoCapitalize='none' placeholder="Potvrdite lozinku" secureTextEntry />
                    { matchPassword && <Text style={ styles.inputError }>{ matchPassword }</Text> }
                </View>
                <TouchableOpacity onPress={ handleSubmit } activeOpacity={ 0.7 } style={ styles.button }>
                    <Text style={ styles.buttonText }>Nastavite</Text>
                </TouchableOpacity>
            </ScrollView>
            </>
    );
};

const styles = StyleSheet.create( {
    container: {
        minHeight: '100%',
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: '#ffffff',
        paddingVertical: 20
    },
    inputContainer: {
        width: width - 40,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E4E4E4',
        marginVertical: 10
    },
    input: {
        color: '#0B323C',
        fontSize: 16,
        fontWeight: "normal",
    },
    inputError: {
        marginTop: 5,
        color: '#ff4a49',
        fontSize: 14,
        fontFamily: 'NotoSans'
    },
    button: {
        width: width - 40,
        backgroundColor: '#068CDD',
        paddingVertical: 10,
        marginTop: 10,
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

export default connect( mapStateToProps, mapDispatchToProps )( SignupForm );