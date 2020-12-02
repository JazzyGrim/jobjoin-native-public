export default function reducer( state={
    chatHistory: [ ],
    historyPage: 0,
    unreadMessages: 0
}, action ) {

    let newState = { ...state };
    let newHistory = [ ...state.chatHistory ];

    switch( action.type ) {

        case "GET_CHAT_HISTORY_SUCCESS":
            if ( state.historyPage == 0 ) { // If this is the first page
                newHistory = action.payload.data; // Set the chat history to the result
            } else { // If this is not the first page, append the results
                for (let i = 0; i < action.payload.data.length; i++) {
                    const element = action.payload.data[i];
                    newHistory.push( element )
                }
            }

            newState = { ...state, chatHistory: newHistory, historyPage: state.historyPage + 1 }
            break

        case "GET_CHAT_HISTORY_ERROR":
            if ( action.payload.status === 404 ) { // If no chat history was found
                newState = { ...state, loadingChat: false, refreshing: false };
                break
            }

            newState = { ...state };
            break

        case "GET_CHAT_SUCCESS":
            newState = { ...state, chat: action.payload.data }
            break

        case "UPDATE_CHAT_HISTORY":
            if ( newState.chatHistory === null ) break

            let newChatHistory = [ ...state.chatHistory ]

            for (let i = 0; i < newChatHistory.length; i++) {
                if ( newChatHistory[ i ].messageSenderID == action.payload.userID || newChatHistory[ i ].messageReceiverID == action.payload.userID ) {
                    // Make a new instance of the object, this will cause the shallow prop check in the FlatList to fail and cause a re render
                    newChatHistory[ i ] = { ...newChatHistory[ i ] };
                    newChatHistory[ i ].messageText = action.payload.message;
                    newChatHistory[ i ].messageTime = new Date( );
                }
            }
            newState = { ...state, chatHistory: newChatHistory }
            break

        case "ADD_UNREAD_MSG":
            newState = { ...state, unreadMessages: state.unreadMessages + 1 }
            break

        case "REMOVE_UNREAD_MSG":
            newState.unreadMessages = 0;
            break

        case "RESET_CHAT_HISTORY":
            newState = { ...state, historyPage: 0 }
            break
            
        default:
            break

    }
    
    return newState
}