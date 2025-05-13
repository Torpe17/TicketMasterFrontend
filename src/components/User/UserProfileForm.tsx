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
  onDeleteClick: () => void;
  onDeleteConfirm: () => void;
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
        if (!value) return 'An email address is required';
        return /^\S+@\S+$/.test(value) ? null : 'The given email address is invalid';
      },
      name: (value) => {
        if (!value) return 'An username is required';
        return null;
      }
    },
  });

  return (
    <>
      <Title order={1}>My Profile</Title>
      <br />
      
      <form onSubmit={form.onSubmit(onSubmit)}>
        {success && (
          <Alert 
            icon={<IconCheck size="1rem" />}
            title="Success!"
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
            title="Error!"
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
          label="User Name"
          placeholder="Your User Name"
          key={form.key('name')}
          {...form.getInputProps('name')}
          disabled={!isEditing} 
        />

        <TextInput
          withAsterisk
          label="Email address"
          placeholder="Your Email address"
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
                Cancel
              </Button>
              <Button type="submit">Save</Button>
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
          Edit Profile
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
          {hasAddress ? "Edit Address" : "New Address"}
        </Button>
        
        {hasAddress && (
  <>
     <Modal 
            opened={deleteModalOpened} 
            onClose={onDeleteModalClose} 
            title="Delete Address" 
            centered
          >
            <Text>Are you sure you want to delete your address?</Text>
            <Group mt="md">
              <Button variant="outline" onClick={onDeleteModalClose}>Cancel</Button>
              <Button color="red" onClick={onDeleteConfirm}>Delete</Button>
            </Group>
          </Modal>
          <Button 
            color="red" 
            onClick={onDeleteClick}
            leftSection={<IconHomeX size="1rem" />}
          >
            Delete Address
          </Button>
  </>
)}
      </Group>
    </>
  );
};

export default UserProfileForm;