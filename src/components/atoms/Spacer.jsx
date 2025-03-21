import styled from 'styled-components'

const SpacerBase = styled.span`
    display: inline-block;
    margin: ${ ( { $margin=0 } ) => $margin };
    padding: ${ ( { $padding='1rem' } ) => $padding };
    width: ${ ( { $width='100%' } ) => $width };
    height: ${ ( { $height='0' } ) => $height };
`

export default function Spacer( { ...props } ) {
    return <SpacerBase { ...props } />
}