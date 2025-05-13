import { Card, Group, Stack, Text } from "@mantine/core";
import { IconCategory, IconClock, IconMovie, IconShield, IconUser } from "@tabler/icons-react";
import { IFilm } from "../../interfaces/IFilm";

interface FilmDetailsProps {
    film: IFilm;
}

const FilmDetails = ({ film }: FilmDetailsProps) => {
    return (
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
                    <Text>{film.length} min</Text>
                </Group>

                <Group>
                    <IconShield size={18} />
                    <Text fw={700}>Age rating:</Text>
                    <Text>{film.ageRating}+</Text>
                </Group>
            </Stack>
        </Card>
    );
};

export default FilmDetails;
