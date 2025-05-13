import { Group, Text } from "@mantine/core";
import { IconArmchair } from "@tabler/icons-react";
import { ITicket } from "../../interfaces/ITicket";

interface TicketItemProps {
    ticket: ITicket;
    index: number;
}

const TicketItem = ({ ticket, index }: TicketItemProps) => {
    return (
        <Group mb="xs" p="xs" bg="gray.0" style={{ borderRadius: '8px' }}>
            <IconArmchair size={16} />
            <Text size="sm">Ticket {index + 1}:</Text>
            <Text size="sm">Row: {ticket.seatRow}, Chair: {ticket.seatColumn}</Text>
        </Group>
    );
};

export default TicketItem;