/*
*
*    Prikazuje povijest razgovora posloprimca s poslodavcima
*
*/

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { disableGetMessage, getMessage } from '../../../../utils/socket';
import { getChatHistory, resetChatHistory, updateChatHistory } from '../../../actions/chat';
import { createErrorMessageSelector, createLoadingSelector } from '../../../actions/selector';
import messageStyles from '../../../styles/messages';
import Empty from '../utils/Empty';
import MessageCard from './MessageCard';

const loadingSelector = createLoadingSelector( [ 'GET_CHAT_HISTORY' ] );
const errorSelector = createErrorMessageSelector( [ 'GET_CHAT_HISTORY' ] );

const mapStateToProps = ( state ) => {
    return {
        chatHistory: state.chat.chatHistory,
        historyPage: state.chat.historyPage,
        loadingChat: loadingSelector( state ),
        id: state.user.id,
        token: state.user.token,
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    getChatHistory,
    updateChatHistory,
    resetChatHistory
}

const Messages = ( props ) => {

    useFocusEffect( useCallback( ( ) => {
            StatusBar.setBarStyle( 'dark-content' );
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#ffffff');
        }, [ ] )
    );

    const [ refreshing, setRefreshing ] = useState( false );
    
    useEffect( ( ) => {
        if ( refreshing && !props.loadingChat ) setRefreshing( false );
    }, [ props.loadingChat ] );

    const handleGetMessage = ( message ) => {
        if ( message.error != null ) return // If we got an access error
        
        let userID;
        ( message.receiverID == props.id ) ? userID = message.senderID : userID = message.receiverID;
        // Are we receiving this message?    If so, the recruiter ID is the sender, otherwise we sent the message, and the receiver is the recruiter

        props.updateChatHistory( message, userID );
    }

    useEffect( ( ) => {

        props.getChatHistory( props.historyPage, props.token );

        getMessage( handleGetMessage );

        return ( ) => {
            disableGetMessage( handleGetMessage );
            props.resetChatHistory( );
        }
    }, [ ] );

    const handleRefresh = ( ) => {
        setRefreshing( true );
        props.resetChatHistory( );
        props.getChatHistory( 0, props.token );
    }

    const loadNextPage = ( ) => {
        props.getChatHistory( props.historyPage, props.token );
    }

    return <>
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <SafeAreaView style={ { flex: 1, alignItems: "center", justifyContent: "center" }  }>
                <View style={ styles.listContainer }>
                    <FlatList
                        contentContainerStyle={ { width: '100%', height: '100%' } }
                        data={ props.chatHistory }
                        keyExtractor={ item => item.messageID.toString( ) }
                        renderItem={ ( { item } ) => (
                            <TouchableOpacity activeOpacity={ 0.7 } onPress={ ( ) => props.navigation.navigate( 'MessagesScreen', { recruiterID: item.recruiterID } ) } >
                                <MessageCard message={ item } />
                            </TouchableOpacity>
                        ) }
                        onEndReached={ loadNextPage }
                        onEndReachedThreshold={0.1}
                        initialNumToRender={10}
                        ListFooterComponent={
                            props.loadingChat && !refreshing && <ActivityIndicator size="large" color='#068CDD' style={ { marginVertical: 30 } } />
                        }
                        onRefresh={ handleRefresh }
                        refreshing={ refreshing }
                        ListEmptyComponent={
                            !props.loadingChat
                            && <Empty
                                image={ require( '../../../../assets/empty-jobs.png' ) }
                                title="Prazno"
                                subtitle="Nije pronađen niti jedan razgovor"
                            />
                        }
                    />
                </View>
            </SafeAreaView>
            </>;
};

const styles = StyleSheet.create( {
    listContainer: {
        width: '90%',
        height: '95%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4,
        elevation: 5
    }
} );

export default connect( mapStateToProps, mapDispatchToProps )( Messages );