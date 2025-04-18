
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- 1. Users Table
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  username VARCHAR(255),
  role VARCHAR(50) DEFAULT 'free', -- 'free', 'premium', 'admin'
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 2. Scripts Table
-- =========================
CREATE TABLE IF NOT EXISTS scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topic TEXT,
  keywords TEXT[],
  content TEXT NOT NULL,
  model_used VARCHAR(50),
  type VARCHAR(50) DEFAULT 'free', -- 'free' or 'premium'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 3. Plans Table
-- =========================
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) DEFAULT 0,
  script_limit_per_month INT DEFAULT 10,
  model_access TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 4. Subscriptions Table
-- =========================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 5. Usage Logs Table
-- =========================
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  tokens_used INT,
  model_used VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 6. API Keys Table
-- =========================
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO plans (name, description, price, script_limit_per_month, model_access)
VALUES 
('Free', 'Free plan with limited features', 0, 10, ARRAY['gpt-3.5']),
('Pro', 'Access to GPT-4 and higher limits', 19.99, 100, ARRAY['gpt-3.5', 'gpt-4']),
('Ultimate', 'Unlimited access and Claude support', 49.99, 1000, ARRAY['gpt-4', 'claude-3', 'mistral']);
