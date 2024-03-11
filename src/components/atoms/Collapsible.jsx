import styled from 'styled-components'

const Details = styled.details`

    // This is the title
    summary {
        color: ${ ( { theme, $color } ) => theme.colors[ $color ] || $color || theme.colors.text };
    }

    #content {
        border-left: 2px solid ${ ( { theme, $color } ) => theme.colors[ $color ] || $color || theme.colors.text };
        padding: 0 0 0 1rem;
    }

`


/**
 * A collapsible component that displays a title and children content.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be displayed inside the collapsible component.
 * @param {string} props.title - The title of the collapsible component.
 * @returns {JSX.Element} The rendered collapsible component.
 */
export default function Collapsible( { children, title, ...props } ) {

    return <Details { ...props }>
        <summary>{ title }</summary>
        <div id="content">
            { children }
        </div>
    </Details>

}