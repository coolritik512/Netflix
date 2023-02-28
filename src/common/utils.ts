import { fetchRequest } from "./api";
import { ENDPOINT } from "./endpoint";
import { MovieVideoInfo, MovieVideoResult } from "./typo";

type dimension = 'width' | 'original'
export function createImageUrl(imageid: string, imageWidth: number, type: dimension = 'width') {
    return type == 'width' ?
        `${import.meta.env.VITE_IMAGE_BASE_API}/w${imageWidth}/${imageid}`
        : `${import.meta.env.VITE_IMAGE_BASE_API}/${type}/${imageid}`;
}

export async function fetchVedioInfo(id:number) {
    const response = await fetchRequest<MovieVideoResult<MovieVideoInfo[]>>(ENDPOINT.MOVIES_VIDEO.replace('{movie_id}', id.toString()));
    console.log(response);
    return response.results.filter(
        (result) => result.type.toLowerCase() === 'trailer'
    );
}
