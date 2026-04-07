-- ============================================================
-- Real Estate AI Assistant (REAA) — Sample Seed Data
-- seed.sql
--
-- Run this AFTER running 001_initial_schema.sql.
-- Replace the UUIDs below with real Supabase auth.users IDs
-- for your demo/test accounts.
--
-- USAGE:
--   1. Sign up a test user in Supabase auth
--   2. Copy their UUID from the Supabase dashboard
--   3. Replace DEMO_AGENT_UUID below
--   4. Run this file in the Supabase SQL editor
-- ============================================================

-- ============================================================
-- DEMO AGENT UUID — REPLACE THIS WITH YOUR REAL AUTH USER ID
-- ============================================================
DO $$
DECLARE
  demo_agent_id UUID := 'a0000000-0000-0000-0000-000000000001';  -- REPLACE THIS
  lead1 UUID := uuid_generate_v4();
  lead2 UUID := uuid_generate_v4();
  lead3 UUID := uuid_generate_v4();
  lead4 UUID := uuid_generate_v4();
  lead5 UUID := uuid_generate_v4();
  lead6 UUID := uuid_generate_v4();
  lead7 UUID := uuid_generate_v4();
  lead8 UUID := uuid_generate_v4();
  call1 UUID := uuid_generate_v4();
  call2 UUID := uuid_generate_v4();
BEGIN

-- -------------------------------------------------------
-- AGENT PROFILE
-- -------------------------------------------------------
INSERT INTO agent_profiles (agent_id, full_name, brokerage, email, phone, bio, service_areas, escalation_contact)
VALUES (
  demo_agent_id,
  'Alex Johnson',
  'Premier Realty Group',
  'alex@premierrealty.com',
  '(555) 867-5309',
  'Experienced real estate agent with 10+ years helping buyers and sellers in the greater metro area. Top 1% producer, specializing in residential and investment properties.',
  'Downtown, Midtown, Eastside, Westside',
  'manager@premierrealty.com'
)
ON CONFLICT (agent_id) DO NOTHING;

-- -------------------------------------------------------
-- ONBOARDING PROGRESS (step 3 of 7, steps 1-2 complete)
-- -------------------------------------------------------
INSERT INTO onboarding_progress (agent_id, current_step, completed_steps, is_complete)
VALUES (demo_agent_id, 3, '[1, 2]', false)
ON CONFLICT (agent_id) DO NOTHING;

-- -------------------------------------------------------
-- BUSINESS SETTINGS
-- -------------------------------------------------------
INSERT INTO business_settings (
  agent_id, appointment_types, appointment_duration, booking_buffer,
  office_hours, lead_routing_prefs, handoff_rules, transfer_instructions, business_notes
)
VALUES (
  demo_agent_id,
  'Buyer Consultation,Listing Appointment,Property Showing,Follow-up Call,Investment Review',
  60,
  15,
  'Mon-Fri 9am-6pm, Sat 10am-4pm, Sun by appointment',
  'immediate',
  'Escalate to human agent if: caller requests to speak with someone, asks legal questions, is ready to make an offer, or expresses frustration.',
  'Transfer to main office at (555) 867-5300 during business hours. After hours: take a message and promise a next-business-day callback.',
  'Specializing in residential real estate. Focus on first-time homebuyers and move-up buyers. Average days on market: 12. Average sale-to-list ratio: 103%.'
)
ON CONFLICT (agent_id) DO NOTHING;

-- -------------------------------------------------------
-- VOICE SETTINGS
-- -------------------------------------------------------
INSERT INTO voice_settings (
  agent_id, selected_voice, greeting, personality,
  allowed_actions, escalation_behavior, is_active
)
VALUES (
  demo_agent_id,
  'nova',
  'Hi, you''ve reached the office of Alex Johnson with Premier Realty Group. How can I help you today?',
  'professional, warm, knowledgeable, concise',
  'Answer questions about listings,Schedule appointments,Collect contact information,Provide neighborhood information,Check calendar availability',
  'Transfer to agent for: making or receiving offers, legal questions, contract review, client requests human assistance, emotional or distressed callers.',
  false
)
ON CONFLICT (agent_id) DO NOTHING;

-- -------------------------------------------------------
-- LEADS
-- -------------------------------------------------------
INSERT INTO leads (id, agent_id, name, phone, email, source, status, intent, notes, created_at, updated_at)
VALUES
  (lead1, demo_agent_id, 'Sarah Mitchell', '(415) 555-0201', 'sarah.mitchell@email.com', 'phone_call', 'new', 'buy',
   'Looking for 3BR in Eastside under $850K. Pre-approved. Has two school-age kids, school districts are priority.',
   NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

  (lead2, demo_agent_id, 'Marcus Thompson', '(415) 555-0202', 'marcus.t@email.com', 'phone_call', 'contacted', 'sell',
   'Wants to list 2BR downtown condo. Needs CMA. Divorce situation — handle with sensitivity.',
   NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

  (lead3, demo_agent_id, 'Jennifer Park', '(415) 555-0203', 'jpark@email.com', 'website', 'qualified', 'buy',
   'Relocating from NYC. Budget $1.2M. Wants Westside or Midtown. Dual income household. Very motivated.',
   NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

  (lead4, demo_agent_id, 'Robert Chen', '(415) 555-0204', 'rchen@email.com', 'referral', 'qualified', 'invest',
   'Looking for multi-unit investment property. Wants min 6% cap rate. Has $500K cash to deploy.',
   NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

  (lead5, demo_agent_id, 'Amanda Torres', '(415) 555-0205', 'atorres@email.com', 'phone_call', 'converted', 'buy',
   'Purchased 4BR in Westside. Closed successfully at $1.15M. Excellent client — ask for referral.',
   NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days'),

  (lead6, demo_agent_id, 'David Kim', '(415) 555-0206', 'dkim@email.com', 'website', 'new', 'buy',
   'First-time buyer looking for condo under $600K. Will need mortgage broker referral.',
   NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),

  (lead7, demo_agent_id, 'Lisa Wang', '(415) 555-0207', 'lwang@email.com', 'phone_call', 'contacted', 'sell',
   'Selling family home (4BR). Estate sale situation — deceased parent. Patient, not in a rush.',
   NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

  (lead8, demo_agent_id, 'James Wilson', '(415) 555-0208', 'jwilson@email.com', 'referral', 'unqualified', 'buy',
   'Interested but not financially ready. Credit issues. Follow up in 6 months.',
   NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

-- -------------------------------------------------------
-- CALLS
-- -------------------------------------------------------
INSERT INTO calls (id, agent_id, caller_name, caller_phone, duration, outcome, summary, transcript, extracted_lead_id, called_at)
VALUES
  (call1, demo_agent_id, 'Sarah Mitchell', '(415) 555-0201', 342, 'answered',
   'Caller inquired about 3-bedroom homes in the Eastside neighborhood. Pre-approved up to $850,000. Two school-age children — school district is top priority. Interested in scheduling a property tour this weekend. Lead info collected and appointment offered.',
   E'[AI]: Hi, you''ve reached the office of Alex Johnson with Premier Realty Group. How can I help you today?\n[Caller]: Hi, I''m looking for a 3-bedroom home in the Eastside area for my family.\n[AI]: That''s great! We have some wonderful options in Eastside. What''s your approximate budget range?\n[Caller]: We''re pre-approved up to $850,000. We really need to be near a good elementary school.\n[AI]: Eastside has excellent schools — Maple Elementary and Riverside K-8 are both highly rated. Are you available this weekend for a showing?\n[Caller]: Saturday afternoon works perfectly.\n[AI]: Perfect! I''ll have Alex''s assistant confirm a time with you. Can I get your email to send over some listings?\n[Caller]: Sure, it''s sarah.mitchell@email.com.',
   lead1,
   NOW() - INTERVAL '1 day'),

  (call2, demo_agent_id, 'Marcus Thompson', '(415) 555-0202', 198, 'answered',
   'Seller called about listing their downtown 2BR condo. Requesting a comparative market analysis. Appointment scheduled for Thursday at 2pm for listing presentation.',
   E'[AI]: Thank you for calling Premier Realty Group. How can I assist you?\n[Caller]: Hi, I want to sell my condo in downtown.\n[AI]: I''d be happy to help. Can I get the address and a bit more about the property?\n[Caller]: It''s on Pine Street, 2 bedrooms, 2 baths, about 1,100 square feet.\n[AI]: That''s a great area. Alex would love to come by and do a full market analysis. Would Thursday work?\n[Caller]: Thursday at 2pm is fine.\n[AI]: Confirmed! I''ll have Alex reach out to confirm. Your name and best number?',
   lead2,
   NOW() - INTERVAL '2 days'),

  (uuid_generate_v4(), demo_agent_id, NULL, '(415) 555-9999', NULL, 'missed',
   NULL, NULL, NULL,
   NOW() - INTERVAL '2 days'),

  (uuid_generate_v4(), demo_agent_id, 'Jennifer Park', '(415) 555-0203', 567, 'answered',
   'Relocation buyer from NYC. Budget $1.2M. Focused on Westside for school districts. Dual income, very motivated. Requested virtual tour for next week.',
   E'[AI]: Hello, Premier Realty Group.\n[Caller]: Hi, we''re moving from New York and need to find a home quickly.\n[AI]: Welcome! We help a lot of relocating families. What''s your timeframe and budget?\n[Caller]: We need to be in by September. Budget up to $1.2 million.\n[AI]: Excellent — that opens up some beautiful options in Westside and Midtown. Would a virtual tour work for your schedule?',
   lead3,
   NOW() - INTERVAL '4 days'),

  (uuid_generate_v4(), demo_agent_id, 'David Kim', '(415) 555-0206', 234, 'answered',
   'First-time buyer, condo under $600K, good walkability needed. Will need a mortgage broker referral.',
   E'[AI]: Hi, Premier Realty Group. How can I help?\n[Caller]: I''m looking to buy my first home. A condo, under $600,000.\n[AI]: That''s exciting! Any neighborhood preferences, or features that are must-haves?\n[Caller]: Somewhere walkable. I don''t have a car.\n[AI]: Downtown and Midtown are very walkable with excellent transit. Can I get your contact info to send over some listings?',
   lead6,
   NOW() - INTERVAL '6 hours'),

  (uuid_generate_v4(), demo_agent_id, NULL, '(510) 555-1234', 45, 'voicemail',
   NULL, NULL, NULL,
   NOW() - INTERVAL '8 hours');

-- -------------------------------------------------------
-- APPOINTMENTS
-- -------------------------------------------------------
INSERT INTO appointments (agent_id, lead_id, lead_name, type, scheduled_at, status, source, notes, calendar_synced)
VALUES
  (demo_agent_id, lead3, 'Jennifer Park', 'Virtual Property Tour',
   NOW() + INTERVAL '2 days', 'upcoming', 'phone_call',
   'Video call showing of 3 Westside properties. Send Zoom link 1 hour before. School district info is priority.', false),

  (demo_agent_id, lead2, 'Marcus Thompson', 'Listing Appointment',
   NOW() + INTERVAL '1 day', 'upcoming', 'phone_call',
   'Full listing presentation. Bring CMA with at least 5 comps. Property: 567 Pine St #4B, Downtown.', false),

  (demo_agent_id, lead1, 'Sarah Mitchell', 'Property Showing',
   NOW() + INTERVAL '3 days', 'upcoming', 'phone_call',
   'Saturday afternoon tour of 3 Eastside properties. All under $850K. Focus on school proximity.', false),

  (demo_agent_id, lead4, 'Robert Chen', 'Investment Consultation',
   NOW() - INTERVAL '1 day', 'completed', 'referral',
   'Discussed multi-unit strategy. Showed 2 candidate properties. Will prepare cap rate analysis.', false),

  (demo_agent_id, lead5, 'Amanda Torres', 'Final Walkthrough',
   NOW() - INTERVAL '3 days', 'completed', 'phone_call',
   'Pre-closing walkthrough at 789 Elm Drive, Westside. Property was in excellent condition. Closed successfully.', false);

-- -------------------------------------------------------
-- LISTINGS
-- -------------------------------------------------------
INSERT INTO listings (agent_id, address, price, beds, baths, sqft, status, notes, source)
VALUES
  (demo_agent_id, '1842 Oak Street, Eastside', 749000, 3, 2.0, 1650, 'active',
   'Updated kitchen with quartz counters, hardwood floors throughout, attached 2-car garage. Walk to Maple Elementary. Seller is motivated.', 'manual'),

  (demo_agent_id, '567 Maple Avenue, Midtown', 995000, 4, 2.5, 2200, 'active',
   'Corner lot with a large backyard and mature trees. Newly renovated master suite with soaking tub. Two blocks from the farmer''s market and top restaurants.', 'manual'),

  (demo_agent_id, '234 Pine Street #4B, Downtown', 585000, 2, 2.0, 1100, 'pending',
   'High-rise condo on the 12th floor with panoramic city views. Full-service building: concierge, gym, rooftop terrace, and valet. Offer accepted — in escrow.', 'manual'),

  (demo_agent_id, '789 Elm Drive, Westside', 1250000, 5, 3.0, 3100, 'active',
   'Premium Westside neighborhood. Large level lot with pool, spa, and 3-car garage. Top-rated school district (9/10). Original owners.', 'manual'),

  (demo_agent_id, '421 Cedar Lane, Eastside', 625000, 3, 1.5, 1450, 'sold',
   'Charming craftsman bungalow. Sold $25K over asking with 6 offers in the first weekend. Excellent comparable for the neighborhood.', 'manual');

-- -------------------------------------------------------
-- FAQS
-- -------------------------------------------------------
INSERT INTO faqs (agent_id, question, answer)
VALUES
  (demo_agent_id,
   'What neighborhoods do you specialize in?',
   'I specialize in Downtown, Midtown, Eastside, and Westside neighborhoods. Each area has its own character — Downtown for the urban lifestyle, Midtown for walkability and dining, Eastside for great schools and family living, and Westside for premium properties and top school districts.'),

  (demo_agent_id,
   'How long does the home buying process take?',
   'Typically 30-60 days from accepted offer to close. This includes the inspection period (7-10 days), appraisal (1-2 weeks), and loan processing (2-3 weeks). I work to make it as smooth and fast as possible with my trusted team of inspectors, lenders, and title officers.'),

  (demo_agent_id,
   'Do you work with first-time home buyers?',
   'Absolutely! I love working with first-time buyers and have helped hundreds get into their first home. I''ll walk you through every step, connect you with excellent lenders (including FHA and down payment assistance programs), and make sure you feel confident throughout.'),

  (demo_agent_id,
   'What is a comparative market analysis (CMA)?',
   'A CMA is a detailed analysis comparing your home to similar recently sold properties in your area. It factors in square footage, condition, location, and features to help determine the right listing price. I provide CMAs at no charge — just give me a call.'),

  (demo_agent_id,
   'How do you handle multiple offer situations?',
   'Multiple offers require strategy and speed. I''ll present each offer with a full analysis, help you understand escalation clauses and contingency trade-offs, and negotiate aggressively on your behalf. As a buyer, I''ll advise you on how to make your offer stand out beyond just price.'),

  (demo_agent_id,
   'What are your office hours?',
   'My office is open Monday through Friday, 9am to 6pm, and Saturday 10am to 4pm. My AI assistant is available 24/7 to answer questions and schedule appointments. For urgent matters outside office hours, leave a message and I''ll return your call the next business morning.');

END;
$$;
