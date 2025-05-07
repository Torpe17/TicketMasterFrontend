import { Alert, Anchor, Button, Divider, Group, PasswordInput, Stack, TextInput, Text, Modal } from "@mantine/core";
import AuthContainer from "../components/AuthContainer.tsx";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { FormEvent, useState } from "react";
import {useForm} from "@mantine/form";
import { AxiosError } from "axios";
import api from "../api/api.ts";
import { useNavigate } from "react-router-dom";
import { DateInput } from "@mantine/dates";

const ForgotPassword = () => {
        const [error, setError] = useState<string | null>(null);
        const [successModalOpened, setSuccessModalOpened] = useState(false)
        const navigate = useNavigate();
    
        const form = useForm({
            initialValues: {
                email: '',
                password: '',
                birthDate: null as Date | null,
            },
    
            validate: {
                email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Érvénytelen e-mail cím'),
                password: (val: string) => (val.length <= 6 ? 'A jelszónak 6 karakter hosszúnak kell lennie.' : null),
                birthDate: (val: Date | null) => (val ? null : 'Kötelező a születési dátum.')
            },
        });

        const formatDateOnly = (date: Date | null): string | undefined => {
          if (!date) return undefined;
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const submit = async (
          values: {email: string; password: string; birthDate: Date | null},
          event?: FormEvent<HTMLFormElement>
      ) => {
          event?.preventDefault();
          if (!values.birthDate) {
              setError('Kötelező a születési dátum.');
              return;
          }
          
          try {
              await api.UpdatePasswordPut.updatePassword(
                  values.email,
                  values.password,
                  formatDateOnly(values.birthDate)
              );
              setSuccessModalOpened(true);
          } catch (error) {
              if(error instanceof AxiosError){
                  let errorMessage = error.response?.data;
                  if(errorMessage === "This user does not exists."){
                      errorMessage = "Ez a felhasználó nem létezik."
                  }
                  if(errorMessage === "The given birthdate is incorrect."){
                      errorMessage = "A megadott születési dátum helytelen."
                  }
                  setError('A jelszó megváltoztatása sikertelen. ' + errorMessage);
              }
          }
      };

        const handleModalClose = () => {
            setSuccessModalOpened(false);
            navigate('/login'); // Redirect when modal closes
        };

    return <AuthContainer>
        <>
        <form onSubmit={form.onSubmit(submit)}>
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
                        label="E-mail cím"
                        placeholder="hello@mantine.dev"
                        key={form.key('email')}
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
                        key={form.key('password')}
                        radius="md"
                        {...form.getInputProps('password')}
                    />
                </Stack>
                <Group justify="center" mt="xl">
                        <Button type="submit" radius="xl" fullWidth>
                                Jelszó megváltoztatása
                        </Button>
                        </Group>
                <Divider my="lg"/>
                      <Group justify="center" gap="xs">
                      <Text>Tudod mi a jelszavad?</Text>
                      <Anchor component="button" type="button" onClick={() => navigate('/login')}>
                        Bejelentkezéshez
                      </Anchor>
                      </Group>
                </form>
                <Modal
                opened={successModalOpened}
                onClose={handleModalClose}
                title="Siker!"
                centered
                withCloseButton
            >
                <Group>
                    <IconCheck color="green" />
                    <Text>A jelszó megváltoztatása sikeresen megtörtént!</Text>
                </Group>
                <Group justify="center" mt="md">
                    <Button onClick={handleModalClose}>
                        OK
                    </Button>
                </Group>
            </Modal>
            </>
        </AuthContainer>
}

export default ForgotPassword;