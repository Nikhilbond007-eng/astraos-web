import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Auth functions ──
export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  })
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── Chart functions ──
export async function saveChart(chartData, formData, userName) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('charts')
    .upsert({
      user_id: user.id,
      name: userName,
      dob: formData.dob,
      tob: formData.tob,
      city: formData.city,
      lat: formData.lat,
      lon: formData.lon,
      system: formData.system || 'vedic',
      chart_data: chartData
    })
    .select()

  if (error) throw error
  return data[0]
}

export async function loadUserChart() {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('charts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) return null
  return data
}

export async function saveChatMessage(chartId, role, content, pageContext) {
  const user = await getCurrentUser()
  if (!user) return

  await supabase.from('chat_history').insert({
    user_id: user.id,
    chart_id: chartId,
    role,
    content,
    page_context: pageContext
  })
}
