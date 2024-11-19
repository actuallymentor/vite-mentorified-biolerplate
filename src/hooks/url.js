import { useSearchParams } from "react-router-dom"

/**
 * Custom hook to manage URL query parameters.
 *
 * @param {string} key - The key of the query parameter to manage.
 * @param {string} default_value - The default value to return if the query parameter is not present.
 * @returns {[string, function]} - An array containing the current value of the query parameter and a function to update it.
 */
export const useQuery = ( key, default_value ) => {

    const [ searchParams, setSearchParams ] = useSearchParams()

    function set_param( value ) {
        searchParams.set( key, value )
        setSearchParams( searchParams )
    }

    return [ searchParams.get( key ) || default_value, set_param ]

}

/**
 * Custom hook to manage URL query parameters.
 *
 * @param {Object} keys - An object containing default key-value pairs for query parameters.
 * @returns {[Object, Function]} - Returns an array with the current query parameters and a function to set a query parameter.
 *
 * @example
 * const [queries, setQuery] = useQueries({ page: 1, search: '' });
 * console.log(queries.page); // Outputs the current 'page' query parameter or 1 if not set.
 * setQuery('page', 2); // Sets the 'page' query parameter to 2.
 */
export const useQueries = ( keys={} ) => {

    const [ searchParams, setSearchParams ] = useSearchParams()

    function set_param( key, value ) {
        searchParams.set( key, value )
        setSearchParams( searchParams )
    }

    const values = Object.keys( keys ).reduce( ( acc, key ) => {
        acc[ key ] = searchParams.get( key ) || keys[ key ]
        return acc
    } , {} )

    return [ values, set_param ]

}