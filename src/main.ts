import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

// Enable production mode unless running locally
if (!/localhost/.test(document.location.host)) { enableProdMode(); }

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
