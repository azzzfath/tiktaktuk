CREATE OR REPLACE FUNCTION ensure_username_is_unique_case_insensitive()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM user_account
    WHERE LOWER(username) = LOWER(NEW.username)
      AND user_id <> NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Username "%" sudah terdaftar, gunakan username lain.', NEW.username;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_account_username_unique_case_insensitive ON user_account;

CREATE TRIGGER trg_user_account_username_unique_case_insensitive
BEFORE INSERT OR UPDATE OF username ON user_account
FOR EACH ROW
EXECUTE FUNCTION ensure_username_is_unique_case_insensitive();
