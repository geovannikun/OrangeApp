import { observable, action } from 'mobx';

class DocumentStore {
  private id: number = Math.random();
  @observable public title = 'App.txt';

  @action
  public setTitle(title: string) {
    this.title = title;
  }
}

export default DocumentStore;
