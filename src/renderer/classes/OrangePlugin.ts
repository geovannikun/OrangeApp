export default class OrangePlugin {
  public importFile: (file: File) => void = ((f) => 0)
  public mimeTypes = ['']

  constructor(mimeTypes: string[]) {
    this.mimeTypes = mimeTypes
  }
}
