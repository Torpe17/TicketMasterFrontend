export const canDeletePurchase = (screeningTime: Date) => {
    const screeningMs = new Date(screeningTime).getTime();
    const currentTime = new Date().getTime();
    const fourHoursInMs = 4 * 60 * 60 * 1000;
    
    return (screeningMs - currentTime) < fourHoursInMs;
};