/*
*
*    Prikazuje ekran za uređivanje postavki aplikacije
*
*/

import Icon from '@expo/vector-icons/FontAwesome5';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { saveConfig } from '../../../../auth';
import { getNotificationToken } from '../../../../utils/notifications';
import { resetErrors } from '../../../actions/error';
import { createErrorMessageSelector, createLoadingSelector } from '../../../actions/selector';
import { updateUserPushToken } from '../../../actions/user';
import messageStyles from '../../../styles/messages';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const loadingSelector = createLoadingSelector( [ 'UPDATE_USER_TOKEN' ] );
const errorSelector = createErrorMessageSelector( [ 'UPDATE_USER_TOKEN' ] );

const mapStateToProps = ( state ) => {
    return {
        token: state.user.token,
        updating: loadingSelector( state ),
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    updateUserPushToken,
    resetErrors
}

const EditSettings = ( props ) => {
    
    const [ loadingToken, setLoadingToken ] = useState( false );

    const [ notifications, setNotifications ] = useState( true );
    const [ saveFilters, setSaveFilters ] = useState( true );

    useEffect( ( ) => {
        setNotifications( global.config.notifications );
        setSaveFilters( global.config.saveFilters );
    }, [ ] );

    const handleSave = ( ) => {

        const new_config = {
            notifications,
            saveFilters
        }

        // If we changed the config
        if ( new_config.notifications != global.config.notifications ) {
            // If we want to receive notifications
            if ( new_config.notifications ) {
                setLoadingToken( true );

                getNotificationToken( ).then( pushToken => {
                    props.updateUserPushToken( pushToken, props.token ); // Set the notification token
                    updateConfig( new_config ); // Save the new config regardless if the previous request succeeded
                } ).catch( error => { // If we couldn't get the notification token
                    console.log( error ); // Log the error
                } ).finally( ( ) => {
                    setLoadingToken( false );
                } );
            
            // If we don't want to receive notifications
            } else {
                props.updateUserPushToken( null, props.token );
                updateConfig( new_config ); // Save the new config regardless if the previous request succeeded
            }

            // Return to prevent further actions
            return;
        
        }
        
        updateConfig( new_config );

    }

    const updateConfig = ( new_config ) => {
        global.config = new_config;
        saveConfig( new_config ); 
    }

    return  <>
            <StatusBar barStyle="dark-content" />
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <View pointerEvents={ ( props.updating || loadingToken ) ? 'none' : 'auto' } style={ styles.screen }>
                <Text style={ styles.title }>Postavke aplikacije</Text>
                <Text style={ styles.subtitle }>Pritiskom na željeno svojstvo, ono se uključuje ili isključuje</Text>
                <TouchableOpacity onPress={ ( ) => setNotifications( !notifications ) } style={ styles.rowButton }>
                    <Text style={ styles.rowButtonText }>Notifikacije</Text>
                    { notifications ? <Icon name="bell" size={ 25 } color={ '#00D6A1' } />
                    : <Icon name="bell" size={ 25 } color={ '#ff4a49' } /> }
                </TouchableOpacity>
                <TouchableOpacity onPress={ ( ) => setSaveFilters( !saveFilters ) } style={ styles.rowButton }>
                    <Text style={ styles.rowButtonText }>Spremanje filtera</Text>
                    { saveFilters ? <Icon name="clipboard-list" size={ 25 } color={ '#00D6A1' } />
                    : <Icon name="clipboard-list" size={ 25 } color={ '#ff4a49' } /> }
                </TouchableOpacity>
            </View>
            <View style={ styles.footer }>
                { ( !props.updating && !loadingToken ) ? <TouchableOpacity onPress={ handleSave } activeOpacity={ 0.7 } style={ styles.saveButton }>
                    <Text style={ styles.saveText }>Spremi</Text>
                </TouchableOpacity> : <ActivityIndicator size="large" color='#068CDD' style={ { marginRight: 20 } } /> }
            </View>
            </>
};

const styles = StyleSheet.create( {
    screen: {
        flex: 1,
        backgroundColor: '#ffffff',
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    title: {
        color: '#0B323C',
        fontSize: 20,
        fontFamily: 'NotoSans-Bold',
        alignSelf: "flex-start",
        marginBottom: 5
    },
    subtitle: {
        color: '#0B323C',
        fontSize: 18,
        fontFamily: 'NotoSans',
        alignSelf: "flex-start",
        marginBottom: 15
    },
    rowButton: {
        width: width - 40,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderTopColor: '#E4E4E4',
        borderTopWidth: 1
    },
    rowButtonText: {
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans',
        width: width - 80
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
        justifyContent: 'flex-end',
        alignItems: "center",
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        borderTopColor: '#E4E4E4',
        borderTopWidth: 1
    }
} );

export default connect( mapStateToProps, mapDispatchToProps )( EditSettings );