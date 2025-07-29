import { format, parse } from 'date-fns';
import { Transformer, Untransformer } from '../../../interfaces/Transformer';
import { BackendFile, UIFile } from '../../../interfaces/Files';

export const transformFiles: Transformer<BackendFile, UIFile> = (data: {
  [key: string]: any;
}): UIFile[] => {
  const transformedData = data.files.map((file: BackendFile): UIFile => {
    return {
      id: file.filename,
      filename: file.filename,
      filetype: file.filetype,
      creationDate: file.creationDate
        ? parse(file.creationDate, "yyyy-MM-dd'T'HH:mm:ss", new Date())
        : null,
      user: file.user,
      isNew: false,
    };
  });

  return transformedData;
};

// This is a dummy untransformer as we never send file objects to the backend
// TODO: Make untransformer usage optional in DataManager and remove - MM
export const untransformFiles: Untransformer<UIFile, BackendFile> = (
  uiData: UIFile
): BackendFile => {
  return {
    filename: uiData.filename,
    filetype: uiData.filetype || null,
    creationDate: uiData.creationDate
      ? format(uiData.creationDate, 'yyyy-MM-dd')
      : null,
    user: uiData.user || null,
  };
};
