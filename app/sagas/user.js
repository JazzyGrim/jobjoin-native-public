import { all, put, takeLatest } from 'redux-saga/effects';
import axios from '../../utils/axios';

function* getUserApplications( { payload } ) {
    yield put( { type: 'USER_APPLICATIONS_REQUEST' } )
    try {
        let postData = { page: payload.page };
        if ( payload.status ) postData.status = payload.status;
        if ( payload.expired ) postData.expired = payload.expired;
        
        const data = yield axios.post( '/user/applied', postData, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'USER_APPLICATIONS_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'USER_APPLICATIONS_ERROR', payload: e } )
    }
}

function* watchGetUserApplications( ) {
    yield takeLatest( "USER_APPLICATIONS_TRIGGER", getUserApplications )
}

function* getUser( { payload } ) {
    yield put( { type: 'GET_USER_REQUEST' } )
    try {
        let url = payload.details ? '/user/' + payload.id + '?details=1' : '/user/' + payload.id;
        url += payload.address ? ( payload.details ? '&address=1' : '?address=1' ) : '';

        const data = yield axios.get( url, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'GET_USER_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'GET_USER_ERROR', payload: e } )
    }
}

function* watchGetUser( ) {
    yield takeLatest( "GET_USER_TRIGGER", getUser )
}

function* saveUser( { payload } ) {
    yield put( { type: 'SAVE_USER_REQUEST' } )
    try {
        const data = yield axios.post( '/user/edit', {
            userFirstName: payload.firstName,
            userLastName: payload.lastName,
            userBirthday: payload.birthday,
            userAbout: payload.about
        }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'SAVE_USER_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'SAVE_USER_ERROR', payload: e } )
    }
}

function* watchSaveUser( ) {
    yield takeLatest( "SAVE_USER_TRIGGER", saveUser )
}

function* saveExperience( { payload } ) {
    yield put( { type: 'SAVE_INFO_REQUEST' } )
    try {
        const data = yield axios.post( '/user/edit/experience', {
            experience: payload.experience,
        }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'SAVE_INFO_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'SAVE_INFO_ERROR', payload: e } )
    }
}

function* watchSaveExperience( ) {
    yield takeLatest( "SAVE_EXPERIENCE_TRIGGER", saveExperience )
}

function* saveEducation( { payload } ) {
    yield put( { type: 'SAVE_INFO_REQUEST' } )
    try {
        const data = yield axios.post( '/user/edit/education', {
            education: payload.education,
        }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'SAVE_INFO_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'SAVE_INFO_ERROR', payload: e } )
    }
}

function* watchSaveEducation( ) {
    yield takeLatest( "SAVE_EDUCATION_TRIGGER", saveEducation )
}

function* saveLanguages( { payload } ) {
    yield put( { type: 'SAVE_INFO_REQUEST' } )
    try {
        const data = yield axios.post( '/user/edit/languages', {
            languages: payload.languages,
        }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'SAVE_INFO_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'SAVE_INFO_ERROR', payload: e } )
    }
}

function* watchSaveLanguages( ) {
    yield takeLatest( "SAVE_LANGUAGES_TRIGGER", saveLanguages )
}

function* saveJobType( { payload } ) {
    yield put( { type: 'SAVE_INFO_REQUEST' } )
    try {
        const data = yield axios.post( '/user/edit/jobtype', {
            userJobTypeID: payload.jobTypeID,
        }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'SAVE_INFO_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'SAVE_INFO_ERROR', payload: e } )
    }
}

function* watchSaveJobType( ) {
    yield takeLatest( "SAVE_JOB_TYPE_TRIGGER", saveJobType )
}

function* saveAddress( { payload } ) {
    yield put( { type: 'SAVE_ADDRESS_REQUEST' } )
    try {
        const data = yield axios.post( '/user/edit/address', {
            userAddress: payload.info.address,
            userCity: payload.info.city,
            userState: payload.info.region,
            userZip: payload.info.postalCode,
            userCountry: payload.info.country,
            userLat: payload.info.latitude,
            userLong: payload.info.longitude,
        }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'SAVE_ADDRESS_SUCCESS', payload: { ...data, info: payload.info } } )
    } catch ( e ) {
        console.log( e.message )
        yield put( { type: 'SAVE_ADDRESS_ERROR', payload: e } )
    }
}

function* watchSaveAddress( ) {
    yield takeLatest( "SAVE_ADDRESS_TRIGGER", saveAddress )
}

function* saveImage( { payload } ) {
    yield put( { type: 'SAVE_PROFILE_IMAGE_REQUEST' } )
    try {
        const data = yield axios.post( '/user/image', payload.form, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'SAVE_PROFILE_IMAGE_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'SAVE_PROFILE_IMAGE_ERROR', payload: e } )
    }
}

function* watchSaveImage( ) {
    yield takeLatest( "SAVE_PROFILE_IMAGE_TRIGGER", saveImage )
}

function* reportBug( { payload } ) {
    yield put( { type: 'REPORT_BUG_REQUEST' } )
    try {
        const data = yield axios.post( '/report/bug', {
            info: payload.info,
        }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'REPORT_BUG_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'REPORT_BUG_ERROR', payload: e } )
    }
}

function* watchReportBug( ) {
    yield takeLatest( "REPORT_BUG_TRIGGER", reportBug )
}

function* reportRecruiter( { payload } ) {
    yield put( { type: 'REPORT_RECRUITER_REQUEST' } )
    try {
        const data = yield axios.post( '/report/new', { reportedID: payload.reportedID, reason: payload.reason }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'REPORT_RECRUITER_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'REPORT_RECRUITER_ERROR', payload: e } )
    }
}

function* watchReportRecruiter( ) {
    yield takeLatest( "REPORT_RECRUITER_TRIGGER", reportRecruiter )
}

function* updateUserPushToken( { payload } ) {
    yield put( { type: 'UPDATE_USER_TOKEN_REQUEST' } );
    
    try {
        const data = yield axios.post( '/notifications', { pushToken: payload.pushToken }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'UPDATE_USER_TOKEN_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'UPDATE_USER_TOKEN_ERROR', payload: e } )
    }
}

function* watchUpdateUserPushToken( ) {
    yield takeLatest( "UPDATE_USER_TOKEN_TRIGGER", updateUserPushToken )
}

export default function* rootSaga( ) {
    yield all( [
        watchGetUserApplications( ),
        watchGetUser( ),
        watchSaveUser( ),
        watchSaveExperience( ),
        watchSaveEducation( ),
        watchSaveLanguages( ),
        watchSaveJobType( ),
        watchSaveAddress( ),
        watchSaveImage( ),
        watchReportBug( ),
        watchReportRecruiter( ),
        watchUpdateUserPushToken( )
    ] );
}