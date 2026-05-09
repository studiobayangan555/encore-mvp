-- ============================================================
-- ENCORE MVP — SEED DATA
-- Run in Supabase SQL Editor after schema.sql
-- ============================================================

-- ─── SHOWS ──────────────────────────────────────────────────
insert into public.shows (
  id, artist, venue, city, country, date, date_display,
  price, genre, type, promoter, promoter_slug, description,
  venue_address, venue_maps_url, venue_transport,
  ticket_url, is_published, review_count, going_count,
  comment_count, avg_rating
) values

('11111111-0000-0000-0000-000000000001',
 'The Weeknd', 'Axiata Arena', 'Kuala Lumpur', 'MY',
 '2026-06-14', 'Sat 14 Jun 2026',
 'From RM388', 'R&B / Soul', 'concert',
 'Live Nation Malaysia', 'live-nation-malaysia',
 'The Weeknd brings his After Hours Til Dawn Tour to Kuala Lumpur for one night only. Expect a career-spanning setlist, cinematic production, and an arena-wide moment you won''t forget.',
 'Axiata Arena, Bukit Jalil, 57000 Kuala Lumpur',
 'https://maps.google.com/?q=Axiata+Arena+Kuala+Lumpur',
 'LRT Bukit Jalil — 5 min walk. Free parking available on-site.',
 'https://livenation.my', true, 47, 234, 12, 4.80),

('11111111-0000-0000-0000-000000000002',
 'NIKI', 'Zepp KL', 'Kuala Lumpur', 'MY',
 '2026-03-21', 'Fri 21 Mar 2026',
 'From RM188', 'Pop', 'concert',
 'Livescape Asia', 'livescape-asia',
 'NIKI returns to KL on her Nicole World Tour. An intimate evening of lush pop and honest songwriting from one of SEA''s finest exports.',
 'Zepp KL, Lot 10, 50200 Kuala Lumpur',
 'https://maps.google.com/?q=Zepp+KL',
 'Monorail Imbi or Bukit Bintang — 3 min walk.',
 'https://livescape.asia', true, 63, 189, 15, 4.90),

('11111111-0000-0000-0000-000000000003',
 'Good Vibes Festival', 'Genting Highlands', 'Pahang', 'MY',
 '2026-08-08', 'Sat–Sun 8–9 Aug 2026',
 'From RM298', 'Indie / Alt', 'festival',
 'Livescape Asia', 'livescape-asia',
 'Malaysia''s most beloved outdoor music festival returns to Genting Highlands with a stacked two-day lineup spanning indie, electronic, and pop across multiple stages.',
 'Resorts World Genting, 69000 Genting Highlands',
 'https://maps.google.com/?q=Resorts+World+Genting',
 'Genting Highlands Premium Outlets bus from KL Sentral. Cable car from Gohtong Jaya.',
 'https://goodvibesfestival.my', true, 312, 1240, 38, 4.50),

('11111111-0000-0000-0000-000000000004',
 'YOASOBI', 'Singapore Indoor Stadium', 'Singapore', 'SG',
 '2026-04-02', 'Thu 2 Apr 2026',
 'From SGD 98', 'J-pop', 'concert',
 'LAMC Productions', 'lamc-productions',
 'Japanese duo YOASOBI make their Singapore debut, bringing the anthemic energy of Idol, Racing Into The Night, and their full catalog to the Indoor Stadium.',
 '2 Stadium Walk, Singapore 397691',
 'https://maps.google.com/?q=Singapore+Indoor+Stadium',
 'Stadium MRT — 5 min walk.',
 'https://lamcproductions.com', true, 89, 456, 21, 4.70),

('11111111-0000-0000-0000-000000000005',
 'Billie Eilish', 'Axiata Arena', 'Kuala Lumpur', 'MY',
 '2026-07-10', '3 Nights, 10–12 Jul 2026',
 'From RM488', 'Pop', 'multi-night',
 'Live Nation Malaysia', 'live-nation-malaysia',
 'Billie Eilish brings Hit Me Hard and Soft to Kuala Lumpur for three consecutive nights. The most intimate large-scale production of her career.',
 'Axiata Arena, Bukit Jalil, 57000 Kuala Lumpur',
 'https://maps.google.com/?q=Axiata+Arena+Kuala+Lumpur',
 'LRT Bukit Jalil — 5 min walk.',
 'https://livenation.my', true, 0, 892, 24, 0.00),

('11111111-0000-0000-0000-000000000006',
 'BamBam', 'Impact Arena', 'Bangkok', 'TH',
 '2026-05-22', 'Fri 22 May 2026',
 'From THB 1,500', 'K-pop / J-pop', 'concert',
 'YG Entertainment', 'yg-entertainment',
 'GOT7''s BamBam brings his solo world tour to Bangkok for a homecoming night.',
 'Impact Arena, Muang Thong Thani, Nonthaburi',
 'https://maps.google.com/?q=Impact+Arena+Bangkok',
 'BTS Mo Chit — shuttle bus available.',
 'https://ygfamily.com', true, 0, 312, 9, 0.00),

('11111111-0000-0000-0000-000000000007',
 'Yuna', 'Merdekarya', 'Kuala Lumpur', 'MY',
 '2026-05-29', 'Fri 29 May 2026',
 'From RM60', 'Indie / Alt', 'gig',
 'Merdekarya', 'merdekarya',
 'An intimate evening with Yuna at KL''s beloved listening room. Acoustic set, new songs, and old favourites.',
 'Merdekarya, Bangsar South, 59200 Kuala Lumpur',
 'https://maps.google.com/?q=Merdekarya+Kuala+Lumpur',
 'Kerinchi LRT — 10 min walk. Limited parking on-site.',
 'https://merdekarya.com', true, 0, 78, 5, 0.00),

('11111111-0000-0000-0000-000000000008',
 'Pamungkas', 'Jakarta International Stadium', 'Jakarta', 'ID',
 '2026-04-18', 'Sat 18 Apr 2026',
 'From IDR 350,000', 'Pop', 'concert',
 'Ismaya Live', 'ismaya-live',
 'Pamungkas plays his largest headline show to date at JIS, with a full band production and orchestra.',
 'Jakarta International Stadium, Papanggo, Jakarta Utara',
 'https://maps.google.com/?q=Jakarta+International+Stadium',
 'KRL Commuter Line to Tanjung Priok. Grab recommended.',
 'https://ismaya.com', true, 201, 560, 33, 4.60),

('11111111-0000-0000-0000-000000000009',
 'Ben&Ben', 'MOA Arena', 'Manila', 'PH',
 '2026-09-05', 'Sat 5 Sep 2026',
 'From PHP 1,200', 'Indie / Alt', 'concert',
 'MMI Live', 'mmi-live',
 'Ben&Ben celebrate a decade of music with a landmark show at the Mall of Asia Arena.',
 'Mall of Asia Arena, Pasay City, Metro Manila',
 'https://maps.google.com/?q=MOA+Arena+Manila',
 'Taft Avenue MRT — 15 min ride. Extensive parking on-site.',
 'https://mmilive.com', true, 0, 423, 16, 0.00)

on conflict (id) do update set
  review_count = excluded.review_count,
  going_count = excluded.going_count,
  avg_rating = excluded.avg_rating,
  is_published = excluded.is_published;

-- ─── BLOG POSTS ─────────────────────────────────────────────
insert into public.blog_posts (
  id, slug, title, category, author, deck, body, read_time, likes, is_published, published_at
) values

('22222222-0000-0000-0000-000000000001',
 'weeknd-kl-review',
 'The Weeknd in KL was everything the hype promised and then some',
 'Reviews', 'Amirah Lee', '6 min read',
 'He walked out to a roar that shook the floor. Three hours later, nobody wanted to leave.

The production was unlike anything I''ve seen at Axiata Arena — massive LED panels that felt more like a cinema than a concert. Every transition was deliberate. Every song landed.

The setlist hit every era. Blinding Lights closed the main set to a crowd that sang every word back. The encore felt earned rather than obligatory.

If you missed it, I''m sorry. If you have tickets for the remaining dates — don''t be late.',
 '6 min read', 189, true, '2026-06-15 10:00:00+00'),

('22222222-0000-0000-0000-000000000002',
 'inside-kl-festival-circuit',
 'Inside the KL festival circuit — a guide for first-timers',
 'Guides', 'Tom Kha', '8 min read',
 'First time at a KL festival? Here''s what nobody tells you.

The weather is the first thing. Even in the highlands, check the forecast. Waterproof shoes are not optional at Good Vibes.

Second: food. Venue food is expensive and the queues are long. Eat before you go, and carry water. Most venues allow sealed bottles.

Third: transport. Grab surge pricing after 11pm is brutal. Book ahead, share rides, or stay nearby.

The shows themselves are worth it. KL punches above its weight — the lineups we get rival Singapore and Bangkok, at better prices.',
 '8 min read', 156, true, '2026-07-01 10:00:00+00'),

('22222222-0000-0000-0000-000000000003',
 'yoasobi-singapore-debut',
 'Why YOASOBI''s Singapore debut was the show of the year',
 'Reviews', 'Priya Nair', '5 min read',
 'Nobody expected them to open with Idol. The Indoor Stadium had not finished settling when the first notes hit.

YOASOBI''s live setup is deceptively simple — two people, a band, and an enormous amount of precision. Ikura''s voice is extraordinary in person. The harmonics in Racing Into The Night felt physical.

The crowd was the most bilingual I have ever experienced at a Singapore show. Japanese, Mandarin, and English, all singing the same words.

If they come back — and they will — buy tickets on day one.',
 '5 min read', 98, true, '2026-04-03 10:00:00+00')

on conflict (id) do nothing;
