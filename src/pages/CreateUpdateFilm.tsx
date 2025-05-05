import { Button, Card, Checkbox, Group, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import api from "../api/api.ts";
import { useNavigate, useParams } from "react-router-dom"; 

interface ICreateUpdateFilms {
  isCreate: boolean;
}

const CreateUpdateFilms = ({ isCreate }: ICreateUpdateFilms) => {
    const [showAgeRating, setShowAgeRating] = useState(true);
    const navigate = useNavigate();

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowAgeRating(event.currentTarget.checked);
    };

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
        title: "",
        director: "",
        genre: "",
        length: 0,
        description: "",
        ageRating: 0,
        setAgeRating: true,
        },

        validate: {
        title: (value) =>
            value.length <= 3 ? "Legalább 3 karakter hosszúnak kell lennie" : null,
        director: (value) =>
            value.length <= 3 ? "Legalább 3 karakter hosszúnak kell lennie" : null,
        genre: (value) =>
            value.length <= 3 ? "Legalább 3 karakter hosszúnak kell lennie" : null,
        length: (value) => (value <= 0 ? "Nagyobb mint 0-nak kell lennie" : null),
        ageRating: (value) => (value < 0 || value >18 ? "18 és 0 közötti számnak kell lennie" : null),
        description: (value) =>
            value.length <= 3 ? "Legalább 3 karakter hosszúnak kell lennie" : null,
        },
    });

    const { id } = useParams();

    useEffect(() => {
        if (id && !isCreate) {
        api.Films.getFilm(String(id)).then((res) => {
            form.initialize({
            title: res.data.title,
            director: res.data.director,
            genre: res.data.genre,
            length: res.data.length,
            description: res.data.description,
            ageRating: res.data.ageRating,
            setAgeRating: res.data.ageRating != null,
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
                await api.Films.createFilm({
                    title: values.title,
                    director: values.director,
                    genre: values.genre,
                    length: Number(values.length),
                    description: values.description,
                    ageRating: Number(values.ageRating),
                });
                } else {
                await api.Films.updateFilm(String(id), {
                    title: values.title,
                    director: values.director,
                    genre: values.genre,
                    length: Number(values.length),
                    description: values.description,
                    ageRating: Boolean(values.setAgeRating) == true? Number(values.ageRating) : null,
                    setAgeRating: true
                });
                }

                navigate(-1);
            } catch (error) {
                console.error("Failed to save film:", error); 
            }
            })}
        >
            <TextInput
            withAsterisk
            label="Cím"
            placeholder="Cím"
            key={form.key("title")}
            {...form.getInputProps("title")}
            />
            <TextInput
            withAsterisk
            label="Rendező"
            placeholder="Rendező"
            key={form.key("director")}
            {...form.getInputProps("director")}
            />
            <TextInput
            withAsterisk
            label="Műfaj"
            placeholder="Műfaj"
            key={form.key("genre")}
            {...form.getInputProps("genre")}
            />
            <NumberInput
            withAsterisk
            label="Hossz (perc)"
            placeholder="Hossz"
            key={form.key("length")}
            {...form.getInputProps("length")}
            />
            <TextInput
            withAsterisk
            label="Leírás"
            placeholder="Leírás"
            key={form.key("description")}
            {...form.getInputProps("description")}
            />
            <Checkbox
            defaultChecked
            label="Korhatár"
            {...form.getInputProps("setAgeRating")}
            onChange={handleCheckboxChange}
            />
            {showAgeRating && (
            <NumberInput
                withAsterisk
                label="Korhatár"
                placeholder="Korhatár"
                key={form.key("ageRating")}
                {...form.getInputProps("ageRating")}
            />
            )}

            <Group justify="flex-end" mt="md">
            <Button type="submit">Mentés</Button>
            </Group>
        </form>
        </Card>
    );
};

export default CreateUpdateFilms;
