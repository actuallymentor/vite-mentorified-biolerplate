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
	${ passable_props };
`

export default ( { href, navigate, new_tab=false, ...props } ) => {

    const navigate_to = useNavigate()

    function handle_navigate() {
        if( navigate ) navigate_to( navigate )
        if( href && new_tab ) window.open( href, '_blank' ).focus()
        if( href && !new_tab ) window.open( href, '_self' )
    }

    return <A onClick={ handle_navigate } { ...props }/>

}