// src/pages/Films.tsx
import { useEffect, useState } from 'react';
import { Container, SimpleGrid, Loader, Center, Input, Drawer, Button, CloseButton, Checkbox, Space } from '@mantine/core';
import FilmCard from '../components/FilmCard';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import useDebounce from '../hooks/useDebounce';

interface Film {
  id: string;
  title: string;
  description: string;
  genre: string;
  length: number,
  ageRating: number
  pictureBase64?: string
}

const Films: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const [datevalue, setDateValue] = useState<string | null>("");

  const [films, setFilms] = useState<Film[]>([]);
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
            response  = await fetch(`https://localhost:7293/api/Film/on/${datevalue}`);
        }
        else if(datevalue != "" && datevalue != null && !checked && debouncedNameValue == ""){// date picked AND checkebox not picked AND no name
            response  = await fetch(`https://localhost:7293/api/Film/after/${datevalue}`);
        }
        else if((datevalue == '' || datevalue === null) && debouncedNameValue != ""){
            response  = await fetch(`https://localhost:7293/api/Film/name?name=${debouncedNameValue}`); //date not picked AND name
        }
        else if(datevalue != '' && datevalue != null && debouncedNameValue != ""){
            response  = await fetch(`https://localhost:7293/api/Film/NameAndDate?name=${debouncedNameValue}&date=${datevalue}&onDay=${checked}`);//date picked AND name 
        }
        else{
            response = await fetch('https://localhost:7293/api/Film');
        }
        
        const data = await response.json();
        
        setFilms(data);
      } catch (error) {
        console.error('Hiba a filmek lekérésekor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, [datevalue,debouncedNameValue,checked]);

  if (loading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

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
      <Space h="xl" />
     
      <SimpleGrid cols={5} spacing="lg">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Films;