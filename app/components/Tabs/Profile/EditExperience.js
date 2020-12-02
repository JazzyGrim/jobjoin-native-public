/*
*
*    Prikazuje ekran za uređivanje iskustva posloprimca
*
*/

import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Picker, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { resetErrors } from '../../../actions/error';
import { createLoadingSelector, createErrorMessageSelector, createSuccessMessageSelector } from '../../../actions/selector';
import { getUser, saveExperience, saveUser } from '../../../actions/user';
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
    saveExperience,
    saveUser,
    resetErrors
}

const EditExperience = ( props ) => {
    
    const [ loaded, setLoaded  ] = useState( false );
    const [ inputs, setInputs ] = useState( {
        title: 'Programer',
        company: 'JobJoin',
        amount: '48',
        description: 'Radio sam kao programer.',
        typeID: 'hzp9Ns0xhuB'
    } );

    const [ experience, setExperience  ] = useState( [ ] );

    // Initial render
    useEffect( ( ) => {

        if ( props.user && props.user.experience ) {
            setExperience( props.user.experience );
            setLoaded( true );
        }
        
    }, [ ] );

    // After the user experience is successfully updated, update the state
    // This will also reset the revert button
    useEffect( ( ) => {
        if ( props.user && props.user.experience ) {
            setExperience( props.user.experience );
        }
    }, [ props.user ] );

    const handleChange = ( name, value ) => {
        setInputs( { ...inputs, [name]: value } );
    }

    const handleAdd = ( ) => {
        if ( experience.length == 5 ) return;
        for ( const field in inputs ) {
            if ( !inputs[ field ].length ) return;
        }

        setExperience( prev => { return [ ...prev, { ...inputs } ] } );
    }

    const handleRemove = ( index ) => {
        setExperience( prev => {
            const newArray = [ ...prev ];
            newArray.splice( index, 1 ); // Remove the wanted element
            return newArray
        } );
    }

    const handleRevert = ( ) => {
        props.resetErrors( );
        setExperience( props.user.experience );
    }

    const handleSave = ( ) => {
        props.resetErrors( );
        props.saveExperience( experience, props.token );
    }
    
    return  <View pointerEvents={ props.updating ? 'none' : 'auto' } style={ styles.screen }>
            <StatusBar barStyle="dark-content" />
            { ( props.successMessage ) && <Text style={ messageStyles.success }>{ props.successMessage }</Text> }
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <ScrollView contentContainerStyle={ { alignItems: "center", justifyContent: "center" }  }>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Titula</Text>
                    <TextInput placeholder="Unesite titlu" value={ inputs.title } onChangeText={ v => handleChange( 'title', v ) } style={ styles.input } />
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Firma</Text>
                    <TextInput placeholder="Unesite ime firme" value={ inputs.company } onChangeText={ v => handleChange( 'company', v ) } style={ styles.input } />
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Količina u mjesecima</Text>
                    <TextInput placeholder="Unesite kolicinu radnog iskustva" keyboardType="number-pad" value={ inputs.amount } onChangeText={ v => handleChange( 'amount', v ) } style={ styles.input } />
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Opis radnog mjesta</Text>
                    <TextInput placeholder="Opisite vase radno iskustvo" multiline numberOfLines={ 3 } value={ inputs.description } onChangeText={ v => handleChange( 'description', v ) } style={ { ...styles.input, textAlignVertical: "top" } } />
                </View>
                <View style={ styles.inputContainer }>
                    <Text style={ styles.inputLabel }>Kategorija radnog iskustva</Text>
                <Picker style={ styles.picker } selectedValue={ inputs.typeID } onValueChange={ v => handleChange( 'typeID', v ) } >
                    <Picker.Item label="IT" value="hzp9Ns0xhuB" />
                    <Picker.Item label="Waiter" value="Zs3HsJefXpB" />
                </Picker>
                </View>
                <View style={ styles.row }>
                    <TouchableOpacity onPress={ handleAdd } activeOpacity={ 0.7 } style={ styles.addButton }>
                        <Text style={ styles.addText }>Dodaj iskustvo</Text>
                    </TouchableOpacity>
                    { experience != props.user.experience && <TouchableOpacity onPress={ handleRevert } activeOpacity={ 0.7 } style={ styles.removeButton }>
                        <Text style={ styles.removeText }>Resetiraj</Text>
                    </TouchableOpacity> }
                </View>
                { Object.keys( props.errorMessage ).length > 0 && !props.errorMessage.text && <View style={ styles.experienceContainer } >
                    { Object.keys( props.errorMessage ).map( ( error, i ) => {
                        return <Text key={ i } style={ styles.error }>{ props.errorMessage[ error ] }</Text>
                    } ) }
                </View> }
                { loaded ? <View style={ styles.container }>
                    { experience.map( ( exp, index ) => {
                        return <View key={ index } style={ styles.experienceContainer } >
                            <View style={ styles.experienceRow }>
                                <Text style={ styles.experienceTitle }>{ exp.title }</Text>
                                <TouchableOpacity onPress={ ( ) => handleRemove( index ) } activeOpacity={ 0.7 } >
                                    <MaterialIcon name="delete" size={ 25 } color={ '#808080' } />
                                </TouchableOpacity>
                            </View>
                            <Text style={ styles.experienceAmount }>{ exp.amount } Mjeseci</Text>
                            <Text style={ styles.experienceCompany }>{ exp.company }</Text>
                            <Text style={ styles.experienceDescription }>{ exp.description }</Text>
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
    experienceContainer: {
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
    experienceRow: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    experienceTitle: {
        color: '#0B323C',
        fontSize: 18,
        fontFamily: 'NotoSans'
    },
    experienceAmount: {
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans'
    },
    experienceCompany: {
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans-Bold'
    },
    experienceDescription: {
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

export default connect( mapStateToProps, mapDispatchToProps )( EditExperience );