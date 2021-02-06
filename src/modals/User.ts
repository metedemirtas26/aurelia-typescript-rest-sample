import { bindable } from 'aurelia-framework';

export class User {
  id: number;
  @bindable
  name: string;
  familyName: string;
  address: string;
  countryOfOrigin: string;
  eMailAdress: string;
  age: number;
  hired: boolean;

}
