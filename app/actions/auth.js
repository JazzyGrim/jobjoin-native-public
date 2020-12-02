export const login = ( email, password, pushToken ) => dispatch => {
    dispatch( { type: 'LOGIN_TRIGGER', payload: {
        email, password, pushToken
    } } )
}

export const loginFacebook = ( accessToken, pushToken, address, city, state, zip, country, lat, long ) => dispatch => {
    dispatch( { type: 'FACEBOOK_LOGIN_TRIGGER', payload: { accessToken, pushToken, address, city, state, zip, country, lat, long } } )
}

export const register = ( firstName, lastName, email, password, pushToken, address, city, state, zip, country, lat, long ) => dispatch => {
    dispatch( { type: 'REGISTER_TRIGGER', payload: {
        firstName, lastName, email, password, address, city, state, zip, country, lat, long, pushToken
    } } )
}

export const forgotPassword = ( email ) => dispatch => {
    dispatch( { type: 'FORGOT_PASSWORD_TRIGGER', payload: { email } } )
}

export const logout = ( ) => dispatch => {
    dispatch( { type: 'LOGOUT', payload: { } } )
}

export const resetFacebookRedirect = ( ) => dispatch => {
    dispatch( { type: 'RESET_FACEBOOK_REDIRECT', payload: { } } )
}

export const setErrorMessage = ( message ) => dispatch => {
    dispatch( { type: 'SET_ERROR_MESSAGE', payload: { message } } )
}

export const setUser = ( id, token, type ) => dispatch => {
    dispatch( { type: 'SET_USER', payload: { id, token, type } } )
}