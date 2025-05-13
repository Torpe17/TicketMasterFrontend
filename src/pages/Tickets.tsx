import { Accordion, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { IPurchase } from "../interfaces/IPurchase";
import api from "../api/api";
import PurchaseItem from "../components/Tickets/TicketAccordionPurchaseItem";

const Tickets = () => {
    const [purchases, setPurchases] = useState<IPurchase[]>([]);

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
        }
    };

    return (
        <div>
            <Title order={1} mb="xl">Vásárolt jegyek</Title>
            <Accordion variant="separated" radius="lg" chevronPosition="left">
                {purchases.map((purchase) => (
                    <PurchaseItem 
                        key={purchase.id}
                        purchase={purchase}
                        onDelete={handleDelete}
                    />
                ))}
            </Accordion>
        </div>
    );
};

export default Tickets;