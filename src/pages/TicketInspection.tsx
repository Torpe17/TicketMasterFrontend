import { Alert, Button, Card, Fieldset, Group, NumberInput, rem, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useState } from "react";

const TicketInspection = () => {
    const [alertVisible, setAlertVisible] = useState(false);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            id: 0,
        },

        validate: {
            id: (value) => value <= 0 ? "Nem lehet negatív" : null,
        },
    });

    return <Card>
        <Fieldset
            legend={<Title order={4}>Jegy ellenőrzés</Title>}
            radius="md"
            style={{
                border: '1px solid var(--mantine-color-gray-3)',
                padding: rem(24),
                marginTop: rem(16),
                backgroundColor: 'var(--mantine-color-gray-0)',
                borderRadius: rem(8),
            }}
        >
            <form
                onSubmit={form.onSubmit(async (values) => {
                    try {
                        //todo
                    } catch (error) {
                        console.error("Failed to validate ticket:", error);
                        setAlertVisible(true);
                    }
                })}
            >
                <NumberInput
                    withAsterisk
                    label="Jegy azonosító"
                    placeholder="Hossz"
                    allowNegative={false}
                    key={form.key("id")}
                    {...form.getInputProps("id")}
                />

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
                Hiba történt a művelet során.
            </Alert>)}
        </Fieldset>
    </Card>
}

export default TicketInspection;