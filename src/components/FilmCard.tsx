import { Card, Text, Badge, Button, Group } from '@mantine/core';

interface Film {
    id: string;
    title: string;
    description: string;
    genre: string;
    length: number,
    ageRating: number
}

interface FilmCardProps {
  film: Film;
}

const FilmCard: React.FC<FilmCardProps> = ({ film }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{film.title}</Text>
        <Badge color="pink">{film.genre}</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {film.description}
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Részletek
      </Button>
    </Card>
  );
};

export default FilmCard