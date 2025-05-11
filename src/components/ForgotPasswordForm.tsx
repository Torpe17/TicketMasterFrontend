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
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Érvénytelen e-mail cím'),
      password: (val) => (val.length <= 6 ? 'A jelszónak 6 karakter hosszúnak kell lennie.' : null),
      birthDate: (val) => (val ? null : 'Kötelező a születési dátum.')
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
              required
              label="E-mail cím"
              placeholder="hello@mantine.dev"
              radius="md"
              {...form.getInputProps('email')}
            />

            <DateInput
              required
              label="Születésnap"
              placeholder="Születésnapod"
              valueFormat="YYYY-MM-DD"
              locale="hu"
              radius="md"
              firstDayOfWeek={1}
              {...form.getInputProps('birthDate')}
            />

            <PasswordInput
              required
              label="Új Jelszó"
              placeholder="Jelszavad"
              radius="md"
              {...form.getInputProps('password')}
            />
          </Stack>

          <Group justify="center" mt="xl">
            <Button type="submit" radius="xl" fullWidth>
              Jelszó megváltoztatása
            </Button>
          </Group>

          <Divider my="lg" />

          <Group justify="center" gap="xs">
            <Text>Tudod mi a jelszavad?</Text>
            <Anchor component="button" type="button" onClick={onModalClose}>
              Bejelentkezéshez
            </Anchor>
          </Group>
        </form>

        <Modal
          opened={successModalOpened}
          onClose={onModalClose}
          title="Siker!"
          centered
          withCloseButton
        >
          <Group>
            <IconCheck color="green" />
            <Text>A jelszó megváltoztatása sikeresen megtörtént!</Text>
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