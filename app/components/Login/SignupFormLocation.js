/*
*
*    Prikazuje kartu te polje za unos lokacije korisnika
*
*/

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { getNotificationToken } from '../../../utils/notifications';
import { connectWithToken } from '../../../utils/socket';
import { signIn } from '../../../auth'; // Get the signIn method to save the user details to secure storage
import { loginFacebook, register } from '../../actions/auth';
import { createErrorMessageSelector, createLoadingSelector } from '../../actions/selector';
import messageStyles from '../../styles/messages';
import LocationPicker from '../Tabs/Profile/LocationPicker';

const loadingSelector = createLoadingSelector( [ 'REGISTER' ] );
const errorSelector = createErrorMessageSelector( [ 'REGISTER' ] );

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
    register,
    loginFacebook
}

const SignupLocation = ( props ) => {

    const [ loadingToken, setLoadingToken ] = useState( false );

    const [ region, setRegion ] = useState( {
        latitude: 0,
        longitude: 0
    } );

    const [ address, setAddress ] = useState( null );

    useEffect( ( ) => {
        if ( props.route.params.address ) setAddress( {
            address: props.route.params.address,
            city: props.route.params.city,
            region: props.route.params.region,
            postalCode: props.route.params.postalCode,
            country: props.route.params.country,
        } )
        if ( props.route.params.lat ) setRegion( {
            latitude: props.route.params.lat,
            longitude: props.route.params.long
        } )
    }, [ ] );

    const onMapPress = (data, details = null) => {
        
        let address, premise, street, street_number, city, region, postalCode, country;
        for (let i = 0; i < details.address_components.length; i++) {
            const element = details.address_components[ i ]
            if ( element.types.includes( 'premise' ) ) premise = element.long_name;
            if ( element.types.includes( 'street_number' ) ) street_number = element.long_name;
            if ( element.types.includes( 'route' ) ) street = element.long_name;
            if ( element.types.includes( 'locality' ) ) city = element.long_name;
            if ( element.types.includes( 'administrative_area_level_1' ) ) region = element.long_name;
            if ( element.types.includes( 'country' ) ) country = element.long_name;
            if ( element.types.includes( 'postal_code' ) ) postalCode = element.long_name;
        }

        if ( street && street_number ) address = street + ' ' + street_number;
        const info = { address: address || premise, city, region, postalCode, country };
        setAddress( info );

        setRegion( {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng
        } )
    }

    useEffect( ( ) => {
        if ( props.token ) { // If the login was successful

            if ( props.type === 'recruiter' ) {
                props.navigation.navigate( 'LoginRecruiter' ); // Redirect the user to the target page
                return;
            }

            connectWithToken( props.token ) // Connect to the server with the token
            signIn( props.id, props.token, props.type ); // Save the user to SecureStorage
            props.navigation.navigate( 'JobsTab' ); // Redirect the user to the target page
        }
    }, [ props.token ] );

    const registerHandler = ( skip ) => {

        setLoadingToken( true );
        
        getNotificationToken( ).then( token => {
            register( token, skip );
        } ).catch( error => {
            console.log( error );
            register( );
        } ).finally( ( ) => setLoadingToken( false ) );
        
    }

    const register = ( token, skip ) => {

        const { accessToken, name, surname, email, password } = props.route.params;

        const { addressValue, city, region:state, postalCode, country } = address || { };
        let { latitude, longitude } = region || { };
        
        if ( latitude == 0 ) latitude = null;
        if ( longitude == 0 ) longitude = null;

        // If we are logging in with Facebook
        if ( accessToken ) {
            if ( skip ) {
                props.loginFacebook( accessToken, token );
                return;
            }
            props.loginFacebook( accessToken, token, addressValue, city, state, postalCode, country, latitude, longitude );
            return;
        }

        // Register normally, without Facebook
        
        if ( skip ) {
            props.register( name, surname, email, password, token );
            return;
        }

        props.register( 
            name,
            surname,
            email,
            password,
            token,
            addressValue, city, state, postalCode, country, latitude, longitude
        );

    }
    
    return  <View pointerEvents={ props.loginLoading ? 'none' : 'auto' } style={ styles.screen }>
            <StatusBar barStyle="dark-content" />
            { ( props.errorMessage.text ) && <Text style={ { ...messageStyles.error, top: 50 } }>{ props.errorMessage.text }</Text> }
            <LocationPicker
                onPress={ onMapPress }
                region={ region }
                initialAddress={ props.route.params.address }
                initialCity={ props.route.params.city }
                successMessage={ props.successMessage }
            />
            <View style={ styles.footer }>
                <TouchableOpacity onPress={ ( ) => registerHandler( true ) } activeOpacity={ 0.7 } style={ styles.skipButton }>
                        <Text style={ styles.skipText }>PRESKOČI</Text>
                </TouchableOpacity>
                { ( !props.loginLoading && !loadingToken ) ? <TouchableOpacity disabled={ !address } onPress={ registerHandler } activeOpacity={ 0.7 } style={ !address ? { ...styles.saveButton, backgroundColor: '#E4E4E4' } : styles.saveButton }>
                        <Text style={ !address ? { ...styles.saveText, color: '#808080' } : styles.saveText }>Kreni!</Text>
                </TouchableOpacity> : <ActivityIndicator size="large" color='#068CDD' style={ { marginRight: 20 } } /> }
            </View>
            </View>
};

const styles = StyleSheet.create( {
    screen: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: "flex-start"
    },
    skipButton: {
        paddingVertical: 5,
        marginLeft: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    skipText: {
        color: '#808080',
        fontSize: 14,
        fontFamily: 'NotoSans'
    },
    saveButton: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        marginRight: 20,
        backgroundColor: '#068CDD',
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    saveText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'NotoSans'
    },
    footer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        borderTopColor: '#E4E4E4',
        borderTopWidth: 1
    }
} );

export default connect( mapStateToProps, mapDispatchToProps )( SignupLocation );