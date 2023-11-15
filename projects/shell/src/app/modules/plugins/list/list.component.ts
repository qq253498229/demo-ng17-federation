import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  template: `
      <p>
          plugin list works!
      </p>
  `,
  styles: ``,
})
export class ListComponent {

}
