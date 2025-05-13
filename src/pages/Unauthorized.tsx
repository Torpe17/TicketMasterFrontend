import {useEffect} from "react";
import {Alert} from "@mantine/core";
import { IconAlertTriangleFilled} from "@tabler/icons-react";
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    useEffect(() => {
        loadItems();
        const timer = setTimeout(() => {
            navigate('/app/dashboard');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);
    const loadItems = () => {

    }

    const icon = <IconAlertTriangleFilled />;
  return (
    <Alert variant="filled" color="red" radius="xl" title="Unauthorized" icon={icon}>
      You are unauthorized to view this content!
    </Alert>
  );
}

export default Unauthorized;