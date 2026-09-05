INSERT INTO departments (name, description) VALUES
('Road Department', 'Road repairs, potholes, asphalt work'),
('Sanitation Department', 'Waste collection and cleanliness issues'),
('Water Department', 'Water leakages and supply problems'),
('Electrical Department', 'Streetlights and electrical infrastructure'),
('Drainage Department', 'Drainage, flooding, sewage issues'),
('Parks Department', 'Park and public landscape maintenance'),
('General Infrastructure', 'Cross-department civic maintenance tasks');

INSERT INTO users (name, email, phone, password_hash, role) VALUES
('System Admin', 'admin@civicconnect.ai', '9999999999', '$2b$12$ZP6Tx4ZFrCw0rLsR8fJjv.Pz3KfE8GJUGJ2iI9vS0I9DqFj7E3N7a', 'admin'),
('Rahul Verma', 'staff1@civicconnect.ai', '9876543210', '$2b$12$Lx3I3kQ8L8F3r5z5QW8PveRFBd0n2n0n4c1w7V9l9w6fX4rGe2K.2', 'staff'),
('Ananya Shah', 'staff2@civicconnect.ai', '9876543211', '$2b$12$M5m7WgXwzJd0iDL5cQjyxe5U0gMmwFUSxP4Kk6vQtzs4m6J0BRqJ2', 'staff'),
('Amit Kumar', 'citizen1@example.com', '9000000001', '$2b$12$3sIv6nCJ2Itj1KQ9VrT7M.4wAotDca1Lz6kfFvKk3sG5t3uUmMXr2', 'citizen');
