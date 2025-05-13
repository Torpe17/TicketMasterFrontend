import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { AxiosError } from "axios";
import api from "../../api/api";
import useAuth from "../../hooks/useAuth";
import UserProfileForm from "../../components/User/UserProfileForm";

const UserProfile = () => {
  const { name, email, setName, setEmail } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasAddress, setHasAddress] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

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

  const handleSubmit = async (values: { email: string; name: string }) => {
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
        setError('Updating profile was unsuccesfull. ' + errorMessage);
      }
    }
  };

  const handleDeleteAddress = async () => {
    try {
      await api.User.deleteAddress();
      setSuccess('Address has been deleted!');
      setHasAddress(false);
      closeDeleteModal();
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      if (error instanceof AxiosError) {
        let errorMessage = error.response?.data;
        setError('Deleting address was unsuccessfull. ' + errorMessage);
      }
      closeDeleteModal();
    }
  };

  return (
    <UserProfileForm
      initialValues={{ name: name || '', email: email || '' }}
      isEditing={isEditing}
      hasAddress={hasAddress}
      loading={loading}
      error={error}
      success={success}
      onDeleteConfirm={handleDeleteAddress}
      onDeleteClick={openDeleteModal}
    onDeleteModalClose={closeDeleteModal}
    deleteModalOpened={deleteModalOpened}
      onEditClick={() => setIsEditing(true)}
      onCancelClick={() => {
        setIsEditing(false);
      }}
      onSubmit={handleSubmit}
      onClearError={() => setError(null)}
      onClearSuccess={() => setSuccess(null)}
      onNewAddressClick={handleNewAddressClick}
    />
  );
};

export default UserProfile;