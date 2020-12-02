import { all, put, takeLatest } from 'redux-saga/effects'
import axios from '../../utils/axios'

function* getRecruiter( { payload } ) {
    yield put( { type: 'GET_RECRUITER_REQUEST' } )
    try {
        const data = yield axios.get( '/recruiter/' + payload.recruiterID, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'GET_RECRUITER_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'GET_RECRUITER_ERROR', payload: e } )
    }
}

function* watchGetRecruiter( ) {
    yield takeLatest( "GET_RECRUITER_TRIGGER", getRecruiter )
}

export default function* rootSaga( ) {
    yield all( [
        watchGetRecruiter( )
    ] );
}