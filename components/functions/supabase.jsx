import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zlnlpintvtfvjrxczyls.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsbmxwaW50dnRmdmpyeGN6eWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMxMzE2NDMsImV4cCI6MTk5ODcwNzY0M30.KxuIzsjWyRozW5C_xYo5zZxvA9fV1wo-GV8GwXi7QfA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
