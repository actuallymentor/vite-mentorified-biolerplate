import { v2_oncall } from './runtime/on_call_runtimes.mjs'


export const do_a_thing = v2_oncall( async () => {
    return 'did a thing'
} )
