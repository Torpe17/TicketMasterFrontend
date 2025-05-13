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
      country: (value) => value ? null : 'Choose a country',
      county: (value) => value.trim().length > 0 ? null : 'Add a county',
      zipcode: (value) => value > 0 ? null : 'A valid postal code is required',
      city: (value) => value.trim().length > 0 ? null : 'Add a city',
      street: (value) => value.trim().length > 0 ? null : 'Add a street',
      housenumber: (value) => value > 0 ? null : 'A valid house number is required',
    },
  });

  useEffect(() => {
    form.setValues(initialValues);
    form.resetDirty(initialValues);
  }, [initialValues]);

  return (
    <>
      <Title order={1}>{isCreate ? "Create new address" : "Update current address"}</Title>
      <br />
      
      <form onSubmit={form.onSubmit(onSubmit)}>
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

        <Select
          withAsterisk
          label="Country"
          placeholder="Choose your country"
          data={countryOptions}
          searchable
          key={form.key('country')}
          {...form.getInputProps('country')}
        />

        <TextInput
          withAsterisk
          label="County"
          placeholder="Your County"
          key={form.key('county')}
          {...form.getInputProps('county')}
        />

        <NumberInput
          withAsterisk
          label="Postal Code"
          placeholder="Your Postal Code"
          key={form.key('zipcode')}
          {...form.getInputProps('zipcode')}
        />

        <TextInput
          withAsterisk
          label="City"
          placeholder="Your City"
          key={form.key('city')}
          {...form.getInputProps('city')}
        />

        <TextInput
          withAsterisk
          label="Street"
          placeholder="Your Street"
          key={form.key('street')}
          {...form.getInputProps('street')}
        />

        <TextInput
          label="Floor"
          placeholder="Your Floor"
          key={form.key('floor')}
          {...form.getInputProps('floor')}
        />

        <NumberInput
          withAsterisk
          label="House Number"
          placeholder="House Number"
          key={form.key('housenumber')}
          {...form.getInputProps('housenumber')}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button type="submit">Save</Button>
        </Group>
      </form>

      <Modal
        opened={successModalOpened}
        onClose={onModalClose}
        title="Success!"
        centered
        withCloseButton
      >
        <Group>
          <IconCheck color="green" />
          <Text>{isCreate 
    ? "The new address has been created successfully!" 
    : "The address has been updated successfully!"}</Text>
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