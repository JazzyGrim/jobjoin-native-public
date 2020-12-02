import parseError from './utils/errorParser'

export default ( state = { }, action ) => {
    const { type, payload } = action;

    if ( type === 'RESET_MESSAGES' ) return { }

    if ( !payload ) return { ...state };

    if ( payload.message && payload.message.startsWith( 'timeout' ) ) return { connection: { text: "Komunikacija sa serverom nije moguća.", status: 503 } }

    const matches = /(.*)_(REQUEST|ERROR)/.exec( type );
  
    // not a *_REQUEST / *_ERROR actions, so we ignore them
    if (!matches) return state;
  
    const [, requestName, requestState] = matches;
    return {
      ...state,
      // Store errorMessage
      // e.g. stores errorMessage when receiving GET_TODOS_ERROR
      //      else clear errorMessage when receiving GET_TODOS_REQUEST
      [requestName]: requestState === 'ERROR' ? parseError( payload.response ) : '',
    };
  };