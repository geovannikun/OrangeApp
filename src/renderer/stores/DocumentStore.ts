import { action, observable } from 'mobx'
import { OrangePage } from '../classes'

class DocumentStore {
  @observable public title = 'App.txt'
  @observable public pages: OrangePage[] = []
  @observable public selectedPage?: OrangePage

  @action
  public setTitle(title: string) {
    this.title = title
  }

  @action
  public addPage(value: OrangePage) {
    if (value && this.pages.indexOf(value) === -1) {
      this.pages.push(value)
      if (!this.selectedPage) {
        this.select(value)
      }
    }
  }

  @action
  public select(value: OrangePage) {
    if (value && this.pages.indexOf(value) > -1) {
      this.selectedPage = value
    }
  }
}

export default DocumentStore
