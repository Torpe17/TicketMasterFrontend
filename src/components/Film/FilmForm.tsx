import {
    Alert, Button, Card, Checkbox, FileInput, Group,
    NumberInput, TextInput
} from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { useFilmForm } from "./useFilmForm";
import { convertImageToBase64 } from "./helpers";

export const FilmForm = ({ isCreate }: { isCreate: boolean }) => {
    const [showAgeRating, setShowAgeRating] = useState(true);
    const [removePicture, setRemovePicture] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);

    const form = useFilmForm();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && !isCreate) {
            api.Films.getFilm(id).then((res) => {
                form.initialize({
                    title: res.data.title,
                    director: res.data.director,
                    genre: res.data.genre,
                    length: res.data.length,
                    description: res.data.description,
                    ageRating: res.data.ageRating,
                    setAgeRating: res.data.ageRating != null,
                    removePicture: false,
                });
            });
        }
    }, [id, isCreate]);

    const handleImageUpload = async (file: File | null) => {
        setImageFile(file);
        if (file) {
            try {
                const base64 = await convertImageToBase64(file);
                setBase64Image(base64);
            } catch (err) {
                console.error("Error converting image:", err);
                setAlertVisible(true);
            }
        } else {
            setBase64Image(null);
        }
    };

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
                                pictureBytes: base64Image ?? null,
                            });
                        } else {
                            const cur = await api.Films.getFilm(String(id));
                            await api.Films.updateFilm(String(id), {
                                title: values.title,
                                director: values.director,
                                genre: values.genre,
                                length: Number(values.length),
                                description: values.description,
                                ageRating: values.setAgeRating ? Number(values.ageRating) : null,
                                setAgeRating: true,
                                pictureBase64: base64Image === cur.data.pictureBase64 ? null : base64Image,
                                removePicture,
                            });
                        }
                        navigate(-1);
                    } catch (error) {
                        console.error("Failed to save film:", error);
                        setAlertVisible(true);
                    }
                })}
            >
                <TextInput withAsterisk label="Title" placeholder="Title" key={form.key("title")} {...form.getInputProps("title")} />
                <TextInput withAsterisk label="Director" placeholder="Director" key={form.key("director")} {...form.getInputProps("director")} />
                <TextInput withAsterisk label="Genre" placeholder="Genre" key={form.key("genre")} {...form.getInputProps("genre")} />
                <NumberInput withAsterisk label="Length" placeholder="Length" key={form.key("length")} {...form.getInputProps("length")} allowNegative={false} suffix=" minutes" />
                <TextInput withAsterisk label="Description" placeholder="Description" key={form.key("description")} {...form.getInputProps("description")} />
                <Checkbox defaultChecked label="Age rating" {...form.getInputProps("setAgeRating")} onChange={(e) => setShowAgeRating(e.currentTarget.checked)} />
                {showAgeRating && (
                    <NumberInput withAsterisk label="Age rating" placeholder="Age rating" key={form.key("ageRating")} {...form.getInputProps("ageRating")} allowNegative={false} suffix=" +" max={18} />
                )}
                {!isCreate && (
                    <Checkbox label="Remove Current Picture" key={form.key("removePicture")} {...form.getInputProps("removePicture")} onChange={(e) => setRemovePicture(e.currentTarget.checked)} />
                )}
                {!removePicture && (
                    <FileInput accept="image/png,image/jpeg,image/jpg" clearable label="Film Poster" placeholder="Your Poster Image Here" key={form.key("pictureBase64")} {...form.getInputProps("pictureBase64")} onChange={handleImageUpload} />
                )}
                <Group justify="flex-end" mt="md">
                    <Button type="submit">Save</Button>
                </Group>
            </form>
            {alertVisible && (
                <Alert variant="light" color="red" title="Error" mt={16} icon={<IconAlertTriangle />} withCloseButton onClose={() => setAlertVisible(false)} closeButtonLabel="Dismiss">
                    Error while saving
                </Alert>
            )}
        </Card>
    );
};
