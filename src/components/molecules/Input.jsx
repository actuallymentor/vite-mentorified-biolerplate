import styled from 'styled-components'
import { useEffect, useRef, useState } from 'react'
import { passable_props } from '../component_base'
import { log } from '../../modules/helpers'
import { useDebounce } from 'use-debounce'
import useInterval from 'use-interval'

const Input = styled.span`

	display: flex;
	flex-direction: column;
	margin: 1rem 0;

	width: 100%;
	max-width: 100%;
	min-width: 300px;
	
	& select, input, textarea, & p#title {
		background: ${ ( { theme } ) => theme.colors.backdrop };
		border: none;
		color: ${ ( { theme } ) => theme.colors.text };

		// Default border
		border-left: 2px solid ${ ( { theme, highlight } ) => highlight ? theme.colors.accent : theme.colors.primary };

		// Validity based border, only if the property valid exists
		${ ( { $valid, theme, $has_content } ) => $has_content && $valid === true && `border-left: 2px solid ${ theme.colors.success }` }
		${ ( { $valid, theme, $has_content } ) => $has_content && $valid === false && `border-left: 2px solid ${ theme.colors.error }` }

	}

	& select, input, textarea, & p#title {
		padding: 1rem 2rem 1rem 1rem;
		width: 100%;
        ${ props => passable_props( props ) }
	}

	textarea {
		min-height: 150px;
	}

	p {
		font-size: .7rem;
	}

	p#error {
		color: red;
	}

	& label {
		
		display: flex;
		justify-content: flex-start;

		// The actual label
		span:first-child {
			opacity: .5;
			font-style: italic;
			margin-bottom: .5rem;
			width: 100%;
			color: ${ ( { theme } ) => theme.colors.text };
		}

		// The info icon
		span:nth-child( 2 ) {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: .9rem;
			margin-left: auto;
			font-style: normal;
			background: ${ ( { theme } ) => theme.colors.backdrop };
			color: ${ ( { theme } ) => theme.colors.primary };
			border-radius: 50%;
			width: 20px;
			height: 20px;
		}
	}

	${ props => passable_props( props ) }

`

/**
 * Input component for forms.
 *
 * @component
 * @param {Object} props - The input component props.
 * @param {Function} props.onChange - The function to handle input change.
 * @param {string} props.type - The type of input field.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.info - Additional information for the input field.
 * @param {boolean} props.highlight - Whether to highlight the input field.
 * @param {string} props.id - The ID of the input field.
 * @param {string} props.title - The title of the input field.
 * @param {Function} props.onClick - The function to handle input click.
 * @param {Array} props.options - The options for dropdown input field.
 * @param {Function|string} props.validate - The validation function or regex pattern for input field.
 * @param {string} props.error - The error message for invalid input.
 * @param {boolean} props.verbose - Whether to enable verbose mode.
 * @param {number} props.validation_delay - The delay in milliseconds for input validation.
 * @returns {JSX.Element} The rendered Input component.
 */
export default ( { onChange, type, label, info, highlight, id, title, onClick, options, validate, error, verbose=false, validation_delay=2000, ...props } ) => {

    const { current: internalId } = useRef( id || `input-${ Math.random() }` )
    const special_types = [ 'dropdown', 'textarea' ]

    // Separate props into parent and childs
    const { placeholder, value, ...parent_props } = props
    const child_props = { placeholder, value }

    // Manage validation
    const empty = !value || `${ value }`.length == 0
    const [ raw_valid, set_raw_valid ] = useState( undefined )
    const [ valid ] = useDebounce( empty || raw_valid, validation_delay, { leading: true } )
    const [ last_edit, set_last_edit ] = useState( Date.now() )
    const [ is_typing, set_is_typing ] = useState( false )
    useEffect( () => {

        // If verbose mode is enabled, log the validation
        if( verbose ) log( `Validating ${ typeof value } value ${ value } with validation (${ validation_delay }ms):`, validate, ` empty: ${ empty }, valid: ${ valid }, typing: ${ is_typing }` )

        // If there is no validation, assume valid
        if( !validate ) {
            if( verbose ) log( 'No validation, assuming valid' )
            return set_raw_valid( true )
        }

        // If there is no value, assume valid
        if( empty ) {
            if( verbose ) log( 'Input empty, assuming valid' )
            return set_raw_valid( undefined )
        }

        // Mark the last edit
        if( `${ value }`.length > 0 ) {
            set_last_edit( Date.now() )
            set_is_typing( true )
        }

        try {

            // If validate is a function, run it as an attempted validation
            if( typeof validate == 'function' && validate( value ) ) return set_raw_valid( true )
            if( typeof validate == 'function' && !validate( value ) ) return set_raw_valid( false )

            // If validate is a string, assume it is a regex, match it against the value
            if( value?.match?.( validate ) ) return set_raw_valid( true )
            if( !value?.match?.( validate ) ) return set_raw_valid( false )

        } catch ( e ) {

            set_raw_valid( false )
            log( 'Validation failed', e )

        }

    }, [ value, empty, validate ] )

    // If there is a value, periodically set the time since typing
    const time_to_idle_in_ms = 500
    useInterval( () => {
        const typing_timed_out = Date.now() - last_edit > time_to_idle_in_ms
        if( verbose ) log( 'Typing timed out: ', typing_timed_out )
        if( typing_timed_out ) set_is_typing( false )
    }, value && !valid ? 1000 : null )

    return <Input onClick={ onClick } highlight={ highlight } { ...{ ...parent_props, $has_content: value?.length > 0 } } $valid={ valid } >

        { label && <label htmlFor={ internalId }><span>{ label }</span> { info && <span onClick={ f => alert( info ) }>?</span> }</label> }

        { /* Regular input field */ } 
        { !title && !special_types.includes( type ) && <input data-testid={ internalId } { ...child_props } id={ internalId } onChange={ onChange } type={ type || 'text' } /> }
        
        { /* Textarea input field */ }
        { !title && type == 'textarea' && <textarea data-testid={ internalId } { ...child_props } id={ internalId } onChange={ onChange } type={ type || 'text' } /> }

        { /* Dropdown input field */ }
        { !title && type == 'dropdown' && <select id={ internalId } onChange={ onChange }>
            { options.map( ( option, index ) => <option key={ index } value={ option.value }>{ option.label }</option> ) }
        </select> }

        { title && <p id="title">{ title }</p> }

        { !is_typing && !empty && !valid && <p id="error">{ error || `Please enter a valid ${ type || 'input' }` }</p> }
		
    </Input>

}