import { Injectable, isDevMode } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

@Injectable({
  providedIn: 'root',
})
export class PluginService {

  constructor(private router: Router) {
  }

  init() {
    return new Promise<void>(resolve => {
      let newRoutes: Routes = [
        {path: '', redirectTo: 'manage/list', pathMatch: 'full'},
        {path: 'manage/list', component: ListComponent},
        {
          path: 'plugin/user',
          loadChildren: () => loadRemoteModule({
            type: 'module',
            remoteEntry: isDevMode() ? 'http://localhost:4201/remoteEntry.js' : '/assets/user/remoteEntry.js',
            exposedModule: './routes',
          }).then(m => m.routes),
        },
      ];
      this.router.resetConfig(newRoutes);
      resolve();
    });
  }
}
