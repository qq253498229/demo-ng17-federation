import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
      <button routerLink="/manage/list">plugin</button>
      <button routerLink="/plugin/user">user</button>
      <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
}
