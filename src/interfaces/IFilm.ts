export interface IFilm{
    id: number;
    title: string;
    director: string;
    genre: string;
    length: number;
    description: string;
    ageRating: number;
    pictureBase64: string |null;
}