export const createLoadingSelector = actions => state => {
    return actions.some( action => state.loading[ action ] );
};

export const createErrorMessageSelector = actions => state => {
    return actions.map( action => state.error[ action ] ).filter( action => action != null )[0] || '';
};

export const createSuccessMessageSelector = actions => state => {
    return actions.map( action => state.success[ action ] ).filter( action => action != null )[0] || null;
};