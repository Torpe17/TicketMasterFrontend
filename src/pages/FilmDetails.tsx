import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {Image, Grid, Flex, SimpleGrid, Space, Group } from '@mantine/core';
import api from '../api/api';
import { IFilm } from '../interfaces/IFilm';
import { IScreening } from '../interfaces/IScreening';
import ScreeningButton from '../components/FilmScreeningButton'
import { IconCategory, IconClock, IconMovie, IconShield, IconUser } from "@tabler/icons-react";


const FilmDetails: React.FC = () => {
  const { id } = useParams();
  const [film, setFilm] = useState<IFilm | null>(null);
  const [screening, setScreening] = useState<IScreening[] |null>([]);
  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = api.Films.getFilm(id!.toString());
        const data = await response;
        setFilm(data.data);
      } catch (error) {
        console.error('Hiba a film adatainak lekérésekor:', error);
      }
    };
    

    fetchFilm();
  }, [id]);

  useEffect(() =>{
    const fetchScreenings = async () =>{
      try{
        if(!film) return;
        
        const response = api.Screening.getScreenings(film.id)
        const data = await response;
        setScreening(data.data)
      }
      catch(error)
      {
        console.error('Hiba a screening adatainak lekérésekor:', error);
      }
    }
    fetchScreenings();
  }, [film]);


  if (!film) {
    return <div>Betöltés...</div>;
  }

  return (
    <div>
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
      <SimpleGrid cols={8} spacing="lg">
        {screening!.map((screening) => (
          <ScreeningButton key={screening.id} screening={screening} />
        ))}
      </SimpleGrid>
    </div>
  );
};

export default FilmDetails;
