import { combineReducers } from 'redux'
import chat from './chatReducer'
import job from './jobReducer'
import recruiter from './recruiterReducer'
import user from './userReducer'
import loading from './loadingReducer'
import error from './errorReducer'
import success from './successReducer'

export default combineReducers( {
    user,
    job,
    recruiter,
    chat,
    loading,
    error,
    success
} )