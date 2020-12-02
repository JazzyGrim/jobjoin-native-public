/*
*
*    Prikazuje ekran za prijavu u aplikaciju
*
*/

import * as Facebook from 'expo-facebook';
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { signIn } from '../../../auth'; // Get the signIn method to save the user details to secure storage
import { getNotificationToken } from '../../../utils/notifications';
import { connectWithToken } from '../../../utils/socket';
import { loginFacebook, resetFacebookRedirect, setErrorMessage } from '../../actions/auth';
import { createLoadingSelector } from '../../actions/selector';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get( 'window' ); // Get the window dimensions

const loadingSelector = createLoadingSelector( [ 'FACEBOOK_LOGIN' ] );

const mapStateToProps = ( state ) => {
    return {
        id: state.user.id,
        token: state.user.token,
        type: state.user.type,
        loginLoading: loadingSelector( state ),
        facebookRedirect: state.user.facebookRedirect
    }
}

const mapDispatchToProps = {
    loginFacebook,
    resetFacebookRedirect,
    setErrorMessage
}

const Login = ( props ) => {

    useFocusEffect( useCallback( ( ) => {
            StatusBar.setBarStyle( 'dark-content' );
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#C6CDD5');
        }, [ ] )
    );

    const [ loadingToken, setLoadingToken ] = useState( false );
    const [ accessToken, setAccessToken ] = useState( null );
    const [ notificationToken, setNotificationToken ] = useState( null );

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

    // Handle Facebook login
    const handleFacebookLogin = ( ) => {
        Facebook.initializeAsync( '3868271966520170' ).then( ( ) => { // Initialize Facebook SDK
            Facebook.logInWithReadPermissionsAsync( ).then( ( { token, type } ) => { // Login with Facebook
                if ( type == 'success' ) { // If the login was successful
                    setAccessToken( token ); // Set the access token
                    setLoadingToken( true );
                    // Get the notification push token
                    getNotificationToken( ).then( ).then( pushToken => {
                        setNotificationToken( pushToken ); // Set the notification token
                        props.loginFacebook( token, pushToken ); // Login with the notification token
                    } ).catch( error => { // If we couldn't get the notification token
                        props.loginFacebook( token ); // Login without the notification token
                        console.log( error ); // Log the error
                    } );

                    return;
                }
                // If Facebook returns a type other than success throw an error
                throw type;
            } ).catch( error => {
                throw error;
            } );
        } ).catch( error => {
            props.setErrorMessage( 'Pogreška u komunikaciji s Facebook-om.' );
            console.log( error );
        } ).finally( ( ) =>{
            setLoadingToken( false );
        } );
    }

    useEffect( ( ) => {
        // If the server responded with a request for the user's address
        if ( props.facebookRedirect ) {
            props.resetFacebookRedirect( ); // Reset the facebookRedirect variable
            // Go to the sign up location screen to set the location, and finalize the register
            props.navigation.navigate( 'SignupFormLocation', { accessToken, notificationToken } );

        }
    }, [ props.facebookRedirect ] );

    return  < >
            <StatusBar backgroundColor="#C6CDD5" barStyle="dark-content" />
            <View style={ { flex: 1, backgroundColor: '#C6CDD5', justifyContent: 'flex-end', paddingHorizontal: 20 }  }>
                <View style={ { position: "absolute", left: 0, top: 0 } } >
                    <Image
                        source={ require( '../../../assets/login-bg.png' ) }
                        style={ styles.imageStyle }
                        resizeMode="contain"
                    />
                </View>
                <View style={ { height: height / 3, justifyContent: "center" } }>
                    <View style={ styles.row }>
                        <TouchableOpacity onPress={ ( ) => props.navigation.navigate( 'LoginForm' ) } style={ { ...styles.button, width: '48%' } }>
                            <Text style={ styles.buttonText }>Prijava</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ ( ) => props.navigation.navigate( 'SignupForm' ) } style={ { ...styles.button, width: '48%' } }>
                            <Text style={ styles.buttonText }>Registracija</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={ handleFacebookLogin } style={ { ...styles.button, backgroundColor: '#068CDD' } }>
                    { !props.loginLoading && !loadingToken ? <Text style={ { ...styles.buttonText, color: 'white' } }>Nastavi uz Facebook</Text> : <ActivityIndicator size="large" color='#ffffff' /> }
                    </TouchableOpacity>
                </View>
            </View>
            </>

};

const styles = StyleSheet.create( {
    imageStyle: {
        flex: 1,
        width: width - 50,
        height: height / 3 * 2,
        marginHorizontal: 25
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,

        marginVertical: 10
    },
    buttonText: {
        color: '#0B323C',
        fontSize: 20,
        fontFamily: 'NotoSans'
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    }
} );

Login.navigationOptions = {
    headerShown: false,
};

export default connect( mapStateToProps, mapDispatchToProps )( Login );