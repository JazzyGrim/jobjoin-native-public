/*
*
*    Prikazuje ekran za uređivanje traženog vrsta posla posloprimca
*
*/

import Icon from '@expo/vector-icons/Feather';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import jobTypes from '../../../../jobTypes'; // Get the job types
import { resetErrors } from '../../../actions/error';
import { createLoadingSelector, createErrorMessageSelector, createSuccessMessageSelector } from '../../../actions/selector';
import { saveJobType } from '../../../actions/user';
import messageStyles from '../../../styles/messages';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const loadingSelector = createLoadingSelector( [ 'SAVE_INFO' ] );
const errorSelector = createErrorMessageSelector( [ 'SAVE_INFO' ] );
const successSelector = createSuccessMessageSelector( [ 'SAVE_INFO' ] );

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
    saveJobType,
    resetErrors
}

const EditLanguages = ( props ) => {

    const [ selected, setSelected  ] = useState( '' );

    // After the user languages is successfully updated, update the state
    useEffect( ( ) => {
        if ( props.user && props.user.jobTypeID ) {
            setSelected( props.user.jobTypeID );
        }
    }, [ props.user ] );

    const handleSave = ( ) => {
        props.resetErrors( );
        props.saveJobType( selected, props.token );
    }
    
    return  <View pointerEvents={ props.updating ? 'none' : 'auto' } style={ styles.screen }>
            <StatusBar barStyle="dark-content" />
            { ( props.successMessage ) && <Text style={ messageStyles.success }>{ props.successMessage }</Text> }
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <ScrollView contentContainerStyle={ { alignItems: "center", justifyContent: "flex-start" }  }>
                <View style={ styles.container }>
                    { Object.keys( jobTypes ).map( ( type, index ) => {
                        let name = jobTypes[ type ];

                        return <TouchableOpacity key={ index } style={ styles.row } onPress={ ( ) => setSelected( type ) } >
                            <Text style={ styles.rowText }>{ name }</Text>
                            { selected == type && <Icon name="check-circle" size={ 24 } color={ '#00D6A1' } /> }
                        </TouchableOpacity>
                    } ) }
                </View>
            </ScrollView>
            <View style={ styles.footer }>
                {!props.updating ? <TouchableOpacity onPress={ handleSave } activeOpacity={ 0.7 } style={ styles.saveButton }>
                        <Text style={ styles.saveText }>Spremi</Text>
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

export default connect( mapStateToProps, mapDispatchToProps )( EditLanguages );