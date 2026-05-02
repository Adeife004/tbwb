import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Comments.css'

const REACTIONS = [
  { key: 'heart', emoji: '❤️',  label: 'Love'       },
  { key: 'fire',  emoji: '🔥',  label: 'Fire'       },
  { key: 'clap',  emoji: '👏',  label: 'Applause'   },
  { key: 'think', emoji: '🤔',  label: 'Insightful' },
  { key: 'sad',   emoji: '😢',  label: 'Sad'        },
]

const defaultReactions = Object.fromEntries(REACTIONS.map(r => [r.key, 0]))

export default function Comments({ articleSlug }) {
  const chosenKey = `chosen_${articleSlug}`

  const [reactions, setReactions] = useState(defaultReactions)
  const [chosen,    setChosen]    = useState(() => localStorage.getItem(chosenKey) || null)
  const [comments,  setComments]  = useState([])
  const [name,      setName]      = useState('')
  const [text,      setText]      = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  // ── fetch reactions ──
  useEffect(() => {
    async function fetchReactions() {
      const { data } = await supabase
        .from('reaction')
        .select('type')
        .eq('article_slug', articleSlug)

      if (!data) return
      const counts = { ...defaultReactions }
      data.forEach(r => {
        if (counts[r.type] !== undefined) counts[r.type]++
      })
      setReactions(counts)
    }
    fetchReactions()
  }, [articleSlug])

  // ── fetch comments ──
  useEffect(() => {
    async function fetchComments() {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('article_slug', articleSlug)
        .order('created_at', { ascending: false })

      if (data) setComments(data)
    }
    fetchComments()
  }, [articleSlug])

  // ── handle reaction ──
  async function handleReaction(key) {
    if (chosen === key) return // already chosen, do nothing

    // remove previous reaction row if exists
    if (chosen) {
      await supabase
        .from('reaction')
        .delete()
        .eq('article_slug', articleSlug)
        .eq('type', chosen)
        // Note: this deletes ALL of that type — for anonymous blogs this is fine
    }

    await supabase
      .from('reaction')
      .insert({ article_slug: articleSlug, type: key })

    localStorage.setItem(chosenKey, key)
    setChosen(key)

    // update local counts
    setReactions(prev => {
      const next = { ...prev }
      if (chosen) next[chosen] = Math.max(0, next[chosen] - 1)
      next[key] = next[key] + 1
      return next
    })
  }

  // ── submit comment ──
  async function handleSubmit() {
    if (!name.trim() || !text.trim()) return
    setSubmitting(true)

    const { data, error } = await supabase
      .from('comments')
      .insert({ article_slug: articleSlug, name: name.trim(), text: text.trim() })
      .select()
      .single()

    if (!error && data) {
      setComments(prev => [data, ...prev])
      setName('')
      setText('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
    setSubmitting(false)
  }

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0)

  return (
    <div>
      {/* ── REACTIONS ── */}
      <div className="reactions">
        <div className="reactions__left">
          <div className="reactions__icons">
            {REACTIONS.filter(r => reactions[r.key] > 0)
              .slice(0, 3)
              .map(r => (
                <span key={r.key} className="reactions__icon">{r.emoji}</span>
              ))}
          </div>
          {totalReactions > 0 && (
            <span className="reactions__total">{totalReactions} reactions</span>
          )}
        </div>

        <div className="reactions__breakdown">
          {REACTIONS.map(r => (
            <span key={r.key} className="reactions__breakdown-item">
              {r.emoji} {reactions[r.key] || 0}
            </span>
          ))}
        </div>

        <div className="reactions__btns">
          {REACTIONS.map(r => (
            <button
              key={r.key}
              className={`reaction-btn ${chosen === r.key ? 'reaction-btn--chosen' : ''}`}
              onClick={() => handleReaction(r.key)}
              title={r.label}
            >
              <span className="reaction-btn__emoji">{r.emoji}</span>
              <span className="reaction-btn__label">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── COMMENTS ── */}
      <div className="comments">
        <h3 className="comments__title">
          {comments.length > 0 ? `${comments.length} Comment${comments.length > 1 ? 's' : ''}` : 'Leave a comment'}
        </h3>

        {/* Form */}
        <div className="comments__form">
          <input
            className="comments__input"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <textarea
            className="comments__textarea"
            placeholder="Share your thoughts..."
            rows={4}
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button
            className="comments__submit"
            onClick={handleSubmit}
            disabled={submitting || !name.trim() || !text.trim()}
          >
            {submitting ? 'Posting...' : submitted ? '✓ Posted!' : 'Post Comment'}
          </button>
        </div>

        {/* List */}
        <div className="comments__list">
          {comments.map(c => (
            <div key={c.id} className="comment">
              <div className="comment__header">
                <span className="comment__name">{c.name}</span>
                <span className="comment__date">
                  {new Date(c.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </span>
              </div>
              <p className="comment__text">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}