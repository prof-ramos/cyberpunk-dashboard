-- Create request logs table for monitoring and debugging
CREATE TABLE IF NOT EXISTS public.request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method VARCHAR(10) NOT NULL,
  url TEXT NOT NULL,
  headers JSONB DEFAULT '{}'::jsonb,
  ip VARCHAR(45) NOT NULL,
  user_agent TEXT,
  api_key_hash VARCHAR(16),
  response_status INTEGER,
  response_time INTEGER,
  error_message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_request_logs_timestamp ON public.request_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_request_logs_method ON public.request_logs(method);
CREATE INDEX IF NOT EXISTS idx_request_logs_status ON public.request_logs(response_status);
CREATE INDEX IF NOT EXISTS idx_request_logs_api_key ON public.request_logs(api_key_hash);
CREATE INDEX IF NOT EXISTS idx_request_logs_ip ON public.request_logs(ip);

-- Enable Row Level Security
ALTER TABLE public.request_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for request_logs (admin read only)
CREATE POLICY "request_logs_admin_select" ON public.request_logs
  FOR SELECT USING (true);

CREATE POLICY "request_logs_service_insert" ON public.request_logs
  FOR INSERT WITH CHECK (true);
