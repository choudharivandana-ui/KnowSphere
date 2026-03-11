export interface NameChange {
  name: string; period: string; era?: string; language?: string;
  meaning?: string; context?: string; color?: string; source?: string; current?: boolean;
}
export interface HistoricalContext { period: string; content: string; }
export interface RelatedTopic { label: string; tag: string; slug: string; }
export interface QuickFact { label: string; value: string; }
export interface Comment {
  _id?: string; author: string; avatar: string;
  text: string; rating: number; likes: number; createdAt?: string;
}
export interface TopicData {
  title: string; subtitle: string; image: string; type: string;
  country: string; state?: string; founded: string; population: string;
  coordinates: string; languages: string[];
  summary: string; aiInsight: string;
  nameChanges: NameChange[]; historicalContext: HistoricalContext[];
  relatedTopics: RelatedTopic[]; quickFacts: QuickFact[];
}
export interface Topic {
  _id?: string; query: string; slug: string; category: string;
  searchCount: number; featured?: boolean;
  topicData: TopicData; comments: Comment[];
  createdAt?: string; updatedAt?: string;
}
export interface SearchResponse {
  success: boolean; data: Topic[]; total: number;
  query: string; aiSummary?: string; aiGenerated?: boolean;
  error?: string; message?: string;   // ← added message field
}
