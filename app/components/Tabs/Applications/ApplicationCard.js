/*
*
*    Prikazuje karticu za individialnu prijavu na oglas
*
*/

import Icon from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getBackgroundColor, getColor, getStatus } from './utils/colors';

const ApplicationCard = ( { application, handlePress } ) => {
    return  <TouchableOpacity style={ styles.container } activeOpacity={0.8} onPress={ handlePress } >
                <View style={ styles.content }>
                    <Text style={ styles.companyText }>{ application.JobCompanyName.toUpperCase( ) }</Text>
                    <Text style={ styles.titleText }>{ application.JobTitle }</Text>
                    <View style={ styles.row }>
                        <Icon name="md-pin" size={ 20 } color={ '#808080' } />
                        <Text style={ styles.locationText }>{ application.JobCity + ', ' + application.JobState }</Text>
                    </View>
                </View>
                <View style={ { ...styles.statusContainer, backgroundColor: getBackgroundColor( application.status, application.expired ) } }>
                    <Text style={ { ...styles.statusLabel, color: getColor( application.status, application.expired ) } }>Status:</Text>
                    <Text style={ { ...styles.statusValue, color: getColor( application.status, application.expired ) } }>{ getStatus( application.status, application.expired ) }</Text>
                </View>
            </TouchableOpacity>
};

const styles = StyleSheet.create( {
    container: {
        marginHorizontal: '5%',
        marginVertical: 10,
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4,
        elevation: 5
    },
    content: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 20
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
    }
} );

export default ApplicationCard;