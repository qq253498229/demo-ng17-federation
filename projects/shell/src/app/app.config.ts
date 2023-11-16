import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { PluginService } from './modules/plugins/plugin.service';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { NgxsRouterPluginModule, RouterStateSerializer } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { CustomRouterStateSerializer, SystemState } from '@shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([], withEnabledBlockingInitialNavigation()),
    {provide: RouterStateSerializer, useClass: CustomRouterStateSerializer},
    {
      provide: APP_INITIALIZER,
      deps: [PluginService],
      multi: true,
      useFactory: (s: PluginService) => () => s.init(),
    },
    importProvidersFrom(NgxsModule.forRoot([SystemState], {developmentMode: isDevMode()})),
    importProvidersFrom(NgxsStoragePluginModule.forRoot()),
    importProvidersFrom(NgxsFormPluginModule.forRoot()),
    importProvidersFrom(NgxsRouterPluginModule.forRoot()),
  ],
};
