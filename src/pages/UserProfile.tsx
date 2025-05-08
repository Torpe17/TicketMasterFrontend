import { Alert, Button, Group, TextInput, } from "@mantine/core";
import { useForm } from "@mantine/form";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import api from "../api/api";
import { AxiosError } from "axios";
import { IconAlertCircle, IconEdit, IconX } from "@tabler/icons-react";

const UserProfile = () => {
    const {name, email, setName, setEmail} = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          name: name || '',
          email: email || ''
        },
    
        validate: {
            email: (value) => {
                if (!value) return 'Kötelező egy email cím';
                return /^\S+@\S+$/.test(value) ? null : 'Érvénytelen email cím';
            },
            name: (value) => {
                if (!value) return 'Kötelező egy felhasználó név';
            }
        },
      });

      useEffect(() => {
        if (name !== undefined) {
            form.setFieldValue('name', name || '');
        }
        if (email !== undefined) {
            form.setFieldValue('email', email || '');
        }
    }, [name, email]);

    const submit = async (values: { email: string; name: string }) => {
        try {
            await api.User.updateProfile(
                values.email === email ? null : values.email,
                values.name === name ? null : values.name,
              );
              if (values.name !== name) {
                setName(values.name);
            }
            if (values.email !== email) {
                setEmail(values.email);
            }
            setIsEditing(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                let errorMessage = error.response?.data;
                if (errorMessage === "User not found.") {
                    errorMessage = "Ez a felhasználó nem létezik.";
                }
                if (errorMessage === "There is already another User with this email address") {
                    errorMessage = "Már van egy felhasználó ezzel az email-el.";
                }
                if (errorMessage === "There is already another User with this username") {
                    errorMessage = "Már van egy felhasználó ezzel a felhasználó névvel.";
                }
                setError('Profil frissítése sikertelen. ' + errorMessage);
            }
        }
    };
    

    return(
        <>
    <form onSubmit={form.onSubmit(submit)}>
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
                            variant="outline" 
                            leftSection={<IconX size="1rem" />}
                            onClick={() => {
                                setIsEditing(false);
                                form.reset();
                            }}
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
                    onClick={() => setIsEditing(true)}
                    mb="md"
                >
                    Profil szerkesztése
                </Button>
            )}
    </>
  );
}

export default UserProfile;