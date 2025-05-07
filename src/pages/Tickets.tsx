import { Accordion, Button, Text, Title, Group, Box, Tooltip } from "@mantine/core";
import { IconReceipt, IconTrash, IconArmchair, IconSum, IconCalendar } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import api from "../api/api";
import { IPurchase } from "../interfaces/IPurchase";

const Tickets = () => {
    const [purchases, setPurchases] = useState<IPurchase[]>([]);

    const canDeletePurchase = (screeningTime: Date) => {
        const screeningMs = new Date(screeningTime).getTime();
        const currentTime = new Date().getTime();
        const fourHoursInMs = 4 * 60 * 60 * 1000;
        
        return (screeningMs - currentTime) < fourHoursInMs;
    }

    useEffect(() => {
        api.Purchases.getMyPurchases().then(res => {
            setPurchases(res.data);
        });
    }, []);

    const handleDelete = async (purchaseId: number) => {
        try {
            await api.Purchases.deletePurchase(purchaseId);
            setPurchases(purchases.filter(p => p.id !== purchaseId));
          } catch (error) {
            console.error("Failed to delete purchase:", error);
            // Optionally show error to user
          }


        console.log("Deleting purchase:", purchaseId);
    };

    const items = purchases.map((purchase) => (
        <Accordion.Item key={purchase.id} value={String(purchase.id)}>
            <Accordion.Control icon={<IconReceipt size={20} />}>
                <Group justify="space-between" w="100%">
                    <div>
                        <Title order={4}>{purchase.ticketFilmName}</Title>
                        <Text c="dimmed" size="sm">Vetítés: {new Date(purchase.screeningTime).toLocaleString()}</Text>
                    </div>
                    <Text fw={700}>{purchase.ticketCount} jegyek</Text>
                </Group>
            </Accordion.Control>

            <Accordion.Panel>
                <Box mb="md">
                    <Text><IconReceipt size={18} /><b>Azonosító: </b>{purchase.id}</Text>
                    <Text><IconSum size={18} /><b>Összeg:</b> ${purchase.totalPrice.toFixed(2)}</Text>
                    <Text><IconCalendar size={18} /><b>Vásárlás dátuma:</b> {new Date(purchase.purchaseDate).toLocaleString()}</Text>
                </Box>

                <Title order={5} mb="sm">Jegyek:</Title>
                <div>
                    {purchase.tickets.map((ticket, index) => (
                        <Group key={ticket.id || index} mb="xs" p="xs" bg="gray.0" style={{ borderRadius: '8px' }}>
                            <IconArmchair size={16} />
                            <Text size="sm">Jegy {index + 1}:</Text>
                            <Text size="sm">Sor: {ticket.seatRow}, Szék: {ticket.seatColumn}</Text>
                        </Group>
                    ))}
                </div>
            </Accordion.Panel>

            <Accordion.Panel>
                <Tooltip 
                    label="A vásárlást 4 órán belül a vetítéshez képest nem lehet törölni."
                    disabled={!canDeletePurchase(purchase.screeningTime)}
                    position="bottom">
                    <div>
                        <Button
                            leftSection={<IconTrash size={16} />}
                            radius="xl"
                            color={!canDeletePurchase(purchase.screeningTime) ? "red" : "gray"}
                            disabled={canDeletePurchase(purchase.screeningTime)}
                            onClick={() => {handleDelete(purchase.id)}}
                            style={{
                                transition: 'all 0.2s ease',
                                cursor: !canDeletePurchase(purchase.screeningTime) ? 'pointer' : 'not-allowed'
                            }}>
                            Vásárlás törlése
                        </Button>
                    </div>
                </Tooltip>
                
            </Accordion.Panel>
        </Accordion.Item>
    ));

    return (
        <div>
            <Title order={1} mb="xl">Vásárolt jegyek</Title>
            <Accordion
                variant="separated"
                radius="lg"
                chevronPosition="left"
            >
                {items}
            </Accordion>
        </div>
    );
};

export default Tickets;