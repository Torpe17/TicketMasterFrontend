import { Button, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { canDeletePurchase } from "./utils";
import { IPurchase } from "../../interfaces/IPurchase";

interface DeleteButtonProps {
    purchase: IPurchase;
    onDelete: (id: number) => void;
}

const DeleteButton = ({ purchase, onDelete }: DeleteButtonProps) => {
    const disabled = canDeletePurchase(purchase.screeningTime);

    return (
        <Tooltip 
            label="A vásárlást 4 órán belül a vetítéshez képest nem lehet törölni."
            disabled={!disabled}
            position="bottom">
            <div>
                <Button
                    leftSection={<IconTrash size={16} />}
                    radius="xl"
                    color={!disabled ? "red" : "gray"}
                    disabled={disabled}
                    onClick={() => onDelete(purchase.id)}
                    style={{
                        transition: 'all 0.2s ease',
                        cursor: !disabled ? 'pointer' : 'not-allowed'
                    }}>
                    Vásárlás törlése
                </Button>
            </div>
        </Tooltip>
    );
};

export default DeleteButton;