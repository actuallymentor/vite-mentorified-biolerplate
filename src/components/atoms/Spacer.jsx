import styled from 'styled-components'

export default styled.span`
	margin: ${ ( { margin=0 } ) => margin };
    padding: ${ ( { padding='1rem' } ) => padding };
    width: ${ ( { width='100%' } ) => width };
    height: ${ ( { height='0' } ) => height };
`