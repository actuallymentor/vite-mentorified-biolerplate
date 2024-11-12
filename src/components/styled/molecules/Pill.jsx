import styled from "styled-components"

const StyledPill = styled.aside`
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    background: ${ ( { theme } ) => theme.colors.backdrop };
    color: ${ ( { theme } ) => theme.colors.text };
    padding: .5rem .8rem;
    border-radius: 25px;
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: .6rem;
    box-shadow: ${ ( { theme } ) => theme.shadow };
    font-size: .6rem;

    span#light {
        background: ${ ( { $success, theme } ) => $success ? theme.colors.success : theme.colors.error };
        height: .6rem;
        width: .6rem;
        border-radius: 50%;
    }

`

export default function Pill( { children, ...rest } ) {

    return <StyledPill { ...rest }>
        <span id="light" />
        { children }
    </StyledPill>
    
}