import { useForm } from "@mantine/form";

export const useFilmForm = () =>
  useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      director: "",
      genre: "",
      length: 0,
      description: "",
      ageRating: 0,
      setAgeRating: true,
      removePicture: false,
    },
    validate: {
      title: (value) => value.length <= 0 ? "Required" : null,
      director: (value) => value.length <= 0 ? "Required" : null,
      genre: (value) => value.length <= 0 ? "Required" : null,
      length: (value) => value <= 0 ? "Positive" : null,
      ageRating: (value) => value < 0 || value > 18 ? "Between 0 and 18" : null,
      description: (value) => value.length <= 0 ? "Required" : null,
    },
  });
