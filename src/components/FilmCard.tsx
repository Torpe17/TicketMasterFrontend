import { Card, Text, Badge, Button, Group, Image, Space} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

interface Film {
    id: string;
    title: string;
    description: string;
    genre: string;
    length: number,
    ageRating: number
    pictureBase64? : string
}

interface FilmCardProps {
  film: Film;
}

const FilmCard: React.FC<FilmCardProps> = ({ film }) => {
    const navigate = useNavigate();
    return (
        
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
         <Card.Section>
            <Image
            src={`data:image/jpeg;base64,${film.pictureBase64}`}
            height={160}
            alt={film.title}
            />
        </Card.Section>
            <Space h="xs" />
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
          <Button color="blue" fullWidth mt="md" radius="md" onClick={() => navigate(`${film.id}`)}>
            Részletek
          </Button>
        </div>
      </Card>
    );
  };
export default FilmCard