import { useState, useEffect } from 'react';
import { Combobox, Table, TextInput, useCombobox } from '@mantine/core';
import { IFilm } from '../interfaces/IFilm';
import api from '../api/api';
import { IScreening } from '../interfaces/IScreening';


const AdminPage = () =>{    
    //combo box
    const [films, setFilms] = useState<IFilm[]>([]);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [value, setValue] = useState('');
    const shouldFilterOptions = !films.some((item) => item.title === value);
    const filteredOptions = shouldFilterOptions
        ? films.filter((item) => item.title.toLowerCase().includes(value.toLowerCase().trim()))
        : films;

    const options = filteredOptions.map((item) => (
        <Combobox.Option value={item.title} key={item.id}>
        {item.title}
        </Combobox.Option>
    ));

    //table
    const [screenings, setScreenings] = useState<IScreening[]>([]);
    const rows = screenings.map((element) => (
        <Table.Tr key={element.id}>
          <Table.Td>{element.id}</Table.Td>
          <Table.Td>{element.date.toLocaleTimeString}</Table.Td>
          <Table.Td>{element.filmName}</Table.Td>
          <Table.Td>{element.roomId}</Table.Td>
          <Table.Td>{element.defaultTicketPrice}</Table.Td>
        </Table.Tr>
      ));

    const getScreenings = (filmId: number) =>{
        api.Screening.getScreenings(filmId).then(res =>{
            console.log(res.data);
            setScreenings(res.data);
        })
    }


    useEffect(() => {
        
        api.Films.getFilms().then(res =>{
            // console.log(res.data);
            setFilms(res.data);
        });
        // we need to wait for options to render before we can select first one
        combobox.selectFirstOption();
    }, [value]);

    return (
        <div>
            <Combobox
            onOptionSubmit={(optionValue) => {
                setValue(optionValue);
                combobox.closeDropdown();
                const selectedFilm = films.find((film) => film.title === optionValue);
                if (selectedFilm) {
                    getScreenings(selectedFilm.id);
                }
            }}
            store={combobox}
            >
            <Combobox.Target>
                <TextInput
                label="Film kiválasztása"
                placeholder="Kiválasztás..."
                value={value}
                onChange={(event) => {
                    setValue(event.currentTarget.value);
                    combobox.openDropdown();
                    getScreenings(combobox.getSelectedOptionIndex())
                }}
                onClick={() => combobox.openDropdown()}
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
                </Combobox.Options>
            </Combobox.Dropdown>
            </Combobox>

            <Table>
            <Table.Thead>
            <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Film</Table.Th>
                <Table.Th>RoomID</Table.Th>
                <Table.Th>Default ticket price</Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </div>
    );
}

export default AdminPage;
