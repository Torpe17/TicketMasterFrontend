import { Button, Card, Fieldset, Grid, Group, NativeSelect, NumberInput, rem, Stack, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import api from "../api/api.ts";
import { useNavigate, useParams } from "react-router-dom";
import { IRoom } from "../interfaces/IRoom.ts";
import { IFilm } from "../interfaces/IFilm.ts";
import { IconCategory, IconClock, IconMovie, IconShield, IconUser } from "@tabler/icons-react";
import { DateTimePicker } from '@mantine/dates';

import '@mantine/dates/styles.css'

interface ICreateUpdateScreening {
    isCreate: boolean;
}

const CreateUpdateScreenings = ({ isCreate }: ICreateUpdateScreening) => {
    const navigate = useNavigate();

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            filmId: 0,
            roomId: 0,
            date: new Date(),
            defaultTicketPrice: 0,
          },
          validate: {
            date: (value) => {
                console.log(value);
                console.log(value.getTime());
                
                
                if (!(value instanceof Date) || isNaN(value.getTime())) {
                  return "Érvénytelen dátum";
                }
                if (value.getTime() < Date.now()) {
                  return "Nem lehet múlt idő";
                }
                return null;
              },
            defaultTicketPrice: (value) => value < 0 ? "Nem lehet negatív" : null,
          },
    });

    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [film, setFilm] = useState<IFilm | null>(null);
    const { filmId, id } = useParams();

    useEffect(() => {
        api.Room.getRooms().then(res => setRooms(res.data));
    }, []);

    useEffect(() => {
        if (filmId) {
            api.Films.getFilm(filmId).then(res => setFilm(res.data));
        }
    }, [filmId]);

    useEffect(() => {
        if (id && !isCreate) {
            api.Screening.getScreening(String(id)).then((res) => {
                form.initialize({
                    filmId: res.data.filmId,
                    roomId: res.data.roomId,
                    date: new Date(res.data.date),
                    defaultTicketPrice: res.data.defaultTicketPrice,
                });
            });
        }
    }, [id, isCreate]);

    return (
        <Card>
            <form
                onSubmit={form.onSubmit(async (values) => {
                    try {
                        if (isCreate) {
                            await api.Screening.createScreening({
                                filmId: Number(values.filmId),
                                roomId: Number(values.roomId),
                                date: String(values.date),
                                defaultTicketPrice: Number(values.defaultTicketPrice)
                            });
                        } else {
                            // todo
                        }
                        navigate(-1);
                    } catch (error) {
                        console.error("Failed to save screening:", error);
                    }
                })}
            >

                <Fieldset
                    legend={<Title order={4}>Film adatok</Title>}
                    radius="md"
                    style={{
                        border: '1px solid var(--mantine-color-gray-3)',
                        padding: rem(24),
                        marginTop: rem(16),
                        backgroundColor: 'var(--mantine-color-gray-0)',
                        borderRadius: rem(8),
                    }}
                >
                    {film && (
                        <Card withBorder shadow="sm" padding="md">
                            <Stack gap="md">
                                <Group>
                                    <IconMovie size={18} />
                                    <Text fw={700}>Cím:</Text>
                                    <Text>{film.title}</Text>
                                </Group>

                                <Group>
                                    <IconUser size={18} />
                                    <Text fw={700}>Rendező:</Text>
                                    <Text>{film.director}</Text>
                                </Group>

                                <Group>
                                    <IconCategory size={18} />
                                    <Text fw={700}>Műfaj:</Text>
                                    <Text>{film.genre}</Text>
                                </Group>

                                <Group>
                                    <IconClock size={18} />
                                    <Text fw={700}>Hossz:</Text>
                                    <Text>{film.length} perc</Text>
                                </Group>

                                <Group>
                                    <IconShield size={18} />
                                    <Text fw={700}>Korhatár:</Text>
                                    <Text>{film.ageRating}+</Text>
                                </Group>
                            </Stack>
                        </Card>
                    )}
                </Fieldset>
                <Fieldset
                    legend={<Title order={4}>Vetítés</Title>}
                    radius="md"
                    style={{
                        border: '1px solid var(--mantine-color-gray-3)',
                        padding: rem(24),
                        marginTop: rem(16),
                        backgroundColor: 'var(--mantine-color-gray-0)',
                        borderRadius: rem(8),
                    }}
                >

                    <NativeSelect
                        label="Terem"
                        key={form.key('roomId')}
                        {...form.getInputProps('roomId')}
                        data={rooms.map((c) => {
                            return {
                                value: c.roomId.toString(),
                                label: c.name,
                            }
                        })}
                    />
                    <DateTimePicker
                        withAsterisk
                        label="Vetítés dátuma"
                        placeholder="Válassz dátumot"
                        valueFormat="YYYY-MM-DD HH:mm"
                        key={form.key("date")}
                        {...form.getInputProps("date")}
                    />
                    <NumberInput
                        withAsterisk
                        label="Alap jegyár"
                        placeholder="Jegyár Ft"
                        key={form.key("defaultTicketPrice")}
                        {...form.getInputProps("defaultTicketPrice")}
                    />
                </Fieldset>


                <Group justify="flex-end" mt="md">
                    <Button type="submit">Mentés</Button>
                </Group>
            </form>
        </Card>
    );
};

export default CreateUpdateScreenings;
