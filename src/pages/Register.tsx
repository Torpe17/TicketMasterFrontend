import {
    Stack,
    TextInput,
    PasswordInput,
    Group,
    Button,
    Anchor, Divider,
    Text,
    Alert
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useNavigate} from "react-router-dom";
import { DateInput} from '@mantine/dates';
import api from "../api/api.ts";
import { FormEvent, useState } from "react";
import { IconAlertCircle } from '@tabler/icons-react';
import { AxiosError } from "axios";
import AuthContainer from "../components/AuthContainer.tsx";
import 'dayjs/locale/hu'; // Import Hungarian locale if needed

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          name: '',
          email: '',
          password: '',
          birthDate: null as Date | null,
      },
    
        validate: {
          email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Érvénytelen e-mail cím'),
          password: (val: string) => (val.length <= 6 ? 'A jelszónak 6 karakter hosszúnak kell lennie.' : null),
          birthDate: (val: Date | null) => (val ? null : 'Kötelező a születési dátum')
        },
      });

      const formatDateOnly = (date: Date | null): string | undefined => {
        if (!date) return undefined;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const handleSubmit = async (
        values: { name: string; email: string; password: string; birthDate: Date | null },
        event?: FormEvent<HTMLFormElement>
      ) => {
        event?.preventDefault();
        try {
          await api.RegisterPost.register(
            values.name,
            values.email,
            values.password,
            [3],
            formatDateOnly(values.birthDate)
          );
        } catch (error) {
          if(error instanceof AxiosError){
            const errorMessage = error.response?.data;
            setError('A regisztráció sikertelen. Kérjük, próbáld újra. ' + errorMessage);
          }
        }
      };
      return (<AuthContainer>
        <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
        {error && (
          <Alert 
            icon={<IconAlertCircle size="1rem" />}
            title="Hiba!"
            color="red"
            mb="md"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

          <TextInput
                required
                label="Teljes név"
                placeholder="Jane Doe"
                key={form.key('name')}
                radius="md"
                {...form.getInputProps('name')}
            />
            <TextInput
                required
                label="E-mail cím"
                placeholder="hello@mantine.dev"
                key={form.key('email')}
                radius="md"
                {...form.getInputProps('email')}
            />
  
            <PasswordInput
                required
                label="Jelszó"
                placeholder="Jelszavad"
                key={form.key('password')}
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
        <Divider my="lg"/>
      <Group justify="center" gap="xs">
      <Text>Van már fiókod?</Text>
      <Anchor component="button" type="button" onClick={() => navigate('/login')}>
          Bejelentkezés
      </Anchor>
  </Group>
    </form>
    </AuthContainer>
        );
}

export default Register;