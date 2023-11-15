import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { PluginService } from './modules/plugins/plugin.service';
import { RouterModule } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(RouterModule.forRoot([])),
    {
      provide: APP_INITIALIZER,
      deps: [PluginService],
      multi: true,
      useFactory: (s: PluginService) => () => s.init(),
    },
  ],
};
