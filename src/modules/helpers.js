// ///////////////////////////////
// Development helpers
// ///////////////////////////////
export const dev = process.env.NODE_ENV === 'development' ||  typeof location !== 'undefined' && ( location.href?.includes( 'debug=true' ) || location.href?.includes( 'localhost' ) ) 
export const localhost = window.location.hostname == 'localhost'

// Get the loglevel from the URL, valid values are info, debug, warn, error. Default is debug
export const loglevel = typeof location !== 'undefined' && new URLSearchParams( location.search ).get( 'loglevel' ) || 'debug'

// Logging helpers
export const log_handler = ( ...messages ) => {
    if( dev ) console.log( ...messages )
}

// Verbose logging is used for verbose logging of actions (ie state changes in a complex component)
export const verbose = ( ...messages ) => [ 'info' ].includes( loglevel ) ? log_handler( ...messages ) : undefined

// Debug is used for verbose logging, but not with extreme detail (ie hook data changes)
export const log = ( ...messages ) => [ 'info', 'debug' ].includes( loglevel ) ? log_handler( ...messages ) : undefined

// Warn is used for things that should not happen but will not break things
export const warn = ( ...messages ) => [ 'info', 'debug', 'warn' ].includes( loglevel ) ? log_handler( ...messages ) : undefined

// Error is used for things that should not happen and will break things
export const error = ( ...messages ) => {
    if( !dev ) return
    console.error( ...messages )
    console.trace()
}

// ///////////////////////////////
// Date helpers
// ///////////////////////////////
export const monthNameToNumber = monthName => {
    const months = [ 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' ]
    const monthNumber = months.findIndex( month => month.includes( monthName.toLowerCase() ) ) + 1
    return `${ monthNumber }`.length == 1 ? `0${ monthNumber }` : monthNumber
}

// ///////////////////////////////
// Visual
// ///////////////////////////////

export const wait = ( time, error=false ) => new Promise( ( res, rej ) => setTimeout( error ? rej : res, time ) )