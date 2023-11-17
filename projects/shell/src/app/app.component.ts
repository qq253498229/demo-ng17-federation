import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { SharedModule } from '../../../shared/src/lib/shared/shared.module';
import { SystemSelector } from '../../../shared/src/lib/store/system/system.selector';
import { PluginSelector } from './plugins/store/plugin.selector';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, SharedModule],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @AutoUnsubscribe() messages$ = this.store.select(SystemSelector.messages);
  @AutoUnsubscribe() pluginMenu$ = this.store.select(PluginSelector.pluginMenu);

  isCollapsed = false;

  constructor(private store: Store) {
    this.messages$.subscribe(r => {
      console.log('shell app message', r);
    });
  }

}
