-- Promote a user to admin by email
-- Replace the email below and run once
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
