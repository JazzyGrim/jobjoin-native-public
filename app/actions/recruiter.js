export const getRecruiter = ( recruiterID, token ) => dispatch => {
    dispatch( { type: 'GET_RECRUITER_TRIGGER', payload: { recruiterID, token } } )
}

export const getRecruiterJobs = ( recruiterID, token, page ) => dispatch => {
    dispatch( { type: 'GET_RECRUITER_JOBS_TRIGGER', payload: { recruiterID, token, page } } )
}

export const resetRecruiter = ( ) => dispatch => {
    dispatch( { type: 'RESET_RECRUITER', payload: { } } )
}

export const refreshJobList = ( ) => dispatch => {
    dispatch( { type: 'REFRESH_RECRUITER_JOB_LIST', payload: { } } )
}

export const resetJobList = ( ) => dispatch => {
    dispatch( { type: 'RESET_RECRUITER_JOB_LIST', payload: { } } )
}