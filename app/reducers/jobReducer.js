export default function reducer( state={
    jobList: [],
    jobPage: 0,
    job: null,
    quiz: null,
    quizID: null
}, action ) {

    let newState = { ...state };
    let newJob = { ...state.job };
    let newJobList = [ ...newState.jobList ]

    switch( action.type ) {

        case "GET_JOB_LIST_SUCCESS":
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

        case "REFRESH_JOB_LIST":
            newState = { ...state, jobPage: 0 }
            break

        case "RESET_JOB_LIST":
            newState = { ...state, jobList: [ ], jobPage: 0 }
            break

        case "GET_JOB_SUCCESS":
            newState = { ...state, job: action.payload.data }
            break

        case "SAVE_JOB_SUCCESS":
            if ( newJob ) newJob.saved = !newJob.saved;
            newState = { ...state, job: newJob };
            break

        case "APPLY_JOB_SUCCESS":
            if ( newJob ) newJob.applied = true;
            newState = { ...state, job: newJob };
            break

        case "GET_QUIZ_SUCCESS":
            console.log( action.payload.data );
            newState = { ...state, quiz: action.payload.data.quiz, quizID: action.payload.data.quizID }
            break

        case "RESET_JOB":
            newState = { ...state, job: null }
            break
            
        default:
            break

    }
    
    return newState

}