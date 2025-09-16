-- Create event processing logs table
CREATE TABLE IF NOT EXISTS public.event_processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.webhook_events(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  success BOOLEAN NOT NULL,
  message TEXT,
  processing_data JSONB,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_processing_logs_event_id ON public.event_processing_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_event_processing_logs_success ON public.event_processing_logs(success);
CREATE INDEX IF NOT EXISTS idx_event_processing_logs_processed_at ON public.event_processing_logs(processed_at);

-- Enable Row Level Security
ALTER TABLE public.event_processing_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_processing_logs
CREATE POLICY "event_processing_logs_select_all" ON public.event_processing_logs
  FOR SELECT USING (true);

CREATE POLICY "event_processing_logs_insert_service" ON public.event_processing_logs
  FOR INSERT WITH CHECK (true);

-- Add retry_at column to webhook_events for better retry handling
ALTER TABLE public.webhook_events ADD COLUMN IF NOT EXISTS retry_at TIMESTAMP WITH TIME ZONE;

-- Create index for retry scheduling
CREATE INDEX IF NOT EXISTS idx_webhook_events_retry_at ON public.webhook_events(retry_at) WHERE retry_at IS NOT NULL;
