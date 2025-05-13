import { Alert, Button, Card, Fieldset, Group, NativeSelect, NumberInput, rem, Stack, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import api from "../../api/api.ts";
import { useNavigate, useParams } from "react-router-dom";
import { IRoom } from "../../interfaces/IRoom.ts";
import { IFilm } from "../../interfaces/IFilm.ts";
import { IconAlertTriangle, IconCategory, IconClock, IconMovie, IconShield, IconUser } from "@tabler/icons-react";
import { DateTimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';


interface ICreateUpdateScreening {
    isCreate: boolean;
}

const CreateUpdateScreenings = ({ isCreate }: ICreateUpdateScreening) => {
    const navigate = useNavigate();
    const [alertVisible, setAlertVisible] = useState(false);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            filmId: 0,
            roomId: "0",
            date: new Date(),
            defaultTicketPrice: 0,
        },
        validate: {
            date: (value) => {
                const date = new Date(value).getTime();
                if (isNaN(date)) return "Invalid date";
                if (date < Date.now()) return "Can not be in the past";
                return null;
            },
            defaultTicketPrice: (value) => value < 0 ? "Positive" : null,
        },
    });

    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [film, setFilm] = useState<IFilm | null>(null);
    const { filmId, id } = useParams();

    useEffect(() => {
        api.Room.getRooms().then(res => {
            setRooms(res.data)
            if (isCreate && res.data.length > 0) {
                form.setFieldValue("roomId", String(res.data[0].roomId));
            }
        });
        
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
                    roomId: String(res.data.roomId),
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
                            console.log(values.date);
                            console.log(new Date(values.date.toString().replace(" ", "T")).toISOString().replace("Z", ""));
                            
                            await api.Screening.createScreening({
                                filmId: Number(film?.id),
                                roomId: Number(values.roomId),
                                date: new Date(values.date.toString().replace(" ", "T")).toISOString().replace("Z", ""), 
                                defaultTicketPrice: Number(values.defaultTicketPrice)
                            });
                        } else {
                            console.log(typeof(values.date), values.date);
                            console.log(new Date(values.date.toString().replace(" ", "T")).toISOString().replace("Z", ""));
                            
                            await api.Screening.updateScreening(String(id), {
                                filmId: Number(film?.id),
                                roomId: Number(values.roomId),
                                date: new Date(values.date.toString().replace(" ", "T")).toISOString().replace("Z", ""), 
                                defaultTicketPrice: Number(values.defaultTicketPrice)
                            })
                        }
                        navigate(-1);
                    } catch (error) {
                        console.error("Failed to save screening:", error);
                        setAlertVisible(true);
                    }
                })}
            >

                <Fieldset
                    legend={<Title order={4}>Movie data</Title>}
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
                                    <Text fw={700}>Title:</Text>
                                    <Text>{film.title}</Text>
                                </Group>

                                <Group>
                                    <IconUser size={18} />
                                    <Text fw={700}>Director:</Text>
                                    <Text>{film.director}</Text>
                                </Group>

                                <Group>
                                    <IconCategory size={18} />
                                    <Text fw={700}>Genre:</Text>
                                    <Text>{film.genre}</Text>
                                </Group>

                                <Group>
                                    <IconClock size={18} />
                                    <Text fw={700}>Length:</Text>
                                    <Text>{film.length} perc</Text>
                                </Group>

                                <Group>
                                    <IconShield size={18} />
                                    <Text fw={700}>Age rating:</Text>
                                    <Text>{film.ageRating}+</Text>
                                </Group>
                            </Stack>
                        </Card>
                    )}
                </Fieldset>
                <Fieldset
                    legend={<Title order={4}>Screening</Title>}
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
                        data={rooms.map((c) => ({
                            value: c.roomId.toString(),
                            label: c.name,
                          }))}
                    />
                    <DateTimePicker
                        withAsterisk
                        label="Screening date"
                        placeholder="Choose date"
                        valueFormat="YYYY-MM-DD HH:mm"
                        key={form.key("date")}
                        {...form.getInputProps("date")}
                    />
                    <NumberInput
                        withAsterisk
                        label="Default ticket price"
                        placeholder="$ price"
                        key={form.key("defaultTicketPrice")}
                        prefix="$ "
                        {...form.getInputProps("defaultTicketPrice")}
                    />
                </Fieldset>


                <Group justify="flex-end" mt="md">
                    <Button type="submit">Save</Button>
                </Group>
            </form>
            {alertVisible && (<Alert
                variant="light"
                color="red" 
                title="Hiba" 
                mt={16} 
                icon={<IconAlertTriangle />}
                withCloseButton 
                onClose={() => setAlertVisible(false)}
                closeButtonLabel="Dismiss">
                Error while saving
            </Alert>)}
        </Card>
    );
};

export default CreateUpdateScreenings;
