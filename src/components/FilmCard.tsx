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
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
          <Text fw={500}>{film.title}</Text>
        <Group  justify="space-between" mt="xs" mb="xs">
          <Badge color="pink">{film.genre}</Badge>
          <Badge color="purple">{film.length} min</Badge>
          <Badge color="red">{film.ageRating? film.ageRating + "+":"None"}</Badge>
        </Group>
  
        <Text size="sm" c="dimmed">
          {film.description}
        </Text>
  
        <div style={{ marginTop: 'auto' }}>
          <Button color="blue" fullWidth mt="md" radius="md">
            Részletek
          </Button>
        </div>
      </Card>
    );
  };
export default FilmCard