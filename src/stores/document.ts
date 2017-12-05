import { observable } from 'mobx';

class Document {
  private id: number = Math.random();
  @observable public title = 'App.txt';
}

export default Document;
