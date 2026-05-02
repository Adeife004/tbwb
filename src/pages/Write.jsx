import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.jpeg'
import './Write.css'

const DEFAULT_PASSWORD = 'tbwb2026'
const ASPECT = 16 / 9

function centerAspectCrop(w, h) {
  return centerCrop(makeAspectCrop({ unit: '%', width: 100 }, ASPECT, w, h), w, h)
}

export default function Write() {
  const [authed, setAuthed]         = useState(false)
  const [pwInput, setPwInput]       = useState('')
  const [pwError, setPwError]       = useState('')

  const [title, setTitle]           = useState('')
  const [subtitle, setSubtitle]     = useState('')
  const [category, setCategory]     = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [body, setBody]             = useState('')
  const [published, setPublished]   = useState(false)
  const [formError, setFormError]   = useState('')
  const [uploading, setUploading]   = useState(false)
  const [editingId, setEditingId]   = useState(null)
  const [activeTab, setActiveTab]   = useState('editor')

  const [authorName, setAuthorName]           = useState('The Boy Without Blueprint')
  const [authorAvatar, setAuthorAvatar]       = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const [drafts, setDrafts]           = useState([])
  const [articles, setArticles]       = useState([])
  const [loadingList, setLoadingList] = useState(false)

  const [cropSrc, setCropSrc]               = useState(null)
  const [crop, setCrop]                     = useState()
  const [completedCrop, setCompletedCrop]   = useState(null)
  const [showCrop, setShowCrop]             = useState(false)
  const imgRef                              = useRef(null)
  const originalFileRef                     = useRef(null)

  const [showPwChange, setShowPwChange] = useState(false)
  const [currentPw, setCurrentPw]       = useState('')
  const [newPw, setNewPw]               = useState('')
  const [confirmPw, setConfirmPw]       = useState('')
  const [pwChangeMsg, setPwChangeMsg]   = useState('')
  const [pwChangeErr, setPwChangeErr]   = useState('')

  const location = useLocation()

  // ── load draft from localStorage
  useEffect(() => {
    if (!authed) return
    const draft = localStorage.getItem('tbwb_draft')
    if (draft && !editingId) {
      const d = JSON.parse(draft)
      setTitle(d.title || '')
      setSubtitle(d.subtitle || '')
      setCategory(d.category || '')
      setCoverImage(d.coverImage || '')
      setBody(d.body || '')
      setAuthorName(d.authorName || 'The Boy Without Blueprint')
      setAuthorAvatar(d.authorAvatar || '')
    }
  }, [authed])

  // ── autosave to localStorage
  useEffect(() => {
    if (!authed) return
    const timer = setTimeout(() => {
      localStorage.setItem('tbwb_draft', JSON.stringify({
        title, subtitle, category, coverImage, body, authorName, authorAvatar
      }))
    }, 800)
    return () => clearTimeout(timer)
  }, [title, subtitle, category, coverImage, body, authorName, authorAvatar, authed])

  // ── fetch lists when tab changes
  useEffect(() => {
    if (!authed) return
    if (activeTab === 'drafts')    fetchDrafts()
    if (activeTab === 'published') fetchPublished()
  }, [activeTab, authed])

  const fetchDrafts = async () => {
    setLoadingList(true)
    const { data } = await supabase
      .from('articles')
      .select('id, title, category, date, slug')
      .eq('status', 'draft')
      .order('date', { ascending: false })
    setDrafts(data || [])
    setLoadingList(false)
  }

  const fetchPublished = async () => {
    setLoadingList(true)
    const { data } = await supabase
      .from('articles')
      .select('id, title, category, date, slug')
      .eq('status', 'published')
      .order('date', { ascending: false })
    setArticles(data || [])
    setLoadingList(false)
  }

  const getPassword = () => localStorage.getItem('tbwb_password') || DEFAULT_PASSWORD

  const login = () => {
    if (pwInput === getPassword()) { setAuthed(true); setPwError('') }
    else { setPwError('Wrong password. Try again.'); setPwInput('') }
  }

  const slugify = (str) =>
    str.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

  const resetEditor = () => {
    setTitle(''); setSubtitle(''); setCategory('')
    setCoverImage(''); setBody(''); setEditingId(null)
    setAuthorName('The Boy Without Blueprint')
    setAuthorAvatar('')
    setFormError('')
  }

  const loadForEdit = async (id) => {
    const { data } = await supabase.from('articles').select('*').eq('id', id).single()
    if (!data) return
    setTitle(data.title)
    setSubtitle(data.subtitle || '')
    setCategory(data.category || '')
    setCoverImage(data.cover_image || '')
    setBody(data.body)
    setAuthorName(data.author_name || 'The Boy Without Blueprint')
    setAuthorAvatar(data.author_avatar || '')
    setEditingId(id)
    setActiveTab('editor')
    window.scrollTo(0, 0)
  }

  const deleteArticle = async (id) => {
    if (!window.confirm('Delete this article? This cannot be undone.')) return
    await supabase.from('articles').delete().eq('id', id)
    setDrafts(prev => prev.filter(a => a.id !== id))
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    originalFileRef.current = file
    const reader = new FileReader()
    reader.onload = () => { setCropSrc(reader.result); setShowCrop(true) }
    reader.readAsDataURL(file)
  }

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height))
  }

  const uploadCropped = async () => {
    if (!completedCrop || !imgRef.current) return
    setUploading(true)
    const image = imgRef.current
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width  = completedCrop.width  * scaleX
    canvas.height = completedCrop.height * scaleY
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image,
      completedCrop.x * scaleX, completedCrop.y * scaleY,
      completedCrop.width * scaleX, completedCrop.height * scaleY,
      0, 0, canvas.width, canvas.height
    )
    canvas.toBlob(async (blob) => {
      const ext = originalFileRef.current.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('covers').upload(fileName, blob, { upsert: true, contentType: `image/${ext}` })
      if (!error) {
        const { data: urlData } = supabase.storage.from('covers').getPublicUrl(fileName)
        setCoverImage(urlData.publicUrl)
      }
      setUploading(false)
      setShowCrop(false)
    }, `image/${originalFileRef.current.name.split('.').pop()}`)
  }

  const saveDraft = async () => {
    if (!title.trim()) return setFormError('Title is required to save a draft.')
    setFormError('')

    const payload = {
      slug: slugify(title),
      title: title.trim(),
      subtitle: subtitle.trim(),
      category: category.trim() || 'Essay',
      cover_image: coverImage,
      excerpt: body.trim().split(' ').slice(0, 30).join(' ') + '...',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      body: body.trim(),
      status: 'draft',
      author_name: authorName.trim(),
      author_avatar: authorAvatar,
    }

    if (editingId) {
      await supabase.from('articles').update(payload).eq('id', editingId)
    } else {
      await supabase.from('articles').insert(payload)
    }

    localStorage.removeItem('tbwb_draft')
    resetEditor()
    setActiveTab('drafts')
  }

  const publish = async (status = 'published') => {
    if (!title.trim())  return setFormError('Title is required.')
    if (!body.trim())   return setFormError('Body cannot be empty.')
    if (!coverImage)    return setFormError('Cover image is required.')
    setFormError('')

    const payload = {
      slug: slugify(title),
      title: title.trim(),
      subtitle: subtitle.trim(),
      category: category.trim() || 'Essay',
      cover_image: coverImage,
      excerpt: body.trim().split(' ').slice(0, 30).join(' ') + '...',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      body: body.trim(),
      status,
      author_name: authorName.trim(),
      author_avatar: authorAvatar,
    }

    let error
    if (editingId) {
      ({ error } = await supabase.from('articles').update(payload).eq('id', editingId))
    } else {
      ({ error } = await supabase.from('articles').insert(payload))
    }

    if (!error) {
      localStorage.removeItem('tbwb_draft')
      resetEditor()
      setPublished(true)
      setTimeout(() => setPublished(false), 4000)
    } else {
      setFormError('Something went wrong. Please try again.')
    }
  }

  const changePassword = () => {
    setPwChangeErr(''); setPwChangeMsg('')
    if (currentPw !== getPassword()) return setPwChangeErr('Current password is wrong.')
    if (!newPw.trim())               return setPwChangeErr('New password cannot be empty.')
    if (newPw !== confirmPw)         return setPwChangeErr('Passwords do not match.')
    if (newPw.length < 6)            return setPwChangeErr('Password must be at least 6 characters.')
    localStorage.setItem('tbwb_password', newPw)
    setPwChangeMsg('Password updated successfully.')
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    setTimeout(() => { setPwChangeMsg(''); setShowPwChange(false) }, 2500)
  }

  if (!authed) return (
    <div className="write-gate">
      <div className="write-gate__box animate-scaleIn">
        <div className="write-gate__logo">✦</div>
        <h2 className="write-gate__title">Writer Access</h2>
        <p className="write-gate__sub">This page is private. Enter your password.</p>
        <input
          type="password" placeholder="Password" value={pwInput}
          onChange={e => setPwInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          className="write-gate__input" autoFocus
        />
        {pwError && <p className="write-gate__error">{pwError}</p>}
        <button className="write-gate__btn" onClick={login}>Enter</button>
      </div>
    </div>
  )

  return (
    <div className="write-page">

      {/* Crop Modal */}
      {showCrop && (
        <div className="crop-modal">
          <div className="crop-modal__box">
            <h3 className="crop-modal__title">Crop Cover Image</h3>
            <p className="crop-modal__sub">Drag to reposition. 16:9 ratio.</p>
            <div className="crop-modal__canvas">
              <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} aspect={ASPECT}>
                <img ref={imgRef} src={cropSrc} onLoad={onImageLoad} alt="Crop" style={{ maxHeight: '60vh', maxWidth: '100%' }} />
              </ReactCrop>
            </div>
            <div className="crop-modal__actions">
              <button className="crop-modal__cancel" onClick={() => setShowCrop(false)}>Cancel</button>
              <button className="crop-modal__confirm" onClick={uploadCropped} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Use this crop'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="write-topbar">
        <div className="write-topbar__left">
          <Link to="/" className="write-nav__logo">
            <img src={logo} alt="TBWB" className="navbar__logo-img" />
            <span className="navbar__logo-text">TBWB</span>
          </Link>
          <div className="write-nav__links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <Link to="/articles" className={location.pathname === '/articles' ? 'active' : ''}>Articles</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
          </div>
        </div>
        <div className="write-topbar__actions">
          <span className="write-topbar__draft">Draft autosaved</span>
          <button className="write-topbar__settings" onClick={() => setShowPwChange(!showPwChange)}>⚙ Settings</button>
          <button className="write-topbar__publish" onClick={() => publish('published')}>Publish →</button>
        </div>
      </div>

      {/* Password change panel */}
      {showPwChange && (
        <div className="write-settings animate-fadeUp">
          <div className="write-settings__inner">
            <h3 className="write-settings__title">Change Password</h3>
            <div className="write-settings__fields">
              <input type="password" placeholder="Current password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="write-input" />
              <input type="password" placeholder="New password" value={newPw} onChange={e => setNewPw(e.target.value)} className="write-input" />
              <input type="password" placeholder="Confirm new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="write-input" />
            </div>
            {pwChangeErr && <p className="write-error">{pwChangeErr}</p>}
            {pwChangeMsg && <p className="write-success">{pwChangeMsg}</p>}
            <button className="write-settings__save" onClick={changePassword}>Update Password</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="write-tabs">
        <button className={`write-tab ${activeTab === 'editor' ? 'write-tab--active' : ''}`} onClick={() => { resetEditor(); setActiveTab('editor') }}>
          {editingId ? '✏️ Editing' : '+ New Article'}
        </button>
        <button className={`write-tab ${activeTab === 'drafts' ? 'write-tab--active' : ''}`} onClick={() => setActiveTab('drafts')}>
          Drafts {drafts.length > 0 && <span className="write-tab__count">{drafts.length}</span>}
        </button>
        <button className={`write-tab ${activeTab === 'published' ? 'write-tab--active' : ''}`} onClick={() => setActiveTab('published')}>
          Published
        </button>
      </div>

      {/* Editor Tab */}
      {activeTab === 'editor' && (
        <div className="write-editor">
          {published && <div className="write-published animate-fadeUp">✓ Article published successfully.</div>}
          {formError  && <p className="write-error write-error--top">{formError}</p>}

          <input type="text" placeholder="Article title..." value={title} onChange={e => setTitle(e.target.value)} className="write-title-input" />
          <input type="text" placeholder="Subtitle (optional)" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="write-subtitle-input" />

          <div className="write-meta-row">
            <input type="text" placeholder="Category (e.g. Society, Life, Nigeria)" value={category} onChange={e => setCategory(e.target.value)} className="write-input" />
            <div className="write-cover-upload">
              <label className="write-cover-label">
                {uploading ? 'Uploading...' : coverImage ? 'Change Cover Image' : 'Upload Cover Image'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
              </label>
              {coverImage && <div className="write-cover-preview"><img src={coverImage} alt="Cover preview" /></div>}
            </div>
          </div>

          {/* Author */}
          <div className="write-author-row">
            <input
              type="text"
              placeholder="Author name"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              className="write-input"
            />
            <div className="write-cover-upload">
              <label className="write-cover-label">
                {uploadingAvatar ? 'Uploading...' : authorAvatar ? 'Change Author Photo' : 'Upload Author Photo'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0]
                    if (!file) return
                    setUploadingAvatar(true)
                    const ext = file.name.split('.').pop()
                    const fileName = `avatar_${Date.now()}.${ext}`
                    const { error } = await supabase.storage
                      .from('covers')
                      .upload(fileName, file, { upsert: true })
                    if (!error) {
                      const { data: urlData } = supabase.storage.from('covers').getPublicUrl(fileName)
                      setAuthorAvatar(urlData.publicUrl)
                    }
                    setUploadingAvatar(false)
                  }}
                />
              </label>
              {authorAvatar && (
                <div className="write-avatar-preview">
                  <img src={authorAvatar} alt="Author" />
                </div>
              )}
            </div>
          </div>

          <textarea placeholder="Write your essay here..." value={body} onChange={e => setBody(e.target.value)} className="write-body" />

          <div className="write-footer">
            <span className="write-wordcount">{body.trim() ? body.trim().split(/\s+/).length : 0} words</span>
            <div className="write-footer__btns">
              <button className="write-draft-btn" onClick={saveDraft}>Save Draft</button>
              <button className="write-publish-btn" onClick={() => publish('published')}>
                {editingId ? 'Update Article →' : 'Publish Article →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drafts Tab */}
      {activeTab === 'drafts' && (
        <div className="write-list">
          <h2 className="write-list__title">Saved Drafts</h2>
          {loadingList && <p className="write-list__empty">Loading...</p>}
          {!loadingList && drafts.length === 0 && <p className="write-list__empty">No drafts yet.</p>}
          {drafts.map(a => (
            <div key={a.id} className="write-list__item">
              <div className="write-list__info">
                <span className="write-list__category">{a.category}</span>
                <span className="write-list__name">{a.title}</span>
                <span className="write-list__date">{a.date}</span>
              </div>
              <div className="write-list__actions">
                <button className="write-list__edit" onClick={() => loadForEdit(a.id)}>Edit</button>
                <button className="write-list__delete" onClick={() => deleteArticle(a.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Published Tab */}
      {activeTab === 'published' && (
        <div className="write-list">
          <h2 className="write-list__title">Published Articles</h2>
          {loadingList && <p className="write-list__empty">Loading...</p>}
          {!loadingList && articles.length === 0 && <p className="write-list__empty">No published articles yet.</p>}
          {articles.map(a => (
            <div key={a.id} className="write-list__item">
              <div className="write-list__info">
                <span className="write-list__category">{a.category}</span>
                <span className="write-list__name">{a.title}</span>
                <span className="write-list__date">{a.date}</span>
              </div>
              <div className="write-list__actions">
                <Link to={`/article/${a.slug}`} className="write-list__view" target="_blank">View</Link>
                <button className="write-list__edit" onClick={() => loadForEdit(a.id)}>Edit</button>
                <button className="write-list__delete" onClick={() => deleteArticle(a.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}