import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { Editor } from '@ckeditor/ckeditor5-core';
import {
    FileLoader,
    UploadAdapter,
} from '@ckeditor/ckeditor5-upload/src/filerepository';
// import { uploadFileToBucket } from './api';

function uploadAdapter(loader: FileLoader): UploadAdapter {
    return {
        upload: () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const file = await loader.file;

                    const dataPayload = {
                        entityType: ENTITY_TYPE_PICTURE.NEWS_POST_CONTENT,
                        fileName: file?.name ?? '',
                        contentType: file?.type ?? '',
                        fileSize: file?.size ?? 0,
                    };

                    if (file) {
                        const url = await uploadApi.uploadFile({
                            infoFile: dataPayload,
                            file: file,
                        });
                        resolve({
                            default: url,
                        });
                    } else {
                        reject('Upload error');
                    }
                } catch (error) {
                    reject('Upload error');
                }
            });
        },
        abort: () => {},
    };
}

export function uploadPlugin(editor: Editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return uploadAdapter(loader);
    };
}
