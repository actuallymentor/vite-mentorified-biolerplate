// ///////////////////////////////
// Development helpers
// ///////////////////////////////
export const dev = process.env.NODE_ENV === 'development'
export const loglevel = process.env.LOG_LEVEL || 'error'
export const emulator = process.env.FUNCTIONS_EMULATOR === 'true'

export const log = ( ...messages ) => {
    if( [ 'error', 'warn', 'info' ].includes( loglevel ) ) console.log( ...messages )
}
export const warn = ( ...messages ) => {
    if( [ 'info', 'warn' ].includes( loglevel ) ) console.log( ...messages )
}
export const error = ( ...messages ) => {
    if( 'error' == loglevel ) console.log( ...messages )
}
log( `Dev mode is: `, dev )
export const wait = ( time, error=false ) => new Promise( ( res, rej ) => setTimeout( error ? rej : res, time ) )
