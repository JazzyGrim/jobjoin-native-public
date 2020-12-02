/*
*
*    Univerzalne funkcije zaslužne za korištenje web socketa
*
*/

import openSocket from "socket.io-client"
import config from '../config'

let socket = openSocket( config.server.url )

export const connectWithToken = ( token ) => {
    socket = openSocket( config.server.url + '?token=' + token )
}

export const closeSocket = ( ) => socket.close( );

export const getChat = ( receiverID, offset, page ) => {
    socket.emit( 'get-chat', { receiverID, offset, page } )
}

export const onGetChat = ( callback ) => {
    socket.on( 'get-chat', callback )
}

export const disableGetChat = ( func ) => {
    socket.off( 'get-chat', func )
}

export const sendMessage = ( message, receiverID ) => {
    socket.emit( 'chat', { message, receiverID } )
}

export const getMessage = ( callback ) => {
    socket.on( 'chat', callback );
}

export const disableGetMessage = ( func ) => {
    socket.off( 'chat', func )
}