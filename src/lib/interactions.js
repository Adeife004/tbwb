import { supabase } from './supabase'

// ── REACTIONS ──
export async function getReactions(articleSlug) {
  const { data, error } = await supabase
    .from('reactions')
    .select('type')
    .eq('article_slug', articleSlug)

  if (error) { console.error(error); return {} }

  const counts = { fire: 0, thinking: 0, facts: 0, felt: 0 }
  data.forEach(r => { if (counts[r.type] !== undefined) counts[r.type]++ })
  return counts
}

export async function setReaction(articleSlug, type, visitorId) {
  // Remove any existing reaction from this visitor on this article
  await supabase
    .from('reactions')
    .delete()
    .eq('article_slug', articleSlug)
    .eq('visitor_id', visitorId)

  // If type is null — just removing, don't insert
  if (!type) return true

  // Insert the new reaction
  const { error } = await supabase
    .from('reactions')
    .insert([{ article_slug: articleSlug, type, visitor_id: visitorId }])

  if (error) { console.error(error); return false }
  return true
}

// ── COMMENTS ──
export async function getComments(articleSlug) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_slug', articleSlug)
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return [] }
  return data
}

export async function addComment(articleSlug, name, text) {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ article_slug: articleSlug, name, text }])
    .select()
    .single()

  if (error) { console.error(error); return null }
  return data
}