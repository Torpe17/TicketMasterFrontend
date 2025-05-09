import {
  Alert,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  TextInput,
  Text,
  Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { SelectItem } from "../interfaces/Types";
import { useEffect } from "react";

interface AddressFormValues {
  country: string;
  county: string;
  zipcode: number;
  city: string;
  street: string;
  housenumber: number;
  floor: string;
}

interface AddressFormProps {
  isCreate: boolean;
  initialValues: AddressFormValues;
  countryOptions: SelectItem[];
  error: string | null;
  successModalOpened: boolean;
  onSubmit: (values: AddressFormValues) => void;
  onClearError: () => void;
  onModalClose: () => void;
  onBack: () => void;
}

const AddressForm = ({
  isCreate,
  initialValues,
  countryOptions,
  error,
  successModalOpened,
  onSubmit,
  onClearError,
  onModalClose,
  onBack
}: AddressFormProps) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues,
    validate: {
      country: (value) => value ? null : 'Válassz országot',
      county: (value) => value.trim().length > 0 ? null : 'Add meg a megyét',
      zipcode: (value) => value > 0 ? null : 'Érvényes irányítószám szükséges',
      city: (value) => value.trim().length > 0 ? null : 'Add meg a várost',
      street: (value) => value.trim().length > 0 ? null : 'Add meg az utcát',
      housenumber: (value) => value > 0 ? null : 'Érvényes házszám szükséges',
    },
  });

  useEffect(() => {
    form.setValues(initialValues);
    form.resetDirty(initialValues);
  }, [initialValues]);

  return (
    <>
      <Title order={1}>{isCreate ? "Új cím felvétele" : "Meglévő cím szerkesztése"}</Title>
      <br />
      
      <form onSubmit={form.onSubmit(onSubmit)}>
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
          <Button variant="outline" onClick={onBack}>Vissza</Button>
          <Button type="submit">Mentés</Button>
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
          <Text>{isCreate 
    ? "Az új cím sikeresen létrehozva!" 
    : "A cím sikeresen frissítve!"}</Text>
        </Group>
        <Group justify="center" mt="md">
          <Button onClick={onModalClose}>
            OK
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default AddressForm;