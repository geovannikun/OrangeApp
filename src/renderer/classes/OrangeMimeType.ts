import { OrangePage } from './'

export default abstract class OrangeMimeType {
  public abstract parseFile: (file: File) => OrangePage | null
  public abstract exportPage: (page: OrangePage) => File

  constructor(public mimeType: string) {}
}
