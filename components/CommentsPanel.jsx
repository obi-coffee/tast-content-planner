import React, { useState, useRef, useEffect } from 'react'
import { useComments } from '../hooks/useComments'
import { getMember } from '../lib/team'

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function CommentsPanel({ contentItemId, currentMember, onClose }) {
  const { comments, loading, addComment, deleteComment } = useComments(contentItemId)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async () => {
    if (!text.trim() || !currentMember) return
    setSending(true)
    try {
      await addComment(text.trim(), currentMember.id, currentMember.name)
      setText('')
    } catch (e) {
      console.error(e)
    }
    setSending(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 900,
      display: 'flex', alignItems: 'flex-end',
      background: 'rgba(0,0,0,0.3)',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480, margin: '0 auto',
          background: '#FBF9F3',
          borderRadius: '20px 20px 0 0',
          maxHeight: '75vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.15)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid #e8e4dd',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#333', fontFamily: '"Times New Roman", serif' }}>
              Comments
            </span>
            {comments.length > 0 && (
              <span style={{
                background: '#F05881', color: '#fff',
                borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700,
              }}>
                {comments.length}
              </span>
            )}
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#757575', fontSize: 22, lineHeight: 1, padding: 4,
          }}>×</button>
        </div>

        {/* Comments list */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '16px 20px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {loading && (
            <div style={{ color: '#999', fontSize: 13, textAlign: 'center', padding: 20 }}>Loading...</div>
          )}
          {!loading && comments.length === 0 && (
            <div style={{ color: '#999', fontSize: 13, textAlign: 'center', padding: 20 }}>
              No comments yet. Be the first.
            </div>
          )}
          {comments.map(comment => {
            const author = getMember(comment.author_id)
            const isMe = currentMember?.id === comment.author_id
            return (
              <div key={comment.id} style={{
                display: 'flex', gap: 10,
                flexDirection: isMe ? 'row-reverse' : 'row',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: author?.color || '#ccc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#fff',
                }}>
                  {author?.initials || comment.author_name?.[0] || '?'}
                </div>
                <div style={{ maxWidth: '72%' }}>
                  <div style={{
                    background: isMe ? '#F05881' : '#fff',
                    color: isMe ? '#fff' : '#333',
                    padding: '10px 14px',
                    borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    fontSize: 14, lineHeight: 1.5,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }}>
                    {comment.text}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginTop: 4,
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                  }}>
                    <span style={{ fontSize: 11, color: '#999' }}>
                      {!isMe && `${comment.author_name} · `}{formatTime(comment.created_at)}
                    </span>
                    {isMe && (
                      <button
                        onClick={() => deleteComment(comment.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#ccc', fontSize: 11, padding: 0,
                        }}
                      >
                        delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px 20px',
          borderTop: '1px solid #e8e4dd',
          display: 'flex', gap: 10, alignItems: 'flex-end',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: currentMember?.color || '#ccc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>
            {currentMember?.initials || '?'}
          </div>
          <textarea
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder={currentMember ? `Message as ${currentMember.name}...` : 'Choose a team member first'}
            disabled={!currentMember}
            rows={1}
            style={{
              flex: 1, padding: '10px 14px',
              border: '1.5px solid #e0dcd5',
              borderRadius: 20, resize: 'none',
              fontSize: 14, fontFamily: 'Arial, sans-serif',
              background: '#fff', color: '#333',
              outline: 'none', lineHeight: 1.5,
              minHeight: 40,
            }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending || !currentMember}
            style={{
              background: text.trim() && currentMember ? '#F05881' : '#e0dcd5',
              border: 'none', borderRadius: '50%',
              width: 40, height: 40, flexShrink: 0,
              cursor: text.trim() && currentMember ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
              color: '#fff', fontSize: 16,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
