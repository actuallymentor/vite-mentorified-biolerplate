import styled from 'styled-components'
import { passable_props } from '../component_base'

const MainBase = styled.main`
	display: flex;
	flex-grow: 1;
	max-width: 100%;
	flex-wrap: wrap;
	padding: 0 2rem;
	${ passable_props };
`

export default function Main( { ...props } ) {
    return <MainBase { ...props } />
}