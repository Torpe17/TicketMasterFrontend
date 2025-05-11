import {
  Alert,
  Button,
  Group,
  Modal,
  TextInput,
  Text,
  Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconCheck, IconEdit, IconHomeCog, IconHomePlus, IconHomeX, IconX } from "@tabler/icons-react";

interface FormValues {
  name: string;
  email: string;
}

interface UserProfileFormProps {
  initialValues: FormValues;
  isEditing: boolean;
  hasAddress: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
  onEditClick: () => void;
  onCancelClick: () => void;
  onSubmit: (values: FormValues) => void;
  onClearError: () => void;
  onClearSuccess: () => void;
  onNewAddressClick: () => void;
  onDeleteClick: () => void; // For opening the modal
  onDeleteConfirm: () => void; // For actual deletion
  onDeleteModalClose: () => void;
  deleteModalOpened: boolean;
}

const UserProfileForm = ({
  initialValues,
  isEditing,
  hasAddress,
  loading,
  error,
  success,
  onEditClick,
  onCancelClick,
  onSubmit,
  onClearError,
  onClearSuccess,
  onNewAddressClick,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteModalClose,
  deleteModalOpened
}: UserProfileFormProps) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues,
    validate: {
      email: (value) => {
        if (!value) return 'Kötelező egy email cím';
        return /^\S+@\S+$/.test(value) ? null : 'Érvénytelen email cím';
      },
      name: (value) => {
        if (!value) return 'Kötelező egy felhasználó név';
        return null;
      }
    },
  });

  return (
    <>
      <Title order={1}>Profilom</Title>
      <br />
      
      <form onSubmit={form.onSubmit(onSubmit)}>
        {success && (
          <Alert 
            icon={<IconCheck size="1rem" />}
            title="Siker!"
            color="green"
            mb="md"
            withCloseButton
            onClose={onClearSuccess}
          >
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert 
            icon={<IconAlertCircle size="1rem" />}
            title="Hiba!"
            color="red"
            mb="md"
            withCloseButton
            onClose={onClearError}
          >
            {error}
          </Alert>
        )}

        <TextInput
          withAsterisk
          label="Felhaszáló név"
          placeholder="Felhasználó neved"
          key={form.key('name')}
          {...form.getInputProps('name')}
          disabled={!isEditing} 
        />

        <TextInput
          withAsterisk
          label="Email"
          placeholder="Email címed"
          key={form.key('email')}
          {...form.getInputProps('email')}
          disabled={!isEditing} 
        />

        <Group justify="flex-end" mt="md">
          {isEditing && (
            <Group justify="space-between" mt="md">
              <Button 
                color="red"
                variant="outline" 
                leftSection={<IconX size="1rem" />}
                onClick={onCancelClick}
              >
                Mégse
              </Button>
              <Button type="submit">Mentés</Button>
            </Group>
          )}
        </Group>
      </form>

      {!isEditing && (
        <Button 
          leftSection={<IconEdit size="1rem" />}
          onClick={onEditClick}
          mb="md"
        >
          Profil szerkesztése
        </Button>
      )}

      <br />
      <Group>
        <Button 
          component="button" 
          type="button" 
          color="green" 
          onClick={onNewAddressClick}
          loading={loading}
          leftSection={hasAddress ? <IconHomeCog size="1rem" /> : <IconHomePlus size="1rem" />}
        >
          {hasAddress ? "Cím szerkesztése" : "Új cím"}
        </Button>
        
        {hasAddress && (
  <>
     <Modal 
            opened={deleteModalOpened} 
            onClose={onDeleteModalClose} 
            title="Cím törlés" 
            centered
          >
            <Text>Biztos törölni szeretnéd a címed?</Text>
            <Group mt="md">
              <Button variant="outline" onClick={onDeleteModalClose}>Mégse</Button>
              <Button color="red" onClick={onDeleteConfirm}>Törlés</Button>
            </Group>
          </Modal>
          <Button 
            color="red" 
            onClick={onDeleteClick}
            leftSection={<IconHomeX size="1rem" />}
          >
            Cím törlése
          </Button>
  </>
)}
      </Group>
    </>
  );
};

export default UserProfileForm;