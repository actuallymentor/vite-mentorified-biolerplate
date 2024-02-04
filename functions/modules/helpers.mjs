// ///////////////////////////////
// Development helpers
// ///////////////////////////////
export const dev = process.env.NODE_ENV === 'development'
export const log = ( ...messages ) => {
    if( dev ) console.log( ...messages )
}
export const wait = ( time, error=false ) => new Promise( ( res, rej ) => setTimeout( error ? rej : res, time ) )

// Create readable stream
export const create_readable_stream = async ( ) => {

    // Dependencies
    const { Readable } = await import( 'stream' )

    // Create a readable stream
    const readable = new Readable( )

    // Return the stream
    return readable

}

// Create writable stream
export const create_writable_stream = async ( ) => {

    // Dependencies
    const { Writable } = await import( 'stream' )

    // Create a writable stream
    const writable = new Writable( )

    // Return the stream
    return writable

}


// Buffer to readable stream 
export const buffers_to_stream = async buffers => {

    // Create a readable stream from the buffer
    const stream = await create_readable_stream( )

    // Push all buffers in the array to the stream
    buffers.map( buffer => stream.push( buffer ) )

    // End the stream
    stream.push( null )

    // Return the stream
    return stream

}
