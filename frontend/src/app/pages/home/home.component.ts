import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Topic } from '../../models/topic.model';
 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  q = '';
  showSug = false;
  featuredTopics: Topic[] = [];
  trendingTopics: Topic[] = [];
  loadingFeatured = true;
  loadingTrending = true;

  allSuggestions = [
    'Chennai', 'Myanmar', 'Peking Duck', 'Google', 'Nike', 'Kyoto',
    'Starbucks', 'Ramen', 'Oslo', 'Thailand', 'Jakarta', 'Pizza',
    'Adidas', 'Twitter', 'Pepsi', 'Lego', 'Nokia', 'Sony'
  ];
  filteredSug: string[] = [];
  quickTags = ['Chennai', 'Google', 'Peking Duck', 'Kyoto', 'Nike', 'Ramen'];

  typeBg    = ['#f0f0f4'];
  typeColor = ['#6b7280'];

  categories = [
  { icon:'bi-globe', name:'Cities & Countries', count:'2,400+', bg:'#f0f0f4' },
  { icon:'bi-building', name:'Companies & Brands', count:'1,800+', bg:'#f0f0f4' },
  { icon:'bi-tree', name:'Plants & Trees', count:'3,200+', bg:'#f0f0f4' },
  { icon:'bi-gem', name:'Jewellery & Gems', count:'900+', bg:'#f0f0f4' },
  { icon:'bi-cpu', name:'Scientific Terms', count:'5,100+', bg:'#f0f0f4' },
  { icon:'bi-music-note-beamed', name:'Festivals & Culture', count:'1,200+', bg:'#f0f0f4' }
];

  features = [
    { title:'Name Change Timelines', desc:'Chronological records with dates and sources' },
    { title:'Cultural Context',      desc:'Why names changed and who changed them' },
    { title:'Cross-Reference Links', desc:'Connect related topics, events, and entities' },
    { title:'Verified Sources',      desc:'Every fact backed by historical records' }
  ];

  fallbackTopics: Topic[] = [
    { query:'pune', slug:'pune', category:'Cities & Countries', searchCount:420,
      topicData:{ title:'Pune', subtitle:'City · Maharashtra, India', image:'', type:'City',
        country:'India', state:'Maharashtra', founded:'937 CE', population:'3.1M',
        coordinates:'', languages:['Marathi'],
        summary:'Pune evolved over 1,300 years from Punya-Vishaya (937 CE) through Poona, officially reverting to Pune in 1978.',
        aiInsight:'', nameChanges:new Array(6).fill({}), historicalContext:[], relatedTopics:[], quickFacts:[] }, comments:[] },
    { query:'istanbul', slug:'istanbul', category:'Cities & Countries', searchCount:380,
      topicData:{ title:'Istanbul', subtitle:'City · Turkey', image:'', type:'City',
        country:'Turkey', founded:'657 BCE', population:'15.8M',
        coordinates:'', languages:['Turkish'],
        summary:'Known as Byzantium then Constantinople for 1,600+ years before being renamed Istanbul in 1930.',
        aiInsight:'', nameChanges:new Array(4).fill({}), historicalContext:[], relatedTopics:[], quickFacts:[] }, comments:[] },
    { query:'sri-lanka', slug:'sri-lanka', category:'Cities & Countries', searchCount:290,
      topicData:{ title:'Sri Lanka', subtitle:'Country · South Asia', image:'', type:'Country',
        country:'Sri Lanka', founded:'125,000 BCE', population:'22M',
        coordinates:'', languages:['Sinhala','Tamil'],
        summary:'Known as Lanka, Tambapanni, Serendib, and Ceylon before adopting Sri Lanka in 1972.',
        aiInsight:'', nameChanges:new Array(5).fill({}), historicalContext:[], relatedTopics:[], quickFacts:[] }, comments:[] }
  ];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.filteredSug = this.allSuggestions.slice(0,5);
    this.api.getFeaturedTopics().subscribe(t => { this.featuredTopics = t; this.loadingFeatured = false; });
    this.api.getTrendingTopics().subscribe(t => { this.trendingTopics = t; this.loadingTrending = false; });
  }

  onInput() {
    const v = this.q.toLowerCase();
    this.filteredSug = v
      ? this.allSuggestions.filter(s => s.toLowerCase().includes(v)).slice(0,5)
      : this.allSuggestions.slice(0,5);
  }

  search() {
    const query = this.q.trim();
    if (query) { this.showSug = false; this.router.navigate(['/search'], { queryParams: { q: query } }); }
  }

  pickSug(s: string) { this.q = s; this.showSug = false; this.search(); }
  pickTag(t: string) { this.q = t; this.search(); }
  go(slug: string) { this.router.navigate(['/topic', slug]); }
  changesCount(t: Topic) { return t.topicData?.nameChanges?.length ?? 0; }

  hideSuggestions() { 
    window.setTimeout(() => { this.showSug = false; }, 200); 
  }
}
