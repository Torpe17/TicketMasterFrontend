import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Fieldset, Group, NativeSelect, NumberInput, Title, Button, Alert, rem } from "@mantine/core";
import { DateTimePicker } from '@mantine/dates';
import { IRoom } from "../../interfaces/IRoom";
import { IFilm } from "../../interfaces/IFilm";
import { IconAlertTriangle, } from "@tabler/icons-react";
import api from "../../api/api";
import FilmDetails from "../../components/Film/FilmDetails";

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
            setRooms(res.data);
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
                            await api.Screening.createScreening({
                                filmId: Number(film?.id),
                                roomId: Number(values.roomId),
                                date: new Date(values.date.toString().replace(" ", "T")).toISOString().replace("Z", ""),
                                defaultTicketPrice: Number(values.defaultTicketPrice)
                            });
                        } else {
                            await api.Screening.updateScreening(String(id), {
                                filmId: Number(film?.id),
                                roomId: Number(values.roomId),
                                date: new Date(values.date.toString().replace(" ", "T")).toISOString().replace("Z", ""),
                                defaultTicketPrice: Number(values.defaultTicketPrice)
                            });
                        }
                        navigate(-1);
                    } catch (error) {
                        console.error("Failed to save screening:", error);
                        setAlertVisible(true);
                    }
                })}
            >

                {film && <FilmDetails film={film} />}

                <Fieldset
                    legend={<Title order={4}>Screening Details</Title>}
                    radius="md"
                    style={{ border: '1px solid var(--mantine-color-gray-3)', padding: rem(24), marginTop: rem(16), backgroundColor: 'var(--mantine-color-gray-0)' }}
                >
                    <NativeSelect label="Room" {...form.getInputProps('roomId')} data={rooms.map(c => ({ value: c.roomId.toString(), label: c.name }))} />
                    <DateTimePicker withAsterisk label="Screening date" valueFormat="YYYY-MM-DD HH:mm" {...form.getInputProps("date")} />
                    <NumberInput withAsterisk label="Default ticket price" prefix="$ " {...form.getInputProps("defaultTicketPrice")} />
                </Fieldset>

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Save</Button>
                </Group>
            </form>
            {alertVisible && (
                <Alert variant="light" color="red" title="Error" mt={16} icon={<IconAlertTriangle />} onClose={() => setAlertVisible(false)}>
                    Error while saving
                </Alert>
            )}
        </Card>
    );
};

export default CreateUpdateScreenings;