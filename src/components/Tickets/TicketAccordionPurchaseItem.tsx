import { Accordion, Box, Text, Title, Group, Tooltip } from "@mantine/core";
import { IconReceipt, IconSum, IconCalendar } from "@tabler/icons-react";
import TicketItem from "./TicketAccordionTicketItem";
import DeleteButton from "./TicketDeleteButton";
import { canDeletePurchase } from "./utils";
import { IPurchase } from "../../interfaces/IPurchase";

interface PurchaseItemProps {
    purchase: IPurchase;
    onDelete: (id: number) => void;
}

const PurchaseItem = ({ purchase, onDelete }: PurchaseItemProps) => {
    return (
        <Accordion.Item value={String(purchase.id)}>
            <Accordion.Control icon={<IconReceipt size={20} />}>
                <Group justify="space-between" w="100%">
                    <div>
                        <Title order={4}>{purchase.ticketFilmName}</Title>
                        <Text c="dimmed" size="sm">
                            Vetítés: {new Date(purchase.screeningTime).toLocaleString()}
                        </Text>
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
                        <TicketItem 
                            key={ticket.id || index}
                            ticket={ticket}
                            index={index}
                        />
                    ))}
                </div>
            </Accordion.Panel>

            <Accordion.Panel>
                <DeleteButton 
                    purchase={purchase}
                    onDelete={onDelete}
                />
            </Accordion.Panel>
        </Accordion.Item>
    );
};

export default PurchaseItem;