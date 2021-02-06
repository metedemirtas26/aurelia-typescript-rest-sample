import { bindable } from 'aurelia-framework';
import { inject, NewInstance } from "aurelia-dependency-injection";
import axios from "axios";
import { User } from "modals/User";
import * as environment from "../config/environment.json";
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';

@inject(NewInstance.of(ValidationController))
export class App {
  public user: User;
  public users: User[];
  controller: any;
  message;

  rules = ValidationRules
            .ensure('name').required().minLength(5).withMessage('name must at least be 5 chars long.')
            .ensure('familyName').required().minLength(5).withMessage('familyName must at least be 5 chars long.')
            .ensure('address').required().minLength(5).withMessage('address must at least be 5 chars long.')
            .ensure('eMailAdress').required().email()
            .ensure('age').required().between(20,60)
            .rules;

  constructor(validationController) {
    this.controller = validationController;
    this.user = new User();
    this.user.name = 'Maxim';
    this.user.familyName = 'Muster';
    this.user.address = 'Augsburger Str. 1';
    this.user.eMailAdress = 'max@muster.com';
    this.user.age = 44;
    this.user.countryOfOrigin = 'aruba';
  }

  async attached(argument) {
    this.users = await this.getAllUsers();
  }

  async addUser() {
    let base = this;
    this.controller.validate().then(v => {
        if (v.valid) {
          axios.post(environment.api + "/users/create", this.user)
          .then(function (response) {
            base.users.push(response.data);
            base.reset();
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        } else {
            console.log('not valid', v);
        }
    });
  }

  getUser(id: number) {
    return axios.get(environment.api + "/users/" + id);
  }

  async getAllUsers() {
    return await axios.get(environment.api + "/users").then(x => x.data);
  }

  async deleteUser(id: number) {
    let base = this;
    return await axios.delete(environment.api + "/users/delete/" + id)
      .then(function (response) {
        console.log(response);
        base.users = base.users.filter(item => item.id !== id)
      })
    .catch(function (error) {
      console.log(error);
    });
  }

  reset(){
    this.user.name = '';
    this.user.familyName = '';
    this.user.address = '';
    this.user.eMailAdress = '';
    this.user.age = null;
    this.user.countryOfOrigin = '';
  }

}
