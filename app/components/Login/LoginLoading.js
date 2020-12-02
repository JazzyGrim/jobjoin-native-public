/*
*
*    Prikazuje animaciju prilikom učitavanja aplikacije
*
*/

import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { connect } from 'react-redux';
import { getConfig, getUser, getWalkthroughStatus } from '../../../auth'; // Get the getUser method to check SecureStorage
import { connectWithToken } from '../../../utils/socket';
import { setUser } from '../../actions/auth';

const mapStateToProps = ( state ) => {
    return {
        token: state.user.token
    }
}

const mapDispatchToProps = {
    setUser
}

const LoginLoading = ( props ) => {
    
    useEffect( ( ) => {

        // Defualt config settings
        const default_config = {
            notifications: true,
            saveFilters: true
        }

        global.config = default_config;

        getConfig( ).then( configResult => {

            // If a config is saved in async storage, set it here
            if ( configResult ) global.config = configResult;
        
        } ).catch( e => {
            console.log( e );
        } ).finally( ( ) => {

            getUser( ).then( ( result ) => {

                if ( result ) {
                    connectWithToken( result.token ); // Connect the socket to the server
                    props.setUser( result.id, result.token, result.type ); // Set the user in Redux
                    props.navigation.navigate( 'Home' );
                    return;
                }

                getWalkthroughStatus( ).then( walkthrough => {
                    if ( walkthrough ) {
                        props.navigation.navigate( 'Login' );
                    } else {
                        props.navigation.navigate( 'WelcomeScreen' );
                    }
                } )
                
            } );

        } );
    }, [ ] );

    return (
        <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
            <ActivityIndicator size="large" color="#068CDD" />
        </View>
    );
}

export default connect( mapStateToProps, mapDispatchToProps )( LoginLoading );