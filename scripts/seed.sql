TRUNCATE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, description, price, old_price, category, image_url, stock, is_active, is_featured) VALUES
('Banana Prata', 'Banana prata fresca, 1kg', 4.99, 6.99, 'Hortifruti', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400', 150, true, true),
('Maçã Gala', 'Maçã gala argentina, 1kg', 8.99, NULL, 'Hortifruti', 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', 80, true, true),
('Tomate', 'Tomate salada, 1kg', 5.49, 6.99, 'Hortifruti', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', 120, true, false),
('Alface Crespa', 'Alface crespa fresca, unidade', 2.99, NULL, 'Hortifruti', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400', 60, true, false),
('Laranja Pera', 'Laranja pera, 1kg', 4.49, NULL, 'Hortifruti', 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400', 90, true, false);

SELECT 'Produtos inseridos com sucesso!' AS status;
SELECT COUNT(*) AS total_produtos FROM products;
SELECT category, COUNT(*) AS quantidade FROM products GROUP BY category ORDER BY category;
