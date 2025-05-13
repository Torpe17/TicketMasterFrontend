import { FilmForm } from "../components/Film/FilmForm.tsx";
import { ICreateUpdateFilms } from "../interfaces/ICreateUpdateFilms.ts";

const CreateUpdateFilms = ({ isCreate }: ICreateUpdateFilms) => {
  return <FilmForm isCreate={isCreate} />;
};

export default CreateUpdateFilms;