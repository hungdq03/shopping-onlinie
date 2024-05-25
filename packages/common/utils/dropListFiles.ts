import { UploadFile } from 'antd';

export const dropListFiles = (files: UploadFile[]) => {
    const listFileUploaded = files
        .filter((item) => item.status === 'done')
        .map((item) => item.name);

    const listNewImage = files.filter((item) => !!item.originFileObj);

    return { filesUploaded: listFileUploaded, fileNotUpload: listNewImage };
};
