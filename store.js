/*
*
*   Krerira Redux Store te ga učitava
*
*/

import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import reducer from './app/reducers';
import authSaga from './app/sagas/auth.js';
import chatSaga from './app/sagas/chat';
import jobSaga from './app/sagas/job.js';
import recruiterSaga from './app/sagas/recruiter';
import userSaga from './app/sagas/user';

const sagaMiddleware = createSagaMiddleware( );

const middleware = applyMiddleware( sagaMiddleware, thunk );

export default createStore( reducer, middleware );

sagaMiddleware.run( authSaga );
sagaMiddleware.run( jobSaga );
sagaMiddleware.run( recruiterSaga );
sagaMiddleware.run( userSaga );
sagaMiddleware.run( chatSaga );