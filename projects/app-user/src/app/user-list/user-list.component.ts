import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { SystemSelector } from '../../../../shared/src/lib/store/system/system.selector';
import { SharedModule } from '../../../../shared/src/lib/shared/shared.module';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
      <nz-table #basicTable [nzData]="list">
          <thead>
          <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Address</th>
              <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let data of basicTable.data">
              <td>{{ data.name }}</td>
              <td>{{ data.age }}</td>
              <td>{{ data.address }}</td>
              <td>
                  <a>Action 一 {{ data.name }}</a>
                  <nz-divider nzType="vertical"></nz-divider>
                  <a>Delete</a>
              </td>
          </tr>
          </tbody>
      </nz-table>
  `,
  styles: ``,
})
export class UserListComponent {
  @AutoUnsubscribe() messages$ = this.store.select(SystemSelector.messages);
  list = [
    {name: '111', age: 11, address: '111'},
    {name: '222', age: 22, address: '222'},
  ];

  constructor(private store: Store) {
    this.messages$.subscribe(r => {
      console.log('user app message', r);
    });
  }
}
