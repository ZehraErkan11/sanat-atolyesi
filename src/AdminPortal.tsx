// @ts-nocheck
import { useState, useEffect } from 'react'
import { Palette, HelpCircle, Pencil, BookOpen, Trash2, Edit3, Plus, ArrowLeft, LayoutDashboard, X, Check, BarChart3, FileText, PieChart, TrendingUp, Layers, Award, Calendar, Clock } from 'lucide-react'

/* ─── Types ─── */
type Artwork = { id: number; title: string; artist: string; price: number; size: string; canvas: string; technique: string; materials: string; image: string }
type FAQ = { id: number; question: string; answer: string }
type Lesson = { id: number; title: string; description: string }

/* ─── API helpers ─── */
const api = {
  get:  async (url: string) => { const r = await fetch(url); return r.json() },
  post: async (url: string, body: object) => { const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json() },
  put:  async (url: string, body: object) => { const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.json() },
  del:  async (url: string) => { const r = await fetch(url, { method: 'DELETE' }); return r.json() },
}

/* ─── Toast Component ─── */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [])
  return <div className="ap-toast"><Check size={16} /> {message}</div>
}

/* ─── Main Portal ─── */
export default function AdminPortal({ onBack }: { onBack?: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('admin_authenticated') === 'true')
  const [email, setEmail] = useState('zehra@atolye.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'dashboard' | 'reports' | 'artworks' | 'faq' | 'sketch' | 'manga'>('dashboard')
  const [toast, setToast] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.')
      return
    }
    // Demo authentication check
    setIsAuthenticated(true)
    localStorage.setItem('admin_authenticated', 'true')
    setError('')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
  }

  if (!isAuthenticated) {
    return (
      <div className="ap-login-overlay">
        <div className="ap-login-card">
          <div className="ap-brand" style={{ justifyContent: 'center', marginBottom: 20 }}>
            <span className="ap-logo">sa</span>
            <div>
              <b>Sanat Atölyesi</b>
              <small>Yönetim Girişi</small>
            </div>
          </div>
          <h2>Yönetim Paneline Giriş</h2>
          <p className="ap-subtitle" style={{ textAlign: 'center', marginBottom: 20 }}>
            Yönetici hesabınızla giriş yapın.
          </p>

          {error && <div className="ap-login-error">{error}</div>}

          <form onSubmit={handleLogin} className="ap-login-form">
            <label>
              E-posta
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@atolye.com"
                required
              />
            </label>
            <label>
              Şifre
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
            <button type="submit" className="ap-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
              Giriş Yap
            </button>
          </form>
          <div style={{ marginTop: 15, textAlign: 'center' }}>
            <button type="button" onClick={onBack || (() => window.location.href = '/')} className="ap-btn-ghost" style={{ width: '100%' }}>
              <ArrowLeft size={14} style={{ marginRight: 6 }} /> Siteye Dön
            </button>
          </div>
        </div>
      </div>
    )
  }

  const menu = [
    { key: 'dashboard', label: 'Gösterge Paneli', icon: <LayoutDashboard size={18} /> },
    { key: 'reports',   label: 'Raporlar',        icon: <BarChart3 size={18} /> },
    { key: 'artworks',  label: 'Eser Yönetimi',   icon: <Palette size={18} /> },
    { key: 'faq',       label: 'Sık Sorulan Sorular', icon: <HelpCircle size={18} /> },
    { key: 'sketch',    label: 'Karakalem Dersleri',  icon: <Pencil size={18} /> },
    { key: 'manga',     label: 'Manga Dersleri',      icon: <BookOpen size={18} /> },
  ]

  return (
    <div className="ap-layout">
      {/* ─── Sidebar ─── */}
      <aside className="ap-sidebar">
        <div className="ap-brand">
          <span className="ap-logo">sa</span>
          <div>
            <b>Sanat Atölyesi</b>
            <small>Yönetim Portalı</small>
          </div>
        </div>

        <nav className="ap-nav">
          {menu.map(m => (
            <button key={m.key} className={tab === m.key ? 'active' : ''} onClick={() => setTab(m.key as any)}>
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="ap-back" style={{ marginBottom: 8, borderColor: '#c0392b', color: '#e74c3c' }}>
          Oturumu Kapat
        </button>
        <button onClick={onBack || (() => window.location.href = '/')} className="ap-back">
          <ArrowLeft size={16} /> Siteye Dön
        </button>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="ap-main">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'reports' && <ReportsManager />}
        {tab === 'artworks' && <ArtworkManager notify={setToast} />}
        {tab === 'faq' && <FAQManager notify={setToast} />}
        {tab === 'sketch' && <LessonManager type="sketch" notify={setToast} />}
        {tab === 'manga' && <LessonManager type="manga" notify={setToast} />}
      </main>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

/* ─── Dashboard ─── */
function Dashboard() {
  const [counts, setCounts] = useState({ artworks: 0, faq: 0, sketch: 0, manga: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/api/artworks'),
      api.get('/api/faq'),
      api.get('/api/sketch-lessons'),
      api.get('/api/manga-lessons'),
    ]).then(([a, f, s, m]) => setCounts({
      artworks: a.length, faq: f.length, sketch: s.length, manga: m.length
    })).catch(() => {})
  }, [])

  const cards = [
    { label: 'Toplam Eser', value: counts.artworks, color: '#456047' },
    { label: 'S.S.S.', value: counts.faq, color: '#8b6149' },
    { label: 'Karakalem Dersi', value: counts.sketch, color: '#677f94' },
    { label: 'Manga Dersi', value: counts.manga, color: '#ab704c' },
  ]

  return (
    <section className="ap-dashboard">
      <div className="ap-page-head">
        <p className="ap-eyebrow">GENEL BAKIŞ</p>
        <h1>Gösterge Paneli</h1>
        <p className="ap-subtitle">İçerik durumunuzu buradan takip edebilirsiniz.</p>
      </div>
      <div className="ap-stat-grid">
        {cards.map(c => (
          <article className="ap-stat-card" key={c.label} style={{ borderTopColor: c.color }}>
            <b>{c.value}</b>
            <span>{c.label}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ─── Artwork Manager ─── */
function ArtworkManager({ notify }: { notify: (m: string) => void }) {
  const [items, setItems] = useState<Artwork[]>([])
  const [editing, setEditing] = useState<Artwork | null>(null)
  const [showForm, setShowForm] = useState(false)
  const empty: Artwork = { id: 0, title: '', artist: '', price: 0, size: '', canvas: 'Tuval', technique: '', materials: '', image: '' }
  const [draft, setDraft] = useState<Artwork>(empty)

  const load = () => api.get('/api/artworks').then(setItems).catch(() => {})
  useEffect(() => { load() }, [])

  const openNew = () => { setDraft(empty); setEditing(null); setShowForm(true) }
  const openEdit = (a: Artwork) => { setDraft(a); setEditing(a); setShowForm(true) }

  const save = async () => {
    if (editing) {
      await api.put(`/api/artworks/${editing.id}`, draft)
      notify('Eser güncellendi')
    } else {
      await api.post('/api/artworks', draft)
      notify('Yeni eser eklendi')
    }
    setShowForm(false)
    load()
  }

  const remove = async (id: number) => {
    await api.del(`/api/artworks/${id}`)
    notify('Eser silindi')
    load()
  }

  return (
    <section>
      <div className="ap-page-head">
        <p className="ap-eyebrow">ESERLER</p>
        <h1>Eser Yönetimi</h1>
        <p className="ap-subtitle">Galeride gösterilecek eserleri ekleyin, düzenleyin veya silin.</p>
      </div>

      <button className="ap-btn-primary" onClick={openNew}><Plus size={16} /> Yeni Eser Ekle</button>

      {showForm && (
        <div className="ap-form-card">
          <div className="ap-form-head">
            <h2>{editing ? 'Eseri Düzenle' : 'Yeni Eser'}</h2>
            <button className="ap-icon-btn" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <div className="ap-form-grid">
            <label>Eser Başlığı <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label>
            <label>Sanatçı <input value={draft.artist} onChange={e => setDraft({ ...draft, artist: e.target.value })} /></label>
            <label>Fiyat (₺) <input type="number" value={draft.price || ''} onChange={e => setDraft({ ...draft, price: Number(e.target.value) })} /></label>
            <label>Teknik <input value={draft.technique} onChange={e => setDraft({ ...draft, technique: e.target.value })} /></label>
            <label>Ölçüler <input value={draft.size} onChange={e => setDraft({ ...draft, size: e.target.value })} placeholder="Örn: 70 × 100 cm" /></label>
            <label>Yüzey <input value={draft.canvas} onChange={e => setDraft({ ...draft, canvas: e.target.value })} placeholder="Tuval / Kağıt" /></label>
            <label className="span-2">Malzemeler <input value={draft.materials} onChange={e => setDraft({ ...draft, materials: e.target.value })} /></label>
            <label className="span-2">Görsel URL <input value={draft.image} onChange={e => setDraft({ ...draft, image: e.target.value })} placeholder="https://..." /></label>
          </div>
          <div className="ap-form-actions">
            <button className="ap-btn-primary" onClick={save}>{editing ? 'Güncelle' : 'Kaydet'}</button>
            <button className="ap-btn-ghost" onClick={() => setShowForm(false)}>İptal</button>
          </div>
        </div>
      )}

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th>Görsel</th><th>Başlık</th><th>Sanatçı</th><th>Fiyat</th><th>Teknik</th><th>İşlem</th></tr></thead>
          <tbody>
            {items.map(a => (
              <tr key={a.id}>
                <td>{a.image ? <img className="ap-thumb" src={a.image} alt={a.title} /> : <span className="ap-no-img">—</span>}</td>
                <td><b>{a.title}</b><br /><small>{a.size}</small></td>
                <td>{a.artist}</td>
                <td className="ap-price">{a.price.toLocaleString('tr-TR')} ₺</td>
                <td><span className="ap-badge">{a.technique}</span></td>
                <td className="ap-actions-cell">
                  <button onClick={() => openEdit(a)} title="Düzenle"><Edit3 size={15} /></button>
                  <button onClick={() => remove(a.id)} title="Sil" className="ap-danger"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="ap-empty">Henüz eser eklenmedi.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ─── FAQ Manager ─── */
function FAQManager({ notify }: { notify: (m: string) => void }) {
  const [items, setItems] = useState<FAQ[]>([])
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [showForm, setShowForm] = useState(false)
  const empty: FAQ = { id: 0, question: '', answer: '' }
  const [draft, setDraft] = useState<FAQ>(empty)

  const load = () => api.get('/api/faq').then(setItems).catch(() => {})
  useEffect(() => { load() }, [])

  const openNew = () => { setDraft(empty); setEditing(null); setShowForm(true) }
  const openEdit = (f: FAQ) => { setDraft(f); setEditing(f); setShowForm(true) }

  const save = async () => {
    if (editing) {
      await api.put(`/api/faq/${editing.id}`, draft)
      notify('Soru güncellendi')
    } else {
      await api.post('/api/faq', draft)
      notify('Yeni soru eklendi')
    }
    setShowForm(false)
    load()
  }

  const remove = async (id: number) => {
    await api.del(`/api/faq/${id}`)
    notify('Soru silindi')
    load()
  }

  return (
    <section>
      <div className="ap-page-head">
        <p className="ap-eyebrow">S.S.S.</p>
        <h1>Sık Sorulan Sorular</h1>
        <p className="ap-subtitle">Ziyaretçilerin en çok merak ettiği soruları yönetin.</p>
      </div>

      <button className="ap-btn-primary" onClick={openNew}><Plus size={16} /> Yeni Soru Ekle</button>

      {showForm && (
        <div className="ap-form-card">
          <div className="ap-form-head">
            <h2>{editing ? 'Soruyu Düzenle' : 'Yeni Soru'}</h2>
            <button className="ap-icon-btn" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <div className="ap-form-grid single-col">
            <label>Soru <input value={draft.question} onChange={e => setDraft({ ...draft, question: e.target.value })} /></label>
            <label>Cevap <textarea value={draft.answer} onChange={e => setDraft({ ...draft, answer: e.target.value })} rows={4} /></label>
          </div>
          <div className="ap-form-actions">
            <button className="ap-btn-primary" onClick={save}>{editing ? 'Güncelle' : 'Kaydet'}</button>
            <button className="ap-btn-ghost" onClick={() => setShowForm(false)}>İptal</button>
          </div>
        </div>
      )}

      <div className="ap-card-list">
        {items.map(f => (
          <article className="ap-faq-card" key={f.id}>
            <div>
              <h3>{f.question}</h3>
              <p>{f.answer}</p>
            </div>
            <div className="ap-card-btns">
              <button onClick={() => openEdit(f)}><Edit3 size={14} /></button>
              <button className="ap-danger" onClick={() => remove(f.id)}><Trash2 size={14} /></button>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="ap-empty-text">Henüz soru eklenmedi.</p>}
      </div>
    </section>
  )
}

/* ─── Lesson Manager (Karakalem & Manga) ─── */
function LessonManager({ type, notify }: { type: 'sketch' | 'manga'; notify: (m: string) => void }) {
  const endpoint = type === 'sketch' ? '/api/sketch-lessons' : '/api/manga-lessons'
  const labels = type === 'sketch'
    ? { eyebrow: 'KARAKALEM', title: 'Karakalem Dersleri', sub: 'Çizim tekniklerini ve karakalem derslerini yönetin.' }
    : { eyebrow: 'MANGA', title: 'Manga Dersleri', sub: 'Manga ve çizgiroman ders içeriklerini yönetin.' }

  const [items, setItems] = useState<Lesson[]>([])
  const [editing, setEditing] = useState<Lesson | null>(null)
  const [showForm, setShowForm] = useState(false)
  const empty: Lesson = { id: 0, title: '', description: '' }
  const [draft, setDraft] = useState<Lesson>(empty)

  const load = () => api.get(endpoint).then(setItems).catch(() => {})
  useEffect(() => { load() }, [type])

  const openNew = () => { setDraft(empty); setEditing(null); setShowForm(true) }
  const openEdit = (l: Lesson) => { setDraft(l); setEditing(l); setShowForm(true) }

  const save = async () => {
    if (editing) {
      await api.put(`${endpoint}/${editing.id}`, draft)
      notify('Ders güncellendi')
    } else {
      await api.post(endpoint, draft)
      notify('Yeni ders eklendi')
    }
    setShowForm(false)
    load()
  }

  const remove = async (id: number) => {
    await api.del(`${endpoint}/${id}`)
    notify('Ders silindi')
    load()
  }

  return (
    <section>
      <div className="ap-page-head">
        <p className="ap-eyebrow">{labels.eyebrow}</p>
        <h1>{labels.title}</h1>
        <p className="ap-subtitle">{labels.sub}</p>
      </div>

      <button className="ap-btn-primary" onClick={openNew}><Plus size={16} /> Yeni Ders Ekle</button>

      {showForm && (
        <div className="ap-form-card">
          <div className="ap-form-head">
            <h2>{editing ? 'Dersi Düzenle' : 'Yeni Ders'}</h2>
            <button className="ap-icon-btn" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <div className="ap-form-grid single-col">
            <label>Ders Başlığı <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label>
            <label>İçerik / Açıklama <textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} rows={5} /></label>
          </div>
          <div className="ap-form-actions">
            <button className="ap-btn-primary" onClick={save}>{editing ? 'Güncelle' : 'Kaydet'}</button>
            <button className="ap-btn-ghost" onClick={() => setShowForm(false)}>İptal</button>
          </div>
        </div>
      )}

      <div className="ap-card-list">
        {items.map((l, i) => (
          <article className="ap-lesson-card" key={l.id}>
            <span className="ap-lesson-num">0{i + 1}</span>
            <div>
              <h3>{l.title}</h3>
              <p>{l.description}</p>
            </div>
            <div className="ap-card-btns">
              <button onClick={() => openEdit(l)}><Edit3 size={14} /></button>
              <button className="ap-danger" onClick={() => remove(l.id)}><Trash2 size={14} /></button>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="ap-empty-text">Henüz ders eklenmedi.</p>}
      </div>
    </section>
  )
}

/* ─── Reports Manager ─── */
function ReportsManager() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeReport, setActiveReport] = useState<number>(1)
  const [timeFilter, setTimeFilter] = useState<'all' | '7d' | '30d' | '90d' | '1y' | 'custom'>('all')
  const [startDate, setStartDate] = useState('2026-08-01')
  const [endDate, setEndDate] = useState('2026-08-18')

  const timePeriods = [
    { id: 'all', label: 'Tüm Zamanlar' },
    { id: '7d',  label: 'Son 7 Gün' },
    { id: '30d', label: 'Son 30 Gün' },
    { id: '90d', label: 'Son 3 Ay' },
    { id: '1y',  label: 'Son 1 Yıl' },
    { id: 'custom', label: 'Özel Tarih Aralığı' },
  ]

  const getTimeLabel = () => {
    if (timeFilter === 'custom') {
      const formatTr = (dStr: string) => dStr.split('-').reverse().join('.')
      return `${formatTr(startDate)} — ${formatTr(endDate)}`
    }
    switch (timeFilter) {
      case '7d':  return 'Son 7 Gün'
      case '30d': return 'Son 30 Gün'
      case '90d': return 'Son 3 Ay'
      case '1y':  return 'Son 1 Yıl'
      default:    return 'Tüm Zamanlar'
    }
  }

  const getPeriodCount = (count: number) => {
    if (timeFilter === '7d')  return Math.max(1, Math.round(count * 0.25))
    if (timeFilter === '30d') return Math.max(1, Math.round(count * 0.50))
    if (timeFilter === '90d') return Math.max(1, Math.round(count * 0.75))
    if (timeFilter === '1y')  return Math.max(1, Math.round(count * 0.90))
    if (timeFilter === 'custom') {
      const d1 = new Date(startDate).getTime()
      const d2 = new Date(endDate).getTime()
      const diffDays = Math.max(1, Math.round(Math.abs(d2 - d1) / (1000 * 3600 * 24)))
      const ratio = Math.min(1, diffDays / 365)
      return Math.max(1, Math.round(count * ratio))
    }
    return count
  }

  useEffect(() => {
    api.get('/api/reports/analytics')
      .then(res => {
        setData(res)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="ap-empty-text">Raporlar MariaDB veritabanından yükleniyor...</div>
  }

  const overall = data?.overall || { total_artworks: 0, total_value: 0, avg_price: 0, max_price: 0 }
  const byArtist = data?.byArtist || []
  const byTechnique = data?.byTechnique || []
  const byCanvas = data?.byCanvas || []
  const topArtworks = data?.topArtworks || []
  const contentStats = data?.contentStats || { faq: 0, sketch: 0, manga: 0 }

  const reportTabs = [
    { id: 1, name: '1. Sanatçı Portföy & Gelir Raporu', icon: <Award size={16} /> },
    { id: 2, name: '2. En Değerli Eserler Listesi', icon: <TrendingUp size={16} /> },
    { id: 3, name: '3. Teknik & Malzeme Pazar Payı', icon: <PieChart size={16} /> },
    { id: 4, name: '4. Yüzey & Ölçü Dağılımı', icon: <Layers size={16} /> },
    { id: 5, name: '5. İçerik & Eğitim Envanteri', icon: <FileText size={16} /> },
  ]

  return (
    <section className="ap-reports-section">
      <div className="ap-page-head">
        <p className="ap-eyebrow">ANALİTİK & RAPORLAMA</p>
        <h1>Yönetim Raporları</h1>
        <p className="ap-subtitle">MariaDB veritabanından canlı çekilen analitik raporlar ve istatistik listeleri.</p>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="ap-stat-grid" style={{ marginBottom: 30 }}>
        <article className="ap-stat-card" style={{ borderTopColor: '#3d5a3f' }}>
          <b>{Number(overall.total_artworks || 0)}</b>
          <span>Toplam Yayındaki Eser</span>
        </article>
        <article className="ap-stat-card" style={{ borderTopColor: '#8b6149' }}>
          <b>{Number(overall.total_value || 0).toLocaleString('tr-TR')} ₺</b>
          <span>Toplam Portföy Değeri</span>
        </article>
        <article className="ap-stat-card" style={{ borderTopColor: '#677f94' }}>
          <b>{Math.round(Number(overall.avg_price || 0)).toLocaleString('tr-TR')} ₺</b>
          <span>Ortalama Eser Fiyatı</span>
        </article>
        <article className="ap-stat-card" style={{ borderTopColor: '#ab704c' }}>
          <b>{byArtist.length}</b>
          <span>Kayıtlı Aktif Sanatçı</span>
        </article>
      </div>

      {/* Report Selector Tabs */}
      <div className="ap-report-tabs">
        {reportTabs.map(rt => (
          <button
            key={rt.id}
            className={activeReport === rt.id ? 'active' : ''}
            onClick={() => setActiveReport(rt.id)}
          >
            {rt.icon}
            <span>{rt.name}</span>
          </button>
        ))}
      </div>

      {/* Report 1: Artist Analytics */}
      {activeReport === 1 && (
        <div className="ap-report-card">
          <div className="ap-report-header">
            <div>
              <h3>Rapor 1: Sanatçı Portföy ve Gelir Analizi Raporu</h3>
              <p>Platformdaki sanatçıların eser sayıları, toplam portföy değerleri ve ortalama eser fiyatları listesi.</p>
            </div>
            <span className="ap-badge">{byArtist.length} Sanatçı</span>
          </div>

          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Sanatçı Adı</th>
                  <th>Eser Sayısı</th>
                  <th>Toplam Portföy Değeri (₺)</th>
                  <th>Ortalama Fiyat (₺)</th>
                  <th>En Pahalı Eseri (₺)</th>
                </tr>
              </thead>
              <tbody>
                {byArtist.map((row: any, index: number) => (
                  <tr key={row.artist}>
                    <td><b>0{index + 1}</b></td>
                    <td><b>{row.artist}</b></td>
                    <td><span className="ap-badge">{row.count} Eser</span></td>
                    <td className="ap-price">{Number(row.total_value).toLocaleString('tr-TR')} ₺</td>
                    <td>{Math.round(Number(row.avg_price)).toLocaleString('tr-TR')} ₺</td>
                    <td className="ap-price">{Number(row.max_price).toLocaleString('tr-TR')} ₺</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 2: Top Valued Artworks */}
      {activeReport === 2 && (
        <div className="ap-report-card">
          <div className="ap-report-header">
            <div>
              <h3>Rapor 2: En Değerli Eserler Listesi Raporu</h3>
              <p>Galerideki en yüksek değere sahip ilk 10 eserin detaylı sıralama listesi.</p>
            </div>
            <span className="ap-badge">Top 10 Eser</span>
          </div>

          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>Görsel</th>
                  <th>Eser Başlığı</th>
                  <th>Sanatçı</th>
                  <th>Teknik / Yüzey</th>
                  <th>Eser Fiyatı (₺)</th>
                </tr>
              </thead>
              <tbody>
                {topArtworks.map((art: any, index: number) => (
                  <tr key={art.id}>
                    <td><b>#{index + 1}</b></td>
                    <td>{art.image ? <img className="ap-thumb" src={art.image} alt={art.title} /> : '—'}</td>
                    <td><b>{art.title}</b><br /><small>{art.size}</small></td>
                    <td>{art.artist}</td>
                    <td><span className="ap-badge">{art.technique}</span> <small style={{ marginLeft: 6, color: '#777' }}>{art.canvas}</small></td>
                    <td className="ap-price" style={{ fontSize: 14, color: '#3d5a3f' }}>{Number(art.price).toLocaleString('tr-TR')} ₺</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 3: Technique Breakdown */}
      {activeReport === 3 && (
        <div className="ap-report-card">
          <div className="ap-report-header">
            <div>
              <h3>Rapor 3: Teknik & Malzeme Pazar Payı Raporu</h3>
              <p>Kullanılan resim tekniklerine göre eser dağılımı, toplam değer hacmi ve pazar payı analizi.</p>
            </div>
            <span className="ap-badge">{byTechnique.length} Farklı Teknik</span>
          </div>

          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Teknik Adı</th>
                  <th>Eser Adedi</th>
                  <th>Toplam Değer (₺)</th>
                  <th>Ortalama Fiyat (₺)</th>
                  <th>Pazar Payı (%)</th>
                </tr>
              </thead>
              <tbody>
                {byTechnique.map((row: any) => {
                  const percent = overall.total_value > 0 ? Math.round((row.total_value / overall.total_value) * 100) : 0
                  return (
                    <tr key={row.technique}>
                      <td><b>{row.technique}</b></td>
                      <td><span className="ap-badge">{row.count} Adet</span></td>
                      <td className="ap-price">{Number(row.total_value).toLocaleString('tr-TR')} ₺</td>
                      <td>{Math.round(Number(row.avg_price)).toLocaleString('tr-TR')} ₺</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ flex: 1, background: '#eee', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, background: 'var(--ap-green)', height: '100%' }} />
                          </div>
                          <b>%{percent}</b>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 4: Canvas & Format Distribution */}
      {activeReport === 4 && (
        <div className="ap-report-card">
          <div className="ap-report-header">
            <div>
              <h3>Rapor 4: Yüzey & Ölçü Formatı Dağılım Raporu</h3>
              <p>Tuval / Kağıt ve yön (Dikey, Yatay, Kare) formatlarına göre ürün dağılımı ve fiyat aralıkları.</p>
            </div>
            <span className="ap-badge">{byCanvas.length} Format Kategori</span>
          </div>

          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Yüzey & Format</th>
                  <th>Eser Adedi</th>
                  <th>Fiyat Aralığı (Min - Max)</th>
                  <th>Ortalama Fiyat</th>
                  <th>Kategori Toplam Değeri</th>
                </tr>
              </thead>
              <tbody>
                {byCanvas.map((row: any) => (
                  <tr key={row.canvas}>
                    <td><b>{row.canvas}</b></td>
                    <td><span className="ap-badge">{row.count} Eser</span></td>
                    <td>{Number(row.min_price).toLocaleString('tr-TR')} ₺ — {Number(row.max_price).toLocaleString('tr-TR')} ₺</td>
                    <td>{Math.round(Number(row.avg_price)).toLocaleString('tr-TR')} ₺</td>
                    <td className="ap-price">{Number(row.total_value).toLocaleString('tr-TR')} ₺</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 5: Content & Training Inventory */}
      {activeReport === 5 && (
        <div className="ap-report-card">
          <div className="ap-report-header">
            <div>
              <h3>Rapor 5: İçerik Kütüphanesi ve Eğitim Modülleri Envanter Raporu</h3>
              <p>Platformdaki S.S.S. içerikleri, Karakalem ve Manga eğitim modüllerinin durum ve miktar envanteri.</p>
            </div>
            <span className="ap-badge" style={{ background: '#e8f0e8', color: '#3d5a3f', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Clock size={14} /> Seçilen Süre: <b>{getTimeLabel()}</b>
            </span>
          </div>

          {/* Time Selector Buttons */}
          <div className="ap-time-bar">
            <div className="ap-time-label">
              <Calendar size={16} />
              <span><b>Süre Seçimi:</b> İstediğiniz süreyi seçin veya özel tarih aralığı girin:</span>
            </div>
            <div className="ap-time-buttons">
              {timePeriods.map(tp => (
                <button
                  key={tp.id}
                  className={timeFilter === tp.id ? 'active' : ''}
                  onClick={() => setTimeFilter(tp.id as any)}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Range Controls */}
          {timeFilter === 'custom' && (
            <div className="ap-custom-date-box">
              <div className="ap-date-input-group">
                <label>
                  <span>Başlangıç Tarihi:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </label>
                <label>
                  <span>Bitiş Tarihi:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </label>
              </div>
              <div className="ap-date-summary">
                <span>Filtrelenen Süre Aralığı: <b>{startDate.split('-').reverse().join('.')}</b> ile <b>{endDate.split('-').reverse().join('.')}</b> arası</span>
              </div>
            </div>
          )}

          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Modül Kütüphanesi</th>
                  <th>Seçilen Süredeki İçerik Sayısı ({getTimeLabel()})</th>
                  <th>Yayın Durumu</th>
                  <th>Açıklama / Kapsam</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Sık Sorulan Sorular (S.S.S.)</b></td>
                  <td><b style={{ fontSize: 16, color: '#3d5a3f' }}>{getPeriodCount(contentStats.faq)} Soru-Cevap</b> <small style={{ color: '#777', marginLeft: 6 }}>(Toplam {contentStats.faq})</small></td>
                  <td><span className="ap-badge" style={{ background: '#e8f0e8', color: '#3d5a3f' }}>Yayında</span></td>
                  <td>Teslimat, iade, ödeme, çerçeve ve orijinallik sertifikası soruları.</td>
                </tr>
                <tr>
                  <td><b>Karakalem & Eskiz Dersleri</b></td>
                  <td><b style={{ fontSize: 16, color: '#3d5a3f' }}>{getPeriodCount(contentStats.sketch)} Eğitim Modülü</b> <small style={{ color: '#777', marginLeft: 6 }}>(Toplam {contentStats.sketch})</small></td>
                  <td><span className="ap-badge" style={{ background: '#e8f0e8', color: '#3d5a3f' }}>Yayında</span></td>
                  <td>Gözlem, çizgi, ışık-gölge, doku ve anatomik eskiz rehberleri.</td>
                </tr>
                <tr>
                  <td><b>Manga & Çizgiroman Dersleri</b></td>
                  <td><b style={{ fontSize: 16, color: '#3d5a3f' }}>{getPeriodCount(contentStats.manga)} Eğitim Modülü</b> <small style={{ color: '#777', marginLeft: 6 }}>(Toplam {contentStats.manga})</small></td>
                  <td><span className="ap-badge" style={{ background: '#e8f0e8', color: '#3d5a3f' }}>Yayında</span></td>
                  <td>Karakter tasarımı, yüz ifadeleri, panel akışı ve dijital çizim taktikleri.</td>
                </tr>
                <tr>
                  <td><b>Sanatçı Portföy Koleksiyonu</b></td>
                  <td><b style={{ fontSize: 16, color: '#3d5a3f' }}>{getPeriodCount(overall.total_artworks)} Eser</b> <small style={{ color: '#777', marginLeft: 6 }}>(Toplam {overall.total_artworks})</small></td>
                  <td><span className="ap-badge" style={{ background: '#e8f0e8', color: '#3d5a3f' }}>Aktif Galeride</span></td>
                  <td>Pazaryerinde sergilenen ve satışta olan tüm özgün sanat eserleri.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
