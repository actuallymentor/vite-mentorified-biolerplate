import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
`

const SpinnerBase = styled.div`
	display: inline-block;
	align-items: center;
	justify-content: center;
	width: ${ ( { size=80 } ) => size }px;
	height: ${ ( { size=80 } ) => size }px;
	padding: ${ ( { padding='.5rem' } ) => padding };
	margin: ${ ( { margin='1rem' } ) => margin };

	&:after {
		content: " ";
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: ${ ( { size=64 } ) => size/12 }px solid ${ ( { theme } ) => theme.colors.primary };
		border-color: ${ ( { theme } ) => theme.colors.primary } transparent ${ ( { theme } ) => theme.colors.primary } transparent;
		animation: ${ rotate } 1.2s linear infinite;
	}
`

export default function Spinner( { ...props } ) {
    return <SpinnerBase { ...props } />
}