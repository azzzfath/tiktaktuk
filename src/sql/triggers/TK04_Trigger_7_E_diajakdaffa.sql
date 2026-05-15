CREATE OR REPLACE FUNCTION validate_order_promotion_exists_and_usage()
RETURNS TRIGGER AS $$
DECLARE
  promo_record RECORD;
  current_usage INTEGER;
BEGIN
  SELECT
    promotion_id,
    promo_code,
    usage_limit
  INTO promo_record
  FROM promotion
  WHERE promotion_id = NEW.promotion_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Promotion dengan ID % tidak ditemukan.', NEW.promotion_id;
  END IF;

  SELECT COUNT(*)::INTEGER
  INTO current_usage
  FROM order_promotion
  WHERE promotion_id = NEW.promotion_id
    AND order_promotion_id <> COALESCE(
      NEW.order_promotion_id,
      '00000000-0000-0000-0000-000000000000'::UUID
    );

  IF current_usage >= promo_record.usage_limit THEN
    RAISE EXCEPTION 'Promotion "%" telah mencapai batas maksimum penggunaan.', promo_record.promo_code;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_1_order_promotion_exists_and_usage ON order_promotion;

CREATE TRIGGER trg_1_order_promotion_exists_and_usage
BEFORE INSERT OR UPDATE OF promotion_id, order_id ON order_promotion
FOR EACH ROW
EXECUTE FUNCTION validate_order_promotion_exists_and_usage();
