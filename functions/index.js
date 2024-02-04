import { log } from './modules/helpers.mjs'
import { throw_if_invalid_context } from './modules/firebase.mjs'
import { v2_oncall } from './runtime/on_call_runtimes.mjs'


export const do_a_thing = v2_oncall( async () => {
    try {
        return { success: true }
    } catch ( e ) {
        log( `upload_file_to_web3 error: `, e )
        return { error: e.message }
    }
} )
