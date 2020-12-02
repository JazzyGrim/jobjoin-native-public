export const reportBug = ( info, token ) => dispatch => {
    dispatch( { type: 'REPORT_BUG_TRIGGER', payload: { info, token } } )
}

export const reportRecruiter = ( reason, reportedID, token ) => dispatch => {
    dispatch( { type: 'REPORT_RECRUITER_TRIGGER', payload: { reason, reportedID, token } } )
}