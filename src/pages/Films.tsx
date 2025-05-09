import { useEffect, useState } from 'react';
import { Container, SimpleGrid, Loader, Center, Input, Drawer, Button, CloseButton, Checkbox, Space } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { FilmCard, TrendingFilmCard } from '../components/FilmCard';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import useDebounce from '../hooks/useDebounce';
import api from '../api/api';
import { IFilm } from '../interfaces/IFilm';
import '@mantine/carousel/styles.css';

const Films: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const [datevalue, setDateValue] = useState<string | null>("");

  const [films, setFilms] = useState<IFilm[]>([]);
  const [trendingFilms, setTrendingFilms] = useState<IFilm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [checked, setChecked] = useState(false);
  const [nameValue, setInputValue] = useState("");
  const debouncedNameValue = useDebounce(nameValue, 300);
    
  function resetFilter(): void{
    setInputValue('');
    setChecked(false);
    setDateValue('');
  }

  useEffect(() => {      
    const fetchFilms = async () => {        
      try {
        var response;
        if(datevalue != "" && datevalue != null && checked && debouncedNameValue == ""){ //date picket AND checbox checked AND no name
            response = api.Films.getFilmOnDate(datevalue);
        }
        else if(datevalue != "" && datevalue != null && !checked && debouncedNameValue == ""){// date picked AND checkebox not picked AND no name
            response = api.Films.getFilmAfterDate(datevalue);
        }
        else if((datevalue == '' || datevalue === null) && debouncedNameValue != ""){//date not picked AND name
            response = api.Films.getFilmByName(debouncedNameValue); 
        }
        else if(datevalue != '' && datevalue != null && debouncedNameValue != ""){//date picked AND name 
            response = api.Films.getFilmByNameAndDate(datevalue,debouncedNameValue,checked);  
        }
        else{
            response = api.Films.getFilms(); 
        }
        
        const data = await response;
        
        setFilms(data.data);
      } catch (error) {
        console.error('Hiba a filmek lekérésekor:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchTrendingFilms = async () => {        
      try {
        const response = api.Films.getTrendingFilms(); 
        const data = await response;
        
        setTrendingFilms(data.data);
        console.log(trendingFilms);
        
      } catch (error) {
        console.error('Hiba a filmek lekérésekor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingFilms()
    fetchFilms();
  }, [datevalue,debouncedNameValue,checked]);

  if (loading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  const slides = trendingFilms.map((trendingFilms) => (
    <Carousel.Slide key={trendingFilms.id}>
      <TrendingFilmCard key={trendingFilms.id} film={trendingFilms} />
    </Carousel.Slide>
  ));

  return (
    <Container fluid>
      <Drawer opened={opened} onClose={close} title="Filter" size="xs">
        <Space h="xl" />
        Date
        <Space h="xs" />
        <DatePicker allowDeselect value={datevalue} onChange={setDateValue} />
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
            onChange={(event) => setInputValue(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            mt="md"
            rightSection={
            <CloseButton
                aria-label="Film name"
                onClick={() => setInputValue('')}
                style={{ display: nameValue ? undefined : 'none' }}
            />
            }
        />

        <Space h="xs" />
        <Button variant="default" onClick={resetFilter}>
            Reset filter
        </Button>
      </Drawer>

      <Button variant="default" onClick={open}>
        Filter
      </Button>
            
      <h1>Trending movies</h1>

      <Carousel
        slideSize={{ base: '100%', sm: '33.3%' }}
        slideGap={{ base: 'xl', sm: 5 }}
        emblaOptions={{ loop: true, align: 'start' }}
      >
        {slides}
      </Carousel>

      <h1>Films</h1>

      <SimpleGrid cols={5} spacing="lg">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Films;