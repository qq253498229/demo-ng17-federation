import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { SystemSelector } from './store/system/system.selector';
import { SystemAction } from './store/system/system.action';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
      <button routerLink="/manage/list">plugin</button>
      <button routerLink="/plugin/user">user</button>
      <button (click)="test()">test</button>
      <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {

  constructor(private store: Store) {
    this.store.select(SystemSelector.messages).subscribe(r => {
      console.log('app message', r);
    });
  }

  test() {
    console.log('test');
    this.store.dispatch(new SystemAction.SendMessage('test', {name: 123}));
  }
}
