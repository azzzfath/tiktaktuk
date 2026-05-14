CREATE OR REPLACE FUNCTION validate_order_promotion_event_date()
RETURNS TRIGGER AS $$
DECLARE
  promo_record RECORD;
  related_event_count INTEGER;
  invalid_event_date DATE;
BEGIN
  SELECT
    promotion_id,
    promo_code,
    start_date,
    end_date
  INTO promo_record
  FROM promotion
  WHERE promotion_id = NEW.promotion_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Promotion dengan ID % tidak ditemukan.', NEW.promotion_id;
  END IF;

  SELECT COUNT(*)::INTEGER
  INTO related_event_count
  FROM ticket t
  JOIN ticket_category tc ON tc.category_id = t.tcategory_id
  JOIN event e ON e.event_id = tc.tevent_id
  WHERE t.torder_id = NEW.order_id;

  IF related_event_count = 0 THEN
    RAISE EXCEPTION 'Order dengan ID % belum memiliki event untuk validasi promotion.', NEW.order_id;
  END IF;

  SELECT e.event_datetime::DATE
  INTO invalid_event_date
  FROM ticket t
  JOIN ticket_category tc ON tc.category_id = t.tcategory_id
  JOIN event e ON e.event_id = tc.tevent_id
  WHERE t.torder_id = NEW.order_id
    AND (
      e.event_datetime::DATE < promo_record.start_date
      OR e.event_datetime::DATE > promo_record.end_date
    )
  LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION 'Promotion "%" tidak berlaku untuk tanggal event ini.', promo_record.promo_code;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_2_order_promotion_event_date ON order_promotion;

CREATE TRIGGER trg_2_order_promotion_event_date
BEFORE INSERT OR UPDATE OF promotion_id, order_id ON order_promotion
FOR EACH ROW
EXECUTE FUNCTION validate_order_promotion_event_date();
