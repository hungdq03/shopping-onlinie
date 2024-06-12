export const getImageLink = (imageName: string) => {
    return `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${imageName}`;
};
