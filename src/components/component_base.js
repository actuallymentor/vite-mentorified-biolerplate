import { log } from "../modules/helpers"

export const passable_props = props => {

    const allowed_props = [ '$padding', '$margin', '$width', '$height', '$align', '$justify', '$direction', '$min-height', '$min-width', '$gap' ]

    // The CSS string to add to styled components
    let css_string = allowed_props.reduce( ( acc, allowed_prop ) => {

        // If no match, return acc
        if( !props[allowed_prop] ) return acc

        // Check for properties that require translation to native css
        let native_css_property = allowed_prop
        if( allowed_prop == '$direction' ) native_css_property = 'flex-direction'
        if( allowed_prop == '$justify' ) native_css_property = 'justify-content'
        if( allowed_prop == '$align' ) native_css_property = 'align-items'

        // Add to acc, note that since we are using transient props, we need to remove any leading $ signs
        if( props[allowed_prop] ) acc += `${ native_css_property.replace( /^\$/, '' ) }: ${ props[ allowed_prop ] };\n`

        return acc
        
    }
    , '' )

    return css_string

}