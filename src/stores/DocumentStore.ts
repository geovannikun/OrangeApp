import { observable, action } from 'mobx';
import { OrangePage } from '../classes';
import { appStore } from './';
import { app } from 'electron';

class DocumentStore {
  private id: number = Math.random();
  @observable public title = 'App.txt';
  @observable public pages: OrangePage[] = [];
  @observable public selectedPage: OrangePage;

  @action
  public setTitle(title: string) {
    this.title = title;
  }

  @action
  public addPage(value: OrangePage) {
    if (value && this.pages.indexOf(value) === -1) {
      this.pages.push(value);
      if (!this.selectedPage) {
        this.select(value);
      }
    }
  }

  @action
  public select(value: OrangePage) {
    if (value && this.pages.indexOf(value) > -1) {
      this.selectedPage = value;
      this.selectedPage.render(appStore.canvas);
    }
  }
}

export default DocumentStore;
