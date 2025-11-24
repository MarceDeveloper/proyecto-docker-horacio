CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  space_name TEXT NOT NULL,
  user_name TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL
);