import { observable, autorun, action } from 'mobx';

export default class AppStore {
  @observable public acceptableImageTypes: string = 'image/jpeg, image/png';
}
