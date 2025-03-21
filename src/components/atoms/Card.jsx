import styled from 'styled-components'

const CardBase = styled.div`
    background-color: ${ ( { theme } ) => theme.colors.backdrop };
    color: ${ ( { theme } ) => theme.colors.text };
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    width: 500px;
    flex-wrap: wrap;
    box-shadow: ${ ( { theme } ) => theme.shadows[0] };
`

export default function Card( { ...props } ) {
    return <CardBase { ...props } />
}