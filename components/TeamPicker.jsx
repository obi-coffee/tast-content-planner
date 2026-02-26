import React from 'react'
import { TEAM_MEMBERS } from '../lib/team'

export default function TeamPicker({ onChoose, currentMember }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(251,249,243,0.97)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          fontFamily: '"Times New Roman", serif',
          fontSize: 32, fontWeight: 700,
          color: '#F05881', letterSpacing: '-0.5px',
          marginBottom: 8,
        }}>tāst content ops</div>
        <p style={{ color: '#757575', fontSize: 15, margin: 0 }}>
          {currentMember ? 'Switch to a different team member' : 'Who are you today?'}
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 16, width: '100%', maxWidth: 360, padding: '0 24px',
      }}>
        {TEAM_MEMBERS.map(member => (
          <button
            key={member.id}
            onClick={() => onChoose(member.id)}
            style={{
              background: currentMember?.id === member.id ? member.color : '#fff',
              border: `2px solid ${member.color}`,
              borderRadius: 12,
              padding: '24px 16px',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 12,
              transition: 'all 0.15s ease',
              boxShadow: currentMember?.id === member.id
                ? `0 4px 20px ${member.color}40`
                : '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: currentMember?.id === member.id ? 'rgba(255,255,255,0.3)' : member.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: '#fff',
              fontFamily: '"Times New Roman", serif',
            }}>
              {member.initials}
            </div>
            <span style={{
              fontSize: 16, fontWeight: 600,
              color: currentMember?.id === member.id ? '#fff' : '#333',
              fontFamily: '"Times New Roman", serif',
            }}>
              {member.name}
            </span>
          </button>
        ))}
      </div>

      {currentMember && (
        <button
          onClick={() => onChoose(currentMember.id)}
          style={{
            marginTop: 32, background: 'none', border: 'none',
            color: '#757575', fontSize: 14, cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Cancel — stay as {currentMember.name}
        </button>
      )}
    </div>
  )
}
