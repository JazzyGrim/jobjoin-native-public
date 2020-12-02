/*
*
*    Prikazuje modul za prijavu na oglas
*
*/

import Icon from '@expo/vector-icons/Ionicons';
import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from "react-native-modal";
import { getBackgroundColor, getColor, getStatus } from './utils/colors';

const { width, height } = Dimensions.get( 'window' ); // Get the window dimensions

const ApplicationModal = ( { visible, application, closeModal, openJob } ) => {

    const scrollViewRef = useRef( );

    const [ scrollOffset, setScrollOffset ] = useState( null );
    const [ modalHeight, setModalHeight ] = useState( 500 );

    const handleOnScroll = event => {
        setScrollOffset( event.nativeEvent.contentOffset.y );
    };

    const handleScrollTo = p => {
      if ( scrollViewRef.current ) {
        scrollViewRef.current.scrollTo( p );
      }
    };

    return <Modal
    isVisible={ visible }
    onBackButtonPress={ closeModal }
    onBackdropPress={ closeModal }
    onSwipeComplete={closeModal}
        swipeDirection={ [ 'down' ] }
        scrollTo={ handleScrollTo }
        scrollOffset={ scrollOffset }
        scrollOffsetMax={ ( modalHeight + 100 ) - modalHeight } // content height - ScrollView height
        style={ styles.modal }
        useNativeDriver={ true }
    >
        <View style={ styles.content } onLayout={ ( event ) => {
            var { height } = event.nativeEvent.layout;
            setModalHeight( Math.round( height ) );
        } }>
            <View style={ styles.header }>
                <TouchableOpacity activeOpacity={ 0.8 } onPress={ ( ) => openJob( application.jobID ) } style={ styles.button }>
                    <Text style={ styles.buttonText }>Pogledaj oglas</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                ref={scrollViewRef}
                onScroll={handleOnScroll}
                scrollEventThrottle={16}
                contentContainerStyle={ styles.container }>
            <View style={ styles.infoContainer }>
                <Text style={ styles.companyText }>{ application.JobCompanyName.toUpperCase( ) }</Text>
                <Text style={ styles.titleText }>{ application.JobTitle }</Text>
                <View style={ styles.row }>
                    <Icon name="md-pin" size={ 20 } color={ '#808080' } />
                    <Text style={ styles.locationText }>{ application.JobCity + ', ' + application.JobState }</Text>
                </View>
            </View>
            { application.recruiterResponse && <>
                <Text style={ styles.responseTitle }>Automatski odgovor poslodavca:</Text>
                <View style={ styles.infoContainer }>
                    <Text style={ styles.responseText }>{ application.recruiterResponse }</Text>
                </View>
            </> }
            </ScrollView>
            <View style={ { ...styles.statusContainer, backgroundColor: getBackgroundColor( application.status, application.expired ) } }>
                <Text style={ { ...styles.statusLabel, color: getColor( application.status, application.expired ) } }>Status:</Text>
                <Text style={ { ...styles.statusValue, color: getColor( application.status, application.expired ) } }>{ getStatus( application.status, application.expired ) }</Text>
            </View>
        </View>
    </Modal>
};

const styles = StyleSheet.create( {
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: width
    },
    button: {
        width: width - 40,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#068CDD',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: 'NotoSans'
    },
    container: {
        width: '100%',
    },
    infoContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    content: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: "center",
        backgroundColor: '#ffffff',
        maxHeight: height / 3 * 2,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    companyText: {
        color: '#808080',
        fontSize: 15,
        fontFamily: 'NotoSans-Bold',
    },
    titleText: {
        color: '#0B323C',
        fontSize: 20,
        fontFamily: 'NotoSans-Bold',
        marginTop: 5
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 10
    },
    locationText: {
        color: '#808080',
        fontSize: 15,
        fontFamily: 'NotoSans',
        marginLeft: 10,
    },
    statusContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    statusLabel: {
        fontSize: 20,
        fontFamily: 'NotoSans'
    },
    statusValue: {
        fontSize: 20,
        fontFamily: 'NotoSans'
    },
    responseTitle: {
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans-Bold',
        marginTop: 5,
        marginLeft: 20
    },
    responseText: {
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans',
        marginTop: 5
    }
} );

export default ApplicationModal;