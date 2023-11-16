import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { PluginService } from './modules/plugins/plugin.service';
import { RouterModule } from '@angular/router';
import { NgxsRouterPluginModule, RouterStateSerializer } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { SystemState } from './store/system/system.state';
import { CustomRouterStateSerializer } from './store/router/custom-router-state-serializer';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(RouterModule.forRoot([])),
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
