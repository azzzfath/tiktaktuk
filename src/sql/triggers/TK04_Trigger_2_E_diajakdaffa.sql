CREATE OR REPLACE FUNCTION ensure_username_is_alphanumeric()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.username !~ '^[A-Za-z0-9]+$' THEN
    RAISE EXCEPTION 'Username "%" hanya boleh mengandung huruf dan angka tanpa simbol atau spasi.', NEW.username;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_account_username_alphanumeric ON user_account;

CREATE TRIGGER trg_user_account_username_alphanumeric
BEFORE INSERT OR UPDATE OF username ON user_account
FOR EACH ROW
EXECUTE FUNCTION ensure_username_is_alphanumeric();
