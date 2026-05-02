import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qhpaphjvkmzymltcpwpq.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocGFwaGp2a216eW1sdGNwd3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2Njg3NTAsImV4cCI6MjA5MzI0NDc1MH0.aDHt0n_pUtBbH7o5lDNzdjt-TqcTyGopRVwcpB1-mVY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)