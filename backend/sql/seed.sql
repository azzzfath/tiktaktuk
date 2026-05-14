INSERT INTO role (role_id, role_name)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'administrator'),
  ('11111111-0000-0000-0000-000000000002', 'organizer'),
  ('11111111-0000-0000-0000-000000000003', 'customer')
ON CONFLICT (role_name) DO UPDATE SET role_name = EXCLUDED.role_name;

INSERT INTO user_account (user_id, username, password)
VALUES
  ('22222222-1111-0000-0000-000000000001', 'admin', '$2b$10$HjNhPILKg0M/GWJpOj36n.iPuVJs9/06jG7zYTqpkCPA74VKGm5ea'),
  ('22222222-1111-0000-0000-000000000002', 'organizer', '$2b$10$SPLKjuMk.gXDcXBcWwbri.GnwnV1aVintjNUeb7L0gPPw8h7Ocpfa'),
  ('22222222-1111-0000-0000-000000000003', 'customer', '$2b$10$y3UrKjylGGGbuLSTx.JgOODISIyw3D6erNiXIY3g56ZmDAiehqNM2')
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password;

INSERT INTO account_role (role_id, user_id)
VALUES
  ('11111111-0000-0000-0000-000000000001', '22222222-1111-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000002', '22222222-1111-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000003', '22222222-1111-0000-0000-000000000003')
ON CONFLICT (role_id, user_id) DO NOTHING;

INSERT INTO customer (customer_id, full_name, phone_number, user_id)
VALUES
  ('33333333-1111-0000-0000-000000000001', 'Customer Demo', '081234567890', '22222222-1111-0000-0000-000000000003')
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone_number = EXCLUDED.phone_number;

INSERT INTO organizer (organizer_id, organizer_name, contact_email, user_id)
VALUES
  ('44444444-1111-0000-0000-000000000001', 'Organizer Demo', 'organizer@example.com', '22222222-1111-0000-0000-000000000002')
ON CONFLICT (user_id) DO UPDATE SET
  organizer_name = EXCLUDED.organizer_name,
  contact_email = EXCLUDED.contact_email;

INSERT INTO venue (venue_id, venue_name, capacity, address, city)
VALUES
  ('55555555-1111-0000-0000-000000000001', 'Jakarta Convention Center', 1000, 'Jl. Gatot Subroto No.1', 'Jakarta'),
  ('55555555-1111-0000-0000-000000000002', 'Bandung Hall Center', 800, 'Jl. Asia Afrika', 'Bandung')
ON CONFLICT (venue_id) DO UPDATE SET
  venue_name = EXCLUDED.venue_name,
  capacity = EXCLUDED.capacity,
  address = EXCLUDED.address,
  city = EXCLUDED.city;

INSERT INTO event (event_id, event_datetime, event_title, venue_id, organizer_id)
VALUES
  ('77777777-1111-0000-0000-000000000001', '2026-08-15 19:00:00', 'Synthwave Live Festival 2026', '55555555-1111-0000-0000-000000000001', '44444444-1111-0000-0000-000000000001')
ON CONFLICT (event_id) DO UPDATE SET
  event_datetime = EXCLUDED.event_datetime,
  event_title = EXCLUDED.event_title,
  venue_id = EXCLUDED.venue_id,
  organizer_id = EXCLUDED.organizer_id;

INSERT INTO seat (seat_id, section, seat_number, row_number, venue_id)
SELECT
  ('66666666-1111-0000-0000-' || LPAD((row_index * 10 + seat_number)::TEXT, 12, '0'))::UUID,
  'Main',
  seat_number::TEXT,
  row_name,
  '55555555-1111-0000-0000-000000000001'
FROM (
  VALUES (1, 'A'), (2, 'B'), (3, 'C')
) AS rows(row_index, row_name)
CROSS JOIN generate_series(1, 6) AS numbers(seat_number)
ON CONFLICT (seat_id) DO UPDATE SET
  section = EXCLUDED.section,
  seat_number = EXCLUDED.seat_number,
  row_number = EXCLUDED.row_number,
  venue_id = EXCLUDED.venue_id;

INSERT INTO ticket_category (category_id, category_name, quota, price, tevent_id)
VALUES
  ('99999999-1111-0000-0000-000000000001', 'VVIP', 50, 2500000, '77777777-1111-0000-0000-000000000001'),
  ('99999999-1111-0000-0000-000000000002', 'VIP', 100, 1500000, '77777777-1111-0000-0000-000000000001'),
  ('99999999-1111-0000-0000-000000000003', 'Festival', 500, 500000, '77777777-1111-0000-0000-000000000001')
ON CONFLICT (category_id) DO UPDATE SET
  category_name = EXCLUDED.category_name,
  quota = EXCLUDED.quota,
  price = EXCLUDED.price,
  tevent_id = EXCLUDED.tevent_id;

INSERT INTO promotion (promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit)
VALUES
  ('aaaaaaaa-1111-0000-0000-000000000001', 'TIKTAK20', 'PERCENTAGE', 20, '2026-04-01', '2026-12-31', 200),
  ('aaaaaaaa-1111-0000-0000-000000000002', 'WELCOME50K', 'NOMINAL', 50000, '2026-04-01', '2026-12-31', 500),
  ('aaaaaaaa-1111-0000-0000-000000000003', 'MEMBER10', 'PERCENTAGE', 10, '2026-04-01', '2026-12-31', 1000)
ON CONFLICT (promo_code) DO UPDATE SET
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  usage_limit = EXCLUDED.usage_limit;

INSERT INTO "ORDER" (order_id, order_date, payment_status, total_amount, customer_id)
VALUES
  ('bbbbbbbb-1111-0000-0000-000000000001', '2026-05-01 10:00:00', 'PAID', 1450000, '33333333-1111-0000-0000-000000000001')
ON CONFLICT (order_id) DO UPDATE SET
  order_date = EXCLUDED.order_date,
  payment_status = EXCLUDED.payment_status,
  total_amount = EXCLUDED.total_amount,
  customer_id = EXCLUDED.customer_id;

INSERT INTO ticket (ticket_id, ticket_code, tcategory_id, torder_id)
VALUES
  ('cccccccc-1111-0000-0000-000000000001', 'DEMO-TCK-001', '99999999-1111-0000-0000-000000000002', 'bbbbbbbb-1111-0000-0000-000000000001')
ON CONFLICT (ticket_code) DO UPDATE SET
  tcategory_id = EXCLUDED.tcategory_id,
  torder_id = EXCLUDED.torder_id;

INSERT INTO order_promotion (order_promotion_id, promotion_id, order_id)
VALUES
  ('dddddddd-1111-0000-0000-000000000001', 'aaaaaaaa-1111-0000-0000-000000000001', 'bbbbbbbb-1111-0000-0000-000000000001')
ON CONFLICT (order_promotion_id) DO NOTHING;
