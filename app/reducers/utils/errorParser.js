export default parseError = ( payload ) => {

    if ( !payload || !payload.data ) return;
    
    if ( payload.data.message != null ) return { text: payload.data.message, status: payload.status };

    let errors = { };
    
    for (let i = 0; i < payload.data.length; i++) {
        const element = payload.data[i];
        errors[ element.param ] = element.msg;
    }

    return errors;
}