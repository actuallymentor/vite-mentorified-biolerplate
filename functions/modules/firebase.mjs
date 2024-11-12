// Firebase interactors
import { initializeApp } from "firebase-admin/app"
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { getAuth } from 'firebase-admin/auth'
import { log } from "mentie"


// Cached app getter
let app_cache = undefined
export const app = () => {
    if( !app_cache ) app_cache = initializeApp( )
    return app_cache
}

// Cached db getter
let db_cache = undefined
export const db = () => {
    if( !db_cache ) db_cache = getFirestore( app( ) )
    return db_cache
}

// Cached storage getter
let storage_cache = undefined
export const storage = () => {
    if( !storage_cache ) storage_cache = getStorage( app( ) )
    return storage_cache
}

// Cached bucket getter 
// see https://cloud.google.com/nodejs/docs/reference/storage/latest/storage/bucket#_google_cloud_storage_Bucket_file_member_1_
let bucket_cache = undefined
export const bucket = () => {
    if( !bucket_cache ) bucket_cache = storage().bucket()
    return bucket_cache
}

// Cached auth getter
let auth_cache = undefined
export const auth = () => {
    if( !auth_cache ) auth_cache = getAuth( app( ) )
    return auth_cache
}

/**
 * Extracts data from a Firestore snapshot.
 * @param {Object} snapOfDocOrDocs - The snapshot of a document or documents.
 * @param {boolean} [withDocId=true] - Whether to include the document ID in the extracted data.
 * @returns {Object|Array} - The extracted data.
 */
export const dataFromSnap = ( snapOfDocOrDocs, withDocId=true ) => {
	
    // If these are multiple docs
    if( snapOfDocOrDocs.docs ) return snapOfDocOrDocs.docs.map( doc => ( { id: doc.id, ...doc.data( ) } ) )

    // If this is a single document
    return { ... withDocId && { id: snapOfDocOrDocs.id }, ...snapOfDocOrDocs.data()  }

}

/**
 * Reads a document from a collection in Firestore.
 * @param {string} collection - The name of the collection.
 * @param {string} document_id - The ID of the document.
 * @returns {Promise<Object>} - A promise that resolves to the data of the document.
 */
export const read_doc = async ( collection, document_id ) => {

    // Get the document
    // const { log } = await import( './helpers.mjs' )
    // log( `Reading document ${ collection }/${ document_id }, types: ${ typeof collection }/${ typeof document_id }` )
    const doc = await db().collection( collection ).doc( document_id ).get( )

    // Return the data
    return dataFromSnap( doc )

}


/**
 * Writes a document to a Firestore collection.
 * @param {Object} options - The options for writing the document.
 * @param {string} options.collection - The name of the collection to write to.
 * @param {string} options.doc - The ID of the document to write. If not provided, a new document will be created.
 * @param {Object} options.content - The content of the document to write.
 * @param {boolean} [options.merge=true] - Whether to merge the new content with existing document data. Defaults to true.
 * @param {boolean} [options.timestamps=true] - Whether to include timestamp fields in the document. Defaults to true.
 * @returns {Promise} - A promise that resolves when the document is successfully written.
 */
export async function write_doc ( { collection, doc, content, merge=true, timestamps=true } ) {

    // Validations
    if( !collection || !content ) log.error( `Missing required parameters for writing document: `, { collection, doc, content, arguments } )

    if( timestamps ) content = { ...content, updated: Date.now(), updated_human: new Date().toString() }

    if( !doc ) return db().collection( collection ).add( content )
    return db().collection( collection ).doc( doc ).set( content, { merge } )

}