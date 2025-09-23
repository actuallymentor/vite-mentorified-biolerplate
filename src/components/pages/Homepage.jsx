import Container from "../atoms/Container"
import Hero from "../molecules/Hero"
import { H1, H2 } from "../atoms/Text"

export default function Homepage() {


    return <Container>

        <Hero>
            <H1>This is a boilerplate</H1>
            <H2>It doesn&apos;t do much</H2>
        </Hero>

    </Container>
}