export default class OrangePlugin {
  public importFile: (file: File) => void;
  public mimeTypes: string[];

  constructor(mimeTypes: string[]) {
    this.mimeTypes = mimeTypes;
  }
}
