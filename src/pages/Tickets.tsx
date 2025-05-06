import { Accordion } from "@mantine/core"
import { IconReceipt } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import api from "../api/api";
import { IPurchase } from "../interfaces/IPurchase";


const Tickets = () => {
const [purchases, setPurchases] = useState<IPurchase[]>([])

    useEffect(() => {
        api.Purchases.getMyPurchases().then(res => {
            setPurchases(res.data)
        })
    },[]);

    const items = purchases.map((item) => (
    <Accordion.Item key={item.id} value={item.ticketFilmName}>
        <Accordion.Control icon={<IconReceipt/>}>{item.ticketCount}</Accordion.Control>
        <Accordion.Panel>{item.purchaseDate}</Accordion.Panel>
    </Accordion.Item>
    ))
    
    return <div>
        <div>
            <h1>Vásárolt jegyek</h1>
            <Accordion variant="separated" radius="lg" defaultValue="Apples">
                {items}
            </Accordion>
        </div>
    </div>
}
export default Tickets