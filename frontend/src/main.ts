import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { blockBackButton } from './app/back-button-blocker';
blockBackButton();

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));