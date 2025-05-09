import { Button} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IScreening } from '../interfaces/IScreening';
import dayjs
 from 'dayjs';
interface ScreeningButtonProps {
  screening: IScreening;
}

const ScreeningButton: React.FC<ScreeningButtonProps> = ({ screening }) => {
    const navigate = useNavigate();
    return (
      <Button
        variant="gradient"
        gradient={{ from: 'yellow', to: 'orange', deg: 90 }}
        onClick={() => navigate(`../films`)}
      >
        {dayjs(screening.date).format('YYYY.MM.D. HH:mm')}  
      </Button>
    );
  };
export default ScreeningButton;