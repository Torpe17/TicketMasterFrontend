import { Card, Text, Badge, Button, Group, Image, Space, MantineProvider, createTheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IFilm } from '../interfaces/IFilm';
import classes from './Layout/Button.module.css'

interface FilmCardProps {
  film: IFilm;
}

export const FilmCard: React.FC<FilmCardProps> = ({ film }) => {
  const navigate = useNavigate();
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      bg='#EEECEB'
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Card.Section>
        <Image
          src={film.pictureBase64 != null ? `data:image/jpeg;base64,${film.pictureBase64}` : '/noposter.jpg'}
          height={160}
          alt={film.title}
        />
      </Card.Section>
      <Space h="xs" />
      <Text fw={500}>{film.title}</Text>
      <Group justify="space-between" mt="xs" mb="xs">
        <Badge color="#F0B63B">{film.genre}</Badge>
        <Badge color="#AE5B54">{film.length} min</Badge>
        <Badge color="#593531">{film.ageRating ? film.ageRating + "+" : "None"}</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {film.description}
      </Text>

      <div style={{ marginTop: 'auto' }}>
        <Button color="blue" fullWidth mt="md" radius="md" onClick={() => navigate(`${film.id}`)}>
          Details
        </Button>
      </div>
    </Card>
  );
};

const theme = createTheme({
  components: {
    Button: Button.extend({
      classNames: classes,
    }),
  },
});

export const TrendingFilmCard: React.FC<FilmCardProps> = ({ film }) => {
  const navigate = useNavigate();
  return (
    <MantineProvider theme={theme}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        bg='#EEECEB'
        withBorder
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Card.Section>
          <Image
            src={film.pictureBase64 != null ? `data:image/jpeg;base64,${film.pictureBase64}` : '/noposter.jpg'}
            height={260}
            alt={film.title}
          />
        </Card.Section>
        <Space h="xs" />
        <Text fw={700} ta="center" size='xl'>{film.title}</Text>

        <div style={{ marginTop: 'auto' }}>
          <Button variant="primary" onClick={() => navigate(`${film.id}`)}>
            Details
          </Button>
        </div>
      </Card>
    </MantineProvider>
  );
};