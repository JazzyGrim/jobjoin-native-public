/*
*
*    Prikazuje ekran za biranje lokacije na karti i/ili unosom lokacije u polje za pretraživanje
*
*/

import Icon from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const LocationPicker = ( props ) => {

    return <>
            <GooglePlacesAutocomplete
                placeholder='Pretraži lokacije'
                minLength={2} // minimum length of text to search
                autoFocus={ false }
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed='false'    // true/false/undefined
                fetchDetails={ true }
                renderDescription={row => row.description || row.formatted_address || row.name}
                onPress={ props.onPress }
            
                getDefaultValue={ ( ) => props.initialAddress ? props.initialAddress + ', ' + props.initialCity : '' }
            
                query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyAjeyOcUIzWnH_2EHcmzC8xOskFjOyekR4',
                    language: 'hr', // language of the results
                }}
            
                GooglePlacesDetailsQuery={{
                    // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                    fields: 'address_component,geometry',
                  }}

                styles={{
                    textInputContainer: {
                        width: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: 5,
                        borderTopWidth: 0,
                        borderBottomColor: '#E4E4E4',
                        borderBottomWidth: 1,
                        height: 50,
                        alignItems: 'center'
                    },
                    textInput: {
                        height: 36,
                        fontSize: 16,
                        margin: 0,
                        padding: 0
                    },
                    description: {
                        fontFamily: 'NotoSans',
                        fontWeight: 'bold'
                    },
                    poweredContainer: {
                        display: 'none'
                    },
                    container: {
                        position: 'absolute',
                        top: props.successMessage ? 50 : 0,
                        left: 0,
                        width: width,
                        zIndex: 10,
                        backgroundColor: '#ffffff',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.18,
                        shadowRadius: 1.00,

                        elevation: 1,
                    },
                    listView: {
                        paddingVertical: 5
                    },
                    row: {
                        height: 46
                    }
                }}
            
                currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                currentLocationLabel="Trenutna lokacija"
                nearbyPlacesAPI='GoogleReverseGeocoding' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}
                renderLeftButton={ ( ) => <Icon style={ { marginTop: 10, marginLeft: 15 } } name="search" size={ 18 } solid color={ '#0B323C' } />}
                // debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                />
            <MapView
                initialRegion={{
                    latitude: 45.35224960,
                    longitude: 14.36595050,
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.004,
                }}
                style={ { ...styles.mapStyle, ...props.style } }
            >
                <Marker
                    coordinate={ props.region }
                    title={'Kuca'}
                    description={'Lokacija kuce'}
                    />
            </MapView>
        </>
};

const styles = StyleSheet.create( {
    mapStyle: {
        flex: 1
    }
} );

export default LocationPicker;