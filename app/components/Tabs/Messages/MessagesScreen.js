/*
*
*    Prikazuje poruke razmijenjene između poslodavca i posloprimca
*
*/

import Icon from '@expo/vector-icons/FontAwesome';
import SimpleIcon from '@expo/vector-icons/SimpleLineIcons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { getImageUrl } from '../../../../utils/imageManager';
import { disableGetChat, disableGetMessage, getChat, getMessage, onGetChat, sendMessage } from '../../../../utils/socket';
import { getRecruiter, resetRecruiter } from '../../../actions/recruiter';
import { createErrorMessageSelector } from '../../../actions/selector';
import messageStyles from '../../../styles/messages';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const errorSelector = createErrorMessageSelector( [ 'GET_RECRUITER' ] );

const mapStateToProps = ( state ) => {
    return {
        id: state.user.id,
        token: state.user.token,
        recruiter: state.recruiter.recruiter,
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    getRecruiter,
    resetRecruiter
}

const Messages = ( props ) => {

    const [ chat, setChat ] = useState( { } );
    const [ chatPage, setChatPage ] = useState( 0 );
    const [ preventLoading, setPreventLoading ] = useState( false );
    const [ loadingChat, setLoadingChat ] = useState( true );
    const [ inputValue, setInputValue ] = useState( '' );
    const [ sentMessages, setSentMessages ] = useState( 0 );

    const recruiterID = props.route.params.recruiterID;

    useEffect( ( ) => {

        if ( recruiterID ) { // If the recruiter ID was specified in route params
            props.navigation.setOptions( {
                headerRight: ( ) => {
                        return <TouchableOpacity onPress={ ( ) => props.navigation.navigate( 'RecruiterJobs', { recruiterID } ) }>
                            <SimpleIcon name="user" size={ 25 } color={ '#111111' } />
                        </TouchableOpacity>
                },
                headerRightContainerStyle: {
                    marginRight: 20
                }
            } );

            props.getRecruiter( recruiterID, props.token )

            getChat( recruiterID, 0, chatPage )
        } else { // If the recruiter ID wasn't specified
            props.navigation.goBack( ); // Go back to where we were
        }
        return ( ) => {
            props.resetRecruiter( )
        }
    }, [ ] );

    useEffect( ( ) => {

        if ( props.recruiter ) props.navigation.setOptions( {
            headerTitle: () => <View style={ styles.header }>
                <Text style={ styles.headerTitle }>{ ( props.recruiter.firstName + ' ' + props.recruiter.lastName ).toString( ) }</Text>
                <Text style={ styles.headerSubtitle }>{ props.recruiter.companyName }</Text>
            </View>
        } );

    }, [ props.recruiter ] );

    const handleGetMessage = ( message ) => { // Create a subscription based on the current chat

        if ( message.error != null ) { // If we get an access error from the server
            setChatForbidden( true ); // It means the chat is locked
            return // Return to prevent further actions
        }

        let newChat = { ...chat } // Get the old chat

        if ( !newChat.chat ) return; 

        newChat.chat.unshift( message ) // Append the new message

        setChat( newChat ) // Set the new chat value
    }

    useEffect( ( ) => {
        disableGetMessage( handleGetMessage );
        getMessage( handleGetMessage );

        return ( ) => {
            disableGetMessage( handleGetMessage )
        }
    }, [ chat ] );

    const handleGetChat = ( newChat ) => {
        setLoadingChat( false );
        setChatPage( chatPage + 1 ); // Update the chat page to load
        
        if ( newChat.chat.length < 10 ) setPreventLoading( true ); // We are at the end of the chat history with the recruiter

        if ( chat.chat == null ) { // If this is the first call
            setChat( newChat ); // Set the chat
            return; // Return to prevent further actions
        }

        let oldChat = { ...chat } // Get the old chat
        oldChat.chat = [ ...oldChat.chat, ...newChat.chat ]; // Add the new chat to the old chat
        setChat( oldChat ); // Change the chat
    }

    useEffect( ( ) => {
        disableGetChat( handleGetChat );
        onGetChat( handleGetChat );

        return ( ) => {
            disableGetChat( handleGetChat )
        }
    }, [ chat, chatPage ] );

    const loadNextPage = ( ) => {
        if ( preventLoading ) return; // If there are no more chats to be found
        if ( loadingChat ) return; // Prevent duplicate calls from being made
        setLoadingChat( true );
        getChat( recruiterID, sentMessages, chatPage );
    }

    const handleSendMessage = ( ) => {

        // If we remove whitespaces and there is no message, don't send it
        if ( !inputValue.replace( /\s/g, '' ).length ) return;

        sendMessage( inputValue, recruiterID );
        setInputValue( '' );
        setSentMessages( prev => prev + 1 ); // Increment the number of sent messages
    }

    return <>
            <StatusBar barStyle="dark-content" />
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <View style={ { flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "center" }  }>
                { props.recruiter ? <View style={ styles.listContainer }>
                    <FlatList
                        inverted
                        contentContainerStyle={ { width: '100%' } }
                        data={ chat.chat }
                        keyExtractor={ ( item, index ) => item.MessageID ? item.MessageID.toString( ) : 'chat-item-' + index }
                        renderItem={ ( { item } ) => {
                            const time = item.MessageTime ? new Date( item.MessageTime ) : new Date( )
                            
                            if ( item.MessageText === 'CF385DEAF06072B2B7E465B88696006BAE21A1868C59F0CF576F3EE526038167' ) {
                                return <Text style={ styles.startText }>Početak razgovora</Text>
                            }

                            return ( item.MessageReceiverID === recruiterID || item.receiverID === recruiterID ) ?
                            <View style={ styles.sentMessage }>
                                <View style={ { ...styles.contentContainer, alignItems: 'flex-end', marginRight: 15 } }>
                                    <Text style={ styles.sentMessageText }>{ item.message || item.MessageText }</Text>
                                    <Text style={ styles.messageTime }>{ time.toTimeString( ).substr( 0, 5 ) }</Text>
                                </View>
                            </View>
                            :
                            <View style={ styles.message }>
                                <Image source={ getImageUrl( props.recruiter.imagePath ) } style={ styles.messageImage } />
                                <View style={ styles.contentContainer }>
                                    <Text style={ styles.messageText }>{ item.message || item.MessageText }</Text>
                                    <Text style={ styles.messageTime }>{ time.toTimeString( ).substr( 0, 5 ) }</Text>
                                </View>
                            </View>
                            
                        } }
                        onEndReached={ loadNextPage }
                        onEndReachedThreshold={0.1}
                        initialNumToRender={10}
                        ListFooterComponent={
                            loadingChat && <ActivityIndicator size="large" color='#068CDD' style={ { marginVertical: 30 } } />
                        }
                        // onRefresh={ handleRefresh }
                        // refreshing={ props.refreshing }
                    />
                </View> : <ActivityIndicator size="large" color='#068CDD' style={ { alignSelf: 'center' } } /> }
            </View>
            <View style={ styles.footer }>
                <TextInput autoFocus value={ inputValue } onChangeText={ setInputValue } blurOnSubmit={ false } onSubmitEditing={ handleSendMessage } style={ styles.input } placeholder="Unesite poruku..." />
                <TouchableOpacity onPress={ handleSendMessage }>
                    <Icon name="send-o" size={ 25 } color={ inputValue.replace( /\s/g, '' ).length ? '#068CDD' : '#808080' } />
                </TouchableOpacity>
            </View>
            </>;
};

const styles = StyleSheet.create( {
    headerTitle: {
        fontSize: 16,
        fontFamily: 'NotoSans-Bold',
        textAlign: "center"
    },
    headerSubtitle: {
        color: '#068CDD',
        fontSize: 12,
        fontFamily: 'NotoSans',
        textAlign: "center",
    },
    listContainer: {
        width: '100%'
    },
    startText: {
        color: '#3E4756',
        fontSize: 15,
        fontFamily: 'NotoSans',
        alignSelf: "center",
        marginVertical: 20
    },
    message: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: "flex-start",
        marginVertical: 15
    },
    sentMessage: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: "center",
        marginVertical: 15
    },
    messageImage: {
        width: 50,
        height: 50,
        marginLeft: 10,
        borderRadius: 50
    },
    contentContainer: {
        flexDirection: "column",
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    messageText: {
        color: '#333333',
        fontSize: 15,
        fontFamily: 'NotoSans',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderBottomLeftRadius: 1,
        marginLeft: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        maxWidth: width - 50 - 10 - 10 - 10 // Width, image size, left container padding, space between image and text, right padding
    },
    sentMessageText: {
        color: '#ffffff',
        fontSize: 15,
        fontFamily: 'NotoSans',
        backgroundColor: '#068CDD',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderBottomRightRadius: 1,
        marginLeft: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        maxWidth: width - 10 - 10 // Width, left container padding, right padding
    },
    messageTime: {
        color: '#808080',
        fontSize: 14,
        fontFamily: 'NotoSans',
        marginLeft: 10,
        marginTop: 5
    },
    footer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
        backgroundColor: '#ffffff',
        paddingVertical: 10
    },
    input: {
        color: '#808080',
        fontSize: 14,
        fontFamily: 'NotoSans',
        width: '80%',
        paddingVertical: 5
    }
} );

export default connect( mapStateToProps, mapDispatchToProps )( Messages );