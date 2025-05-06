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
import AuthContainer from "../components/AuthContainer.tsx";
import useAuth from "../hooks/useAuth.tsx";
import { useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";

const Login = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
     const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Érvénytelen e-mail cím'),
            password: (val: string) => (val.length <= 6 ? 'A jelszónak 6 karakter hosszúnak kell lennie.' : null),
        },
    });


    const submit = async () => {
        setError(null);
        const result = await login(form.values.email, form.values.password);
        
        if (!result.success) {
            setError(result.error || 'Hibás email cím vagy jelszó');
        }
    }

    return <AuthContainer>
        <div>
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

                    <PasswordInput
                        required
                        label="Jelszó"
                        placeholder="Jelszavad"
                        key={form.key('password')}
                        radius="md"
                        {...form.getInputProps('password')}
                    />
                </Stack>

                <Group justify="right" mt="xl">
                    <Anchor component="button" type="button" c="dimmed" onClick={() => navigate('/forgot')}
                            size="xs">
                        Elfelejtetted a jelszavad?
                    </Anchor>
                </Group>
                <Group justify="center" mt="xl">
                <Button type="submit" radius="xl" fullWidth>
                        Bejelentkezés
                    </Button>
                    </Group>
                <Divider my="lg"/>
                <Group justify="center" gap="xs">
                <Text>Még nincs fiókod?</Text>
                <Anchor component="button" type="button" onClick={() => navigate('/register')}>
                    Regisztráció
                </Anchor>
                </Group>
            </form>
        </div>
    </AuthContainer>
}

export default Login;