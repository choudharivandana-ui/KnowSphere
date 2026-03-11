import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  q = '';

  constructor(private router: Router) {}

  /** Hide search box on home page — it has its own hero search */
  isHome(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

  search() {
    const query = this.q.trim();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.q = '';
    }
  }
}
