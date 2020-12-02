export const search = ( token, filters, page ) => dispatch => {
    dispatch( { type: 'SEARCH_TRIGGER', payload: { token, filters, page } } )
}

export const getFavorites = ( token, page = 0 ) => dispatch => {
    dispatch( { type: 'GET_FAVORITES_TRIGGER', payload: { token, page } } )
}

export const refreshJobList = ( ) => dispatch => {
    dispatch( { type: 'REFRESH_JOB_LIST', payload: { } } )
}

export const resetJobList = ( ) => dispatch => {
    dispatch( { type: 'RESET_JOB_LIST', payload: { } } )
}

export const getJob = ( id, token ) => dispatch => {
    dispatch( { type: 'GET_JOB_TRIGGER', payload: { id, token } } )
}

export const resetJob = ( ) => dispatch => {
    dispatch( { type: 'RESET_JOB', payload: { } } )
}

export const toggleFavorite = ( id, saved, token ) => dispatch => {
    dispatch( { type: 'SAVE_JOB_TRIGGER', payload: { id, saved, token } } )
}

export const apply = ( quiz, id, token ) => dispatch => {
    dispatch( { type: 'APPLY_JOB_TRIGGER', payload: { quiz, id, token } } )
}

export const getQuiz = ( id, token ) => dispatch => {
    dispatch( { type: 'GET_QUIZ_TRIGGER', payload: { id, token } } )
}

export const submitQuizAnswers = ( answers, quizID, token ) => dispatch => {
    dispatch( { type: 'SUBMIT_QUIZ_TRIGGER', payload: { answers, quizID, token } } )
}