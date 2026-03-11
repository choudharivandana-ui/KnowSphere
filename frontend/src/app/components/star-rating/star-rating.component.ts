import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex gap-1">
      @for (s of [1,2,3,4,5]; track s) {
        <span class="ks-star"
          [class.filled]="s <= (hover || value)"
          [class.ro]="readonly"
          (mouseenter)="!readonly && (hover = s)"
          (mouseleave)="!readonly && (hover = 0)"
          (click)="!readonly && select(s)">
          {{ s <= (hover || value) ? '★' : '☆' }}
        </span>
      }
    </div>`,
  styles: [`
    .ks-star { font-size:20px; color:#d1d5db; cursor:pointer; transition:color .1s,transform .1s; user-select:none; }
    .ks-star.filled { color:#f59e0b; }
    .ks-star:hover:not(.ro) { transform:scale(1.15); }
    .ks-star.ro { cursor:default; font-size:14px; }
  `]
})
export class StarRatingComponent {
  @Input() value = 0;
  @Input() readonly = false;
  @Output() valueChange = new EventEmitter<number>();
  hover = 0;
  select(n: number) { this.value = n; this.valueChange.emit(n); }
}
