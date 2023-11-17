import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { PluginService } from './plugins/plugin.service';
import { provideRouter } from '@angular/router';
import { NgxsRouterPluginModule, RouterStateSerializer } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/src/lib/shared/shared.module';
import { PluginState } from './plugins/store/plugin.state';
import { CustomRouterStateSerializer } from './store/router/custom-router-state-serializer';
import { SystemState } from '../../../shared/src/lib/store/system/system.state';

export const states = [SystemState, PluginState];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    {provide: RouterStateSerializer, useClass: CustomRouterStateSerializer},
    {
      provide: APP_INITIALIZER,
      deps: [PluginService],
      multi: true,
      useFactory: (s: PluginService) => () => s.init(),
    },
    importProvidersFrom(NgxsModule.forRoot(states, {developmentMode: isDevMode()})),
    importProvidersFrom(NgxsStoragePluginModule.forRoot()),
    importProvidersFrom(NgxsFormPluginModule.forRoot()),
    importProvidersFrom(NgxsRouterPluginModule.forRoot()),
    {provide: NZ_I18N, useValue: zh_CN},
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(SharedModule),
  ],
};
