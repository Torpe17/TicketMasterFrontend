import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { countries } from 'countries-list';
import api from "../../api/api";
import AddressForm from "../../components/AddressForm";
import { SelectItem } from "../../interfaces/Types";

//countries.registerLocale(hu);

interface ICreateAddress {
  isCreate: boolean;
}

const CreateAddress = ({ isCreate }: ICreateAddress) => {
  const [error, setError] = useState<string | null>(null);
  const [successModalOpened, setSuccessModalOpened] = useState(false);
  const navigate = useNavigate();

  const countryOptions: SelectItem[] = Object.entries(countries).map(([code, country]) => ({
  value: code,
  label: country.name,
}));

 const [initialValues, setInitialValues] = useState({
    country: '',
    county: '',
    zipcode: 0,
    city: '',
    street: '',
    housenumber: 0,
    floor: '',
  });
  const [isLoading, setIsLoading] = useState(!isCreate);

  useEffect(() => {
    if (!isCreate) {
      const fetchAddress = async () => {
        try {
          const res = await api.User.getAddress();
          const address = res.data;
          setInitialValues({
            country: address.country,
            county: address.county,
            zipcode: Number(address.zipCode),
            city: address.city,
            street: address.street,
            housenumber: address.houseNumber,
            floor: address.floor ?? ''
          });
        } catch (error) {
          console.error("Error fetching address:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAddress();
    } else {
      setIsLoading(false);
    }
  }, [isCreate]);

 if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values: {
    country: string;
    county: string;
    zipcode: number;
    city: string;
    street: string;
    housenumber: number;
    floor: string;
  }) => {
    const floor = values.floor === '' ? null : values.floor;

    try {
      if (isCreate) {
        await api.User.createAddress(
          values.country,
          values.county,
          values.zipcode,
          values.city,
          values.street,
          values.housenumber,
          floor
        );
      } else {
        const currentAddress = await api.User.getAddress();
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
      }
      setSuccessModalOpened(true);
    } catch (error) {
      let errorMessage = "An unknown error has occured.";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data;
      }
      setError(`Create new address was unsuccessfull. ${errorMessage}`);
    }
  };

  const handleModalClose = () => {
    setSuccessModalOpened(false);
    navigate('/app/profile');
  };

  return (
    <AddressForm
      isCreate={isCreate}
      initialValues={initialValues}
      countryOptions={countryOptions}
      error={error}
      successModalOpened={successModalOpened}
      onSubmit={handleSubmit}
      onClearError={() => setError(null)}
      onModalClose={handleModalClose}
      onBack={() => navigate('/app/profile')}
    />
  );
};

export default CreateAddress;