import * as UTIF from 'utif';

export const isTiffContent = (
    contentType: string | null,
    bytes: Uint8Array
) => {
    const normalizedContentType = contentType?.toLowerCase() ?? '';
    const isTiffByContentType =
        normalizedContentType.includes('image/tiff') ||
        normalizedContentType.includes('image/tif');

    const isLittleEndianTiff =
        bytes[0] === 0x49 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x2a &&
        bytes[3] === 0x00;
    const isBigEndianTiff =
        bytes[0] === 0x4d &&
        bytes[1] === 0x4d &&
        bytes[2] === 0x00 &&
        bytes[3] === 0x2a;

    return isTiffByContentType || isLittleEndianTiff || isBigEndianTiff;
};

export const convertTiffToPreviewUrl = async (buffer: ArrayBuffer) => {
    const ifds = UTIF.decode(buffer);
    const firstImage = ifds[0];

    if (!firstImage) {
        throw new Error('Invalid TIFF image');
    }

    UTIF.decodeImage(buffer, firstImage);

    const rgba = UTIF.toRGBA8(firstImage);
    const width = firstImage.width as number;
    const height = firstImage.height as number;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('Canvas context is not available');
    }

    const imageData = new ImageData(
        new Uint8ClampedArray(rgba),
        width,
        height
    );
    context.putImageData(imageData, 0, 0);

    return canvas.toDataURL('image/png');
};

export const resolvePreviewUrl = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch cover art image');
    }

    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer.slice(0, 4));

    if (isTiffContent(contentType, bytes)) {
        return {
            previewUrl: await convertTiffToPreviewUrl(buffer),
            revokeUrl: false,
        };
    }

    const blob = new Blob([buffer], {
        type: contentType ?? 'image/*',
    });

    return {
        previewUrl: URL.createObjectURL(blob),
        revokeUrl: true,
    };
};
