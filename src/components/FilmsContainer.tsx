import React, { useRef } from 'react';
import {
  Container,
  SimpleGrid,
  Input,
  Drawer,
  Button,
  CloseButton,
  Checkbox,
  Space,
  Center, 
  Loader,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { DatePicker } from '@mantine/dates';
import { IFilm } from '../interfaces/IFilm';
import { FilmCard, TrendingFilmCard } from './FilmCard';
import '@mantine/carousel/styles.css';
import Autoplay from 'embla-carousel-autoplay';
import useAuth from "../hooks/useAuth.tsx";
import { useNavigate } from 'react-router-dom';

interface FilmsContainerProps {
  loading: boolean;
  films: IFilm[];
  trendingFilms: IFilm[];
  dateValue: string | null;
  setDateValue: (value: string | null) => void;
  nameValue: string;
  setNameValue: (value: string) => void;
  checked: boolean;
  setChecked: (value: boolean) => void;
  resetFilter: () => void;
  opened: boolean;
  open: () => void;
  close: () => void;
}

export const FilmsContainer: React.FC<FilmsContainerProps> = ({
  loading,
  films,
  trendingFilms,
  dateValue,
  setDateValue,
  nameValue,
  setNameValue,
  checked,
  setChecked,
  resetFilter,
  opened,
  open,
  close,
}) => {
  const slides = trendingFilms.map((film) => (
    <Carousel.Slide key={film.id}>
      <TrendingFilmCard film={film} />
    </Carousel.Slide>
  ));
const { isLoggedIn } = useAuth();
const autoplay = useRef(Autoplay({ delay: 5000 }));
const navigate = useNavigate();

  return (
    <Container fluid>
      <Drawer opened={opened} onClose={close} title="Filter" size="xs">
        <Space h="xl" />
        Date
        <Space h="xs" />
        <DatePicker allowDeselect value={dateValue} onChange={setDateValue} />
        <Space h="xs" />
        <Checkbox
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          label="Only on selected day"
        />
        <Space h="xl" />
        Name
        <Input
          placeholder="Film name"
          value={nameValue}
          onChange={(event) => setNameValue(event.currentTarget.value)}
          rightSectionPointerEvents="all"
          mt="md"
          rightSection={
            <CloseButton
              aria-label="Delete film name"
              onClick={() => setNameValue('')}
              style={{ display: nameValue ? undefined : 'none' }}
            />
          }
        />
        <Space h="xs" />
        <Button variant="default" onClick={resetFilter}>
          Reset filter
        </Button>
      </Drawer>
      {!isLoggedIn&&(
        <Space h='xl' />
      )}
      {!isLoggedIn&&(
        <Button variant="default" onClick={() => navigate(`../login`)}>
          Log in
        </Button>
      )}

      <h1>Trending films</h1>
      <Carousel
        slideSize={{ base: '100%', sm: '33.3%' }}
        slideGap={{ base: 'xl', sm: 5 }}
        emblaOptions={{ loop: true, align: 'start' }}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={() => autoplay.current.play()}
        >
        {slides}
      </Carousel>

      <h1>Films</h1>
      <Button variant="default" onClick={open}>
        Filter
      </Button>
      <Space h='lg'/>
        {loading&& (
          <Center>
            <Loader />
          </Center>
          
        )}

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} spacing="lg">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </SimpleGrid>
    </Container>
  );
};
