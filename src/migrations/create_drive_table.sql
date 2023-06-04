CREATE TABLE IF NOT EXISTS drives (
    id SERIAL PRIMARY KEY,
    mimetype VARCHAR(100),
    originalName VARCHAR(255),
    is_openToAll BOOLEAN DEFAULT false,
    awslocation_id VARCHAR(255),
    user_id INT,
    folder_id INT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_folder FOREIGN KEY (folder_id) REFERENCES folder(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)