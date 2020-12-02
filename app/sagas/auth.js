import { all, put, takeLatest } from 'redux-saga/effects'
import axios from '../../utils/axios'

function* login( { payload } ) {
    yield put( { type: 'LOGIN_REQUEST' } )
    try {
        const data = yield axios.post( '/login', { loginEmail: payload.email, loginPassword: payload.password, pushToken: payload.pushToken } ).then( ( data ) => { return data } )
        yield put( { type: 'LOGIN_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'LOGIN_ERROR', payload: e } )
    }
    
}

function* watchLogin( ) {
    yield takeLatest( 'LOGIN_TRIGGER', login )
}

function* register( { payload } ) {
    yield put( { type: 'REGISTER_REQUEST' } )
    try {
        const data = yield axios.post( '/register', { 
            userFirstName: payload.firstName,
            userLastName: payload.lastName,
            userEmail: payload.email,
            userPassword: payload.password,
            userAddress: payload.address,
            userCity: payload.city,
            userState: payload.state,
            userZIP: payload.zip,
            userCountry: payload.country,
            userLat: payload.lat,
            userLong: payload.long,
            pushToken: payload.pushToken
         } ).then( ( data ) => { return data } )
         console.log( data );
        yield put( { type: 'REGISTER_SUCCESS', payload: data } )
    } catch ( e ) {
        console.log( e );
        yield put( { type: 'REGISTER_ERROR', payload: e } )
    }
}

function* watchRegister( ) {
    yield takeLatest( "REGISTER_TRIGGER", register )
}

function* forgotPassword( { payload } ) {
    yield put( { type: 'FORGOT_PASSWORD_REQUEST' } )
    try {
        const data = yield axios.post( '/reset', { resetEmail: payload.email, api: true } ).then( ( data ) => { return data } )
        yield put( { type: 'FORGOT_PASSWORD_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'FORGOT_PASSWORD_ERROR', payload: e } )
    }
}

function* watchForgotPassword( ) {
    yield takeLatest( "FORGOT_PASSWORD_TRIGGER", forgotPassword )
}

function* loginFacebook( { payload } ) {
    yield put( { type: 'FACEBOOK_LOGIN_REQUEST' } )
    try {
        const data = yield axios.post( '/facebook/user', { ...payload } ).then( ( data ) => { return data } )
        yield put( { type: 'FACEBOOK_LOGIN_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'FACEBOOK_LOGIN_ERROR', payload: e } )
    }
}

function* watchLoginFacebook( ) {
    yield takeLatest( "FACEBOOK_LOGIN_TRIGGER", loginFacebook )
}

function* removePushToken( { payload } ) {
    try {
        const data = yield axios.post( '/logout', { }, { headers: { 'x-access-token': payload.token } } ).then( ( data ) => { return data } )
        yield put( { type: 'LOGOUT_SUCCESS', payload: data } )
    } catch ( e ) {
        yield put( { type: 'LOGOUT_ERROR', payload: e } )
    }
}

function* watchRemovePushToken( ) {
    yield takeLatest( "REMOVE_PUSH_TOKEN", removePushToken )
}

export default function* rootSaga( ) {
    yield all( [
        watchLogin( ),
        watchRegister( ),
        watchForgotPassword( ),
        watchLoginFacebook( ),
        watchRemovePushToken( )
    ] );
}