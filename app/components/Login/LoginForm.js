/*
*
*    Prikazuje formu za prijavu
*
*/

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { signIn } from '../../../auth'; // Get the signIn method to save the user details to secure storage
import { getNotificationToken } from '../../../utils/notifications';
import { connectWithToken } from '../../../utils/socket';
import { login } from '../../actions/auth';
import { resetErrors } from '../../actions/error';
import { createErrorMessageSelector, createLoadingSelector } from '../../actions/selector';
import messageStyles from '../../styles/messages';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const loadingSelector = createLoadingSelector( [ 'LOGIN' ] );
const errorSelector = createErrorMessageSelector( [ 'LOGIN' ] );

const mapStateToProps = ( state ) => {
    return {
        id: state.user.id,
        token: state.user.token,
        type: state.user.type,
        loginLoading: loadingSelector( state ),
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    login,
    resetErrors
}

const LoginForm = ( props ) => {

    useFocusEffect( useCallback( ( ) => {
            StatusBar.setBarStyle( 'dark-content' );
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#ffffff');
        }, [ ] )
    );

    const [ loadingToken, setLoadingToken ] = useState( false );
    const [ email, setEmail ] = useState( 'mateo.sindicic@gmail.com' );
    const [ password, setPassword ] = useState( 'laptop11' );

    useEffect( ( ) => {
        return ( ) => props.resetErrors( );
    }, [ ] );

    useEffect( ( ) => {
        if ( props.token ) { // If the login was successful

            if ( props.type === 'recruiter' ) {
                props.navigation.navigate( 'LoginRecruiter' ); // Redirect the user to the target page
                return;
            }

            signIn( props.id, props.token, props.type ); // Save the user to SecureStorage
            connectWithToken( props.token ) // Connect to the server with the token
            props.navigation.navigate( 'JobsTab' ); // Redirect the user to the target page
        }
    }, [ props.token ] );

    const handleLogin = ( ) => {

        setLoadingToken( true );
        getNotificationToken( ).then( token => {
            props.login( email, password, token );
        } ).catch( error => {
            props.login( email, password );
            console.log( error );
        } ).finally( ( ) => setLoadingToken( false ) );

    }

    const handleSignup = ( ) => {
        props.resetErrors( );
        props.navigation.navigate( 'SignupForm' )
    }

    return ( <>
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <ScrollView keyboardShouldPersistTaps='never' contentContainerStyle={ styles.container }>
                        <Image
                            source={ require( '../../../assets/icon.png' ) }
                            style={ { width: width / 3, margin: 0 } }
                            resizeMode="contain"
                        />
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>E-mail</Text>
                    <TextInput style={ styles.input } value={ email } keyboardType="email-address" onChangeText={ setEmail } autoCapitalize='none' placeholder="Unesite e-mail adresu" />
                    { props.errorMessage.loginEmail && <Text style={ styles.inputError }>{ props.errorMessage.loginEmail }</Text> }
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Lozinka</Text>
                    <TextInput style={ styles.input } value={ password } onChangeText={ setPassword } autoCapitalize='none' placeholder="Unesite lozinku" secureTextEntry />
                    { props.errorMessage.loginPassword && <Text style={ styles.inputError }>{ props.errorMessage.loginPassword }</Text> }
                </View>
                <TouchableOpacity onPress={ ( ) => props.navigation.navigate( 'LoginReset' ) } activeOpacity={ 0.7 }>
                    <Text style={ styles.forgotPassword }>Zaboravljena lozinka?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ handleLogin } activeOpacity={ 0.7 } style={ styles.button }>
                    { !props.loginLoading && !loadingToken ? <Text style={ styles.buttonText }>Prijavi se</Text> : <ActivityIndicator size="large" color='#ffffff' /> }
                </TouchableOpacity>
                <TouchableOpacity onPress={ handleSignup } activeOpacity={ 0.7 }>
                    <Text style={ styles.registerText }>Nemate račun? <Text style={ styles.registerSpan }>Registrirajte se!</Text></Text>
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
    title: {
        color: '#0B323C',
        fontSize: 30,
        fontFamily: 'CaviarDreams-Bold',
        marginBottom: 10
    },
    subtitle: {
        color: '#808080',
        fontSize: 24,
        fontFamily: 'CaviarDreams'
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
    forgotPassword: {
        color: '#808080',
        fontSize: 16,
        fontFamily: 'NotoSans',
        width: width - 40,
        textAlign: "right"
    },
    button: {
        width: width - 40,
        backgroundColor: '#068CDD',
        paddingVertical: 10,
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
    },
    registerText: {
        color: '#808080',
        fontSize: 18,
        fontFamily: 'NotoSans',
        width: width - 40,
        textAlign: "center"
    },
    registerSpan: {
        color: '#068CDD'
    },
} );

export default connect( mapStateToProps, mapDispatchToProps )( LoginForm );