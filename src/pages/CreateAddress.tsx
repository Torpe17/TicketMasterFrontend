import {Alert, Button, Group, Modal, NumberInput, Select, TextInput, Text, Title} from "@mantine/core";
import { useForm } from "@mantine/form";
import countries from 'i18n-iso-countries';
import hu from 'i18n-iso-countries/langs/hu.json';
import { FormEvent, useEffect, useState } from "react";
import api from "../api/api";
import { AxiosError } from "axios";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { useNavigate} from "react-router-dom";

countries.registerLocale(hu);

interface ICreateAddress {
    isCreate: boolean;
}

const CreateAddress = ({ isCreate }: ICreateAddress) => {
    const [error, setError] = useState<string | null>(null);
    const [successModalOpened, setSuccessModalOpened] = useState(false)
    const navigate = useNavigate();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            country: '',
            county: '',
            zipcode: 0,
            city: '',
            street: '',
            housenumber: 0,
            floor: '',
        },
        validate: {
            country: (value) => value ? null : 'Válassz országot',
            county: (value) => value.trim().length > 0 ? null : 'Add meg a megyét',
            zipcode: (value) => value > 0 ? null : 'Érvényes irányítószám szükséges',
            city: (value) => value.trim().length > 0 ? null : 'Add meg a várost',
            street: (value) => value.trim().length > 0 ? null : 'Add meg az utcát',
            housenumber: (value) => value > 0 ? null : 'Érvényes házszám szükséges',
        },
    });
      const countryNames = countries.getNames('hu');
  
  const countryOptions = Object.entries(countryNames).map(([code, name]) => ({
    value: code,
    label: name,
  }));
      
  const handleModalClose = () => {
    setSuccessModalOpened(false);
    navigate('/app/profile');
};


useEffect(() => {
    if (!isCreate) {
        api.User.getAddress().then((res) => {
            const address = res.data;
            form.initialize({
                country: address.country,
                county: address.county,
                zipcode: Number(address.zipCode),
                city: address.city,
                street: address.street,
                housenumber: address.houseNumber,
                floor: address.floor ?? ''
            });
            console.log(typeof address.zipCode);
            console.log(address.zipCode);
        }).catch((error) => {
            console.error("Error fetching address:", error);
        });
    }
}, []);

  const submit = async (
    values: {country: string; county: string; zipcode: number; city: string; street: string; housenumber: number; floor: string | null},
    event?: FormEvent<HTMLFormElement>
) => {
    event?.preventDefault();
    let floor;
    if(values.floor === ''){
        floor = null;
    }
    else{
        floor = values.floor;
    }
    if(isCreate){
        try {
            await api.User.createAddress(
                values.country,
                values.county,
                values.zipcode,
                values.city,
                values.street,
                values.housenumber,
                floor
            );
            setSuccessModalOpened(true);
        } catch (error) {
            if(error instanceof AxiosError){
                let errorMessage = error.response?.data;
                if(errorMessage === "Only one address is allowed for a user"){
                    errorMessage = "Csak egy cím lehet egy felhasználóhoz."
                }
                setError('Az új cím felvétele sikertelen. ' + errorMessage);
            }
        }
    }
    else{
        try {
            let currentAddress = await api.User.getAddress();
            const setFloor = values.floor !== currentAddress.data.floor;
            await api.User.updateAddress(
                setFloor,
                values.country === currentAddress.data.country ? null : values.country,
                values.county === currentAddress.data.county ? null : values.county,
                values.zipcode === currentAddress.data.zipCode ? null : values.zipcode,
                values.city === currentAddress.data.city ? null : values.city,
                values.street === currentAddress.data.street ? null : values.street,
                values.housenumber === currentAddress.data.houseNumber ? null : values.housenumber,
                values.floor === currentAddress.data.floor ? null : values.floor,
            );
            setSuccessModalOpened(true);
        } catch (error) {
            if(error instanceof AxiosError){
                let errorMessage = error.response?.data;
                if(errorMessage === "User doesn't have address yet."){
                    errorMessage = "Még nincsen elmentve címed."
                }
                setError('Az új cím felvétele sikertelen. ' + errorMessage);
            }
        }
    }
    
};

    return (
        <>
         <Title order={1}>{isCreate ? "Új cím felvétele" : "Meglévő cím szerkesztése"}</Title>
                 <br></br>
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
    <Select
      withAsterisk
      label="Ország"
      placeholder="Válassz egy országot"
      data={countryOptions}
      searchable
      key={form.key('country')}
        {...form.getInputProps('country')}
    />
    <TextInput
        withAsterisk
        label="Megye"
        placeholder="Megye"
        key={form.key('county')}
        {...form.getInputProps('county')}
      />
      <NumberInput
        withAsterisk
        label="Irányítószám"
        placeholder="Irányítószám"
        key={form.key('zipcode')}
        {...form.getInputProps('zipcode')}
      />
      <TextInput
        withAsterisk
        label="Város"
        placeholder="Város"
        key={form.key('city')}
        {...form.getInputProps('city')}
      />
      <TextInput
        withAsterisk
        label="Utca"
        placeholder="Utca"
        key={form.key('street')}
        {...form.getInputProps('street')}
      />
      <TextInput
        label="Emelet"
        placeholder="Emelet"
        key={form.key('floor')}
        {...form.getInputProps('floor')}
      />
      <NumberInput
        withAsterisk
        label="Házszám"
        placeholder="Házszám"
        key={form.key('housenumber')}
        {...form.getInputProps('housenumber')}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="outline" onClick={() => navigate('/app/profile')}>Vissza</Button>
        <Button type="submit">Mentés</Button>
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
                    <Text>A cím létrehozása sikeresen megtörtént!</Text>
                </Group>
                <Group justify="center" mt="md">
                    <Button onClick={handleModalClose}>
                        OK
                    </Button>
                </Group>
            </Modal>
        </>
    );
}

export default CreateAddress;