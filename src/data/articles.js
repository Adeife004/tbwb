import { supabase } from '../lib/supabase'

export async function getArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return [] }
  return data
}

export async function getArticleBySlug(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) { console.error(error); return null }
  return data
}

export async function createArticle(article) {
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single()

  if (error) { console.error(error); return null }
  return data
}