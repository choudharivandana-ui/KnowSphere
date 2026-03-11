const mongoose = require('mongoose');

const NameChangeSchema = new mongoose.Schema({
  name:     String,
  period:   String,
  era:      String,
  language: String,
  meaning:  String,
  context:  String,
  color:    { type: String, default: '#5B5BD6' },
  source:   String,
  current:  { type: Boolean, default: false }
}, { _id: false });

const HistoricalContextSchema = new mongoose.Schema({
  period:  String,
  content: String
}, { _id: false });

const RelatedTopicSchema = new mongoose.Schema({
  label: String,
  tag:   String,
  slug:  String
}, { _id: false });

const QuickFactSchema = new mongoose.Schema({
  label: String,
  value: String
}, { _id: false });

const CommentSchema = new mongoose.Schema({
  author:    { type: String, default: 'Anonymous' },
  avatar:    { type: String, default: 'AN' },
  text:      { type: String, required: true },
  rating:    { type: Number, min: 1, max: 5, default: 5 },
  likes:     { type: Number, default: 0 },
  createdAt: { type: Date,   default: Date.now }
});

const TopicDataSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  subtitle:   String,
  image:      { type: String, default: '' },
  type:       String,
  country:    String,
  state:      String,
  founded:    String,
  population: String,
  coordinates:String,
  languages:  [String],
  summary:    String,
  aiInsight:  String,
  nameChanges:       [NameChangeSchema],
  historicalContext: [HistoricalContextSchema],
  relatedTopics:     [RelatedTopicSchema],
  quickFacts:        [QuickFactSchema]
}, { _id: false });

const TopicSchema = new mongoose.Schema({
  query:       { type: String, required: true, lowercase: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  category:    { type: String, default: 'General' },
  searchCount: { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
  topicData:   TopicDataSchema,
  comments:    [CommentSchema]
}, { timestamps: true });

TopicSchema.index(
  { 'topicData.title': 'text', query: 'text', 'topicData.summary': 'text' },
  { weights: { 'topicData.title': 10, query: 8, 'topicData.summary': 2 } }
);
TopicSchema.index({ searchCount: -1 });
TopicSchema.index({ category: 1 });

module.exports = mongoose.model('Topic', TopicSchema);
