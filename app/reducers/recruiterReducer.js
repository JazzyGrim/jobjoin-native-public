export default function reducer( state={
    recruiter: null,
    jobList: [],
    jobPage: 0
}, action ) {

    let newState = { ...state };
    let newJobList = [ ...newState.jobList ]

    switch( action.type ) {

        case "GET_RECRUITER_JOBS_SUCCESS":
            if ( state.jobPage == 0 ) { // If this is the first page
                newJobList = action.payload.data; // Set the job list to the result
            } else { // If this is not the first page, append the results
                for (let i = 0; i < action.payload.data.length; i++) {
                    const element = action.payload.data[i];
                    newJobList.push( element )
                }
            }
                

            newState = { ...state, jobList: newJobList, jobPage: state.jobPage + 1 }
            break

        case "REFRESH_RECRUITER_JOB_LIST":
            newState = { ...state, jobPage: 0 }
            break

        case "RESET_RECRUITER_JOB_LIST":
            newState = { ...state, jobList: [ ], jobPage: 0 }
            break
        
        case "GET_RECRUITER_SUCCESS":
            newState = { ...state, recruiter: action.payload.data }
            break

        case "RESET_RECRUITER":
            newState = { ...state, recruiter: null }
            break
            
        default:
            break

    }
    
    return newState

}