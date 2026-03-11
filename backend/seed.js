require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('./models/Topic');

const TOPICS = [
  {
    query: 'pune', slug: 'pune', category: 'Cities & Countries', searchCount: 420, featured: true,
    topicData: {
      title: 'Pune', subtitle: 'City · Maharashtra, India',
      image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=70',
      type: 'City', country: 'India', state: 'Maharashtra',
      founded: '937 CE (earliest record)', population: '3.1 million (city proper)',
      coordinates: '18.5204° N, 73.8567° E', languages: ['Marathi', 'Hindi', 'English'],
      summary: 'Pune is a major city in the western Indian state of Maharashtra. Its name has undergone a remarkable evolution over 1,300 years, shaped by ancient Sanskrit literature, Maratha Empire rule, British colonial administration, and post-independence renaming.',
      aiInsight: "Pune's naming history reflects post-colonial India's broader pattern of reverting British phonetic approximations to indigenous names. The 1978 renaming was part of Maharashtra government's effort to restore Marathi cultural identity.",
      nameChanges: [
        { name: 'Punya-Vishaya', period: '937 CE', era: 'Early Medieval', language: 'Sanskrit', meaning: 'Region of merit/virtue', context: 'First recorded in a Rashtrakuta dynasty copper-plate inscription.', color: '#7c3aed', source: 'Copper Plate Inscription, Rashtrakuta Dynasty', current: false },
        { name: 'Punaka', period: '1000–1100 CE', era: 'Medieval', language: 'Prakrit/Marathi', meaning: "Derived from Sanskrit 'punya'", context: 'Used in Yadava dynasty records.', color: '#4f46e5', source: 'Yadava Dynasty Records', current: false },
        { name: 'Punawadi', period: '1300–1500 CE', era: 'Bahmani Sultanate', language: 'Marathi', meaning: 'Puna + wadi (settlement)', context: 'Bahmani Sultanate administrative era.', color: '#0891b2', source: 'Bahmani Administrative Records', current: false },
        { name: 'Kasba Pune', period: '1600–1700 CE', era: 'Adilshahi/Early Maratha', language: 'Marathi/Persian', meaning: 'Kasba = market town', context: 'Adilshahi rule; Shivaji had connections here.', color: '#059669', source: 'Shivaji Era Records', current: false },
        { name: 'Poona', period: '1817–1978', era: 'British Colonial', language: 'English', meaning: 'British romanisation of Pune', context: 'After Third Anglo-Maratha War; summer capital of Bombay Presidency.', color: '#d97706', source: 'British East India Company Records', current: false },
        { name: 'Pune', period: '1978 – Present', era: 'Post-Independence', language: 'Marathi', meaning: 'Restored Marathi pronunciation', context: 'Maharashtra Govt officially reverted to Pune in 1978.', color: '#16a34a', source: 'Maharashtra Government Gazette, 1978', current: true }
      ],
      historicalContext: [
        { period: 'Ancient & Early Medieval (600–1200 CE)', content: 'Part of Rashtrakuta and Yadava kingdoms. Appears in Sanskrit copper-plate inscriptions as Punya-Vishaya, a sacred administrative district.' },
        { period: 'Sultanate Period (1300–1600 CE)', content: 'Under the Bahmani Sultanate and Adilshahi of Bijapur. Persian terminology blended with local Marathi.' },
        { period: 'Maratha Empire (1630–1818 CE)', content: 'Seat of the Peshwa (Maratha Prime Ministers). Shaniwar Wada palace became the political hub of a vast empire.' },
        { period: 'British Colonial Era (1818–1947)', content: 'Key British cantonment town and summer capital of Bombay Presidency after the Third Anglo-Maratha War.' },
        { period: 'Post-Independence (1947–Present)', content: 'Renamed Pune in 1978. Today a major IT hub hosting Infosys, Wipro, and hundreds of tech companies.' }
      ],
      relatedTopics: [
        { label: 'Mumbai', tag: 'City · Maharashtra', slug: 'mumbai' },
        { label: 'Maratha Empire', tag: 'Historical Empire', slug: 'maratha-empire' },
        { label: 'Deccan Plateau', tag: 'Geographic Region', slug: 'deccan-plateau' }
      ],
      quickFacts: [
        { label: 'Area', value: '331.26 km²' }, { label: 'Elevation', value: '560 m' },
        { label: 'River', value: 'Mula–Mutha' }, { label: 'Time Zone', value: 'IST (UTC+5:30)' },
        { label: 'PIN Code', value: '411 001–411 062' }
      ]
    },
    comments: [
      { author: 'David Thompson', avatar: 'DT', text: 'Fascinating! The name evolution shows how empires shaped identity.', rating: 5, likes: 18 },
      { author: 'Priya Sharma',   avatar: 'PS', text: 'As a history student I find the detailed timeline extremely valuable.', rating: 5, likes: 24 }
    ]
  },
  {
    query: 'istanbul', slug: 'istanbul', category: 'Cities & Countries', searchCount: 380, featured: true,
    topicData: {
      title: 'Istanbul', subtitle: 'City · Turkey',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=70',
      type: 'City', country: 'Turkey', state: 'Istanbul Province',
      founded: '657 BCE', population: '15.8 million',
      coordinates: '41.0082° N, 28.9784° E', languages: ['Turkish'],
      summary: "Istanbul is Turkey's largest city straddling Europe and Asia. Formerly Byzantium then Constantinople, it served as capital to three major empires over 1,600 years.",
      aiInsight: "Istanbul's 1930 renaming was central to Atatürk's Turkification program — the same reform that changed Turkish script from Arabic to Latin. The name likely derives from Greek 'eis tin polin' (to the city).",
      nameChanges: [
        { name: 'Byzantium', period: '657 BCE – 330 CE', era: 'Ancient Greek/Roman', language: 'Ancient Greek', meaning: 'Named after founder Byzas of Megara', context: 'Greek colony at the Bosphorus.', color: '#7c3aed', source: 'Strabo, Geographica', current: false },
        { name: 'Constantinople', period: '330 CE – 1453 CE', era: 'Byzantine Empire', language: 'Greek/Latin', meaning: "City of Constantine", context: 'Emperor Constantine I made it New Rome; Byzantine capital for 1,100 years.', color: '#0891b2', source: 'Eusebius, Life of Constantine', current: false },
        { name: 'Kostantiniyye', period: '1453–1930', era: 'Ottoman Empire', language: 'Ottoman Turkish', meaning: 'Arabic/Ottoman form of Constantinople', context: 'Ottoman capital after conquest by Mehmed II.', color: '#d97706', source: 'Ottoman Imperial Firmans', current: false },
        { name: 'Istanbul', period: '1930 – Present', era: 'Republic of Turkey', language: 'Turkish', meaning: "From Greek 'eis tin polin'", context: "Standardised by Atatürk's postal reforms of 1930.", color: '#16a34a', source: 'Turkish Republic Official Gazette, 1930', current: true }
      ],
      historicalContext: [
        { period: 'Ancient Greek (657–146 BCE)', content: 'Prospered controlling Black Sea–Mediterranean access. Paid tribute to Persia and Macedonia.' },
        { period: 'Byzantine Empire (330–1453 CE)', content: 'Center of Eastern Christendom; largest European city for centuries.' },
        { period: 'Ottoman Empire (1453–1922)', content: 'Mehmed II ended Byzantine rule. Capital of an empire across three continents.' },
        { period: 'Modern Turkey (1923–Present)', content: 'Capital moved to Ankara 1923; Istanbul officially named 1930. Cultural and economic hub.' }
      ],
      relatedTopics: [
        { label: 'Byzantine Empire', tag: 'Historical Empire', slug: 'byzantine-empire' },
        { label: 'Ottoman Empire',  tag: 'Historical Empire', slug: 'ottoman-empire' },
        { label: 'Bosphorus',       tag: 'Geographic Strait', slug: 'bosphorus' }
      ],
      quickFacts: [
        { label: 'Area', value: '5,461 km²' }, { label: 'Strait', value: 'Bosphorus' },
        { label: 'Continent', value: 'Europe & Asia' }, { label: 'Time Zone', value: 'TRT (UTC+3)' },
        { label: 'UNESCO Site', value: 'Historic Areas of Istanbul' }
      ]
    },
    comments: [
      { author: 'Marco Rossi', avatar: 'MR', text: 'Byzantine to Ottoman is one of history\'s most dramatic name changes!', rating: 5, likes: 31 }
    ]
  },
  {
    query: 'sri lanka', slug: 'sri-lanka', category: 'Cities & Countries', searchCount: 290, featured: true,
    topicData: {
      title: 'Sri Lanka', subtitle: 'Country · South Asia',
      image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=70',
      type: 'Country', country: 'Sri Lanka', state: '',
      founded: 'Inhabited since 125,000 BCE', population: '22 million',
      coordinates: '7.8731° N, 80.7718° E', languages: ['Sinhala', 'Tamil', 'English'],
      summary: 'Sri Lanka is an island nation in South Asia with one of the most complex naming histories, having been known by different names to different civilisations over thousands of years.',
      aiInsight: "Sri Lanka's journey encapsulates the full arc of Asian colonial history — from ancient Greek 'Taprobane' to Arabic 'Serendib' (giving us 'serendipity'), through European 'Ceylon', to the 1972 republican restoration.",
      nameChanges: [
        { name: 'Lanka / Heladiva', period: 'Ancient', era: 'Ancient', language: 'Sanskrit/Sinhala', meaning: 'Resplendent island', context: 'Referenced in the Ramayana epic.', color: '#7c3aed', source: 'Sanskrit Epics', current: false },
        { name: 'Tambapanni',       period: '543 BCE', era: 'Ancient', language: 'Pali', meaning: 'Copper-coloured palms', context: 'Name used by Prince Vijaya; reddish soil.', color: '#0891b2', source: 'Mahavamsa', current: false },
        { name: 'Serendib',         period: '600–1500 CE', era: 'Arab Trade Era', language: 'Arabic/Persian', meaning: 'From Sanskrit Simhaladvipa', context: 'Used by Arab traders; origin of the word serendipity.', color: '#059669', source: 'Arab Trading Records', current: false },
        { name: 'Ceylon',           period: '1505–1972', era: 'Colonial', language: 'Portuguese/Dutch/English', meaning: 'European corruption of Sinhala', context: 'Through Portuguese, Dutch, and British rule.', color: '#d97706', source: 'Colonial Administrative Records', current: false },
        { name: 'Sri Lanka',        period: '1972 – Present', era: 'Post-Independence', language: 'Sinhala', meaning: 'Resplendent Island', context: 'Republic declared 22 May 1972; colonial name abandoned.', color: '#16a34a', source: 'Constitution of Sri Lanka, 1972', current: true }
      ],
      historicalContext: [
        { period: 'Ancient Period', content: 'Important maritime trade stop between East and West for millennia.' },
        { period: 'Classical Period (247 BCE–1200 CE)', content: 'Buddhism introduced 247 BCE; became centre of Theravada Buddhism.' },
        { period: 'Colonial Era (1505–1948)', content: 'Controlled successively by Portugal, Netherlands, and Britain; major tea producer.' },
        { period: 'Independence (1948–Present)', content: 'Independent as Ceylon 1948; republic as Sri Lanka 1972.' }
      ],
      relatedTopics: [
        { label: 'India',        tag: 'Country · South Asia',  slug: 'india' },
        { label: 'British Ceylon', tag: 'Colonial History',    slug: 'british-ceylon' },
        { label: 'Serendipity',  tag: 'Etymology · English',   slug: 'serendipity' }
      ],
      quickFacts: [
        { label: 'Area', value: '65,610 km²' }, { label: 'Capital', value: 'Sri Jayawardenepura Kotte' },
        { label: 'Largest City', value: 'Colombo' }, { label: 'Independence', value: '4 Feb 1948' },
        { label: 'Republic', value: '22 May 1972' }
      ]
    },
    comments: []
  },
  {
    query: 'mumbai', slug: 'mumbai', category: 'Cities & Countries', searchCount: 260, featured: false,
    topicData: {
      title: 'Mumbai', subtitle: 'City · Maharashtra, India',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=70',
      type: 'City', country: 'India', state: 'Maharashtra',
      founded: '1507 (Portuguese era)', population: '12.5 million (city proper)',
      coordinates: '19.0760° N, 72.8777° E', languages: ['Marathi', 'Hindi', 'English', 'Gujarati'],
      summary: "Mumbai, India's financial capital, was Bombay under British rule for 350+ years before reverting to its original Marathi name in 1995. 'Mumbai' derives from Mumbadevi, a local goddess.",
      aiInsight: "Bombay's 1995 renaming by the Shiv Sena party makes it unique among Indian city renames — it is rooted in religious reverence for Mumbadevi rather than simple colonial reversal.",
      nameChanges: [
        { name: 'Kakamuchee / Galajunkja', period: 'Pre-1500s', era: 'Ancient/Medieval', language: 'Koli/Marathi', meaning: 'Koli fishing community names', context: 'Original Koli names for the seven islands.', color: '#7c3aed', source: 'Oral tradition', current: false },
        { name: 'Bombaim', period: '1507–1661', era: 'Portuguese Colonial', language: 'Portuguese', meaning: 'Good Bay', context: 'Portuguese captivated by the natural harbour.', color: '#0891b2', source: 'Portuguese Colonial Records', current: false },
        { name: 'Bombay', period: '1661–1995', era: 'British Colonial', language: 'English', meaning: "Anglicisation of Bombaim", context: "Part of dowry when Portugal's Catherine of Braganza married King Charles II.", color: '#d97706', source: 'Treaty of Marriage, 1661', current: false },
        { name: 'Mumbai', period: '1995 – Present', era: 'Post-Independence', language: 'Marathi', meaning: 'From Mumbadevi (goddess) + aai (mother)', context: 'Renamed by Maharashtra government, advocated by Shiv Sena.', color: '#16a34a', source: 'Maharashtra Government Order, 1995', current: true }
      ],
      historicalContext: [
        { period: 'Indigenous Period (Pre-1500s)', content: 'Seven islands home to Koli communities; Mumbadevi temple central to their worship.' },
        { period: 'Portuguese Era (1507–1661)', content: 'Transformed into a trading post with fortifications.' },
        { period: 'British Era (1661–1947)', content: "Premier port city, financial hub, and crucible of India's independence movement." },
        { period: 'Post-Independence (1947–Present)', content: "Capital of Maharashtra 1960; India's commercial capital and Bollywood home." }
      ],
      relatedTopics: [
        { label: 'Pune',                   tag: 'City · Maharashtra',   slug: 'pune' },
        { label: 'Bombay Stock Exchange',  tag: 'Institution',          slug: 'bombay-stock-exchange' },
        { label: 'Bollywood',              tag: 'Culture',              slug: 'bollywood' }
      ],
      quickFacts: [
        { label: 'Area', value: '603.4 km²' }, { label: 'Port', value: 'Mumbai Port' },
        { label: 'Time Zone', value: 'IST (UTC+5:30)' }, { label: 'Landmarks', value: 'Gateway of India, Marine Drive' }
      ]
    },
    comments: []
  },
  {
    query: 'kolkata', slug: 'kolkata', category: 'Cities & Countries', searchCount: 180, featured: false,
    topicData: {
      title: 'Kolkata', subtitle: 'City · West Bengal, India',
      image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=70',
      type: 'City', country: 'India', state: 'West Bengal',
      founded: '1690 (British founding)', population: '4.5 million (city proper)',
      coordinates: '22.5726° N, 88.3639° E', languages: ['Bengali', 'Hindi', 'English'],
      summary: "Kolkata (formerly Calcutta) was British India's capital for ~140 years. Named from the goddess Kali, it remains India's foremost cultural city.",
      aiInsight: "The 2001 Calcutta→Kolkata rename was primarily a spelling correction to match Bengali pronunciation — Kolkata residents had always called it that. It differs from other Indian city renames which were political statements.",
      nameChanges: [
        { name: 'Kalikata',  period: 'Pre-1690', era: 'Ancient/Medieval', language: 'Bengali', meaning: 'From Kali (goddess) + kata (area)', context: 'Original village name.', color: '#7c3aed', source: 'Bengali oral tradition', current: false },
        { name: 'Calcutta',  period: '1690–2001', era: 'British Colonial',  language: 'English', meaning: 'Anglicisation of Kalikata', context: 'Job Charnock established a trading post 1690; capital of British India until 1911.', color: '#d97706', source: 'British East India Company Records', current: false },
        { name: 'Kolkata',   period: '2001 – Present', era: 'Post-Independence', language: 'Bengali', meaning: 'Restores Bengali pronunciation', context: 'West Bengal government renamed it 1 January 2001.', color: '#16a34a', source: 'West Bengal Government Order, 2001', current: true }
      ],
      historicalContext: [
        { period: 'Pre-British Era', content: 'Three villages — Sutanuti, Gobindapur, Kalikata — minor settlements.' },
        { period: 'Capital of British India (1772–1911)', content: 'Seat of East India Company and later the British Raj.' },
        { period: 'Cultural Renaissance (1800s)', content: 'Centre of the Bengal Renaissance; produced Rabindranath Tagore.' },
        { period: 'Post-Independence (1947–Present)', content: "Cultural capital; 2001 spelling corrected to Kolkata." }
      ],
      relatedTopics: [
        { label: 'West Bengal',         tag: 'State · India',       slug: 'west-bengal' },
        { label: 'Rabindranath Tagore', tag: 'Historical Figure',   slug: 'rabindranath-tagore' },
        { label: 'Howrah Bridge',       tag: 'Landmark',            slug: 'howrah-bridge' }
      ],
      quickFacts: [
        { label: 'Area', value: '185 km²' }, { label: 'River', value: 'Hooghly (Ganges tributary)' },
        { label: 'Time Zone', value: 'IST (UTC+5:30)' }, { label: 'Famous For', value: 'Durga Puja, Literature, Fish Curry' }
      ]
    },
    comments: []
  },
  {
    query: 'beijing', slug: 'beijing', category: 'Cities & Countries', searchCount: 220, featured: false,
    topicData: {
      title: 'Beijing', subtitle: 'City · Capital of China',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=70',
      type: 'City', country: 'China', state: 'Beijing Municipality',
      founded: '1045 BCE (as Ji)', population: '21.9 million',
      coordinates: '39.9042° N, 116.4074° E', languages: ['Mandarin Chinese'],
      summary: "Beijing, China's capital, has 8 documented names spanning 3,000+ years across multiple dynasties — one of the longest naming histories of any city in the world.",
      aiInsight: "Beijing's name changes directly map to dynastic power shifts — each conquering dynasty renamed the capital to assert legitimacy. The Western 'Peking' was based on an older pronunciation; 'Beijing' replaced it internationally in the 1980s with Pinyin standardisation.",
      nameChanges: [
        { name: 'Ji',          period: '1045–221 BCE',    era: 'Zhou Dynasty',   language: 'Classical Chinese', meaning: 'Ji state capital',    context: 'Capital of the state of Ji.',                             color: '#7c3aed', source: 'Zhou Dynasty Records',  current: false },
        { name: 'Yanjing',     period: '221 BCE–936 CE',  era: 'Various',        language: 'Chinese',           meaning: 'Yan Capital',         context: 'Named after the ancient Yan kingdom.',                   color: '#4f46e5', source: 'Han Dynasty Records',   current: false },
        { name: 'Zhongdu',     period: '1115–1215',       era: 'Jin Dynasty',    language: 'Chinese',           meaning: 'Central Capital',     context: 'Jin dynasty renamed it.',                                color: '#0891b2', source: 'Jin Dynasty Annals',    current: false },
        { name: 'Khanbaliq / Dadu', period: '1271–1368',  era: 'Yuan (Mongol)',  language: 'Mongolian/Chinese', meaning: "Great Capital / Khan's City", context: "Kublai Khan's capital; Marco Polo knew it as Khanbaliq.", color: '#059669', source: "Marco Polo's Travels", current: false },
        { name: 'Beiping',     period: '1368–1421 & 1928–1949', era: 'Ming/Republic', language: 'Chinese',   meaning: 'Northern Peace',      context: 'Used when not the capital.',                              color: '#d97706', source: 'Ming Dynasty Records',  current: false },
        { name: 'Peking',      period: '1421–1949 (Western)', era: 'Ming/Qing/Republic', language: 'English romanisation', meaning: 'Older romanisation of Northern Capital', context: 'Western maps; still used in Peking University, Peking Duck.', color: '#dc2626', source: 'Western Maps & Records', current: false },
        { name: 'Beijing',     period: '1949 – Present',  era: "People's Republic", language: 'Mandarin (Pinyin)', meaning: 'Northern Capital',  context: "PRC capital 1949; Pinyin romanisation replaced 'Peking' internationally in the 1980s.", color: '#16a34a', source: "People's Republic of China, 1949", current: true }
      ],
      historicalContext: [
        { period: 'Ancient (1045–221 BCE)', content: 'Capital of Ji and Yan kingdoms under Zhou dynasty.' },
        { period: 'Mongol Capital (1271–1368)', content: "Kublai Khan's Khanbaliq — centre of the largest contiguous empire in history." },
        { period: 'Ming & Qing (1368–1912)', content: 'Forbidden City built 1420; undisputed cultural and political capital of China.' },
        { period: "People's Republic (1949–Present)", content: "Mao proclaimed PRC from Tiananmen 1949. Hosted 2008 Summer & 2022 Winter Olympics." }
      ],
      relatedTopics: [
        { label: 'Forbidden City',       tag: 'Landmark · Beijing', slug: 'forbidden-city' },
        { label: 'Great Wall of China',  tag: 'Landmark',           slug: 'great-wall' },
        { label: 'Peking Duck',          tag: 'Food',               slug: 'peking-duck' }
      ],
      quickFacts: [
        { label: 'Area', value: '16,410 km²' }, { label: 'Name changes', value: '8 documented' },
        { label: 'History', value: '3,000+ years' }, { label: 'Time Zone', value: 'CST (UTC+8)' },
        { label: 'Olympics', value: '2008 Summer & 2022 Winter' }
      ]
    },
    comments: []
  },
  {
    query: 'pizza', slug: 'pizza', category: 'Food & Cuisine', searchCount: 0, featured: true,
    topicData: {
      title: 'Pizza', subtitle: 'Food · Italy & Global',
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=70',
      type: 'Food', country: 'Italy', state: 'Campania',
      founded: '1889 (modern era)', population: 'N/A',
      coordinates: '40.8518° N, 14.2681° E (Naples origin)', languages: ['Italian'],
      summary: 'Pizza is a globally iconic Italian dish with a surprisingly complex naming history. From ancient flatbreads to Neapolitan delicacy to worldwide phenomenon, the word "pizza" has evolved across Arabic, Lombard, and Italian languages over centuries.',
      aiInsight: "The word 'pizza' likely derives from Langobardic 'pinsere' (to stretch/flatten dough) or Arabic 'pizza' (type of pastry). Naples transformed regional differences into a culinary icon, standardising and formalising pizza-making traditions by the 18th century.",
      nameChanges: [
        { name: 'Pinsere', period: '1000–1500 CE', era: 'Medieval', language: 'Langobardic/Lombard', meaning: 'To stretch or flatten', context: 'Germanic Lombard cooking traditions influenced Northern Italy. Flatbreads were common across Mediterranean.', color: '#7c3aed', source: 'Medieval Italian Food Records', current: false },
        { name: 'Focaccia/Pinza', period: '1400–1700 CE', era: 'Renaissance & Early Modern', language: 'Venetian/Genoese', meaning: 'Flatbread with toppings', context: 'Various regional names for seasoned flatbreads existed across Italian city-states. Andalusian cuisine also had "pizza" as pastry.', color: '#4f46e5', source: 'Renaissance Merchant Records', current: false },
        { name: 'Pizza', period: '1700–1800', era: 'Modern (Pre-standardisation)', language: 'Italian (Neapolitan)', meaning: 'Unclear origin; possibly from pinsere or Arabic pizza', context: 'Naples formalized pizza-making during Spanish Bourbon rule. Street food for poor population.', color: '#0891b2', source: 'Neapolitan Food Chronicles', current: false },
        { name: 'Pizza Napoletana', period: '1800–1889', era: 'Modern (Standardisation)', language: 'Italian', meaning: 'Neapolitan Pizza', context: '1830s-1880s: Naples developed three classic types (margherita, marinara, quattro formaggi).', color: '#059669', source: 'Neapolitan Culinary Guilds', current: false },
        { name: 'Pizza Margherita', period: '1889 – Present', era: 'Modern (Royal Era)', language: 'Italian', meaning: 'Pizza of Margherita (Queen of Italy)', context: "Created 1889 for Queen Margherita of Savoy's visit to Naples. Patriotic colors: red (tomato), white (mozzarella), green (basil).", color: '#d97706', source: 'Royal Palace Records, Naples 1889', current: false },
        { name: 'Pizza', period: '1900 – Present', era: 'Global', language: 'Italian (International)', meaning: 'Standardised Italian flatbread with cheese and toppings', context: "Italian immigration to US (1900s-1930s) globalised pizza. Americanized pizzerias transformed tradition.;becomes worldwide symbol of Italian cuisine.", color: '#16a34a', source: 'Immigration Records & Food History', current: true }
      ],
      historicalContext: [
        { period: 'Medieval Mediterranean (500–1500 CE)', content: 'Flatbreads with toppings existed across Mediterranean. Arabic influence brought "pitza" (pastry). Langobard influence: "pinsere" (to stretch dough). Multiple regional traditions developed in Southern Italy.' },
        { period: 'Neapolitan Formalisation (1600–1789)', content: 'Naples during Spanish Bourbon rule saw pizza emerge as street food for lower classes. The poor used leftover ingredients; it was not served in restaurants. Tomatoes (New World crop) gradually added to flatbread.' },
        { period: 'Royal Legitimation (1800–1889)', content: 'As tomatoes became accepted among nobles, pizza rose in status. 1889: Queen Margherita of Savoy visited Naples. According to legend, she was served three pizzas; the margherita (red, white, green) became royal favorite. This single event made pizza respectable.' },
        { period: 'Mass Immigration Era (1900–1950)', content: 'Italian immigrants brought pizza to New York, Chicago, Boston. Initially ethnic neighbourhoods; post-WWII American soldiers returning from Italy popularised it. By 1950s, pizza chains and industrial pizzerias transformed Italian tradition into American commodity.' },
        { period: 'Global Dominance (1950 – Present)', content: 'Pizza became universal comfort food and fastest-growing segment of restaurant industry. Globalised with local adaptations: Brazilian pizza with green peas, Indian paneer pizza, Japanese okonomiyaki-pizza fusion. Annual 3+ billion pizzas consumed worldwide.' }
      ],
      relatedTopics: [
        { label: 'Naples', tag: 'City · Italy', slug: 'naples' },
        { label: 'Tomato', tag: 'Ingredient', slug: 'tomato' },
        { label: 'Mozzarella', tag: 'Cheese', slug: 'mozzarella' },
        { label: 'Italian Cuisine', tag: 'Culinary Tradition', slug: 'italian-cuisine' }
      ],
      quickFacts: [
        { label: 'Origin', value: 'Naples, Italy (18th century)' },
        { label: 'Word Origin', value: 'Possibly Langobardic "pinsere" or Arabic' },
        { label: 'Standardisation', value: '1889 (Pizza Margherita for Queen)' },
        { label: 'Global Boom', value: '1950s–Present' },
        { label: 'Annual Consumption', value: '3+ billion pizzas worldwide' },
        { label: 'UNESCO Recognition', value: 'Traditional Neapolitan pizza-making art (2017)' }
      ]
    },
    comments: [
      { author: 'Chef Isabella Rossi', avatar: 'IR', text: 'Fascinating history! Most people don\'t realise pizza is only ~150 years old in its modern form.', rating: 5, likes: 22 },
      { author: 'Marco De Luca', avatar: 'MD', text: 'The 1889 Margherita story is more complex than this, but the symbolism is spot-on!', rating: 4, likes: 15 }
    ]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowsphere');
  console.log('✅  Connected');
  await Topic.deleteMany({});
  console.log('🗑️   Cleared');
  const docs = await Topic.insertMany(TOPICS);
  docs.forEach(d => console.log(`   ✔ ${d.topicData.title}`));
  await mongoose.disconnect();
  console.log('🎉  Done');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
