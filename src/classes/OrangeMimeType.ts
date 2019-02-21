import { OrangePage } from './';

export default class OrangeMimeType {
  public parseFile: (file: File) => OrangePage | null;
  public exportPage: (page: OrangePage) => File;

  constructor(public mimeType: string) {}
}
