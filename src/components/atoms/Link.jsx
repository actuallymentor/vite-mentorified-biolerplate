import styled from 'styled-components'
import { passable_props } from '../component_base'
import { useNavigate } from 'react-router-dom'

const A = styled.a`
    display: inline;
	color: ${ ( { $color='primary', theme } ) => theme.colors[ $color ] || $color };
	font-size: 1rem;
	text-decoration: underline;
	&:hover {
		cursor: pointer;
	}
	&[disabled] {
		opacity: 0.5;
	}
	${ props => passable_props( props ) }
`

export default ( { href, navigate, ...props } ) => {

    const navigate_to = useNavigate()

    function handle_navigate() {
        if( navigate ) navigate_to( navigate )
        if( href ) window.open( href, '_blank' ).focus()
    }

    return <A onClick={ handle_navigate } { ...props }/>

}