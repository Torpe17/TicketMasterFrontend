import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/api';
import { IFilm } from '../interfaces/IFilm';
import { IScreening } from '../interfaces/IScreening';
import FilmDetailContainer from '../components/Film/FilmDetailContainer';

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
        const data:IScreening[] = (await response).data;
        const sortedScreenings = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setScreening(sortedScreenings)
      }
      catch(error)
      {
        console.error('Hiba a screening adatainak lekérésekor:', error);
      }
    }
    fetchScreenings();
  }, [film]);


  if (!film) {
    return <div>Loading...</div>;
  }

  return (
    <FilmDetailContainer film={film} screening={screening!}/>
  );
};

export default FilmDetails;
