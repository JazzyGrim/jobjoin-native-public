/*
*
*    Prikazuje ekran za uređivanje osnovnih podataka posloprimca
*
*/

import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { resetErrors } from '../../../actions/error';
import { createErrorMessageSelector, createLoadingSelector, createSuccessMessageSelector } from '../../../actions/selector';
import { getUser, saveUser } from '../../../actions/user';
import messageStyles from '../../../styles/messages';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const loadingSelector = createLoadingSelector( [ 'SAVE_INFO', 'SAVE_USER' ] );
const errorSelector = createErrorMessageSelector( [ 'SAVE_INFO', 'SAVE_USER' ] );
const successSelector = createSuccessMessageSelector( [ 'SAVE_INFO', 'SAVE_USER' ] );

const mapStateToProps = ( state ) => {
    return {
        id: state.user.id,
        token: state.user.token,
        user: state.user.user,
        updating: loadingSelector( state ),
        successMessage: successSelector( state ),
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    getUser,
    saveUser,
    resetErrors
}

const calucateLocation = ( location ) => {
    if ( location ) {
        if ( location.info.address === null && location.info.region === null ) return 'Nije postavljeno.';
        return `${ location.info.address || '-' }, ${ location.info.region || '-' }`;
    }
    return 'Nije postavljeno.';
}

const EditProfile = ( props ) => {
    
    const [ showDatePicker, setShowDatePicker ] = useState( false );
    const [ location, setLocation ] = useState( null );
    const [ inputs, setInputs ] = useState( {
        firstName: '',
        lastName: '',
        birthday: new Date( ),
        about: '',
    } );

    useEffect( ( ) => {
        
        props.getUser( props.id, true, true, props.token );

    }, [ ] );


    useEffect( ( ) => {
        
        console.log( props );

    }, [ props ] );

    useEffect( ( ) => {
        if ( props.user && props.user.detailed ) {
            setInputs( { ...inputs,
                firstName: props.user.firstName,
                lastName: props.user.lastName,
                birthday: props.user.birthday !== null ? new Date( props.user.birthday ) : null,
                about: props.user.about
            } );
            
            setLocation( {
                info: { 
                    address: props.user.address,
                    city: props.user.city,
                    region: props.user.state,
                    postalCode: props.user.zip,
                    country: props.user.country
                },
                lat: props.user.lat,
                long: props.user.long
            } );
        }
    }, [ props.user ] );

    const handleChange = ( name, value ) => {
        setInputs( { ...inputs, [name]: value } );
    }

    const handleSave = ( ) => {
        props.resetErrors( );
        props.saveUser( inputs.firstName, inputs.lastName, inputs.birthday.toJSON().slice(0, 10), inputs.about, location, props.token );
    }
    
    return  <>
            <StatusBar barStyle="dark-content" />
            { ( props.successMessage ) && <Text style={ messageStyles.success }>{ props.successMessage }</Text> }
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <View pointerEvents={ props.updating ? 'none' : 'auto' } style={ styles.screen }>
                { props.user && props.user.detailed ? <ScrollView contentContainerStyle={ styles.container }>
                    <View style={ { ...styles.inputContainer, borderTopWidth: 0 } }>
                        <Text style={ styles.inputLabel }>Ime</Text>
                        <TextInput placeholder="Unesite ime" value={ inputs.firstName } onChangeText={ v => handleChange( 'firstName', v ) } style={ styles.input } />
                        { props.errorMessage.userFirstName && <Text style={ styles.inputError }>{ props.errorMessage.userFirstName }</Text> }
                    </View>
                    <View style={ styles.inputContainer }>
                        <Text style={ styles.inputLabel }>Prezime</Text>
                        <TextInput placeholder="Unesite prezime" value={ inputs.lastName } onChangeText={ v => handleChange( 'lastName', v ) } style={ styles.input } />
                        { props.errorMessage.userLastName && <Text style={ styles.inputError }>{ props.errorMessage.userLastName }</Text> }
                    </View>
                    <View style={ styles.inputContainer }>
                        <Text style={ styles.inputLabel }>Datum rođenja</Text>
                        <TouchableOpacity onPress={ ( ) => setShowDatePicker( true ) }>
                            <Text style={ styles.input }>{ inputs.birthday !== null ? inputs.birthday.getDate( ) + "/" + ( inputs.birthday.getMonth( ) + 1 ) + "/" + inputs.birthday.getFullYear( ) : 'Nije postavljeno' }</Text>
                        </TouchableOpacity>
                        { props.errorMessage.userBirthday && <Text style={ styles.inputError }>{ props.errorMessage.userBirthday }</Text> }
                    </View>
                    { showDatePicker && <DateTimePicker value={ inputs.birthday } onChange={ ( e, v ) => { setShowDatePicker( false ); if ( v ) handleChange( 'birthday', v ) } } maximumDate={new Date( ) } display="spinner" /> }
                    <View style={ styles.inputContainer }>
                        <Text style={ styles.inputLabel }>Opis</Text>
                        <TextInput placeholder="Unesite opis" multiline={ true } numberOfLines={ 6 } value={ inputs.about } onChangeText={ v => handleChange( 'about', v ) } style={ { ...styles.input, textAlignVertical: "top" } } />
                        { props.errorMessage.userAbout && <Text style={ styles.inputError }>{ props.errorMessage.userAbout }</Text> }
                    </View>
                    <TouchableOpacity onPress={ ( ) => { props.navigation.push( 'EditLocation', { address: props.user.address, city: props.user.city, region: props.user.state, postalCode: props.user.zip, country: props.user.country, lat: props.user.lat, long: props.user.long } ) } } style={ styles.rowButton }>
                        <View style={ styles.rowColumn }>
                            <Text style={ styles.rowButtonText }>Trenutna adresa</Text>
                            <Text style={ { ...styles.rowButtonText, color: '#808080' } }>{ calucateLocation( location ) }</Text>
                        </View>
                        <MaterialIcon name="mode-edit" size={ 25 } color={ '#808080' } />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ ( ) => { props.navigation.push( 'EditJobType' ) } } style={ styles.rowButton }>
                        <Text style={ styles.rowButtonText }>Uredi traženi posao</Text>
                        <MaterialIcon name="mode-edit" size={ 25 } color={ '#808080' } />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ ( ) => { props.navigation.push( 'EditExperience' ) } } style={ styles.rowButton }>
                        <Text style={ styles.rowButtonText }>Uredi radna iskustva</Text>
                        <MaterialIcon name="mode-edit" size={ 25 } color={ '#808080' } />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ ( ) => { props.navigation.push( 'EditEducation' ) } } style={ styles.rowButton }>
                        <Text style={ styles.rowButtonText }>Uredi edukaciju</Text>
                        <MaterialIcon name="mode-edit" size={ 25 } color={ '#808080' } />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ ( ) => { props.navigation.push( 'EditLanguages' ) } } style={ styles.rowButton }>
                        <Text style={ styles.rowButtonText }>Uredi jezike</Text>
                        <MaterialIcon name="mode-edit" size={ 25 } color={ '#808080' } />
                    </TouchableOpacity>
                    </ScrollView> : <ActivityIndicator size="large" color='#068CDD' style={ { alignSelf: "center" } } /> }
            </View>
            { props.user && props.user.detailed && <View style={ styles.footer }>
                    {!props.updating ? <TouchableOpacity onPress={ handleSave } activeOpacity={ 0.7 } style={ styles.saveButton }>
                            <Text style={ styles.saveText }>Spremi</Text>
                        </TouchableOpacity> : <ActivityIndicator size="large" color='#068CDD' style={ { marginRight: 20 } } /> }
            </View> }
            </>
};

const styles = StyleSheet.create( {
    screen: {
        flex: 1,
        backgroundColor: '#ffffff',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    inputContainer: {
        width: width - 40,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderTopColor: '#E4E4E4',
        borderTopWidth: 1,
    },
    inputLabel: {
        color: '#0B323C',
        fontSize: 18,
        fontFamily: 'NotoSans'
    },
    input: {
        width: width - 70, // Width - 50 - padding 10 each side
        color: '#0B323C',
        fontSize: 16,
        maxHeight: 200
    },
    inputError: {
        marginTop: 5,
        color: '#ff4a49',
        fontSize: 16,
        fontFamily: 'NotoSans'
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
    rowColumn: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
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

export default connect( mapStateToProps, mapDispatchToProps )( EditProfile );