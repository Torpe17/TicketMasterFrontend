import { Alert, Button, Card, Checkbox, Group, NumberInput, TextInput, FileInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import api from "../api/api.ts";
import { useNavigate, useParams } from "react-router-dom";
import { IconAlertTriangle } from "@tabler/icons-react";

interface ICreateUpdateFilms {
    isCreate: boolean;
}

const CreateUpdateFilms = ({ isCreate }: ICreateUpdateFilms) => {
    const [showAgeRating, setShowAgeRating] = useState(true);
    const[removePicture, setRemovePicture] = useState(false);
    const navigate = useNavigate();
    const [alertVisible, setAlertVisible] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);


    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowAgeRating(event.currentTarget.checked);
    };

    const handleRemoveImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemovePicture(event.currentTarget.checked);
    };

    const handleImageUpload = (file: File | null) => {
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                const base64String = result.split(',')[1];
                setBase64Image(base64String);
            };
            reader.onerror = (error) => {
                console.error("Error converting image:", error);
                setAlertVisible(true);
            };
        } else {
            setBase64Image(null);
        }
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
            removePicture: false,
        },

        validate: {
            title: (value) => value.length <= 0 ? "Kötelező kitölteni" : null,
            director: (value) => value.length <= 0 ? "Kötelező kitölteni" : null,
            genre: (value) => value.length <= 0 ? "Kötelező kitölteni" : null,
            length: (value) => (value <= 0 ? "Nagyobb mint 0-nak kell lennie" : null),
            ageRating: (value) => (value < 0 || value > 18 ? "18 és 0 közötti számnak kell lennie" : null),
            description: (value) => value.length <= 0 ? "Kötelező kitölteni" : null,
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
                    removePicture: false,
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
                                pictureBytes: base64Image == "0x" ? null : base64Image
                            });
                        } else {
                            const cur = await api.Films.getFilm(String(id));
                            await api.Films.updateFilm(String(id), {
                                title: values.title,
                                director: values.director,
                                genre: values.genre,
                                length: Number(values.length),
                                description: values.description,
                                ageRating: Boolean(values.setAgeRating) == true ? Number(values.ageRating) : null,
                                setAgeRating: true,
                                pictureBase64: base64Image == cur.data.pictureBase64 ? null : base64Image,
                                removePicture: Boolean(removePicture),
                            });
                        }
                        navigate(-1);
                    } catch (error) {
                        console.error("Failed to save film:", error);
                        setAlertVisible(true);
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

                {!isCreate && (
                    <Checkbox
                    label="Remove Current Picture"
                    key={form.key("removePicture")}
                    {...form.getInputProps("removePicture")}
                    onChange={handleRemoveImage}
                    />
                    )}
               

                {!removePicture && (
                    <FileInput
                    accept="image/png,image/jpeg,image/jpg"
                    clearable
                    label="Film Poster"
                    placeholder="Your Poster Image Here"
                    key={form.key("pictureBase64")}
                    {...form.getInputProps("pictureBase64")}
                    onChange={handleImageUpload}
                />
                )}

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Mentés</Button>
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
                Hiba történt a mentés során.
            </Alert>)}
        </Card>
    );
};

export default CreateUpdateFilms;
