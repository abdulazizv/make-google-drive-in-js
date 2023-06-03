CREATE TABLE IF NOT EXISTS folder (
    id SERIAL PRIMARY KEY,
    folder_name varchar(255),
    user_id INT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)