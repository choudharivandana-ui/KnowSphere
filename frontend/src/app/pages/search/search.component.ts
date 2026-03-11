import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Topic } from '../../models/topic.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // ── State ───────────────────────────────────────────────
  q              = '';
  results: Topic[] = [];
  aiSummary      = '';
  aiGenerated    = false;
  loading        = false;
  error          = '';
  activeFilter   = 'All';
  activeCategory = '';

  private _lastSearchedQ  = '';
  private _lastBrowsedCat = '';

  // ── Sort ────────────────────────────────────────────────
  sortOrder: 'default' | 'asc' | 'desc' = 'default';

  get sortedResults(): Topic[] {
    if (this.sortOrder === 'asc') {
      return [...this.results].sort((a, b) =>
        (a.topicData?.title || '').localeCompare(b.topicData?.title || ''));
    }
    if (this.sortOrder === 'desc') {
      return [...this.results].sort((a, b) =>
        (b.topicData?.title || '').localeCompare(a.topicData?.title || ''));
    }
    return this.results;
  }

  setSort(order: 'default' | 'asc' | 'desc') {
    this.sortOrder = order;
    this.resetPagination();
  }

  // ── Category filters ────────────────────────────────────
  private readonly CAT_MAP: Record<string, string> = {
    'Cities':         'Cities & Countries',
    'Countries':      'Cities & Countries',
    'Food & Culture': 'Food & Cuisine',
    'Science':        'Scientific Terms',
    'Companies':      'Companies & Brands'
  };
  filters = ['All', 'Cities', 'Countries', 'Food & Culture', 'Science', 'Companies'];

  private get activeCat(): string { return this.CAT_MAP[this.activeFilter] || ''; }

  setFilter(f: string) {
    this.activeFilter = f;
    if (this.q) this.doSearch();
  }

  // ── Related topics (sidebar) ────────────────────────────
  relatedTopics: { slug: string; title: string; subtitle: string; type: string; category: string; image: string }[] = [];
  loadingRelated = false;

  // ── Browse categories ───────────────────────────────────
  categories = [
    { icon: 'bi-globe',             name: 'Cities & Countries',  count: '2,400+', bg: '#ede9fe' },
    { icon: 'bi-building',          name: 'Companies & Brands',  count: '1,800+', bg: '#dbeafe' },
    { icon: 'bi-tree',              name: 'Plants & Trees',      count: '3,200+', bg: '#dcfce7' },
    { icon: 'bi-egg-fried',         name: 'Food & Cuisine',      count: '900+',   bg: '#fef3c7' },
    { icon: 'bi-cpu',               name: 'Scientific Terms',    count: '5,100+', bg: '#f3e8ff' },
    { icon: 'bi-music-note-beamed', name: 'Festivals & Culture', count: '1,200+', bg: '#fce7f3' },
  ];

  browseCategory(name: string) {
    this.router.navigate(['/search'], { queryParams: { category: name } });
  }

  // ── Recent Searches ─────────────────────────────────────
  // NOTE: Must be a plain array property (NOT a getter).
  // Angular's change detection only watches property references.
  // Every mutation must assign a new array: this.recentSearches = [...list]
  private readonly RECENT_KEY = 'ks_recent_searches';
  private readonly MAX_RECENT = 6;
  recentSearches: string[] = [];

  private _readStorage(): string[] {
    try {
      const raw = localStorage.getItem(this.RECENT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private _writeStorage(list: string[]) {
    this.recentSearches = [...list];  // NEW reference → Angular detects change → re-renders
    try { localStorage.setItem(this.RECENT_KEY, JSON.stringify(list)); } catch {}
  }

  private saveRecentSearch(query: string) {
    if (!query.trim()) return;
    const deduped = this._readStorage().filter(s => s.toLowerCase() !== query.toLowerCase());
    this._writeStorage([query, ...deduped].slice(0, this.MAX_RECENT));
  }

  pickHistory(s: string) {
    this.q = s;
    this._lastSearchedQ = '';
    this.doSearch();
  }

  removeRecent(s: string) {
    this._writeStorage(this.recentSearches.filter(r => r !== s));
  }

  clearRecent() {
    try { localStorage.removeItem(this.RECENT_KEY); } catch {}
    this.recentSearches = [];
  }

  // ── Top Searches ────────────────────────────────────────
  topSearches: { slug: string; title: string; category: string; searchCount: number }[] = [];

  private loadTopSearches() {
    this.api.getTrendingTopics().subscribe({
      next: topics => {
        this.topSearches = topics.slice(0, 6).map(t => ({
          slug: t.slug, title: t.topicData?.title || t.slug,
          category: t.category, searchCount: t.searchCount || 0
        }));
      },
      error: () => { this.topSearches = []; }
    });
  }

  // ── Pagination ──────────────────────────────────────────
  readonly pageSize = 10;
  currentPage = 1;

  private resetPagination() { this.currentPage = 1; }

  get totalPages(): number { return Math.ceil(this.sortedResults.length / this.pageSize); }

  get pagedResults(): Topic[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedResults.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [];
    const cur = this.currentPage;
    pages.push(1);
    if (cur > 3) pages.push(-1);
    const start = Math.max(2, cur - 1);
    const end   = Math.min(total - 1, cur + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (cur < total - 2) pages.push(-1);
    pages.push(total);
    return pages;
  }

  goPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  min(a: number, b: number) { return Math.min(a, b); }

  // ── Did You Know ────────────────────────────────────────
  private readonly DYK_FACTS: Record<string, { highlight: string; fact: string; link: string }> = {
    'Cities & Countries':  { highlight: '200+ cities worldwide',              fact: 'have officially changed their names since 1950, reflecting post-colonial identity shifts.',          link: 'Explore cities →'  },
    'Companies & Brands':  { highlight: 'Over 40% of Fortune 500 companies',  fact: 'have rebranded at least once, often after mergers, scandals, or strategic pivots.',                 link: 'Explore brands →'  },
    'Plants & Trees':      { highlight: 'More than 350,000 plant species',     fact: 'are known to science, yet thousands still carry multiple conflicting common names across regions.', link: 'Explore plants →'  },
    'Food & Cuisine':      { highlight: 'Dishes like "French fries"',          fact: "are disputed in origin — many iconic foods are named after places that didn't invent them.",        link: 'Explore food →'    },
    'Scientific Terms':    { highlight: 'Over 30 elements on the periodic table', fact: 'were renamed in the 20th century to standardise international scientific nomenclature.',         link: 'Explore science →' },
    'Festivals & Culture': { highlight: 'Hundreds of festivals globally',      fact: 'have ancient origins but are celebrated under modern names that differ from their historical roots.',link: 'Explore culture →' },
  };

  get didYouKnow() {
    const key = this.activeCategory || (this.results[0]?.category ?? '');
    return this.DYK_FACTS[key] ?? this.DYK_FACTS['Cities & Countries'];
  }

  // ── Constructor / Init ──────────────────────────────────
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.recentSearches = this._readStorage();  // hydrate from localStorage on init
    this.loadTopSearches();

    this.route.queryParams.subscribe(params => {
      const q   = (params['q']        || '').trim();
      const cat = (params['category'] || '').trim();

      if (cat) {
        const pill = Object.entries(this.CAT_MAP).find(([, v]) => v === cat)?.[0];
        if (pill) this.activeFilter = pill;
      }

      if (q && q !== this._lastSearchedQ) {
        this.q = q;
        this.doSearch();
      } else if (cat && cat !== this._lastBrowsedCat) {
        this.q = '';
        this.doCategoryBrowse(cat);
      } else if (q) {
        this.q = q;
      }
    });
  }

  // ── Search / Browse ─────────────────────────────────────
  doSearch() {
    const query = this.q.trim();
    if (!query) return;

    this._lastSearchedQ  = query;
    this._lastBrowsedCat = '';
    this.activeCategory  = '';
    this.sortOrder       = 'default';
    this.saveRecentSearch(query);   // ← saves AND updates this.recentSearches

    this.loading   = true;
    this.error     = '';
    this.results   = [];
    this.aiSummary = '';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });

    this.api.search(query, this.activeCat).subscribe({
      next: r => {
        this.loading = false;
        if (r.success) {
          this.results     = r.data;
          this.resetPagination();
          this.loadSidebarData();
          this.aiSummary   = r.aiSummary   || '';
          this.aiGenerated = r.aiGenerated || false;
          if (!r.data.length) this.error = r.message || `No results found for "${query}".`;
        } else {
          this.error = r.error || 'Search failed. Please try again.';
        }
      },
      error: err => {
        this.loading = false;
        this.error   = 'Could not connect to server. Please check the backend is running.';
        console.error('Search HTTP error:', err);
      }
    });
  }

  doCategoryBrowse(cat: string) {
    this.loading         = true;
    this.error           = '';
    this.results         = [];
    this.sortOrder       = 'default';
    this.activeCategory  = cat;
    this._lastBrowsedCat = cat;
    this._lastSearchedQ  = '';

    this.api.getTopicsByCategory(cat).subscribe({
      next: topics => {
        this.loading = false;
        this.results = topics;
        this.resetPagination();
        this.loadSidebarData();
        if (!topics.length) this.error = `No topics found in "${cat}".`;
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not load category topics.';
      }
    });
  }

  // ── Sidebar data ────────────────────────────────────────
  private loadSidebarData() {
    const first = this.results[0];
    if (!first?.topicData) return;

    const slugs = (first.topicData.relatedTopics ?? []).map((r: any) => r.slug).filter(Boolean);
    const fallback = (first.topicData.relatedTopics ?? []).map((r: any) => ({
      slug: r.slug, title: r.label, subtitle: r.tag, type: '', category: '', image: ''
    }));

    if (!slugs.length) { this.relatedTopics = fallback; return; }

    this.loadingRelated = true;
    this.api.getRelatedTopics(slugs).subscribe({
      next: t  => { this.loadingRelated = false; this.relatedTopics = t.length ? t : fallback; },
      error: () => { this.loadingRelated = false; this.relatedTopics = fallback; }
    });
  }

  // ── Helpers ─────────────────────────────────────────────
  go(slug: string)       { this.router.navigate(['/topic', slug]); }
  changesCount(t: Topic) { return t.topicData?.nameChanges?.length ?? 0; }

  searchRelated(slug: string) {
    const match = this.relatedTopics.find(r => r.slug === slug);
    if (match?.slug) this.router.navigate(['/topic', match.slug]);
    else { this.q = slug; this.activeFilter = 'All'; this.doSearch(); }
  }

  copy() { if (this.aiSummary) navigator.clipboard.writeText(this.aiSummary).catch(() => {}); }
}
