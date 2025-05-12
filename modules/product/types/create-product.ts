import { FILE_ORIENTATION } from '../enums';

export interface CreateProduct {
    source?: string;
    width?: number;
    height?: number;
    frameRate?: number;
    duration?: number;
    encoding?: string;
    orientation?: FILE_ORIENTATION;
}
