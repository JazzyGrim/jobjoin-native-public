/*
*
*    Prikazuje formu za prijavu poslodavca ukoliko krši pravila platforme
*
*/

import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { resetErrors } from '../../../actions/error';
import { reportRecruiter } from '../../../actions/report';
import messageStyles from '../../../styles/messages';
import { createLoadingSelector, createErrorMessageSelector, createSuccessMessageSelector } from '../../../actions/selector';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const loadingSelector = createLoadingSelector( [ 'REPORT_RECRUITER' ] );
const errorSelector = createErrorMessageSelector( [ 'REPORT_RECRUITER' ] );
const successSelector = createSuccessMessageSelector( [ 'REPORT_RECRUITER' ] );

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
    reportRecruiter,
    resetErrors
}

const ReportRecruiter = ( props ) => {
    
    const [ reason, setReason ] = useState( '' );

    const handleSave = ( ) => {
        props.resetErrors( );
        props.reportRecruiter( reason, props.route.params.recruiterID, props.token );
    }
    
    return  <>
                <StatusBar barStyle="dark-content" />
                { ( props.successMessage ) && <Text style={ messageStyles.success }>{ props.successMessage }</Text> }
                { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
                <View pointerEvents={ props.updating ? 'none' : 'auto' } style={ styles.screen }>
                <ScrollView contentContainerStyle={ { flex: 1, alignItems: "center", justifyContent: "flex-start" }  }>
                    <View style={ styles.inputContainer }>
                        <Text style={ styles.inputLabel }>Razlog prijave</Text>
                        <TextInput placeholder="Unesite razlog prijave" multiline={ true } numberOfLines={ 12 } value={ reason } onChangeText={ setReason } style={ { ...styles.input, textAlignVertical: "top" } } />
                        { props.errorMessage.info && <Text style={ styles.inputError }>{ props.errorMessage.info }</Text> }
                    </View>
                </ScrollView>
                <View style={ styles.footer }>
                    { !props.updating ? <TouchableOpacity onPress={ handleSave } activeOpacity={ 0.7 } style={ styles.saveButton }>
                            <Text style={ styles.saveText }>Prijavi</Text>
                        </TouchableOpacity> : <ActivityIndicator size="large" color='#068CDD' style={ { marginRight: 20 } } /> }
                </View>
                </View>
            </>
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
        width: width - 40,
    },
    inputContainer: {
        width: width - 40,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderColor: '#E4E4E4',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20
    },
    inputLabel: {
        color: '#0B323C',
        fontSize: 18,
        fontFamily: 'NotoSans-Bold',
        marginBottom: 10
    },
    input: {
        width: width - 70, // Width - 50 - padding 10 each side
        color: '#0B323C',
        fontSize: 16
    },
    inputError: {
        marginTop: 5,
        color: '#ff4a49',
        fontSize: 16,
        fontFamily: 'NotoSans'
    },
    picker: {
        width: width - 70
    },
    row: {
        width: width - 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    saveButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 20,
        backgroundColor: '#068CDD',
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    saveText: {
        color: '#ffffff',
        fontSize: 18,
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

export default connect( mapStateToProps, mapDispatchToProps )( ReportRecruiter );