import { Injectable, isDevMode } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { NotFoundComponent } from '../common/not-found/not-found.component';
import { PluginLayoutComponent } from './plugin-layout/plugin-layout.component';
import { PluginListComponent } from './plugin-list/plugin-list.component';
import { PluginLoadedComponent } from './plugin-loaded/plugin-loaded.component';
import { PluginCustomComponent } from './plugin-custom/plugin-custom.component';

@Injectable({
  providedIn: 'root',
})
export class PluginService {
  list: any;
  loaded: any;

  constructor(
      private router: Router,
      private http: HttpClient,
  ) {
  }

  loadList() {
    return this.http.get(`assets/plugin-list.json`);
  }

  init() {
    return this.loadList().pipe(tap((r: any) => {
      this.list = r;
      //初始化路由
      this.initRouter(r);
      //初始化非懒加载的模块
      this.initNotLazyModule(r);
    }));
  }

  private initRouter(r: any) {
    let loadedPlugins = r.filter((s: any) => s.path in this.loaded);
    let pluginRouterList = loadedPlugins.map((s: any) => {
      return {
        path: `${s.path}`,
        loadChildren: () => loadRemoteModule({
          type: 'module',
          remoteEntry: isDevMode() ? s['remoteEntryDev'] : s['remoteEntry'],
          exposedModule: s.exposedModule,
        }).then(m => m[s['moduleName']]),
      };
    });

    const routes: Routes = [
      {path: '', redirectTo: '/manage', pathMatch: 'full'},
      {
        path: 'manage', children: [
          {path: '', redirectTo: 'list', pathMatch: 'full'},
          {path: 'list', component: PluginListComponent},
          {path: 'loaded', component: PluginLoadedComponent},
          {path: 'custom', component: PluginCustomComponent},
        ],
      },
      {path: 'plugin', component: PluginLayoutComponent, children: [...pluginRouterList]},
      {path: '**', component: NotFoundComponent},
    ];
    this.router.resetConfig(routes);
  }

  private initNotLazyModule(r: any) {
    r.filter((s: any) => s.path in this.loaded)
        .filter((s: any) => !s.lazy).forEach((s: any) => {

      loadRemoteModule({
        type: 'module',
        remoteEntry: isDevMode() ? s['remoteEntryDev'] : s['remoteEntry'],
        exposedModule: s.exposedModule,
      }).then(m => m[s['moduleName']]);

    });
  }
}
