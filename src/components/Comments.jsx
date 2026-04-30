import { useState, useEffect } from 'react'
import './Comments.css'

export default function Comments({ articleSlug }) {
  const key = `tbwb_comments_${articleSlug}`
  const [comments, setComments] = useState([])
  const [name, setName]         = useState('')
  const [text, setText]         = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(key)
    if (stored) setComments(JSON.parse(stored))
  }, [key])

  const submit = () => {
    if (!name.trim()) return setError('Please enter your name.')
    if (!text.trim()) return setError('Please write a comment.')
    setError('')

    const newComment = {
      id: Date.now(),
      name: name.trim(),
      text: text.trim(),
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    }

    const updated = [newComment, ...comments]
    setComments(updated)
    localStorage.setItem(key, JSON.stringify(updated))
    setName('')
    setText('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="comments">
      <div className="comments__header">
        <h3 className="comments__title">
          {comments.length} {comments.length === 1 ? 'Response' : 'Responses'}
        </h3>
      </div>

      {/* Form */}
      <div className="comments__form">
        <h4 className="comments__form-title">Leave a response</h4>
        <div className="comments__inputs">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="comments__input"
            maxLength={60}
          />
          <textarea
            placeholder="What are your thoughts?"
            value={text}
            onChange={e => setText(e.target.value)}
            className="comments__textarea"
            rows={5}
            maxLength={1000}
          />
        </div>
        {error   && <p className="comments__error">{error}</p>}
        {success && <p className="comments__success">Response posted. Thank you.</p>}
        <button className="comments__submit" onClick={submit}>
          Post Response
        </button>
      </div>

      {/* List */}
      {comments.length > 0 && (
        <div className="comments__list">
          {comments.map(c => (
            <div className="comment" key={c.id}>
              <div className="comment__avatar">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="comment__body">
                <div className="comment__meta">
                  <span className="comment__name">{c.name}</span>
                  <span className="comment__date">{c.date}</span>
                </div>
                <p className="comment__text">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}