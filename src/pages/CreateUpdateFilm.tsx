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
            title: (value) => value.length <= 0 ? "Required" : null,
            director: (value) => value.length <= 0 ? "Required" : null,
            genre: (value) => value.length <= 0 ? "Required" : null,
            length: (value) => (value <= 0 ? "Positive" : null),
            ageRating: (value) => (value < 0 || value > 18 ? "Between 0 and 18" : null),
            description: (value) => value.length <= 0 ? "Required" : null,
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
                    label="Title"
                    placeholder="Title"
                    key={form.key("title")}
                    {...form.getInputProps("title")}
                />
                <TextInput
                    withAsterisk
                    label="Director"
                    placeholder="Director"
                    key={form.key("director")}
                    {...form.getInputProps("director")}
                />
                <TextInput
                    withAsterisk
                    label="Genre"
                    placeholder="Genre"
                    key={form.key("genre")}
                    {...form.getInputProps("genre")}
                />
                <NumberInput
                    withAsterisk
                    label="Length"
                    placeholder="Length"
                    key={form.key("length")}
                    {...form.getInputProps("length")}
                    allowNegative={false}
                    suffix=" minutes"
                />
                <TextInput
                    withAsterisk
                    label="Description"
                    placeholder="Description"
                    key={form.key("description")}
                    {...form.getInputProps("description")}
                />
                <Checkbox
                    defaultChecked
                    label="Age rating"
                    {...form.getInputProps("setAgeRating")}
                    onChange={handleCheckboxChange}
                />
                {showAgeRating && (
                    <NumberInput
                        withAsterisk
                        label="Age rating"
                        placeholder="Age rating"
                        key={form.key("ageRating")}
                        {...form.getInputProps("ageRating")}
                        allowNegative={false}
                        suffix=" +"
                        max={18}
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
                    <Button type="submit">Save</Button>
                </Group>
            </form>
            {alertVisible && (<Alert
                variant="light"
                color="red"
                title="Error"
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

export default CreateUpdateFilms;
