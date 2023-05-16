// Importa a função createClient do pacote @supabase/supabase-js
import { createClient } from '@supabase/supabase-js'

// Define a URL e a chave da API do Supabase
const supabaseUrl = 'https://zlnlpintvtfvjrxczyls.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsbmxwaW50dnRmdmpyeGN6eWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMxMzE2NDMsImV4cCI6MTk5ODcwNzY0M30.KxuIzsjWyRozW5C_xYo5zZxvA9fV1wo-GV8GwXi7QfA'

// Cria uma instância do cliente Supabase usando a URL e a chave da API fornecidas
const supabase = createClient(supabaseUrl, supabaseKey)

// Exporta o cliente Supabase para que ele possa ser importado em outros arquivos
export default supabase
