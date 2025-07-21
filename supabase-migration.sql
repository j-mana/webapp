-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  created_at_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create experiments table
CREATE TABLE experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  bookmarked_at BIGINT,
  created_at BIGINT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  created_at_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create canvas_nodes table
CREATE TABLE canvas_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  x NUMERIC NOT NULL,
  y NUMERIC NOT NULL,
  width NUMERIC,
  height NUMERIC,
  data JSONB NOT NULL,
  created_at BIGINT NOT NULL,
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  created_at_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create websites table (from instant schema)
CREATE TABLE websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  captured_at TIMESTAMPTZ,
  html TEXT,
  raw_computed_style JSONB,
  screenshot TEXT,
  style_guide JSONB,
  title TEXT,
  url TEXT,
  created_at_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_experiments_created_at ON experiments(created_at);
CREATE INDEX idx_experiments_project_id ON experiments(project_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_messages_experiment_id ON chat_messages(experiment_id);
CREATE INDEX idx_canvas_nodes_created_at ON canvas_nodes(created_at);
CREATE INDEX idx_canvas_nodes_experiment_id ON canvas_nodes(experiment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your authentication needs)
-- For now, allowing all operations - you may want to restrict based on user authentication
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on experiments" ON experiments FOR ALL USING (true);
CREATE POLICY "Allow all operations on chat_messages" ON chat_messages FOR ALL USING (true);
CREATE POLICY "Allow all operations on canvas_nodes" ON canvas_nodes FOR ALL USING (true);
CREATE POLICY "Allow all operations on websites" ON websites FOR ALL USING (true);

-- Enable realtime replication for tables
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE experiments;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE canvas_nodes;
ALTER PUBLICATION supabase_realtime ADD TABLE websites;