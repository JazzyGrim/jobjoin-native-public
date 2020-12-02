import parseError from './utils/errorParser';

export default function reducer( state={
    id: '',
    token: '',
    type: '',
    admin: false,
    tokenValid: null,
    facebookRedirect: false,
    user: null,
    applications: [],
    applicationsPage: 0
}, action ) {

    let newState = { ...state };
    let newApplications = [ ...newState.applications ]
    let newUser = { ...state.user }

    if ( action.payload && action.payload.status === 406 ) { // If any request returns 406, we are logged out
        newState.tokenValid = false; // Set the token as invalid
        return newState; // Return to prevent further actions
    }

    switch( action.type ) {
            
        case "LOGIN_SUCCESS":
            const { id: loginID, token: loginToken, type: loginType, admin: loginAdmin } = action.payload.data;

            newState = { ...state, id: loginID, token: loginToken, type: loginType, admin: loginAdmin, tokenValid: true };
            break

        case "FACEBOOK_LOGIN_SUCCESS":
            console.log( action.payload.data );
            const { id:fbLoginID, token:fbLoginToken, type:fbLoginType } = action.payload.data

            newState = { ...state, id:fbLoginID, token:fbLoginToken, type:fbLoginType, admin: false, tokenValid: true }
            break

        case "FACEBOOK_LOGIN_ERROR":

            // If we must specify an address
            if ( action.payload.status == 422 ) {
                newState.facebookRedirect = true;
                break
            }

            newState = { ...state };
            break

        case "REGISTER_SUCCESS":
            const { id:registerID, token:registerToken, type:registerType } = action.payload.data

            newState = { ...state, id:registerID, token:registerToken, type:registerType, tokenValid: true }
            break

        case "FORGOT_PASSWORD_SUCCESS":
            newState = { ...state }
            break

        case "USER_APPLICATIONS_SUCCESS":
            if ( state.applicationsPage == 0 ) { // If this is the first page
                newApplications = action.payload.data; // Set the applicatioon list to the result
            } else { // If this is not the first page, append the results
                for (let i = 0; i < action.payload.data.length; i++) {
                    const element = action.payload.data[i];
                    newApplications.push( element )
                }
            }
            
            newState = { ...state, applications: newApplications, applicationsPage: state.applicationsPage + 1 }
            break

        case "REFRESH_APPLICATIONS_LIST":
            newState = { ...state, applicationsPage: 0 }
            break

        case "RESET_APPLICATIONS_LIST":
            newState = { ...state, applications: [ ], applicationsPage: 0 }
            break

        case "RESET_FACEBOOK_REDIRECT":
            newState = { ...state, facebookRedirect: false }
            break

        case "SET_ERROR_MESSAGE":
            newState = { ...state, errorMessage: { text: action.payload.message, status: 500 } }
            break

        case "SET_USER":
            newState = { ...state, ...action.payload }
            break

        case "GET_USER_SUCCESS":
            newState = { ...state, user: action.payload.data }
            break

        case "SAVE_INFO_SUCCESS":
            let response = { ...action.payload.data };

            delete response[ 'message' ]; // Remove the message aspect
            
            // Now update the user, and update which ever thing we just updated
            newUser = { ...state.user, ...response }

            newState = { ...state, user: newUser }
            break

        case "SAVE_USER_SUCCESS":
            newUser = { ...state.user, ...action.payload.data.user }
            newState = { ...state, user: newUser }
            break

        case "SAVE_ADDRESS_SUCCESS":
            newUser = {
                ...state.user,
                address: action.payload.info.address,
                city: action.payload.info.city,
                state: action.payload.info.region,
                zip: action.payload.info.postalCode,
                country: action.payload.info.country,
                lat: action.payload.info.latitude,
                long: action.payload.info.longitude,
            }
            newState = { ...state, user: newUser }
            break

        case "SAVE_PROFILE_IMAGE_SUCCESS":
            newState = { ...state, user: null }
            break

        case "LOGOUT":
            newState = { ...state, id: '', token: '', type: '' }
            break
            
        default:
            break

    }
    
    return newState

}