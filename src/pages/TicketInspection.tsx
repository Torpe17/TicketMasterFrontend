import { Alert, Button, Card, Fieldset, Group, NumberInput, rem, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import api from "../api/api";

const TicketInspection = () => {
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("")
    const [lastValidatedId, setLastValidatedId] = useState(-1);

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
                        await api.Tickets.validateTicket(values.id)
                            .then(res => {
                                if(res.status == 200){
                                    setErrorVisible(false);
                                    setSuccessVisible(true);
                                    setLastValidatedId(values.id)
                                }
                            });
                    } catch (error: any) {
                        if(error.response){
                            const status = error.response.status;
                            console.log(status);
                            if(status == 404) setAlertMessage("A jegy nem található.")                     
                            else if(status == 400) setAlertMessage("A jegyet már ellenőrizték.")
                            else {setAlertMessage("");}                     
                        }
                        setErrorVisible(true);
                        setSuccessVisible(false);
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
            {errorVisible && (<Alert
                variant="light"
                color="red"
                title="Hiba"
                mt={16}
                icon={<IconAlertTriangle />}
                withCloseButton
                onClose={() => setErrorVisible(false)}
                closeButtonLabel="Dismiss">
                Hiba történt a művelet során. <br/>
                {alertMessage}
            </Alert>)}
            {successVisible && lastValidatedId != -1 && (<Alert
                variant="light"
                color="green"
                title="Sikeres ellenőrzés"
                mt={16}
                icon={<IconCheck />}
                withCloseButton
                onClose={() => setSuccessVisible(false)}
                closeButtonLabel="Dismiss">
                A {lastValidatedId} azonosítójú jegy sikeresen ellenőrizve.<br/>
            </Alert>)}
        </Fieldset>
    </Card>
}

export default TicketInspection;