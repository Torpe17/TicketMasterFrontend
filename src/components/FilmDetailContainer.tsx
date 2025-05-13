import {Image, Grid, Flex, SimpleGrid, Space, Group, Container, Button } from '@mantine/core';
import { IFilm } from '../interfaces/IFilm';
import { IScreening } from '../interfaces/IScreening';
import ScreeningButton from '../components/FilmScreeningButton'
import { IconCategory, IconClock, IconMovie, IconShield, IconUser, IconChevronLeft } from "@tabler/icons-react";
import useAuth from "../hooks/useAuth.tsx";
import { useNavigate } from 'react-router-dom';
interface FilmProps {
  film: IFilm;
}
interface ScreeningProps{
    screening: IScreening[];
}
export const FilmDetailContainer: React.FC<FilmProps & ScreeningProps> = ({ film, screening }) => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    return (
        <Container fluid>
            {!isLoggedIn && (
                <Space h="xl" />
            )}
            <Button variant="default" radius="xl" onClick={() => navigate('../films')}><IconChevronLeft/></Button>
            <Space h="md"/>
            <Grid gutter="xs">
                <Grid.Col span={2.25}>
                <Image
                    src={`data:image/jpeg;base64,${film.pictureBase64}`}
                    
                    fit="contain"
                    alt={film.title}
                    />
                </Grid.Col>
                <Grid.Col span={5}>
                <Flex
                    mih={5}
                    gap="sm"
                    justify="flex-start"
                    align="center"
                    direction="row"
                    wrap="wrap"
                >
                    <Group><IconMovie size={30}/><h1>{film.title}</h1></Group>
                </Flex>
                    <Group><IconCategory size={18}/><><b>Genre:</b> {film.genre}</></Group>
                    <Space h="xs"/>
                    <Group><IconUser size={18}/><><b>Director:</b> {film.director}</></Group>
                    <Space h="xs"/>
                    <Group><IconClock size={18}/><><b>Length: </b>{film.length}</></Group>
                    <Space h="xs"/>
                    <Group><IconShield size={18}/><><b>Age rating: </b>{film.ageRating}+</></Group>
                    <Space h="xs"/>
                    <p><b>Description</b></p>
                    <p>{film.description}</p>
                </Grid.Col>
            </Grid>
            <Space h="md" />
            <h1>Screenings</h1>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4, lg: 6 }} spacing="lg" verticalSpacing={{ base: 'md',md : 'md', sm: 'xl' }}>
                {screening!.map((screening) => (
                <ScreeningButton key={screening.id} screening={screening} />
                ))}
            </SimpleGrid>
            </Container>
)}
export default FilmDetailContainer;