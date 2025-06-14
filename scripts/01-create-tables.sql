-- Criar tabelas para o sistema de gestão de performance

-- Tabela de máquinas
CREATE TABLE IF NOT EXISTS machines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  standard_cycle INTEGER NOT NULL, -- em minutos
  observations TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de dados de performance
CREATE TABLE IF NOT EXISTS performance_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  machine_id UUID REFERENCES machines(id) ON DELETE CASCADE,
  cycle_time INTEGER NOT NULL, -- em minutos
  efficiency DECIMAL(5,2), -- percentual
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de análises de IA
CREATE TABLE IF NOT EXISTS ai_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  analysis_type VARCHAR(50) NOT NULL, -- 'monthly', 'performance', 'predictive'
  content TEXT NOT NULL, -- JSON com dados da análise
  insights TEXT[], -- array de insights
  recommendations TEXT[], -- array de recomendações
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados de exemplo
INSERT INTO machines (name, standard_cycle, observations, status) VALUES
('Máquina de Corte A1', 45, 'Máquina principal de corte, alta precisão', 'active'),
('Prensa Hidráulica B2', 30, 'Prensa para conformação de peças', 'active'),
('Torno CNC C3', 60, 'Torno de alta precisão para usinagem', 'maintenance'),
('Fresadora D4', 40, 'Fresadora universal para acabamento', 'active'),
('Soldadora E5', 25, 'Equipamento de solda automatizada', 'inactive');

-- Inserir dados de performance de exemplo
INSERT INTO performance_data (machine_id, cycle_time, efficiency, recorded_at) 
SELECT 
  m.id,
  m.standard_cycle + (RANDOM() * 20 - 10)::INTEGER, -- variação de ±10 minutos
  85 + (RANDOM() * 30)::DECIMAL(5,2), -- eficiência entre 85-115%
  NOW() - (RANDOM() * INTERVAL '30 days')
FROM machines m, generate_series(1, 50) -- 50 registros por máquina
WHERE m.status = 'active';
