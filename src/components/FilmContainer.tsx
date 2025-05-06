import {Divider, Paper, Text} from "@mantine/core";

interface AuthContainerInterface {
    children: JSX.Element;
}

const   FilmContainer = ({children}: AuthContainerInterface) => {
    return <div className="film-container">
        
            <Paper radius="md" p="xl" withBorder maw={600} m={10}>
                <Text size="lg" fw={500}>
                    Filmek
                </Text>
                <Divider my="lg"/>
                {children}
            </Paper>
        
    </div>
}

export default FilmContainer;