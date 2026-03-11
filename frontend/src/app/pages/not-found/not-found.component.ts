import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="d-flex flex-column align-items-center justify-content-center py-5 text-center" style="min-height:60vh">
      <div style="font-size:72px; margin-bottom:16px">🗺️</div>
      <h1 style="font-size:36px; font-weight:900; color:#1a1a2e; letter-spacing:-1px">Page Not Found</h1>
      <p class="text-muted mb-4">The page you're looking for doesn't exist or was moved.</p>
      <div class="d-flex gap-3 flex-wrap justify-content-center">
        <a routerLink="/" class="btn-home">← Back to Home</a>
        <a routerLink="/search" class="btn-search-link">Try AI Search</a>
      </div>
    </div>
  `,
  styles: [`
    .btn-home {
      background:linear-gradient(135deg,#5B5BD6,#7C3AED); color:#fff !important;
      border-radius:12px; padding:12px 24px; font-size:14px; font-weight:700;
      text-decoration:none; transition:opacity .2s;
    }
    .btn-home:hover { opacity:.88; }
    .btn-search-link {
      background:#fff; border:1.5px solid #e5e5f0; color:#5B5BD6 !important;
      border-radius:12px; padding:12px 24px; font-size:14px; font-weight:700;
      text-decoration:none; transition:all .2s;
    }
    .btn-search-link:hover { border-color:#a5b4fc; }
  `]
})
export class NotFoundComponent {}
