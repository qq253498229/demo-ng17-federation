import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { SystemSelector } from '@shared';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
      <p>
          user-list works!
      </p>
  `,
  styles: ``,
})
export class UserListComponent {
  @AutoUnsubscribe() messages$ = this.store.select(SystemSelector.messages);

  constructor(private store: Store) {
    this.messages$.subscribe(r => {
      console.log('user app message', r);
    });
  }
}
