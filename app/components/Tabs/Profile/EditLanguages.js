/*
*
*    Prikazuje ekran za uređivanje jezika posloprimca
*
*/

import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import languageManager from 'languages';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Picker, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { resetErrors } from '../../../actions/error';
import { createLoadingSelector, createErrorMessageSelector, createSuccessMessageSelector } from '../../../actions/selector';
import { getUser, saveLanguages, saveUser } from '../../../actions/user';
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
    saveLanguages,
    saveUser,
    resetErrors
}

const EditLanguages = ( props ) => {
    
    const [ loaded, setLoaded  ] = useState( false );
    const [ inputs, setInputs ] = useState( {
        name: 'hr',
        level: '0'
    } );

    const [ languages, setLanguages  ] = useState( [ ] );
    const [ languageList, setLanguageList  ] = useState( [ ] );


    // Initial render
    useEffect( ( ) => {

        if ( props.user && props.user.languages ) {

            let newLanguageList = []
            let langscodes = languageManager.getAllLanguageCode();

            for (let i = 0; i < langscodes.length; i++) {
                const element = { name: languageManager.getLanguageInfo( langscodes[ i ] ).nativeName, value: langscodes[ i ] };
                newLanguageList.push( element );
            }

            setLanguageList( newLanguageList );
            setLanguages( props.user.languages );
            setLoaded( true );
        }
        
    }, [ ] );

    // After the user languages is successfully updated, update the state
    // This will also reset the revert button
    useEffect( ( ) => {
        if ( props.user && props.user.languages ) {
            setLanguages( props.user.languages );
        }
    }, [ props.user ] );

    const handleChange = ( name, value ) => {
        setInputs( { ...inputs, [name]: value } );
    }

    const handleAdd = ( ) => {
        if ( languages.length == 5 ) return;

        setLanguages( prev => { return [ ...prev, { ...inputs } ] } );
    }

    const handleRemove = ( index ) => {
        setLanguages( prev => {
            const newArray = [ ...prev ];
            newArray.splice( index, 1 ); // Remove the wanted element
            return newArray
        } );
    }

    const handleRevert = ( ) => {
        props.resetErrors( );
        setLanguages( props.user.languages );
    }

    const handleSave = ( ) => {
        props.resetErrors( );
        props.saveLanguages( languages, props.token );
    }
    
    return  <View pointerEvents={ props.updating ? 'none' : 'auto' } style={ styles.screen }>
            <StatusBar barStyle="dark-content" />
            { ( props.successMessage ) && <Text style={ messageStyles.success }>{ props.successMessage }</Text> }
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <ScrollView contentContainerStyle={ { alignItems: "center", justifyContent: "flex-start" }  }>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Jezik</Text>
                    <Picker style={ styles.picker } selectedValue={ inputs.name } onValueChange={ v => handleChange( 'name', v ) } >
                        { languageList.map( ( lan, index ) => {
                            return <Picker.Item key={ index } label={ lan.name } value={ lan.value } />
                        } ) }
                    </Picker>
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Razina znanja</Text>
                <Picker style={ styles.picker } selectedValue={ inputs.level } onValueChange={ v => handleChange( 'level', v ) } >
                    <Picker.Item label="Osnovno znanje" value="0" />
                    <Picker.Item label="Razgovorno znanje" value="1" />
                    <Picker.Item label="Izvrsno znanje" value="2" />
                    <Picker.Item label="Materinji jezik" value="3" />
                </Picker>
                </View>
                <View style={ styles.row }>
                    <TouchableOpacity onPress={ handleAdd } activeOpacity={ 0.7 } style={ styles.addButton }>
                        <Text style={ styles.addText }>Dodaj jezik</Text>
                    </TouchableOpacity>
                    { languages != props.user.languages && <TouchableOpacity onPress={ handleRevert } activeOpacity={ 0.7 } style={ styles.removeButton }>
                        <Text style={ styles.removeText }>Resetiraj</Text>
                    </TouchableOpacity> }
                </View>
                { Object.keys( props.errorMessage ).length > 0 && !props.errorMessage.text && <View style={ styles.languagesContainer } >
                    { Object.keys( props.errorMessage ).map( ( error, i ) => {
                        return <Text key={ i } style={ styles.error }>{ props.errorMessage[ error ] }</Text>
                    } ) }
                </View> }
                { loaded ? <View style={ styles.container }>
                    { languages.map( ( language, index ) => {
                        let level;
                        if ( language.level == 0 ) level = "Osnovno znanje"
                        if ( language.level == 1 ) level = "Razgovorno znanje"
                        if ( language.level == 2 ) level = "Izvrsno znanje"
                        if ( language.level == 3 ) level = "Materinji jezik"

                        return <View key={ index } style={ styles.languagesContainer } >
                            <View style={ styles.languagesRow }>
                                <Text style={ styles.languagesName }>{ languageManager.getLanguageInfo( language.name ).nativeName }</Text>
                                <TouchableOpacity onPress={ ( ) => handleRemove( index ) } activeOpacity={ 0.7 } >
                                    <MaterialIcon name="delete" size={ 25 } color={ '#808080' } />
                                </TouchableOpacity>
                            </View>
                            <Text style={ styles.languagesLevel }>{ level }</Text>
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
    languagesContainer: {
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
    languagesRow: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    languagesName: {
        color: '#0B323C',
        fontSize: 18,
        fontFamily: 'NotoSans'
    },
    languagesLevel: {
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

export default connect( mapStateToProps, mapDispatchToProps )( EditLanguages );