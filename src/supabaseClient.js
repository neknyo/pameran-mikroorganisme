import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dukgtaswsklvxanmlgaz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1a2d0YXN3c2tsdnhhbm1sZ2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NDIyNTUsImV4cCI6MjA5MDMxODI1NX0.WwKkca-dXlymXW-cBCd5hgKZCoBDmHRqE6tmi8gcwiE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)