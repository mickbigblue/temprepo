export interface BackendFile {
  filename: string;
  filetype: string | null;
  creationDate: string | null;
  user: string | null;
}
export interface UIFile {
  id: string;
  filename: string;
  filetype: string | null;
  creationDate: Date | null;
  user: string | null;
  isNew: boolean;
}
