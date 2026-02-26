import React, { useState, useCallback } from 'react'
import { useTeamMember } from './hooks/useTeamMember'
import { useContent, useCampaigns } from './hooks/useContent'
import { TEAM_MEMBERS, getMember } from './lib/team'
import TeamPicker from './components/TeamPicker'
import CommentsPanel from './components/CommentsPanel'
import { Avatar, AssigneeSelector } from './components/Avatar'

// ── Brand tokens ────────────────────────────────────────────────────────────
const PINK       = '#F05881'
const DEEP_ROSE  = '#a12f52'
const CORAL      = '#ef4056'
const FOG        = '#FBF9F3'
const GREY       = '#757575'
const BORDER     = '#e8e4dd'

const STAGES = ['Idea', 'In Campaign', 'In Production', 'Ready', 'Published']
const CHANNELS = ['Instagram', 'TikTok', 'Email', 'Blog', 'YouTube', 'Pinterest', 'LinkedIn']

const ROAST_COLORS = {
  light:   '#fa8f9c',
  medium:  '#F05881',
  dark:    '#a12f52',
  blend:   '#ef4056',
  decaf:   '#FBF9F3',
  special: '#6366f1',
  app:     '#22c55e',
}

const PRODUCTS = [
  { id: 'vol3', name: 'Vol. 3 Drop', roast: 'special' },
  { id: 'light1', name: 'Morning Light', roast: 'light' },
  { id: 'med1', name: 'The Daily', roast: 'medium' },
  { id: 'dark1', name: 'Night Watch', roast: 'dark' },
  { id: 'blend1', name: 'House Blend', roast: 'blend' },
  { id: 'app1', name: 'App Launch', roast: 'app' },
]

const CONTENT_CATEGORIES = ['Craft', 'Origins', 'Culture', 'Creative', 'Forward']

// ── Helpers ──────────────────────────────────────────────────────────────────
function stageColor(stage) {
  const map = { 'Idea': '#e0dcd5', 'In Campaign': '#fde68a', 'In Production': '#93c5fd', 'Ready': '#86efac', 'Published': PINK }
  return map[stage] || '#e0dcd5'
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const btn = (active, color = PINK) => ({
  background: active ? color : 'transparent',
  color: active ? '#fff' : GREY,
  border: `1.5px solid ${active ? color : BORDER}`,
  borderRadius: 8, padding: '6px 14px',
  cursor: 'pointer', fontSize: 13,
  fontFamily: 'Arial, sans-serif',
  transition: 'all 0.15s',
})

const input = {
  width: '100%', padding: '10px 12px',
  border: `1.5px solid ${BORDER}`, borderRadius: 8,
  fontSize: 14, fontFamily: 'Arial, sans-serif',
  background: '#fff', color: '#333', outline: 'none',
  boxSizing: 'border-box',
}

const label = {
  fontSize: 12, fontWeight: 600, color: GREY,
  textTransform: 'uppercase', letterSpacing: '0.5px',
  marginBottom: 4, display: 'block',
}

// ── ContentCard ───────────────────────────────────────────────────────────────
function ContentCard({ item, onEdit, onDelete, onComment, onStageChange, commentCount = 0 }) {
  const assignee = getMember(item.assigned_to)
  const product = PRODUCTS.find(p => p.id === item.product_id)
  const accent = product ? ROAST_COLORS[product.roast] : stageColor(item.stage)

  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: `1px solid ${BORDER}`,
      borderLeft: `4px solid ${accent}`,
      padding: '12px 14px', marginBottom: 10,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#333', lineHeight: 1.4, marginBottom: 6 }}>
            {item.title}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
            {item.stage && (
              <span style={{
                fontSize: 10, fontWeight: 700, borderRadius: 4, padding: '2px 7px',
                background: stageColor(item.stage) + '30',
                color: stageColor(item.stage) === '#e0dcd5' ? GREY : stageColor(item.stage),
                textTransform: 'uppercase', letterSpacing: '0.4px',
              }}>{item.stage}</span>
            )}
            {item.channels?.map(ch => (
              <span key={ch} style={{
                fontSize: 10, background: FOG, color: GREY,
                borderRadius: 4, padding: '2px 7px', border: `1px solid ${BORDER}`,
              }}>{ch}</span>
            ))}
            {item.category && (
              <span style={{
                fontSize: 10, background: PINK + '15', color: PINK,
                borderRadius: 4, padding: '2px 7px',
              }}>{item.category}</span>
            )}
          </div>
          {item.scheduled_date && (
            <div style={{ fontSize: 11, color: GREY }}>📅 {formatDate(item.scheduled_date)}</div>
          )}
        </div>
        {assignee && <Avatar memberId={item.assigned_to} size={26} />}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginTop: 10, paddingTop: 10,
        borderTop: `1px solid ${BORDER}`,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {STAGES.map(s => (
            <button key={s} title={s}
              onClick={() => onStageChange(item.id, s)}
              style={{
                width: 8, height: 8, borderRadius: '50%', border: 'none',
                background: item.stage === s ? stageColor(s) : '#e0dcd5',
                cursor: 'pointer', padding: 0,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => onComment(item)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: GREY, display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            💬 {commentCount > 0 ? commentCount : ''}
          </button>
          <button onClick={() => onEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: GREY }}>✏️</button>
          <button onClick={() => onDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#ccc' }}>🗑</button>
        </div>
      </div>
    </div>
  )
}

// ── ContentModal (add/edit) ───────────────────────────────────────────────────
function ContentModal({ item, onSave, onClose, currentMember }) {
  const [form, setForm] = useState(item || {
    title: '', stage: 'Idea', channels: [], category: '',
    product_id: '', scheduled_date: '', caption: '',
    assigned_to: currentMember?.id || null, notes: '',
    campaign_id: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleChannel = (ch) => set('channels', form.channels?.includes(ch)
    ? form.channels.filter(c => c !== ch)
    : [...(form.channels || []), ch])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 800,
      background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 540, margin: '0 auto',
          background: FOG, borderRadius: '20px 20px 0 0',
          maxHeight: '90vh', overflowY: 'auto',
          padding: '24px 24px 32px',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontFamily: '"Times New Roman", serif', fontSize: 22, color: '#333' }}>
            {item ? 'Edit Content' : 'New Content'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: GREY }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <span style={label}>Title *</span>
            <input style={input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="What's this piece of content?" />
          </div>

          <div>
            <span style={label}>Stage</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {STAGES.map(s => (
                <button key={s} onClick={() => set('stage', s)} style={btn(form.stage === s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span style={label}>Channels</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CHANNELS.map(ch => (
                <button key={ch} onClick={() => toggleChannel(ch)} style={btn(form.channels?.includes(ch))}>
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <span style={label}>Category</span>
              <select style={{ ...input }} value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">None</option>
                {CONTENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <span style={label}>Product</span>
              <select style={{ ...input }} value={form.product_id} onChange={e => set('product_id', e.target.value)}>
                <option value="">None</option>
                {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <span style={label}>Scheduled Date</span>
            <input style={input} type="date" value={form.scheduled_date || ''} onChange={e => set('scheduled_date', e.target.value)} />
          </div>

          <AssigneeSelector value={form.assigned_to} onChange={v => set('assigned_to', v)} />

          <div>
            <span style={label}>Caption / Copy</span>
            <textarea style={{ ...input, minHeight: 80, resize: 'vertical' }}
              value={form.caption || ''} onChange={e => set('caption', e.target.value)}
              placeholder="Draft caption or copy direction..." />
          </div>

          <div>
            <span style={label}>Notes</span>
            <textarea style={{ ...input, minHeight: 60, resize: 'vertical' }}
              value={form.notes || ''} onChange={e => set('notes', e.target.value)}
              placeholder="Creative direction, references, brief..." />
          </div>

          <button
            onClick={() => { if (form.title.trim()) onSave(form) }}
            style={{
              background: PINK, color: '#fff', border: 'none',
              borderRadius: 10, padding: '14px 24px',
              fontSize: 16, fontWeight: 600, cursor: 'pointer',
              fontFamily: '"Times New Roman", serif',
              marginTop: 8,
            }}
          >
            {item ? 'Save Changes' : 'Add Content'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Pipeline View ─────────────────────────────────────────────────────────────
function PipelineView({ items, onEdit, onDelete, onComment, onStageChange, commentCounts, filterMember, onFilterMember }) {
  const filtered = filterMember
    ? items.filter(i => i.assigned_to === filterMember)
    : items

  return (
    <div>
      {/* Filter by assignee */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: GREY, fontFamily: 'Arial, sans-serif' }}>Filter:</span>
        <button onClick={() => onFilterMember(null)} style={btn(!filterMember, GREY)}>All</button>
        {TEAM_MEMBERS.map(m => (
          <button key={m.id} onClick={() => onFilterMember(m.id)}
            style={{
              ...btn(filterMember === m.id, m.color),
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              background: filterMember === m.id ? 'rgba(255,255,255,0.4)' : m.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 7, fontWeight: 700, color: '#fff',
            }}>{m.initials}</div>
            {m.name}
          </button>
        ))}
      </div>

      {/* Kanban columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
      }}>
        {STAGES.map(stage => {
          const stageItems = filtered.filter(i => i.stage === stage)
          return (
            <div key={stage} style={{ minWidth: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 12,
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: stageColor(stage),
                }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#333', fontFamily: '"Times New Roman", serif' }}>
                  {stage}
                </span>
                <span style={{
                  fontSize: 11, color: GREY, background: BORDER,
                  borderRadius: 10, padding: '1px 6px',
                }}>{stageItems.length}</span>
              </div>
              {stageItems.length === 0 ? (
                <div style={{
                  border: `2px dashed ${BORDER}`, borderRadius: 12,
                  padding: '20px 14px', textAlign: 'center',
                  fontSize: 12, color: '#ccc',
                }}>Empty</div>
              ) : (
                stageItems.map(item => (
                  <ContentCard key={item.id} item={item}
                    onEdit={onEdit} onDelete={onDelete}
                    onComment={onComment} onStageChange={onStageChange}
                    commentCount={commentCounts[item.id] || 0}
                  />
                ))
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Calendar View ─────────────────────────────────────────────────────────────
function CalendarView({ items, onEdit, onComment, commentCounts }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const itemsByDate = {}
  items.forEach(item => {
    if (!item.scheduled_date) return
    const d = item.scheduled_date.split('T')[0]
    const [y, m, day] = d.split('-').map(Number)
    if (y === year && m - 1 === month) {
      if (!itemsByDate[day]) itemsByDate[day] = []
      itemsByDate[day].push(item)
    }
  })

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }}
          style={{ ...btn(false), padding: '6px 10px' }}>‹</button>
        <h3 style={{ margin: 0, fontFamily: '"Times New Roman", serif', fontSize: 20 }}>{monthName}</h3>
        <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }}
          style={{ ...btn(false), padding: '6px 10px' }}>›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: GREY, padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
        {cells.map((day, i) => {
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const dayItems = day ? (itemsByDate[day] || []) : []
          return (
            <div key={i} style={{
              minHeight: 72, background: day ? '#fff' : 'transparent',
              borderRadius: 8, border: day ? `1px solid ${BORDER}` : 'none',
              padding: '6px 4px',
              outline: isToday ? `2px solid ${PINK}` : 'none',
            }}>
              {day && (
                <>
                  <div style={{
                    fontSize: 11, fontWeight: isToday ? 700 : 400,
                    color: isToday ? PINK : GREY,
                    marginBottom: 4, textAlign: 'right', paddingRight: 4,
                  }}>{day}</div>
                  {dayItems.map(item => {
                    const product = PRODUCTS.find(p => p.id === item.product_id)
                    const color = product ? ROAST_COLORS[product.roast] : PINK
                    const assignee = getMember(item.assigned_to)
                    return (
                      <div key={item.id}
                        onClick={() => onEdit(item)}
                        style={{
                          background: color + '20', borderLeft: `3px solid ${color}`,
                          borderRadius: '0 4px 4px 0', padding: '2px 5px',
                          marginBottom: 2, cursor: 'pointer',
                          fontSize: 10, color: '#333', lineHeight: 1.4,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {item.title}
                        </span>
                        {assignee && (
                          <div style={{
                            width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                            background: assignee.color, marginLeft: 3,
                          }} />
                        )}
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Campaign Modal ─────────────────────────────────────────────────────────────
function CampaignModal({ campaign, onSave, onClose }) {
  const [form, setForm] = useState(campaign || {
    name: '', description: '', start_date: '', end_date: '',
    status: 'Planning', channels: [], product_id: '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleChannel = ch => set('channels', form.channels?.includes(ch)
    ? form.channels.filter(c => c !== ch) : [...(form.channels || []), ch])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 800,
      background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 540, margin: '0 auto',
        background: FOG, borderRadius: '20px 20px 0 0',
        maxHeight: '90vh', overflowY: 'auto',
        padding: '24px 24px 32px',
        fontFamily: 'Arial, sans-serif',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontFamily: '"Times New Roman", serif', fontSize: 22 }}>
            {campaign ? 'Edit Campaign' : 'New Campaign'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: GREY }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <span style={label}>Campaign Name *</span>
            <input style={input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Vol. 3 Drop" />
          </div>
          <div>
            <span style={label}>Description</span>
            <textarea style={{ ...input, minHeight: 70, resize: 'vertical' }}
              value={form.description || ''} onChange={e => set('description', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <span style={label}>Start Date</span>
              <input style={input} type="date" value={form.start_date || ''} onChange={e => set('start_date', e.target.value)} />
            </div>
            <div>
              <span style={label}>End Date</span>
              <input style={input} type="date" value={form.end_date || ''} onChange={e => set('end_date', e.target.value)} />
            </div>
          </div>
          <div>
            <span style={label}>Channels</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CHANNELS.map(ch => (
                <button key={ch} onClick={() => toggleChannel(ch)} style={btn(form.channels?.includes(ch))}>{ch}</button>
              ))}
            </div>
          </div>
          <div>
            <span style={label}>Product</span>
            <select style={input} value={form.product_id || ''} onChange={e => set('product_id', e.target.value)}>
              <option value="">None</option>
              {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <button
            onClick={() => { if (form.name.trim()) onSave(form) }}
            style={{
              background: PINK, color: '#fff', border: 'none',
              borderRadius: 10, padding: '14px 24px',
              fontSize: 16, fontWeight: 600, cursor: 'pointer',
              fontFamily: '"Times New Roman", serif',
            }}>
            {campaign ? 'Save Changes' : 'Create Campaign'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Campaigns View ─────────────────────────────────────────────────────────────
function CampaignsView({ campaigns, items, onAdd, onEdit, onDelete }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: GREY }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📣</div>
          <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 18, marginBottom: 16 }}>No campaigns yet</p>
          <button onClick={onAdd} style={{ ...btn(true), padding: '10px 24px', fontSize: 14 }}>Create First Campaign</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {campaigns.map(c => {
            const campaignItems = items.filter(i => i.campaign_id === c.id)
            const product = PRODUCTS.find(p => p.id === c.product_id)
            const accent = product ? ROAST_COLORS[product.roast] : PINK
            const published = campaignItems.filter(i => i.stage === 'Published').length
            const pct = campaignItems.length > 0 ? Math.round((published / campaignItems.length) * 100) : 0

            return (
              <div key={c.id} style={{
                background: '#fff', borderRadius: 14,
                border: `1px solid ${BORDER}`,
                borderTop: `4px solid ${accent}`,
                padding: 18,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontFamily: '"Times New Roman", serif', fontSize: 17, color: '#333' }}>{c.name}</h3>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => onEdit(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>✏️</button>
                    <button onClick={() => onDelete(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#ccc' }}>🗑</button>
                  </div>
                </div>
                {c.description && <p style={{ fontSize: 13, color: GREY, margin: '0 0 12px' }}>{c.description}</p>}
                {(c.start_date || c.end_date) && (
                  <p style={{ fontSize: 12, color: GREY, margin: '0 0 12px' }}>
                    {formatDate(c.start_date)} {c.start_date && c.end_date && '→'} {formatDate(c.end_date)}
                  </p>
                )}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: GREY, marginBottom: 4 }}>
                    <span>{campaignItems.length} pieces</span>
                    <span>{pct}% published</span>
                  </div>
                  <div style={{ height: 4, background: BORDER, borderRadius: 2 }}>
                    <div style={{ height: 4, background: accent, borderRadius: 2, width: `${pct}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>
                {c.channels?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {c.channels.map(ch => (
                      <span key={ch} style={{ fontSize: 10, background: FOG, color: GREY, borderRadius: 4, padding: '2px 6px', border: `1px solid ${BORDER}` }}>{ch}</span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Live Indicator ─────────────────────────────────────────────────────────────
function LiveIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
        boxShadow: '0 0 0 2px #22c55e30',
        animation: 'pulse 2s infinite',
      }} />
      <span style={{ fontSize: 11, color: '#22c55e', fontFamily: 'Arial, sans-serif' }}>Live</span>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const { member, showPicker, chooseMember, switchMember } = useTeamMember()
  const { items, loading, addItem, updateItem, deleteItem } = useContent()
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useCampaigns()

  const [activeTab, setActiveTab] = useState('pipeline')
  const [showContentModal, setShowContentModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [commentItem, setCommentItem] = useState(null)
  const [filterMember, setFilterMember] = useState(null)

  // Build comment counts from items metadata (we'll update after load)
  // Simple approach: track in state
  const [commentCounts, setCommentCounts] = useState({})

  const handleSaveContent = async (form) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, { ...form, updated_at: new Date().toISOString() })
      } else {
        await addItem({
          ...form,
          created_by: member?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      setShowContentModal(false)
      setEditingItem(null)
    } catch (e) {
      console.error('Save error:', e)
    }
  }

  const handleDeleteItem = async (id) => {
    if (window.confirm('Delete this content?')) {
      await deleteItem(id)
    }
  }

  const handleStageChange = async (id, stage) => {
    await updateItem(id, { stage, updated_at: new Date().toISOString() })
  }

  const handleSaveCampaign = async (form) => {
    try {
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, form)
      } else {
        await addCampaign({ ...form, created_at: new Date().toISOString() })
      }
      setShowCampaignModal(false)
      setEditingCampaign(null)
    } catch (e) {
      console.error('Campaign save error:', e)
    }
  }

  const tabs = [
    { id: 'pipeline', label: 'Pipeline', icon: '⬡' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'campaigns', label: 'Campaigns', icon: '📣' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: FOG, fontFamily: 'Arial, sans-serif' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; }
        textarea { font-family: Arial, sans-serif; }
      `}</style>

      {/* Team Picker */}
      {showPicker && <TeamPicker onChoose={chooseMember} currentMember={member} />}

      {/* Header */}
      <header style={{
        background: '#fff', borderBottom: `1px solid ${BORDER}`,
        padding: '0 20px', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 20, fontWeight: 700, color: PINK,
            }}>tāst</span>
            <span style={{ fontSize: 13, color: GREY }}>content ops</span>
            <LiveIndicator />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Team avatars */}
            <div style={{ display: 'flex', gap: -4 }}>
              {TEAM_MEMBERS.map(m => (
                <div key={m.id} title={m.name} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: m.color,
                  border: `2px solid ${member?.id === m.id ? '#333' : '#fff'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: '#fff',
                  marginLeft: -6, cursor: 'pointer',
                  zIndex: member?.id === m.id ? 2 : 1,
                  boxShadow: member?.id === m.id ? '0 0 0 2px ' + m.color : 'none',
                }}
                  onClick={switchMember}
                >
                  {m.initials}
                </div>
              ))}
            </div>

            {member && (
              <button onClick={switchMember} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: FOG, border: `1px solid ${BORDER}`,
                borderRadius: 20, padding: '5px 12px 5px 6px',
                cursor: 'pointer', fontSize: 13,
              }}>
                <Avatar memberId={member.id} size={22} />
                <span style={{ color: '#333' }}>{member.name}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === t.id ? PINK : 'transparent'}`,
              padding: '10px 16px', cursor: 'pointer',
              fontSize: 13, fontWeight: activeTab === t.id ? 700 : 400,
              color: activeTab === t.id ? PINK : GREY,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s',
            }}>
              {t.icon} {t.label}
              {t.id === 'pipeline' && items.length > 0 && (
                <span style={{
                  background: activeTab === 'pipeline' ? PINK : BORDER,
                  color: activeTab === 'pipeline' ? '#fff' : GREY,
                  borderRadius: 10, padding: '1px 6px', fontSize: 10,
                }}>{items.length}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px 100px' }}>

        {/* Action bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontFamily: '"Times New Roman", serif', fontSize: 22, color: '#333' }}>
            {activeTab === 'pipeline' && 'Content Pipeline'}
            {activeTab === 'calendar' && 'Content Calendar'}
            {activeTab === 'campaigns' && 'Campaigns'}
          </h2>
          <button
            onClick={() => {
              if (activeTab === 'campaigns') {
                setEditingCampaign(null); setShowCampaignModal(true)
              } else {
                setEditingItem(null); setShowContentModal(true)
              }
            }}
            style={{
              background: PINK, color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 20px',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: '"Times New Roman", serif',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            + {activeTab === 'campaigns' ? 'New Campaign' : 'New Content'}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: GREY }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>☕</div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'pipeline' && (
              <PipelineView
                items={items}
                onEdit={item => { setEditingItem(item); setShowContentModal(true) }}
                onDelete={handleDeleteItem}
                onComment={item => setCommentItem(item)}
                onStageChange={handleStageChange}
                commentCounts={commentCounts}
                filterMember={filterMember}
                onFilterMember={setFilterMember}
              />
            )}
            {activeTab === 'calendar' && (
              <CalendarView
                items={items}
                onEdit={item => { setEditingItem(item); setShowContentModal(true) }}
                onComment={item => setCommentItem(item)}
                commentCounts={commentCounts}
              />
            )}
            {activeTab === 'campaigns' && (
              <CampaignsView
                campaigns={campaigns}
                items={items}
                onAdd={() => { setEditingCampaign(null); setShowCampaignModal(true) }}
                onEdit={c => { setEditingCampaign(c); setShowCampaignModal(true) }}
                onDelete={async id => { if (window.confirm('Delete campaign?')) await deleteCampaign(id) }}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showContentModal && (
        <ContentModal
          item={editingItem}
          currentMember={member}
          onSave={handleSaveContent}
          onClose={() => { setShowContentModal(false); setEditingItem(null) }}
        />
      )}

      {showCampaignModal && (
        <CampaignModal
          campaign={editingCampaign}
          onSave={handleSaveCampaign}
          onClose={() => { setShowCampaignModal(false); setEditingCampaign(null) }}
        />
      )}

      {commentItem && (
        <CommentsPanel
          contentItemId={commentItem.id}
          currentMember={member}
          onClose={() => setCommentItem(null)}
        />
      )}
    </div>
  )
}
