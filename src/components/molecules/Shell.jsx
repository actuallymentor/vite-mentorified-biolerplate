import { AppShell, Burger, Group, Skeleton, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

export default function Shell( { children } ) {

    const [ opened, { toggle } ] = useDisclosure( false )

    
    return <AppShell
        header={ { height: 60 } }
        footer={ { height: 35 } }
        navbar={ { width: 300, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: !opened } } }
        padding="md"
    >
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger opened={ opened } onClick={ toggle } size="sm" />
                <Group justify="center" h="100%" m="auto">
                    <Text>💎</Text>
                </Group>
            </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
            Navbar
            { Array( 15 )
                .fill( 0 )
                .map( ( _, index ) => 
                    <Skeleton key={ index } h={ 28 } mt="sm" animate={ false } />
                ) }
        </AppShell.Navbar>
        <AppShell.Main>
            { children }
        </AppShell.Main>
        <AppShell.Footer >
            <Group h="100%" justify="center">
                <Text>Copyright</Text>
            </Group>
        </AppShell.Footer>
    </AppShell>

}