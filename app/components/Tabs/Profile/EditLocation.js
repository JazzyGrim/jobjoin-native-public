/*
*
*    Prikazuje ekran za uređivanje lokacije posloprimca
*
*/

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import jobTypes from '../../../../jobTypes'; // Get the job types
import { resetErrors } from '../../../actions/error';
import { createLoadingSelector, createErrorMessageSelector, createSuccessMessageSelector } from '../../../actions/selector';
import { saveAddress } from '../../../actions/user';
import messageStyles from '../../../styles/messages';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import LocationPicker from './LocationPicker';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const loadingSelector = createLoadingSelector( [ 'SAVE_ADDRESS' ] );
const errorSelector = createErrorMessageSelector( [ 'SAVE_ADDRESS' ] );
const successSelector = createSuccessMessageSelector( [ 'SAVE_ADDRESS' ] );

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
    saveAddress,
    resetErrors
}

const EditLocation = ( props ) => {

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

    const handleSave = ( ) => {
        props.resetErrors( );
        props.saveAddress( { ...address, ...region }, props.token );
    }

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
    
    return  <View pointerEvents={ props.updating ? 'none' : 'auto' } style={ styles.screen }>
            <StatusBar barStyle="dark-content" />
            { ( props.successMessage ) && <Text style={ messageStyles.success }>{ props.successMessage }</Text> }
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <LocationPicker
                onPress={ onMapPress }
                region={ region }
                initialAddress={ props.route.params.address }
                initialCity={ props.route.params.city }
                successMessage={ props.successMessage }
            />
            <View style={ styles.footer }>
                {!props.updating ? <TouchableOpacity disabled={ !address } onPress={ handleSave } activeOpacity={ 0.7 } style={ !address ? { ...styles.saveButton, opacity: 0.3 } : styles.saveButton }>
                        <Text style={ styles.saveText }>Spremi</Text>
                </TouchableOpacity> : <ActivityIndicator size="large" color='#068CDD' style={ { marginRight: 20 } } /> }
            </View>
            </View>
};

const styles = StyleSheet.create( {
    mapStyle: {
        flex: 1
    },
    screen: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: "flex-start"
    },
    error: {
        color: '#ff4a49',
        fontSize: 16,
        fontFamily: 'NotoSans',
        marginVertical: 5
    },
    container: {
        width: width - 20,
    },
    row: {
        width: width - 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: '#E4E4E4',
        borderBottomWidth: 1,
        padding: 10
    },
    rowText: {
        color: '#0B323C',
        fontSize: 18,
        fontFamily: 'NotoSans-Bold'
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

export default connect( mapStateToProps, mapDispatchToProps )( EditLocation );