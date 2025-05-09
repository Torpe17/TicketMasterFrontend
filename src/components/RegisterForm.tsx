import {
  Stack,
  TextInput,
  PasswordInput,
  Group,
  Button,
  Anchor,
  Divider,
  Text,
  Alert,
  Modal
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from '@mantine/dates';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import AuthContainer from "./AuthContainer";
import 'dayjs/locale/hu';
import { useNavigate } from "react-router-dom";

interface FormValues {
  name: string;
  email: string;
  password: string;
  birthDate: Date | null;
}

interface RegisterFormProps {
  onSubmit: (values: FormValues) => void;
  error: string | null;
  onClearError: () => void;
  successModalOpened: boolean;
  onModalClose: () => void;
}

const RegisterForm = ({
  onSubmit,
  error,
  onClearError,
  successModalOpened,
  onModalClose
}: RegisterFormProps) => {
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      birthDate: null,
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Érvénytelen e-mail cím.'),
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
              label="Felhasználó név"
              placeholder="jane_doe"
              radius="md"
              {...form.getInputProps('name')}
            />

            <TextInput
              required
              label="E-mail cím"
              placeholder="hello@mantine.dev"
              radius="md"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              required
              label="Jelszó"
              placeholder="Jelszavad"
              radius="md"
              {...form.getInputProps('password')}
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
          </Stack>

          <Group justify="center" mt="xl">
            <Button type="submit" radius="xl" fullWidth>
              Regisztráció
            </Button>
          </Group>

          <Divider my="lg" />

          <Group justify="center" gap="xs">
            <Text>Van már fiókod?</Text>
            <Anchor component="button" type="button" onClick={() => navigate('/login')}>
              Bejelentkezés
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
          <Stack>
            <Group>
              <IconCheck color="green" />
              <Text>A regisztráció sikeresen megtörtént!</Text>
            </Group>
            <Group justify="center" mt="md">
              <Button onClick={onModalClose}>
                OK
              </Button>
            </Group>
          </Stack>
        </Modal>
      </>
    </AuthContainer>
  );
};

export default RegisterForm;