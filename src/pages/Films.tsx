// src/pages/Films.tsx
import { useEffect, useState } from 'react';
import { Container, SimpleGrid, Loader, Center } from '@mantine/core';
import FilmCard from '../components/FilmCard';

interface Film {
  id: string;
  title: string;
  description: string;
  genre: string;
  length: number,
  ageRating: number
}

const Films: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch('https://localhost:7293/api/Film');
        const data = await response.json();
        setFilms(data);
      } catch (error) {
        console.error('Hiba a filmek lekérésekor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  if (loading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Container>
      <SimpleGrid cols={3} spacing="lg">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Films;


// import FilmContainer from "../components/FilmContainer.tsx";
// import { Card, Text, Badge, Button, Group } from '@mantine/core';
// const Films = () =>{
    // return <Card shadow="sm" padding="lg" radius="md" withBorder>

    //   <Group justify="space-between" mt="md" mb="xs">
    //     <Text fw={500}>Norway Fjord Adventures</Text>
    //     <Badge color="pink">On Sale</Badge>
    //   </Group>

    //   <Text size="sm" c="dimmed">
    //     With Fjord Tours you can explore more of the magical fjord landscapes with tours and
    //     activities on and around the fjords of Norway
    //   </Text>

    //   <Button color="blue" fullWidth mt="md" radius="md">
    //     Book classic tour now
    //   </Button>
    // </Card>


// }
// export default Films;