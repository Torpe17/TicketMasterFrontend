import { Accordion, Box, Text, Title, Group, Tooltip, Button, Modal, Flex } from "@mantine/core";
import { IconReceipt, IconSum, IconCalendar, IconArmchair } from "@tabler/icons-react";
import TicketItem from "./TicketAccordionTicketItem";
import DeleteButton from "./TicketDeleteButton";
import { canDeletePurchase } from "./utils";
import { IPurchase } from "../../interfaces/IPurchase";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

interface PurchaseItemProps {
    purchase: IPurchase;
    onDelete: (id: number) => void;
}

const PurchaseItem = ({ purchase, onDelete }: PurchaseItemProps) => {

    //qr code
    const [img, setImg] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentTicketId, setCurrentTicketId] = useState(0);
    const [opened, { open, close }] = useDisclosure(false);

    const generateQR = (qrData: string) => {
        setLoading(true);
        try {
            const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}`;
            setImg(url);
        } catch (error) {
            console.error("Error generating QR code", error);
        } finally {
            setLoading(false);
        }
    }


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
                        <div><Group key={ticket.id} mb="xs" p="xs" bg="gray.0" style={{ borderRadius: '8px' }}>
                            <IconArmchair size={16} />
                            <Text size="sm">Jegy {index + 1}:</Text>
                            <Text size="sm">Sor: {ticket.seatRow}, Szék: {ticket.seatColumn}</Text>
                            <Button variant="default" onClick={() => {
                                open();
                                generateQR(String(ticket.id))
                                setCurrentTicketId(ticket.id)
                            }}>Felmutatás</Button>
                        </Group>
                        </div>
                    ))}
                </div>
            </Accordion.Panel>

            <Accordion.Panel>
                <DeleteButton 
                    purchase={purchase}
                    onDelete={onDelete}
                />
            </Accordion.Panel>
            
            <Modal opened={opened} onClose={close} title="Olvassa be az ellenőrzéshez">
                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: 'sm', sm: 'lg' }}
                    justify={{ sm: 'center' }}
                >
                    <div className="app-container">
                        {loading && <p>Please Wait....</p>}
                        {img && <img src={img} className="qr-code-image" />}
                        <p>Jegy azonosító: {currentTicketId}</p>
                    </div>
                </Flex>
            </Modal>
        </Accordion.Item>
        
    );
};

export default PurchaseItem;