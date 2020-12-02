/*
*
*    Prikazuje ekran za uređivanje edukacije posloprimca
*
*/

import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Picker, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { resetErrors } from '../../../actions/error';
import { createLoadingSelector, createErrorMessageSelector, createSuccessMessageSelector } from '../../../actions/selector';
import { getUser, saveEducation, saveUser } from '../../../actions/user';
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
    getUser,
    saveUser,
    saveEducation,
    resetErrors
}

const EditEducation = ( props ) => {
    
    const [ loaded, setLoaded  ] = useState( false );
    const [ inputs, setInputs ] = useState( {
        country: 'Croatia',
        school: 'Prva Susacka Hrvatska Gimnazija',
        title: '0',
        major: 'Opci',
        graduationYear: '2020'
    } );

    const [ education, setEducation  ] = useState( [ ] );

    // Initial render
    useEffect( ( ) => {

        if ( props.user && props.user.education ) {
            setEducation( props.user.education );
            setLoaded( true );
        }

    }, [ ] );

    // After the user education is successfully updated, update the state
    // This will also reset the revert button
    useEffect( ( ) => {
        if ( props.user && props.user.education ) {
            setEducation( props.user.education );
        }
    }, [ props.user ] );

    const handleChange = ( name, value ) => {
        setInputs( { ...inputs, [name]: value } );
    }

    const handleAdd = ( ) => {
        if ( education.length == 5 ) return;
        for ( const field in inputs ) {
            if ( !inputs[ field ].length ) return;
        }

        setEducation( prev => { return [ ...prev, { ...inputs } ] } );
    }

    const handleRemove = ( index ) => {
        setEducation( prev => {
            const newArray = [ ...prev ];
            newArray.splice( index, 1 ); // Remove the wanted element
            return newArray
        } );
    }

    const handleRevert = ( ) => {
        props.resetErrors( );
        setEducation( props.user.education );
    }

    const handleSave = ( ) => {
        props.resetErrors( );
        props.saveEducation( education, props.token );
    }
    
    return  <View pointerEvents={ props.updating ? 'none' : 'auto' } style={ styles.screen }>
            <StatusBar barStyle="dark-content" />
            { ( props.successMessage ) && <Text style={ messageStyles.success }>{ props.successMessage }</Text> }
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <ScrollView contentContainerStyle={ { alignItems: "center", justifyContent: "center" }  }>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Smjer</Text>
                    <TextInput placeholder="Unesite zavrseni smjer" value={ inputs.major } onChangeText={ v => handleChange( 'major', v ) } style={ styles.input } />
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Škola</Text>
                    <TextInput placeholder="Unesite ime objekta" value={ inputs.school } onChangeText={ v => handleChange( 'school', v ) } style={ styles.input } />
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Godina završetka</Text>
                    <TextInput placeholder="Unesite kolicinu radnog iskustva" keyboardType="number-pad" value={ inputs.graduationYear } onChangeText={ v => handleChange( 'graduationYear', v ) } style={ styles.input } />
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Država edukacije</Text>
                    <TextInput placeholder="Unesite drzavu edukacije" value={ inputs.country } onChangeText={ v => handleChange( 'country', v ) } style={ { ...styles.input, textAlignVertical: "top" } } />
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Titula</Text>
                <Picker style={ styles.picker } selectedValue={ inputs.title } onValueChange={ v => handleChange( 'title', v ) } >
                    <Picker.Item label="Sveučilišni prvostupnik" value="0" />
                    <Picker.Item label="Diploma" value="1" />
                    <Picker.Item label="Certifikat" value="2" />
                </Picker>
                </View>
                <View style={ styles.row }>
                    <TouchableOpacity onPress={ handleAdd } activeOpacity={ 0.7 } style={ styles.addButton }>
                        <Text style={ styles.addText }>Dodaj edukaciju</Text>
                    </TouchableOpacity>
                    { education != props.user.education && <TouchableOpacity onPress={ handleRevert } activeOpacity={ 0.7 } style={ styles.removeButton }>
                        <Text style={ styles.removeText }>Resetiraj</Text>
                    </TouchableOpacity> }
                </View>
                { Object.keys( props.errorMessage ).length > 0 && !props.errorMessage.text && <View style={ styles.educationContainer } >
                    { Object.keys( props.errorMessage ).map( ( error, i ) => {
                        return <Text key={ i } style={ styles.error }>{ props.errorMessage[ error ] }</Text>
                    } ) }
                </View> }
                { loaded ? <View style={ styles.container }>
                    { education.map( ( edu, index ) => {

                        let title;
                        if ( edu.title == 0 ) title = "Sveučilišni prvostupnik"
                        if ( edu.title == 1 ) title = "Diploma"
                        if ( edu.title == 2 ) title = "Certifikat"

                        return <View key={ index } style={ styles.educationContainer } >
                            <View style={ styles.educationRow }>
                                <Text style={ styles.educationTitle }>{ title }</Text>
                                <TouchableOpacity onPress={ ( ) => handleRemove( index ) } activeOpacity={ 0.7 } >
                                    <MaterialIcon name="delete" size={ 25 } color={ '#808080' } />
                                </TouchableOpacity>
                            </View>
                            <Text style={ styles.educationAmount }>{ edu.major }</Text>
                            <Text style={ styles.educationCompany }>{ edu.school }</Text>
                            <Text style={ styles.educationDescription }>{ edu.graduationYear }</Text>
                            <Text style={ styles.educationDescription }>{ edu.country }</Text>
                        </View>
                    } ) }
                </View> : <ActivityIndicator size="large" color='#068CDD' /> }
            </ScrollView>
            { loaded && <View style={ styles.footer }>
                    {!props.updating ? <TouchableOpacity onPress={ handleSave } activeOpacity={ 0.7 } style={ styles.saveButton }>
                            <Text style={ styles.saveText }>Spremi</Text>
                        </TouchableOpacity> : <ActivityIndicator size="large" color='#068CDD' style={ { marginRight: 20 } } /> }
            </View> }
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
        width: width - 40,
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
    addButton: {
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 5,
        backgroundColor: '#808080',
        borderWidth: 1,
        borderColor: '#808080',
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4,
        elevation: 5,

        marginTop: 10,
        marginBottom: 20
    },
    addText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'NotoSans'
    },
    removeButton: {
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#808080',
        backgroundColor: '#ffffff',
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4,
        elevation: 5,

        marginTop: 10,
        marginBottom: 20
    },
    removeText: {
        color: '#808080',
        fontSize: 16,
        fontFamily: 'NotoSans'
    },
    educationContainer: {
        width: width - 40,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        borderWidth: 1,
        borderColor: '#808080',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 10
    },
    educationRow: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    educationTitle: {
        color: '#0B323C',
        fontSize: 18,
        fontFamily: 'NotoSans'
    },
    educationAmount: {
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans'
    },
    educationCompany: {
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans-Bold'
    },
    educationDescription: {
        color: '#0B323C',
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

export default connect( mapStateToProps, mapDispatchToProps )( EditEducation );