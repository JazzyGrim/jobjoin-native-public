export const getUser = ( id, details, address, token ) => dispatch => {
    dispatch( { type: 'GET_USER_TRIGGER', payload: { id, details, address, token } } )
}

export const saveUser = ( firstName, lastName, birthday, about, location, token ) => dispatch => {
    dispatch( { type: 'SAVE_USER_TRIGGER', payload: { firstName, lastName, birthday, about, location, token } } )
}

export const saveEducation = ( education, token ) => dispatch => {
    dispatch( { type: 'SAVE_EDUCATION_TRIGGER', payload: { education, token } } )
}

export const saveExperience = ( experience, token ) => dispatch => {
    dispatch( { type: 'SAVE_EXPERIENCE_TRIGGER', payload: { experience, token } } )
}

export const saveLanguages = ( languages, token ) => dispatch => {
    dispatch( { type: 'SAVE_LANGUAGES_TRIGGER', payload: { languages, token } } )
}

export const saveJobType = ( jobTypeID, token ) => dispatch => {
    dispatch( { type: 'SAVE_JOB_TYPE_TRIGGER', payload: { jobTypeID, token } } )
}

export const saveAddress = ( info, token ) => dispatch => {
    dispatch( { type: 'SAVE_ADDRESS_TRIGGER', payload: { info, token } } )
}

export const saveImage = ( form, token ) => dispatch => {
    dispatch( { type: 'SAVE_PROFILE_IMAGE_TRIGGER', payload: { form, token } } )
}

export const logout = ( ) => dispatch => {
    dispatch( { type: 'LOGOUT', payload: { } } )
}

export const updateUserPushToken = ( pushToken, token ) => dispatch => {
    dispatch( { type: 'UPDATE_USER_TOKEN_TRIGGER', payload: { pushToken, token } } )
}

export const removePushToken = ( token ) => dispatch => {
    dispatch( { type: 'REMOVE_PUSH_TOKEN', payload: { token } } )
}