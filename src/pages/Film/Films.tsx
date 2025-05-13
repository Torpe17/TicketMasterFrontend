import React, { useEffect, useState } from 'react';

import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import api from '../../api/api';
import { IFilm } from '../../interfaces/IFilm';
import { FilmsContainer } from '../../components/Film/FilmsContainer';

const Films: React.FC = () => {
  const [dateValue, setDateValue] = useState<string | null>(null);
  const [nameValue, setNameValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [films, setFilms] = useState<IFilm[]>([]);
  const [trendingFilms, setTrendingFilms] = useState<IFilm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [debouncedNameValue] = useDebouncedValue(nameValue, 500);

  const [opened, {open, close}] = useDisclosure(false);

  const resetFilter = () => {
    setNameValue('');
    setChecked(false);
    setDateValue(null);
  };

  useEffect(() => {
    const fetchFilms = async () => {
      setLoading(true);
      try {
        let response;
        if (dateValue && checked && !debouncedNameValue) {
          response = await api.Films.getFilmOnDate(dateValue);
        } else if (dateValue && !checked && !debouncedNameValue) {
          response = await api.Films.getFilmAfterDate(dateValue);
        } else if (!dateValue && debouncedNameValue) {
          response = await api.Films.getFilmByName(debouncedNameValue);
        } else if (dateValue && debouncedNameValue) {
          response = await api.Films.getFilmByNameAndDate(dateValue, debouncedNameValue, checked);
        } else {
          response = await api.Films.getFilms();
        }
        setFilms(response.data);
      } catch (error) {
        console.error('Error while getting films:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTrendingFilms = async () => {
      try {
        const response = await api.Films.getTrendingFilms();
        setTrendingFilms(response.data);
      } catch (error) {
        console.error('Error while getting trending films:', error);
      }
    };

    fetchTrendingFilms();
    fetchFilms();
  }, [dateValue, debouncedNameValue, checked]);

  return (
    <FilmsContainer
      loading = {loading}
      films={films}
      trendingFilms={trendingFilms}
      dateValue={dateValue}
      setDateValue={setDateValue}
      nameValue={nameValue}
      setNameValue={setNameValue}
      checked={checked}
      setChecked={setChecked}
      resetFilter={resetFilter}
      opened={opened}
      open={open}
      close={close}
    />
  );
};

export default Films;
