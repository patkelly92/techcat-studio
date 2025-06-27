-- Validate Tables
SELECT * FROM documents;

SELECT * FROM document_versions;

SELECT * FROM projects;

SELECT * FROM users;

SELECT * FROM feedback;

-- Insert dummy user record since we don't have multi-user auth yet
INSERT INTO users (id, email, hashed_password, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'patrick@techcat.ai', 'password1234', LOCALTIMESTAMP);
