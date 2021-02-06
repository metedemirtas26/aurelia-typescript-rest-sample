import {Aurelia} from 'aurelia-framework';
import * as environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';
import 'bootstrap/dist/css/bootstrap.css';
import './main.css';
import 'bootstrap';
import 'popper.js';
import { I18N, Backend, TCustomAttribute } from 'aurelia-i18n';

// if you use TypeScript and target ES5 you might need to import it like this instead
  // import * as Backend from 'i18next-xhr-backend';
  // otherwise add "allowSyntheticDefaultImports": true, to your tsconfig

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-table')); 
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-validation')); 

  aurelia.use
      .plugin('aurelia-i18n', (instance) => {
        let aliases = ['t', 'i18n'];
        // add aliases for 't' attribute
        TCustomAttribute.configureAliases(aliases);
  
        // register backend plugin
        instance.i18next.use(Backend);
  
        // adapt options to your needs (see http://i18next.com/docs/options/)
        // make sure to return the promise of the setup method, in order to guarantee proper loading
        return instance.setup({
          backend: {                                  // <-- configure backend settings
            loadPath: './locales/{{lng}}/{{ns}}.json', // <-- XHR settings for where to get the files from
          },
          attributes: aliases,
          lng : 'de',
          fallbackLng : 'en',
          debug : false
        });
      });


  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
