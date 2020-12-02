import { all, put, takeLatest } from 'redux-saga/effects'
import axios from '../../utils/axios'

function* search( { payload } ) {
    yield put( { type: 'GET_JOB_LIST_REQUEST' } )
    try {
        const data = yield axios.post( '/search', { ...payload.filters, page: payload.page }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'GET_JOB_LIST_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'GET_JOB_LIST_ERROR', payload: e } )
    }
}

function* watchSearch( ) {
    yield takeLatest( "SEARCH_TRIGGER", search )
}

function* getFavorites( { payload } ) {
    yield put( { type: 'GET_JOB_LIST_REQUEST' } )
    try {
        const data = yield axios.get( '/user/saved?page=' + payload.page, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'GET_JOB_LIST_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'GET_JOB_LIST_ERROR', payload: e } )
    }
}

function* watchGetFavorites( ) {
    yield takeLatest( "GET_FAVORITES_TRIGGER", getFavorites )
}

function* getJob( { payload } ) {
    yield put( { type: 'GET_JOB_REQUEST' } )
    try {
        const data = yield axios.get( '/job/' + payload.id, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'GET_JOB_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'GET_JOB_ERROR', payload: e } )
    }
}

function* watchGetJob( ) {
    yield takeLatest( "GET_JOB_TRIGGER", getJob )
}

function* getRecruiterJobs( { payload } ) {
    yield put( { type: 'GET_RECRUITER_JOBS_REQUEST' } )
    try {
        const data = yield axios.post( '/recruiter/job-listings', { recruiterID: payload.recruiterID, page: payload.page }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'GET_RECRUITER_JOBS_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'GET_RECRUITER_JOBS_ERROR', payload: e } )
    }
}

function* watchGetRecruiterJobs( ) {
    yield takeLatest( "GET_RECRUITER_JOBS_TRIGGER", getRecruiterJobs )
}

function* toggleFavoriteJob( { payload } ) {
    yield put( { type: 'SAVE_JOB_REQUEST' } )
    try {
        let url = payload.saved ? '/job/unsave/' : '/job/save/'; // Choose whether to save or unsave the job
        url += payload.id; // Append the job ID to the url
        const data = yield axios.post( url, { }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'SAVE_JOB_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'SAVE_JOB_ERROR', payload: e } )
    }
}

function* watchToggleFavoriteJob( ) {
    yield takeLatest( "SAVE_JOB_TRIGGER", toggleFavoriteJob )
}

function* apply( { payload } ) {
    yield put( { type: 'APPLY_JOB_REQUEST' } )
    try {
        const data = yield axios.post( '/job/apply/' + payload.id, { quiz: payload.quiz }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'APPLY_JOB_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'APPLY_JOB_ERROR', payload: e } )
    }
}

function* watchApply( ) {
    yield takeLatest( "APPLY_JOB_TRIGGER", apply )
}

function* getQuiz( { payload } ) {
    yield put( { type: 'GET_QUIZ_REQUEST' } )
    try {
        const data = yield axios.get( '/job/' + payload.id + '/quiz', { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'GET_QUIZ_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'GET_QUIZ_ERROR', payload: e } )
    }
}

function* watchGetQuiz( ) {
    yield takeLatest( "GET_QUIZ_TRIGGER", getQuiz )
}

function* submitQuiz( { payload } ) {
    yield put( { type: 'SUBMIT_QUIZ_REQUEST' } )
    try {
        const data = yield axios.post( '/job/quiz/answers', { quizID: payload.quizID, answers: payload.answers }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        console.log( data );
        yield put( { type: 'SUBMIT_QUIZ_SUCCESS', payload: data } )
    } catch ( e ) {
        console.log( e );
        yield put( { type: 'SUBMIT_QUIZ_ERROR', payload: e } )
    }
}

function* watchSubmitQuiz( ) {
    yield takeLatest( "SUBMIT_QUIZ_TRIGGER", submitQuiz )
}

export default function* rootSaga( ) {
    yield all( [
        watchSearch( ),
        watchGetFavorites( ),
        watchGetJob( ),
        watchGetRecruiterJobs( ),
        watchToggleFavoriteJob( ),
        watchApply( ),
        watchGetQuiz( ),
        watchSubmitQuiz( )
    ] );
}