import {
  Alert,
  Anchor,
  Button,
  Divider,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Text,
  Modal
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import AuthContainer from "./AuthContainer";
import { DateInput } from "@mantine/dates";

interface FormValues {
  email: string;
  password: string;
  birthDate: Date | null;
}

interface ForgotPasswordFormProps {
  onSubmit: (values: FormValues) => void;
  error: string | null;
  onClearError: () => void;
  successModalOpened: boolean;
  onModalClose: () => void;
}

const ForgotPasswordForm = ({
  onSubmit,
  error,
  onClearError,
  successModalOpened,
  onModalClose
}: ForgotPasswordFormProps) => {
  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      password: '',
      birthDate: null,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email address'),
      password: (val) => (val.length <= 6 ? 'Password needs to be at least 6 charachters long' : null),
      birthDate: (val) => (val ? null : 'Birth Date is required.')
    },
  });

  return (
    <AuthContainer>
      <>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
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
              required
              label="E-mail address"
              placeholder="hello@mantine.dev"
              radius="md"
              {...form.getInputProps('email')}
            />

            <DateInput
              required
              label="Birth Date"
              placeholder="Birth Date"
              valueFormat="YYYY-MM-DD"
              locale="hu"
              radius="md"
              firstDayOfWeek={1}
              {...form.getInputProps('birthDate')}
            />

            <PasswordInput
              required
              label="New Password"
              placeholder="Your new password"
              radius="md"
              {...form.getInputProps('password')}
            />
          </Stack>

          <Group justify="center" mt="xl">
            <Button type="submit" radius="xl" fullWidth>
              Change Password
            </Button>
          </Group>

          <Divider my="lg" />

          <Group justify="center" gap="xs">
            <Text>Do you know your password?</Text>
            <Anchor component="button" type="button" onClick={onModalClose}>
              Login in here
            </Anchor>
          </Group>
        </form>

        <Modal
          opened={successModalOpened}
          onClose={onModalClose}
          title="Success!"
          centered
          withCloseButton
        >
          <Group>
            <IconCheck color="green" />
            <Text>Password has been successfully changed</Text>
          </Group>
          <Group justify="center" mt="md">
            <Button onClick={onModalClose}>
              OK
            </Button>
          </Group>
        </Modal>
      </>
    </AuthContainer>
  );
};

export default ForgotPasswordForm;