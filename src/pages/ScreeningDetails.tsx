import {
    Text, Title, Grid, Card, Group, Button, Checkbox, Paper,
    Badge, Divider, LoadingOverlay, Alert, Modal,
    ScrollArea,
    TextInput
} from "@mantine/core";
import { IScreening } from "../interfaces/IScreening";
import { IRoom } from "../interfaces/IRoom";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { IconAlertCircle, IconTicket, IconArrowLeft, IconAlertTriangle } from "@tabler/icons-react";
import { ITicket } from "../interfaces/ITicket";
import useAuth from "../hooks/useAuth";
import { useForm } from "@mantine/form";

const ScreeningDetails = () => {
    const { id } = useParams();
    const [selectedScreening, setScreening] = useState<IScreening | null>(null);
    const [room, setRoom] = useState<IRoom | null>(null);
    const [tickets, setTickets] = useState<ITicket[] | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<ICreatePurchaseTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [additionalDataModalOpen, setAdditionalModalOpen] = useState(false);
    const { isLoggedIn, roles } = useAuth();
    const [alertVisible, setAlertVisible] = useState(false);


    const navigate = useNavigate();

    // Fetch relevant data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const screeningResponse = await api.Screening.getScreening(id!);
                setScreening(screeningResponse.data);

                const roomResponse = await api.Room.getRoom(screeningResponse.data.roomId);
                setRoom(roomResponse.data);

                const ticketsResponse = await api.Tickets.getTicketsByScreeningId(screeningResponse.data.id);
                setTickets(ticketsResponse.data);

            } catch (err) {
                setError("Failed to load screening details");
                console.error(err);

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Handle seat selection
    const toggleSeat = (row: number, column: number) => {
        if (!selectedScreening?.id) return;

        setSelectedSeats(prev => {
            const existingIndex = prev.findIndex(s => s.seatRow === row && s.seatColumn === column);

            if (existingIndex >= 0) {
                return prev.filter((_, index) => index !== existingIndex);
            } else {
                return [
                    ...prev,
                    {
                        screeningId: selectedScreening.id,
                        seatColumn: column,
                        seatRow: row,
                    },
                ];
            }
        });
    };

    // Purchase total price
    const totalPrice = selectedSeats.length * (selectedScreening?.defaultTicketPrice || 0);

    // Mark bought seats as red
    const seatTaken = (row: number, column: number): boolean => {
        return tickets?.some(ticket => ticket.seatRow === row && ticket.seatColumn === column) || false
    }

    const successfulBuy = () =>{
        setError(null);
        setAdditionalModalOpen(false);
        setPurchaseModalOpen(true);
    }
    const form = useForm({
            mode: "uncontrolled",
            initialValues: {
                email: '',
                phone: ''
            },
    
            validate: {
                email: (value) => !isLoggedIn &&  value.length <= 0 ? "Required field" : null,
                phone: (value) => !isLoggedIn && value.length <= 0 ? "Required field" : null
            },
        });

    // Purchase logic
    const handlePurchase = async () => {
        try {
            setLoading(true);

            if (selectedSeats.length == 0) throw new Error("No seats selected");
            const purchaseData: ICreatePurchaseUser = {
                tickets: selectedSeats
            };

            console.log(purchaseData);

            if (!isLoggedIn) {
                console.log('Guest todo');
                setAdditionalModalOpen(true);
            }
            else{
                if(roles == null){
                    throw new Error("user logged in, but role is null");
                }
                if (roles.includes('Cashier')) {
                    console.log('Cashier todo');
                    setAdditionalModalOpen(true);
                }
                else if (roles.includes('Customer')) {
                    console.log('Customer buying');
                    await api.Purchases.createPurchaseUser(purchaseData);
                    successfulBuy();
                }
            }
            

        } catch (err) {
            setError("Purchase failed. Please try again later.");
            console.error(err);

        } finally {
            setLoading(false);
        }
    };

    if (!selectedScreening || !room) {
        return <LoadingOverlay visible={loading} />;
    }

    return (
        <div>
            <Button
                leftSection={<IconArrowLeft size={14} />}
                variant="subtle"
                mb="md"
                onClick={() => window.history.back()}
            >
                Back to screenings
            </Button>

            <Title order={1} mb="sm">Ticket Purchase - {selectedScreening.filmName}</Title>
            <Text c="dimmed" size="lg" mb="xl">
                Screening time: {new Date(selectedScreening.date).toLocaleString()} | Room: {room.name}
            </Text>

            <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Card withBorder shadow="sm" radius="md" p={0}>
                        <Title order={3} p="md">Select Your Seats</Title>

                        <Paper bg="blue" c="white" p="sm" mb="md" ta="center" radius={0}>
                            SCREEN
                        </Paper>

                        <ScrollArea.Autosize maw="100%" mah={400} mx="auto" type="scroll">
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${room.maxSeatColumn}, 1fr)`,
                                gap: '10px',
                                padding: '0 16px 16px 16px',
                                minWidth: `${room.maxSeatColumn * 40}px`
                            }}>
                                {Array.from({ length: room.maxSeatRow }).map((_, rowIndex) => (
                                    Array.from({ length: room.maxSeatColumn }).map((_, colIndex) => {
                                        const isSelected = selectedSeats.some(s => s.seatRow === rowIndex + 1 && s.seatColumn === colIndex + 1);
                                        const isTaken = seatTaken(rowIndex + 1, colIndex + 1);

                                        return (
                                            <Checkbox
                                                key={`${rowIndex}-${colIndex}`}
                                                checked={isSelected}
                                                onChange={() => toggleSeat(rowIndex + 1, colIndex + 1)}
                                                labelPosition="left"
                                                label={`${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`}
                                                disabled={isTaken}
                                                styles={{
                                                    label: {
                                                        width: '40px',
                                                        textAlign: 'center',
                                                        color: isTaken
                                                            ? 'var(--mantine-color-gray-6)'
                                                            : 'inherit'
                                                    },
                                                    root: {
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        borderRadius: 'var(--mantine-radius-sm)',
                                                        padding: '4px',
                                                        transition: 'all 0.2s ease',
                                                        backgroundColor: 'var(--mantine-color-gray-1)',
                                                        borderWidth: '1px',
                                                        borderStyle: 'solid',
                                                        borderColor: 'var(--mantine-color-gray-3)',
                                                        ...(isSelected && {
                                                            backgroundColor: 'var(--mantine-color-blue-1)',
                                                            borderColor: 'var(--mantine-color-blue-4)'
                                                        }),
                                                        ...(isTaken && {
                                                            backgroundColor: 'var(--mantine-color-red-1)',
                                                            borderColor: 'var(--mantine-color-red-4)',
                                                            cursor: 'not-allowed'
                                                        }),
                                                        '&:hover': {
                                                            ...(!isTaken && {
                                                                backgroundColor: isSelected
                                                                    ? 'var(--mantine-color-blue-2)'
                                                                    : 'var(--mantine-color-gray-2)',
                                                                borderColor: isSelected
                                                                    ? 'var(--mantine-color-blue-5)'
                                                                    : 'var(--mantine-color-gray-4)'
                                                            }),
                                                            ...(isTaken && {
                                                                backgroundColor: 'var(--mantine-color-red-1)'
                                                            })
                                                        }
                                                    },
                                                    icon: {
                                                        ...(isSelected && {
                                                            color: 'var(--mantine-color-blue-6)'
                                                        }),
                                                        ...(isTaken && {
                                                            opacity: 0.5
                                                        })
                                                    },
                                                    input: {
                                                        cursor: isTaken ? 'not-allowed' : 'pointer',
                                                        ...(isTaken && {
                                                            backgroundColor: 'var(--mantine-color-red-2)',
                                                            borderColor: 'var(--mantine-color-red-4)'
                                                        })
                                                    }
                                                }}
                                            />
                                        );
                                    })
                                ))}
                            </div>
                        </ScrollArea.Autosize>

                        {/* Legend */}
                        <Group p="md" justify="center" bg="var(--mantine-color-body)">
                            <Group gap="xs">
                                <div style={{ width: '20px', height: '20px', backgroundColor: '#868e96' }} />
                                <Text size="sm">Available</Text>
                            </Group>
                            <Group gap="xs">
                                <div style={{ width: '20px', height: '20px', backgroundColor: '#4dabf7' }} />
                                <Text size="sm">Selected</Text>
                            </Group>
                            <Group gap="xs">
                                <div style={{ width: '20px', height: '20px', backgroundColor: '#fa5252' }} />
                                <Text size="sm">Reserved</Text>
                            </Group>
                        </Group>
                    </Card>
                </Grid.Col>

                {/* Checkout Panel */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder shadow="sm" radius="md" pos="sticky" top="20px">
                        <Title order={3} mb="md">Order Summary</Title>

                        <Group justify="space-between" mb="sm">
                            <Text>Tickets:</Text>
                            <Text>{selectedSeats.length} x ${selectedScreening.defaultTicketPrice.toFixed(2)}</Text>
                        </Group>

                        <Divider my="md" />

                        <Group justify="space-between" mb="xl">
                            <Text fw={500}>Total:</Text>
                            <Badge color="blue" size="lg" variant="light">
                                ${totalPrice.toFixed(2)}
                            </Badge>
                        </Group>

                        <Button
                            fullWidth
                            size="md"
                            leftSection={<IconTicket size={18} />}
                            disabled={selectedSeats.length === 0}
                            onClick={handlePurchase}
                        >
                            Complete Purchase
                        </Button>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Purchase confirmation modal */}
            <Modal
                opened={purchaseModalOpen}
                onClose={() => {
                    setPurchaseModalOpen(false)
                    navigate(-1)
                }}
                title="Purchase Successful!"
            >
                {error &&
                    <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                        {error}
                    </Alert>}
                {!error &&
                    (<div>
                        <Text mb="md">Thank you for your purchase!</Text>
                        <Text mb="md">Your tickets have been reserved.</Text>
                        <Button
                            fullWidth
                            onClick={() => {
                                setPurchaseModalOpen(false);
                                setTimeout(() => {
                                    navigate('/app/tickets', {
                                        replace: true,
                                        state: {
                                            showSuccess: true
                                        }
                                    });
                                }, 200);
                            }}
                        >
                            View My Tickets
                        </Button>
                    </div>)
                }

            </Modal>

            <Modal
                opened={additionalDataModalOpen}
                onClose={() => setAdditionalModalOpen(false)}
                title="Please add additional data!"
            >
                <form
                onSubmit={form.onSubmit(async (values) => {
                    try {
                        if(!isLoggedIn){
                            const data: ICreatePurchaseGuest = {
                                email: values.email,
                                phoneNumber: values.phone,
                                tickets: selectedSeats
                            };
                            await api.Purchases.createPurchaseGuest(data);
                            successfulBuy();
                        }
                        else if(roles == null) throw new Error("User loged in but has no roles")
                        else if (roles.includes("Cashier")){
                            const data: ICreatePurchaseCashier = {
                                email: values.email,
                                tickets: selectedSeats
                            };
                            await api.Purchases.createPurchaseCashier(data);
                            successfulBuy();
                        }
                    } catch (error) {
                        console.error("Failed to save film:", error);
                        setAlertVisible(true);
                    }
                })}
            >
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="email@example.com"
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                />
                {
                    !isLoggedIn &&
                    <TextInput
                    withAsterisk
                    label="Phone"
                    placeholder="+3630132456"
                    key={form.key("phone")}
                    {...form.getInputProps("phone")}
                    />
                }

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Mentés</Button>
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
                There was an error during the save process.
            </Alert>)}

            </Modal>

            <LoadingOverlay visible={loading} />
        </div>
    );
};

export default ScreeningDetails;