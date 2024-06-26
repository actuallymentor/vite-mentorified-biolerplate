import styled from 'styled-components'
import { passable_props } from '../component_base'

export default styled.section`
	padding: .5rem;
	display: flex;
	flex-direction: ${ ( { direction } ) => direction || 'column' };
	width: ${ ( { width } ) => width || '400px' };
	height: ${ ( { height } ) => height || 'initial' };
	max-width: 100%;
	flex-wrap: wrap;
	align-items: ${ ( { align } ) => align || 'flex-start' };
	justify-content: ${ ( { justify } ) => justify || 'center' };
	${ passable_props };
`