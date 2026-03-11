import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  missionPoints = [
    'Democratize access to historical knowledge',
    'Preserve linguistic and cultural heritage',
    'Make research faster and more intuitive',
    'Bridge the gap between AI and scholarship',
  ];

  howItWorks = [
    {
      step: '01', icon: 'bi-search', title: 'Search Any Topic',
      desc: 'Type any city, country, food item, scientific term, or cultural concept. KnowSphere understands natural language queries.',
      color: '#4f46e5', bg: '#ede9fe'
    },
    {
      step: '02', icon: 'bi-database', title: 'AI Scans Knowledge Base',
      desc: 'Our AI queries a curated database of 50,000+ topics with verified historical records, cross-referenced from multiple scholarly sources.',
      color: '#0891b2', bg: '#e0f2fe'
    },
    {
      step: '03', icon: 'bi-cpu', title: 'Contextual Synthesis',
      desc: 'The AI synthesizes information to present name timelines, historical context, cultural significance, and related topics.',
      color: '#7c3aed', bg: '#f3e8ff'
    },
    {
      step: '04', icon: 'bi-grid-1x2', title: 'Structured Knowledge Panel',
      desc: 'Results appear as beautiful, interactive knowledge panels — similar to Wikipedia but with AI-powered context and visual timelines.',
      color: '#059669', bg: '#d1fae5'
    },
  ];

  features = [
    'Name change timelines with dates and sources',
    'Historical context per era and ruling power',
    'Etymology — meaning of names in original language',
    'AI-generated insights and pattern analysis',
    'Cross-referenced related topics and people',
    'Verified historical source citations',
    '12+ content categories covering diverse topics',
    'Responsive design for desktop and mobile',
  ];

  team = [
    { name: 'Dr. Arjun Sharma', role: 'CEO & Co-Founder',       expertise: 'Historical Linguistics', initial: 'A' },
    { name: 'Priya Patel',      role: 'CTO & Co-Founder',       expertise: 'AI & Machine Learning',  initial: 'P' },
    { name: 'Marcus Chen',      role: 'Head of Research',        expertise: 'Computational History',  initial: 'M' },
    { name: 'Dr. Leila Hassan', role: 'Chief Knowledge Officer', expertise: 'Cultural Anthropology',  initial: 'L' },
  ];
}
