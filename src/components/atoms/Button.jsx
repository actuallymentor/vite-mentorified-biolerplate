import styled from 'styled-components'
import { passable_props } from '../component_base'
import { useNavigate } from 'react-router-dom'

const Button = styled.a`
	padding: ${ ( { scale=1 } ) => `${ scale * .5 }rem ${ scale }rem` };
	font-size: ${ ( { scale=1 } ) => `${ scale }rem` };
	text-decoration: none;
	border-radius: 5px;
	border: 2px solid ${ ( { $color='accent', theme } ) => theme.colors[ $color ] || $color };


	// Variants
	${ ( { $color='accent', theme, $variant='solid' } ) => {
        if( $variant == 'outline' ) return `
			color: ${ theme.colors[ $color ] || $color };
			background: none;
		`
        if( $variant == 'solid' ) return `
			color: ${ theme.colors.backdrop };
			border: 2px solid ${ theme.colors[ $color ] || $color };
			background: ${ theme.colors[ $color ] || $color };
		`
    } }

	&:hover {
		cursor: pointer;
	}
	&[disabled] {
		opacity: 0.5;
	}
	${ passable_props };
`

export default ( { href, navigate, ...props } ) => {

    const navigate_to = useNavigate()

    function handle_navigate() {
        if( navigate ) navigate_to( navigate )
        if( href ) window.open( href, '_blank' ).focus()
    }

    return <Button onClick={ handle_navigate } { ...props } />
}