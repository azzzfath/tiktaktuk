CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS user_account (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS role (
  role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS account_role (
  role_id UUID NOT NULL REFERENCES role(role_id),
  user_id UUID NOT NULL REFERENCES user_account(user_id),
  PRIMARY KEY (role_id, user_id)
);

CREATE TABLE IF NOT EXISTS customer (
  customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR NOT NULL,
  phone_number VARCHAR,
  user_id UUID NOT NULL UNIQUE REFERENCES user_account(user_id)
);

CREATE TABLE IF NOT EXISTS organizer (
  organizer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_name VARCHAR NOT NULL,
  contact_email VARCHAR,
  user_id UUID NOT NULL UNIQUE REFERENCES user_account(user_id)
);

CREATE TABLE IF NOT EXISTS venue (
  venue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_name VARCHAR NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  address TEXT NOT NULL,
  city VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS event (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_datetime TIMESTAMP NOT NULL,
  event_title VARCHAR NOT NULL,
  venue_id UUID NOT NULL REFERENCES venue(venue_id),
  organizer_id UUID NOT NULL REFERENCES organizer(organizer_id)
);

CREATE TABLE IF NOT EXISTS seat (
  seat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section VARCHAR NOT NULL,
  seat_number VARCHAR NOT NULL,
  row_number VARCHAR NOT NULL,
  venue_id UUID NOT NULL REFERENCES venue(venue_id)
);

CREATE TABLE IF NOT EXISTS ticket_category (
  category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name VARCHAR NOT NULL,
  quota INTEGER NOT NULL CHECK (quota > 0),
  price NUMERIC NOT NULL CHECK (price >= 0),
  tevent_id UUID NOT NULL REFERENCES event(event_id)
);

CREATE TABLE IF NOT EXISTS "ORDER" (
  order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_date TIMESTAMP NOT NULL,
  payment_status VARCHAR NOT NULL,
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  customer_id UUID NOT NULL REFERENCES customer(customer_id)
);

CREATE TABLE IF NOT EXISTS ticket (
  ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_code VARCHAR NOT NULL UNIQUE,
  tcategory_id UUID NOT NULL REFERENCES ticket_category(category_id),
  torder_id UUID NOT NULL REFERENCES "ORDER"(order_id)
);

CREATE TABLE IF NOT EXISTS promotion (
  promotion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code VARCHAR NOT NULL UNIQUE,
  discount_type VARCHAR NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'NOMINAL')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  usage_limit INTEGER NOT NULL CHECK (usage_limit > 0)
);

CREATE TABLE IF NOT EXISTS order_promotion (
  order_promotion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID NOT NULL REFERENCES promotion(promotion_id),
  order_id UUID NOT NULL REFERENCES "ORDER"(order_id)
);

CREATE INDEX IF NOT EXISTS idx_user_account_username_lower ON user_account (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_account_role_user_id ON account_role(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_user_id ON customer(user_id);
CREATE INDEX IF NOT EXISTS idx_organizer_user_id ON organizer(user_id);
CREATE INDEX IF NOT EXISTS idx_ticket_category_event_id ON ticket_category(tevent_id);
CREATE INDEX IF NOT EXISTS idx_ticket_order_id ON ticket(torder_id);
CREATE INDEX IF NOT EXISTS idx_ticket_category_id ON ticket(tcategory_id);
CREATE INDEX IF NOT EXISTS idx_order_customer_id ON "ORDER"(customer_id);
