import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { Topic, Comment } from '../../models/topic.model';

@Component({
  selector: 'app-topic-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StarRatingComponent],
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css']
})
export class TopicDetailComponent implements OnInit {
  topic: Topic | null = null;
  loading = true;
  error = '';
  activeTab: 'timeline' | 'context' | 'facts' = 'timeline';
  expandedItem = -1;
  rating = 0;
  commentText = '';
  commentAuthor = '';
  postingComment = false;

  /** Related topics fetched from DB/JSON via API */
  relatedTopics: { slug: string; title: string; subtitle: string; type: string; category: string; image: string }[] = [];
  loadingRelated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.loading = true;
      this.error = '';
      this.topic = null;
      this.relatedTopics = [];

      this.api.getTopicBySlug(p['slug']).subscribe(t => {
        if (t) {
          this.topic = t;
          this.loadRelatedTopics();
        } else {
          this.error = 'Topic not found.';
        }
        this.loading = false;
      });
    });
  }

  /** Fetch related topics from backend using slugs stored in topicData */
  loadRelatedTopics() {
    const slugs = this.topic?.topicData?.relatedTopics
      ?.map(r => r.slug)
      .filter(Boolean) ?? [];

    if (!slugs.length) return;

    this.loadingRelated = true;
    this.api.getRelatedTopics(slugs).subscribe({
      next: (results) => {
        this.relatedTopics = results;
        this.loadingRelated = false;
      },
      error: () => {
        // Fallback: use the relatedTopics array from topicData as-is
        this.relatedTopics = (this.topic?.topicData?.relatedTopics ?? []).map(r => ({
          slug:     r.slug,
          title:    r.label,
          subtitle: r.tag,
          type:     '',
          category: '',
          image:    '',
        }));
        this.loadingRelated = false;
      }
    });
  }

  setTab(tab: 'timeline' | 'context' | 'facts') { this.activeTab = tab; }
  toggleItem(i: number) { this.expandedItem = this.expandedItem === i ? -1 : i; }

  postComment() {
    if (!this.commentText.trim() || !this.topic?.slug) return;
    this.postingComment = true;
    const comment: Partial<Comment> = {
      author: this.commentAuthor || 'Anonymous',
      avatar: (this.commentAuthor || 'AN').substring(0, 2).toUpperCase(),
      text:   this.commentText,
      rating: this.rating || 5
    };
    this.api.addComment(this.topic.slug, comment).subscribe(c => {
      if (c && this.topic) { this.topic.comments.unshift(c); }
      this.commentText  = '';
      this.commentAuthor = '';
      this.rating = 0;
      this.postingComment = false;
    });
  }

  likeComment(commentId: string) {
    if (!this.topic?.slug || !commentId) return;
    this.api.likeComment(this.topic.slug, commentId).subscribe((likes: number) => {
      const c = this.topic!.comments.find(x => x._id === commentId);
      if (c) c.likes = likes;
    });
  }

  copied = false;

  copyInsight() {
    if (!this.topic?.topicData?.aiInsight) return;
    navigator.clipboard.writeText(this.topic.topicData.aiInsight).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  shareInsight() {
    if (!this.topic?.topicData?.aiInsight) return;
    const text = `${this.topic.topicData.title} — AI Insight:\n"${this.topic.topicData.aiInsight}"\n\nvia KnowSphere`;
    if (navigator.share) {
      navigator.share({ title: this.topic.topicData.title, text });
    } else {
      // Fallback: copy to clipboard with share text
      navigator.clipboard.writeText(text).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      });
    }
  }

  goRelated(slug: string) { this.router.navigate(['/topic', slug]); }
  stars(n: number)      { return Array(n).fill(0); }
  emptyStars(n: number) { return Array(5 - n).fill(0); }

  avatarColor(av: string): string {
    const colors = ['#5B5BD6','#7C3AED','#0891b2','#059669','#d97706','#dc2626','#db2777'];
    let h = 0;
    for (const c of av) h = (h * 31 + c.charCodeAt(0)) % colors.length;
    return colors[Math.abs(h)];
  }

  getContextColor(i: number): string {
    const colors = ['#5B5BD6','#0891b2','#059669','#d97706','#7C3AED','#dc2626'];
    return colors[i % colors.length];
  }
}
