import { Button, Fieldset, Group, NumberInput, rem, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconObjectScan } from "@tabler/icons-react";

interface TicketInspectionFormProps {
  onSubmit: (id: number) => void;
  onScanClick: () => void;
  qrOn: boolean;
}

const TicketInspectionForm: React.FC<TicketInspectionFormProps> = ({ onSubmit, onScanClick, qrOn }) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      id: 0,
    },
    validate: {
      id: (value) => (value <= 0 ? "Can't be negative" : null),
    },
  });

  return (
    <Fieldset
      legend={<Title order={4}>Jegy ellenőrzés</Title>}
      radius="md"
      style={{
        border: '1px solid var(--mantine-color-gray-3)',
        padding: rem(24),
        marginTop: rem(16),
        backgroundColor: 'var(--mantine-color-gray-0)',
        borderRadius: rem(8),
      }}
    >
      <form onSubmit={form.onSubmit(async (values) => onSubmit(values.id))}>
        <NumberInput
          withAsterisk
          label="Ticket Identifier"
          placeholder="Length"
          allowNegative={false}
          key={form.key("id")}
          {...form.getInputProps("id")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Validate</Button>
        </Group>

        {qrOn && (
          <Button variant="default" leftSection={<IconObjectScan />} onClick={onScanClick}>
            Scan
          </Button>
        )}
      </form>
    </Fieldset>
  );
};

export default TicketInspectionForm;