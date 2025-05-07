import { Alert, Button, Card, Fieldset, Group, Modal, NumberInput, rem, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertTriangle, IconCheck, IconObjectScan } from "@tabler/icons-react";
import api from "../api/api";
import { useEffect, useRef, useState } from "react";
import "./QrStyles.css";
import QrScanner from "qr-scanner";
import { useDisclosure } from "@mantine/hooks";

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

    const validateAPI = (id: number) => {
        api.Tickets.validateTicket(id)
            .then(res => {
                if (res.status == 200) {
                    setErrorVisible(false);
                    setSuccessVisible(true);
                    setLastValidatedId(id)
                }
            })
            .catch(err => {
                if (err.response) {
                    const status = err.response.status;
                    console.log(status);
                    if (status == 404) setAlertMessage("A jegy nem található.")
                    else if (status == 400) setAlertMessage("A jegyet már ellenőrizték.")
                    else { setAlertMessage(""); }
                }
                setErrorVisible(true);
                setSuccessVisible(false);
            });
        if (opened) close();
    }
    // QR States
    const [opened, { open, close }] = useDisclosure(false);
    const scanner = useRef<QrScanner>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const qrBoxEl = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);

    // Success
    const onScanSuccess = (result: QrScanner.ScanResult) => {
        console.log("scanned: " + result?.data);
        scanner.current?.stop();
        validateAPI(Number(result?.data))
    };

    // Fail
    const onScanFail = (err: string | Error) => {
        console.log(err);
    };
    useEffect(() => {
        if (opened) {
            const timeout = setTimeout(() => {
                if (videoEl.current) {
                    scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
                        onDecodeError: onScanFail,
                        preferredCamera: "environment",
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                        overlay: qrBoxEl.current || undefined,
                    });

                    scanner.current
                        .start()
                        .then(() => setQrOn(true))
                        .catch((err) => {
                            console.error("Scanner start error:", err);
                            setQrOn(false);
                        });
                }
            }, 300);

            return () => {
                scanner.current?.stop();
                scanner.current = undefined;
                clearTimeout(timeout);
            };
        }
    }, [opened]);

    useEffect(() => {
        if (!qrOn) alert("Nincs engedélyezve a kamera. A scanneléshez engedélyezze és töltse újra az oldalt");
    }, [qrOn]);

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
            <form onSubmit={form.onSubmit(async (values) => validateAPI(values.id))} >
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

                {qrOn && (<Button variant="default" leftSection={<IconObjectScan />} onClick={open}>
                    Beolvasás
                </Button>)}
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
                Hiba történt a művelet során. <br />
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
                A {lastValidatedId} azonosítójú jegy sikeresen ellenőrizve.<br />
            </Alert>)}

        </Fieldset>
        <Modal opened={opened} onClose={close} title="Jegy beolvasás">
            {!qrOn && (<p>Nincs engedélyezve a kamera.</p>)}
            <div className="qr-reader">
                <video ref={videoEl} width={256} height={256}></video>
            </div>
        </Modal>
    </Card>
}

export default TicketInspection;