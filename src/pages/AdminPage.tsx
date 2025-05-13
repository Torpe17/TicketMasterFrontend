import { useState, useEffect } from 'react';
import { Button, Combobox, Group, Table, TextInput, useCombobox } from '@mantine/core';
import { IFilm } from '../interfaces/IFilm';
import { IScreening } from '../interfaces/IScreening';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const AdminPage = () => {
    const navigate = useNavigate();
    const [films, setFilms] = useState<IFilm[]>([]);
    const [screenings, setScreenings] = useState<IScreening[]>([]);
    const [value, setValue] = useState('');
    const [selectedFilm, setSelectedFilm] = useState<IFilm | null>(null);


    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const getScreenings = (filmId: number) => {
        api.Screening.getScreenings(filmId).then(res => {
            console.log(res.data);
            setScreenings(res.data);
        });
    };

    useEffect(() => {
        api.Films.getFilms().then(res => {
            setFilms(res.data);
            if (res.data.length > 0) {
                const first = res.data[0];
                setSelectedFilm(first);
                setValue(first.title);
            }
        });
    }, []);

    useEffect(() => {
        if (selectedFilm) {
            getScreenings(selectedFilm.id);
        } else {
            setScreenings([]);
        }
    }, [selectedFilm]);

    const filteredOptions = value
        ? films.filter(f => f.title.toLowerCase().includes(value.toLowerCase().trim()))
        : films;

    const options = filteredOptions.map(film => (
        <Combobox.Option key={film.id} value={film.title}>
            {film.title}
        </Combobox.Option>
    ));

    const rows = screenings.map(screening => (
        <Table.Tr key={screening.id}>
            <Table.Td>{screening.id}</Table.Td>
            <Table.Td>{new Date(screening.date).toLocaleString('hu-HU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })}</Table.Td>
            <Table.Td>{screening.roomId}</Table.Td>
            <Table.Td>{screening.roomName}</Table.Td>
            <Table.Td>{screening.defaultTicketPrice}</Table.Td>
            <Table.Td>
                <Button
                    rightSection={<IconEdit size={14} />}
                    mr={10}
                    variant="light"
                    color="yellow"
                    onClick={() => selectedFilm && navigate(`film/${selectedFilm?.id}/screening/${screening.id}`)}
                >
                    Edit
                </Button>
                <Button
                    rightSection={<IconTrash size={14} />}
                    variant="light"
                    color="red"
                    onClick={async () => {
                        if (!selectedFilm) return;

                        try {
                            await api.Screening.deleteScreening(String(screening.id));
                            setScreenings(prev => prev.filter(s => s.id !== screening.id));
                        } catch (error) {
                            console.error('Failed to delete screening:', error);
                        }
                    }}
                >
                    Delete
                </Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
            <Group justify="center">
                <Button
                    onClick={() => navigate('film/create')}
                    rightSection={<IconPlus size={14} />}
                    variant="light"
                    color="green">New movie</Button>
                <Button
                    onClick={() => selectedFilm && navigate(`film/${selectedFilm.id}`)}
                    rightSection={<IconEdit size={14} />}
                    variant="light"
                    color="yellow"
                    disabled={!selectedFilm}>Edit</Button>
                <Button
                    onClick={async () => {
                        if (!selectedFilm) return;
                        try {
                            await api.Films.deleteFilm(String(selectedFilm.id));
                            setFilms(prev => prev.filter(f => f.id !== selectedFilm.id));
                            setValue('');
                            setSelectedFilm(null);
                            setScreenings([]);
                        } catch (error) {
                            console.error('Failed to delete film:', error);
                        }
                    }}
                    rightSection={<IconTrash size={14} />}
                    variant="light"
                    color="red"
                    disabled={!selectedFilm}>Delete</Button>
            </Group>

            <Combobox
                onOptionSubmit={(optionValue) => {
                    setValue(optionValue);
                    const film = films.find(f => f.title === optionValue);
                    setSelectedFilm(film || null);
                    combobox.closeDropdown();
                }}
                store={combobox}
            >
                <Combobox.Target>
                    <TextInput
                        label="Select film"
                        placeholder="select..."
                        value={value}
                        onChange={(e) => {
                            setValue(e.currentTarget.value);
                            combobox.openDropdown();
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

            <Button
                onClick={() => selectedFilm && navigate(`film/${selectedFilm?.id}/screening/create`)}
                disabled={!selectedFilm}
                rightSection={<IconPlus size={14} />}
                mt={25} variant="light" color="lime">
                New screening
            </Button>

            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>RoomID</Table.Th>
                        <Table.Th>RoomName</Table.Th>
                        <Table.Th>Default ticket price</Table.Th>
                        <Table.Th>Műveletek</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </div>
    );
};

export default AdminPage;
