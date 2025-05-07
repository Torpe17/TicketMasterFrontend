import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Film {
  id: string;
  title: string;
  description: string;
  genre: string;
  length: number;
  ageRating: number;
  pictureBase64?: string;
}

const FilmDetails: React.FC = () => {
  const { id } = useParams();
  const [film, setFilm] = useState<Film | null>(null);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(`https://localhost:7293/api/Film/${id}`);
        const data = await response.json();
        setFilm(data);
        console.log(data);
        
      } catch (error) {
        console.error('Hiba a film adatainak lekérésekor:', error);
      }
    };

    fetchFilm();
  }, [id]);

  if (!film) {
    return <div>Betöltés...</div>;
  }

  return (
    <div>
      <h1>{film.title}</h1>
      <p>{film.description}</p>
      {/* További film adatok megjelenítése */}
    </div>
  );
};

export default FilmDetails;
