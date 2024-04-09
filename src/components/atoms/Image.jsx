import styled from 'styled-components'
import { passable_props } from '../component_base'

const Image = styled.img`

    // If $variant is 'circle', make the image a circle
    ${ ( { $variant } ) => $variant === 'circle' ? 'border-radius: 50%;' : '' }

    // If $size is present, set width and height to $size
    ${ ( { $size } ) => $size ? `width: ${ $size }; height: ${ $size };` : '' }

    ${ passable_props }
`

export default Image