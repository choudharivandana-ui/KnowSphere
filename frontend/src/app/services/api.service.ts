import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Topic, SearchResponse, Comment } from '../models/topic.model';

const BASE = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getFeaturedTopics(): Observable<Topic[]> {
    return this.http
      .get<{ success: boolean; data: Topic[] }>(`${BASE}/topics/featured`)
      .pipe(map(r => r.data || []), catchError(() => of([])));
  }

  getTrendingTopics(): Observable<Topic[]> {
    return this.http
      .get<{ success: boolean; data: Topic[] }>(`${BASE}/topics/trending`)
      .pipe(map(r => r.data || []), catchError(() => of([])));
  }

  getTopicBySlug(slug: string): Observable<Topic | null> {
    return this.http
      .get<{ success: boolean; data: Topic }>(`${BASE}/topics/${slug}`)
      .pipe(map(r => r.data || null), catchError(() => of(null)));
  }

  /**
   * Search topics.
   * @param query   - user search string
   * @param category - optional category filter (e.g. 'Cities & Countries')
   *                   Angular HttpParams encodes & as %26 automatically — safe.
   */
  search(query: string, category = ''): Observable<SearchResponse> {
    // Build params manually so we only add category when it has a value
    let params = new HttpParams().set('q', query);
    if (category && category.trim()) {
      params = params.set('category', category.trim());
    }
    return this.http
      .get<SearchResponse>(`${BASE}/search`, { params })
      .pipe(
        catchError(err => of({
          success: false,
          data: [],
          total: 0,
          query,
          error: err.message || 'Network error'
        } as SearchResponse))
      );
  }

  addComment(slug: string, comment: Partial<Comment>): Observable<Comment | null> {
    return this.http
      .post<{ success: boolean; data: Comment }>(`${BASE}/topics/${slug}/comments`, comment)
      .pipe(map(r => r.data || null), catchError(() => of(null)));
  }

  likeComment(slug: string, commentId: string): Observable<number> {
    return this.http
      .post<{ success: boolean; data: { likes: number } }>(
        `${BASE}/topics/${slug}/comments/${commentId}/like`, {}
      )
      .pipe(map(r => r.data?.likes ?? 0), catchError(() => of(0)));
  }

  getTopicsByCategory(category: string): Observable<Topic[]> {
    return this.http
      .get<{ success: boolean; data: Topic[] }>(`${BASE}/topics/category/${encodeURIComponent(category)}`)
      .pipe(map(r => r.data || []), catchError(() => of([])));
  }

  /** Fetch related topics by slug array from the backend */
  getRelatedTopics(slugs: string[]): Observable<{ slug: string; title: string; subtitle: string; type: string; category: string; image: string }[]> {
    const params = new HttpParams().set('slugs', slugs.join(','));
    return this.http
      .get<{ success: boolean; data: any[] }>(`${BASE}/topics/related`, { params })
      .pipe(map(r => r.data || []), catchError(() => of([])));
  }
}
