import { Alert} from "@mantine/core";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";

interface TicketInspectionAlertsProps {
  errorVisible: boolean;
  successVisible: boolean;
  alertMessage: string;
  lastValidatedId: number;
  onErrorClose: () => void;
  onSuccessClose: () => void;
}

const TicketInspectionAlerts: React.FC<TicketInspectionAlertsProps> = ({
  errorVisible,
  successVisible,
  alertMessage,
  lastValidatedId,
  onErrorClose,
  onSuccessClose,
}) => {
  return (
    <>
      {errorVisible && (
        <Alert
          variant="light"
          color="red"
          title="Error"
          mt={16}
          icon={<IconAlertTriangle />}
          withCloseButton
          onClose={onErrorClose}
          closeButtonLabel="Dismiss"
        >
          There has been an error. <br />
          {alertMessage}
        </Alert>
      )}
      {successVisible && lastValidatedId !== -1 && (
        <Alert
          variant="light"
          color="green"
          title="Succesfully validated."
          mt={16}
          icon={<IconCheck />}
          withCloseButton
          onClose={onSuccessClose}
          closeButtonLabel="Dismiss"
        >
          The {lastValidatedId} ID ticket has been validated<br />
        </Alert>
      )}
    </>
  );
};

export default TicketInspectionAlerts;