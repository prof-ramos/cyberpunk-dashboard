-- Helper function to get table columns
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE(column_name text, data_type text, is_nullable text) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text
  FROM information_schema.columns c
  WHERE c.table_schema = 'public' 
    AND c.table_name = $1
  ORDER BY c.ordinal_position;
$$;

-- Helper function to check if RLS is enabled on tables
CREATE OR REPLACE FUNCTION check_rls_enabled()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT bool_and(relrowsecurity) 
  FROM pg_class 
  WHERE relname IN ('webhook_events', 'api_keys', 'webhook_endpoints', 'request_logs', 'event_processing_logs')
    AND relkind = 'r';
$$;

-- Function to get database health status
CREATE OR REPLACE FUNCTION get_database_health()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  table_count integer;
  total_events integer;
  active_keys integer;
  active_endpoints integer;
BEGIN
  -- Count tables
  SELECT count(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND table_name IN ('webhook_events', 'api_keys', 'webhook_endpoints', 'request_logs', 'event_processing_logs');

  -- Count webhook events
  SELECT count(*) INTO total_events FROM webhook_events;
  
  -- Count active API keys
  SELECT count(*) INTO active_keys FROM api_keys WHERE is_active = true;
  
  -- Count active webhook endpoints
  SELECT count(*) INTO active_endpoints FROM webhook_endpoints WHERE is_active = true;

  result := jsonb_build_object(
    'tables_present', table_count,
    'expected_tables', 5,
    'total_webhook_events', total_events,
    'active_api_keys', active_keys,
    'active_webhook_endpoints', active_endpoints,
    'rls_enabled', (SELECT check_rls_enabled()),
    'last_checked', now()
  );

  RETURN result;
END;
$$;

-- Grant execute permissions to service role
GRANT EXECUTE ON FUNCTION get_table_columns(text) TO service_role;
GRANT EXECUTE ON FUNCTION check_rls_enabled() TO service_role;
GRANT EXECUTE ON FUNCTION get_database_health() TO service_role;
