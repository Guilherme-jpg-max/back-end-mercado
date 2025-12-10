-- SQL ADAPTADO PARA RENDER
-- Removi: DROP DATABASE, CREATE DATABASE, \c, GRANT

-- TABELA: users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- TABELA: categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- TABELA: products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  old_price DECIMAL(10, 2) CHECK (old_price >= 0),
  category VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- TABELA: orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  payment_method VARCHAR(50) NOT NULL,
  delivery_street VARCHAR(255) NOT NULL,
  delivery_number VARCHAR(20) NOT NULL,
  delivery_complement VARCHAR(255),
  delivery_neighborhood VARCHAR(100) NOT NULL,
  delivery_city VARCHAR(100) NOT NULL,
  delivery_state VARCHAR(2) NOT NULL,
  delivery_zip_code VARCHAR(9) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- TABELA: order_items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  image_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- TABELA: contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC);

-- FUNÇÕES DE ATUALIZAÇÃO
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- INSERIR CATEGORIAS INICIAIS (apenas se não existirem)
INSERT INTO categories (name, slug) 
SELECT 'Hortifruti', 'hortifruti'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'hortifruti');

INSERT INTO categories (name, slug) 
SELECT 'Bebidas', 'bebidas'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'bebidas');

INSERT INTO categories (name, slug) 
SELECT 'Açougue', 'acougue'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'acougue');

INSERT INTO categories (name, slug) 
SELECT 'Laticínios', 'laticinios'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'laticinios');

INSERT INTO categories (name, slug) 
SELECT 'Grãos', 'graos'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'graos');

INSERT INTO categories (name, slug) 
SELECT 'Limpeza', 'limpeza'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'limpeza');

INSERT INTO categories (name, slug) 
SELECT 'Higiene', 'higiene'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'higiene');

INSERT INTO categories (name, slug) 
SELECT 'Padaria', 'padaria'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'padaria');

-- VERIFICAR CRIAÇÃO
SELECT 'Tabelas criadas com sucesso!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;