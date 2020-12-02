export const getChatHistory = ( page, token ) => dispatch => {
    dispatch( { type: 'GET_CHAT_HISTORY_TRIGGER', payload: { page, token } } )
}

export const updateChatHistory = ( message, userID ) => dispatch => {
    dispatch( { type: 'UPDATE_CHAT_HISTORY', payload: { message: message.message, userID } } )
}

export const resetChatHistory = ( ) => dispatch => {
    dispatch( { type: 'RESET_CHAT_HISTORY', payload: { } } )
}