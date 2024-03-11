import styled from 'styled-components'
import Section from '../atoms/Section'

export default styled( Section )`
	width: 100%;
	min-height: 400px;
	align-items: flex-start;
	justify-content: center;
	margin-top: 0;
	padding: 0 max( 1rem, calc( 25vw - 8rem ) );
	& h1 {
		margin-bottom: .5rem;
		text-align: left;
	}
	& * {
		max-width: 800px;
	}
	& > p {
		margin: 0 0 4rem;
	}

	// Drop a small shadow that gives the impression of this element popping into the foreground
	box-shadow: ${ ( { theme } ) => theme.shadow };
`