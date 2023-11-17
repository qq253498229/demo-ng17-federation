import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/src/lib/shared/shared.module';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { PluginSelector } from '../store/plugin.selector';
import { Store } from '@ngxs/store';
import { PluginAction } from '../store/plugin.action';

@Component({
  selector: 'app-plugin-loaded',
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
      <div>
          <nz-table #basicTable [nzData]="(loadedList$|async)||[]">
              <thead>
              <tr>
                  <th>路径</th>
                  <th>描述</th>
                  <th>是否有菜单</th>
                  <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let data of basicTable.data">
                  <td>{{ data.path }}</td>
                  <td>{{ data.desc }}</td>
                  <td>{{ data.menu ? '有' : '无' }}</td>
                  <td>
                      <button nz-button nzType="primary" nzDanger (click)="unload(data)">卸载</button>
                  </td>
              </tr>
              </tbody>
          </nz-table>
      </div>

  `,
  styles: ``,
})
export class PluginLoadedComponent {
  @AutoUnsubscribe() loadedList$ = this.store.select(PluginSelector.loadedList);

  constructor(private store: Store) {
  }

  unload(data: any) {
    this.store.dispatch(new PluginAction.Unload(data));
  }
}
