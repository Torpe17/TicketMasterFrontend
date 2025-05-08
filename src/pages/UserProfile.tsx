import { Alert, Button, Group, Modal, TextInput, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import api from "../api/api";
import { AxiosError } from "axios";
import { IconAlertCircle, IconCheck, IconEdit, IconHomeCog, IconHomePlus, IconHomeX, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";

const UserProfile = () => {
    const {name, email, setName, setEmail} = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [hasAddress, setHasAddress] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const checkAddress = async () => {
            try {
                await api.User.getAddress();
                setHasAddress(true);
            } catch (error) {
                setHasAddress(false);
            } finally {
                setLoading(false);
            }
        };
        checkAddress();
    }, []);

    const handleNewAddressClick = () => {
        if (hasAddress) {
            navigate('/app/editAddress');
        } else {
            navigate('/app/newAddress');
        }
    };

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
    
    const handleDeleteAddress = async () => {
        try {
            await api.User.deleteAddress();
            setSuccess('Cím sikeresen törölve!');
            setHasAddress(false);
            close();
            setTimeout(() => setSuccess(null), 5000);
        } catch (error) {
            if (error instanceof AxiosError) {
                let errorMessage = error.response?.data;
                if(errorMessage === "This user doesn't have an address"){
                    errorMessage = "Nincsen cím felvéve.";
                }
                setError('Cím törlése sikertelen. ' + errorMessage);
            }
            close();
        }
    };

    return(
        <>
         <Title order={1}>Profilom</Title>
         <br></br>
    <form onSubmit={form.onSubmit(submit)}>
    {success && (
                <Alert 
                    icon={<IconCheck size="1rem" />}
                    title="Siker!"
                    color="green"
                    mb="md"
                    withCloseButton
                    onClose={() => setSuccess(null)}
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
                            color="red"
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
            <br />
            <Group>
            <Button 
                component="button" 
                type="button" 
                color="green" 
                onClick={handleNewAddressClick}
                loading={loading}
                leftSection={hasAddress ? <IconHomeCog size="1rem" /> : <IconHomePlus size="1rem" />}
            >
                {hasAddress ? "Cím szerkesztése" : "Új cím"}
            </Button>
            <br />
            {hasAddress && (
                <>
                    <Modal opened={opened} onClose={close} title="Cím törlés" centered>
                        <Text>Biztos törölni szeretnéd a címed?</Text>
                        <Group mt="md">
                            <Button variant="outline" onClick={close}>Mégse</Button>
                            <Button color="red" onClick={handleDeleteAddress}>Törlés</Button>
                        </Group>
                    </Modal>
                    <Button color="red" onClick={open} leftSection={<IconHomeX size="1rem" />}>Cím törlése</Button>
                    
                </>
            )}
            </Group>
    </>
  );
}

export default UserProfile;