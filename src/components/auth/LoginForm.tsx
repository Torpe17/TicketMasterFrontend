import { useNavigate } from "react-router-dom";
import AuthContainer from "./AuthContainer";
import { useForm } from "@mantine/form";
import { Alert, Anchor, Button, Divider, Group, PasswordInput, Stack, TextInput, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  error: string | null;
  onClearError: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error, onClearError }) => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid e-mail address'),
      password: (val: string) => (val.length <= 6 ? 'The password must be at least 6 characters.' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    onLogin(values.email, values.password);
  });

  return (
    <AuthContainer>
      <form onSubmit={handleSubmit}>
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

          <PasswordInput
            required
            label="Password"
            placeholder="Password"
            radius="md"
            {...form.getInputProps('password')}
          />
        </Stack>

        <Group justify="flex-end" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => navigate('/forgot')} size="xs">
            Forgot your password?
          </Anchor>
        </Group>
        
        <Group justify="center" mt="xl">
          <Button type="submit" radius="xl" fullWidth>
            Login
          </Button>
          <Button  radius="xl" fullWidth onClick={() => navigate('/films')}>
            Continue as guest
          </Button>
        </Group>
        
        <Divider my="lg" />
        
        <Group justify="center" gap="xs">
          <Text>No account?</Text>
          <Anchor component="button" type="button" onClick={() => navigate('/register')}>
            Register
          </Anchor>
        </Group>
      </form>
    </AuthContainer>
  );
};

export default LoginForm;