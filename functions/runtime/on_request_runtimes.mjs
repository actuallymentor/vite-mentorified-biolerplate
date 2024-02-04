import functions from 'firebase-functions'
import { onRequest } from 'firebase-functions/v2/https'
import { v2_runtimes, v1_runtimes, validate_runtime_settings } from './runtimes_settings.mjs'

/**
 * Return a V1 onRequest with runtimes. NOTE: v1 appcheck is enforced through code and not config
 * @param {Array.<"high_memory"|"long_timeout"|"keep_warm">} [runtimes] - Array of runtime keys to use
 * @param {Function} handler - Function to run
 * @returns {Function} - Firebase function 
*/
export const v1_onrequest = ( runtimes=[], handler ) => {

    // If the first parameter was a function, return the undecorated handler
    if( typeof runtimes === 'function' ) return functions.https.onRequest( runtimes )

    // Validate runtime settings
    validate_runtime_settings( runtimes, v1_runtimes )

    // Config the runtimes for this function
    const runtime = runtimes.reduce( ( acc, runtime_key ) => ( { ...acc, ...v1_runtimes[ runtime_key ] } ), {} )
    return functions.runWith( runtime ).https.onRequest( handler )
}

/**
 * Return a V2 onRequest with runtimes
 * @param {Array.<"long_timeout"|"high_memory"|"keep_warm"|"max_concurrency">} [runtimes] - Array of runtime keys to use, CORS support is ALWAYS ADDED
 * @param {Function} handler - Firebase function handler
 * @returns {Function} - Firebase function
 */
export const v2_onrequest = ( runtimes=[], handler ) => {

    const runtime_basis = { cors: true }

    // If the first parameter was a function, return the handler as 'protected' firebase oncall
    if( typeof runtimes === 'function' ) return onRequest( runtime_basis, runtimes )

    // Validate runtime settings
    validate_runtime_settings( runtimes, v2_runtimes )

    const runtime = runtimes.reduce( ( acc, runtime_key ) => ( { ...acc, ...v2_runtimes[ runtime_key ] } ), runtime_basis )

    return onRequest( runtime, handler )
}