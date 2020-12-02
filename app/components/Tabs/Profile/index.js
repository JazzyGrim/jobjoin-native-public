/*
*
*    Prikazuje profil posloprimca te poveznice za uređivanje profila, postavki aplikacije te prijavu greške
*
*/

import Icon from '@expo/vector-icons/FontAwesome';
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useCallback } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { signOut } from '../../../../auth'; // Get the signOut method to save the user details to secure storage
import { getAge } from '../../../../utils/DateDifference'; // Get the signOut method to save the user details to secure storage
import { getImageUrl } from '../../../../utils/imageManager';
import { closeSocket } from '../../../../utils/socket';
import { resetErrors } from '../../../actions/error';
import { createErrorMessageSelector, createLoadingSelector, createSuccessMessageSelector } from '../../../actions/selector';
import { getUser, logout, removePushToken, saveImage } from '../../../actions/user';
import messageStyles from '../../../styles/messages';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const loadingSelector = createLoadingSelector( [ 'GET_USER' ] );
const errorSelector = createErrorMessageSelector( [ 'GET_USER' ] );
const successSelector = createSuccessMessageSelector( [ 'GET_USER' ] );

const mapStateToProps = ( state ) => {
    return {
        id: state.user.id,
        token: state.user.token,
        user: state.user.user,
        loading: loadingSelector( state ),
        successMessage: successSelector( state ),
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    getUser,
    saveImage,
    logout,
    removePushToken,
    resetErrors
}

const Profile = ( props ) => {

    useFocusEffect( useCallback( ( ) => {
          StatusBar.setBarStyle( 'dark-content' );
          Platform.OS === 'android' && StatusBar.setBackgroundColor('#ffffff');
        }, [ ] )
    );

    useEffect( ( ) => {
        if ( !props.user ) props.getUser( props.id, false, false, props.token );
    }, [ props.user ] );

    useEffect( ( ) => {
        // After the token has been removed
        if ( !props.token ) props.navigation.navigate( 'Login' ); // Navigate to the login screen
    }, [ props.token ] );

    const handleImageChange = ( ) => {
        ImagePicker.requestCameraRollPermissionsAsync( ).then( ( ) => {
            ImagePicker.launchImageLibraryAsync( ).then( image => {
                let data = new FormData( );
                data.append( 'image', { uri: image.uri, type: 'image/jpeg', name: 'profile.jpg' } );
                props.saveImage( data, props.token );
            } )
        } )
    }

    const handleLogout = ( ) => {
        closeSocket( );
        props.removePushToken( props.token ); // Ask the server to delete our notification key
        props.logout( ); // Remove the user's info from the redux state
        signOut( ); // Remove the user's info from SecureStorage
        props.resetErrors( ); // Reset all errors
    }
    
    return  <>
            <StatusBar barStyle="dark-content" />
            { props.successMessage && <Text style={ messageStyles.success }>{ props.successMessage }</Text> }
            { props.errorMessage.text && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <SafeAreaView style={ styles.screen }>
                <ScrollView contentContainerStyle={ styles.container }>
                    { !props.loading ? 
                        ( props.user &&
                            <>
                                <TouchableOpacity activeOpacity={ 0.7 } onPress={ handleImageChange } >
                                    <Image source={ getImageUrl( props.user.imagePath ) } style={ styles.image } />
                                </TouchableOpacity>
                                <Text style={ styles.title }>{ props.user.firstName + ' ' + props.user.lastName }</Text>
                                { props.user.birthday != null && <Text style={ styles.subtitle }>{ getAge( new Date( props.user.birthday ) ) + ' godina' }</Text> }
                                <Text numberOfLines={ 3 } style={ styles.about }>{ props.user.about || 'Opis nije postavljen.' }</Text>
                            </> )
                    : <ActivityIndicator style={ styles.userLoading } size="large" color='#068CDD' /> }
                    <View style={ styles.buttonContainer }>
                        <TouchableOpacity onPress={ ( ) => { props.navigation.navigate( 'EditProfile' ) } } activeOpacity={ 0.7 } style={ styles.button }>
                            <View style={ { ...styles.icon, backgroundColor: '#068CDD' } }>
                                <Icon name="user-circle" size={ 25 } color={ '#ffffff' } />
                            </View>
                            <Text style={ styles.buttonText }>Uredi profil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ ( ) => { props.navigation.navigate( 'EditSettings' ) } } activeOpacity={ 0.7 } style={ styles.button }>
                            <View style={ { ...styles.icon, backgroundColor: '#FEC912' } }>
                                <Icon name="cogs" size={ 25 } color={ '#ffffff' } />
                            </View>
                            <Text style={ styles.buttonText }>Postavke aplikacije</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ ( ) => { props.navigation.navigate( 'ReportBug' ) } } activeOpacity={ 0.7 } style={ styles.button }>
                            <View style={ { ...styles.icon, backgroundColor: '#00D6A1' } }>
                                <Icon name="bug" size={ 25 } color={ '#ffffff' } />
                            </View>
                            <Text style={ styles.buttonText }>Prijavi grešku</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ handleLogout } activeOpacity={ 0.7 } style={ styles.button }>
                            <View style={ { ...styles.icon } }>
                                <MaterialIcon name="exit-to-app" size={ 25 } color={ '#ffffff' } />
                            </View>
                            <Text style={ styles.buttonText }>Odjava</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
            </>
};

Profile.navigationOptions = {
    headerShown: false
};

const styles = StyleSheet.create( {
    screen: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        width: width,
        minHeight: '100%',
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    userLoading: {
        marginBottom: 20
    },
    title: {
        color: '#333333',
        fontSize: 18,
        fontFamily: 'NotoSans-Bold',
        marginTop: 10
    },
    subtitle: {
        color: '#333333',
        fontSize: 16,
        fontFamily: 'NotoSans',
        marginBottom: 20
    },
    about: {
        color: '#333333',
        fontSize: 15,
        fontFamily: 'NotoSans',
        marginBottom: 20,
        alignSelf: "center",
        textAlign: "center"
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 20,
        backgroundColor: '#333333'
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "flex-start"
    },
    button: {
        width: '100%',
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: "center",
        marginVertical: 7
    },
    buttonText: {
        color: '#333333',
        fontSize: 16,
        fontFamily: 'NotoSans',
        marginLeft: 10
    },
    icon: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#808080',
        justifyContent: "center",
        alignItems: "center"
    }
} );

export default connect( mapStateToProps, mapDispatchToProps )( Profile );