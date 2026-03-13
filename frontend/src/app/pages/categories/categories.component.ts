import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  icon: string; name: string; count: string; desc: string;
  bg: string; color: string; examples: string[];
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  filterText = '';
  expanded: string | null = null;

  categories: Category[] = [

{
icon:'bi-globe',
name:'Cities & Countries',
count:'2,400+',
desc:'Colonial renames, post-independence reversions, and geographic renaming.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'Pune → Poona → Pune',
'Istanbul (was Constantinople)',
'Sri Lanka (was Ceylon)',
'Mumbai (was Bombay)',
'Kolkata (was Calcutta)'
]
},

{
icon:'bi-building',
name:'Companies & Brands',
count:'1,800+',
desc:'Corporate rebranding, mergers, and brand identity evolution.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'Google (was BackRub)',
'Twitter → X',
'Meta (was Facebook)',
'Alphabet (Google parent)'
]
},

{
icon:'bi-tree',
name:'Plants & Trees',
count:'3,200+',
desc:'Botanical nomenclature, folk names, and scientific renaming.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'Neem (Azadirachta indica)',
'Tulsi (Holy Basil)',
'Banyan Tree',
'Ashwagandha'
]
},

{
icon:'bi-gem',
name:'Jewellery & Gems',
count:'900+',
desc:'Gemstone nomenclature, trade names, and mineralogical history.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'Diamond (from Adamas)',
'Ruby (from Ratnaraj)',
'Sapphire etymology',
'Emerald history'
]
},

{
icon:'bi-cpu',
name:'Scientific Terms',
count:'5,100+',
desc:'Scientific naming conventions, Latin/Greek roots, and modern revisions.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'Coronavirus naming',
'Pluto (reclassification)',
'Vitamin nomenclature',
'Element names'
]
},

{
icon:'bi-music-note-beamed',
name:'Festivals & Culture',
count:'1,200+',
desc:'Cultural event naming, religious festivals, and traditional celebrations.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'Diwali (various names)',
'Christmas etymology',
'Eid origins',
'Holi history'
]
},

{
icon:'bi-shield',
name:'Historical Events',
count:'780+',
desc:'Wars, revolutions, and historical events across time.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'World War I naming',
'The Great Plague',
'French Revolution',
'Industrial Revolution'
]
},

{
icon:'bi-translate',
name:'Languages & Scripts',
count:'460+',
desc:'Language evolution, script changes, and linguistic naming history.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'Hindi (from Hindavi)',
'English etymology',
'Sanskrit → Pali',
'Devanagari script'
]
},

{
icon:'bi-bank',
name:'Schools & Institutions',
count:'340+',
desc:'University renames, institutional rebranding, and educational history.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'IIT Bombay history',
'Oxford University',
'Harvard naming',
'BITS Pilani'
]
},

{
icon:'bi-water',
name:'Geographic Features',
count:'1,100+',
desc:'Rivers, mountains, oceans, and geographic feature renaming.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'Indian Ocean naming',
'Everest (Sagarmatha)',
'Ganges / Ganga',
'Dead Sea history'
]
},

{
icon:'bi-lightbulb',
name:'Objects & Inventions',
count:'2,200+',
desc:'Product naming, invention history, and object etymology.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'Penicillin naming',
'Aspirin etymology',
'Internet naming',
'Bluetooth origin'
]
},

{
icon:'bi-egg-fried',
name:'Food & Cuisine',
count:'1,600+',
desc:'Dish origins, food naming history, and culinary etymology.',
bg:'#f0f0f4',
color:'#6b7280',
examples:[
'Peking Duck history',
'Vindaloo etymology',
'Chai naming',
'Mango etymology'
]
}

];

  get filtered() {
    const q = this.filterText.toLowerCase();
    return q ? this.categories.filter(c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) : this.categories;
  }

  toggle(name: string) { this.expanded = this.expanded === name ? null : name; }

  mostExplored = [
    { name: 'Istanbul', tag: 'City · Turkey',           slug: 'istanbul',  count: 380 },
    { name: 'Pune',     tag: 'City · India',            slug: 'pune',      count: 420 },
    { name: 'Mumbai',   tag: 'City · India',            slug: 'mumbai',    count: 260 },
    { name: 'Sri Lanka',tag: 'Country · South Asia',    slug: 'sri-lanka', count: 290 },
    { name: 'Kolkata',  tag: 'City · India',            slug: 'kolkata',   count: 180 },
    { name: 'Beijing',  tag: 'City · China',            slug: 'beijing',   count: 220 }
  ];

  constructor(private router: Router) {}
  go(slug: string) { this.router.navigate(['/topic', slug]); }
}
