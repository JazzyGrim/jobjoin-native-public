export const getApplications = ( status, expired, token, page ) => dispatch => {
    dispatch( { type: 'USER_APPLICATIONS_TRIGGER', payload: { status, expired, token, page } } )
}

export const refreshApplicationsList = ( ) => dispatch => {
    dispatch( { type: 'REFRESH_APPLICATIONS_LIST', payload: { } } )
}

export const resetApplicationsList = ( ) => dispatch => {
    dispatch( { type: 'RESET_APPLICATIONS_LIST', payload: { } } )
}