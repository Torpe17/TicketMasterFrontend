interface ICreateFilm {
    title: string;
    director: string;
    genre: string;
    length: number;
    description: string;
    ageRating: number | null;
    pictureBytes: string | null;
}