export const TEAM_MEMBERS = [
  { id: 'obi',    name: 'Obi',    color: '#F05881', initials: 'O' },
  { id: 'reggie', name: 'Reggie', color: '#a12f52', initials: 'R' },
  { id: 'maggie', name: 'Maggie', color: '#ef4056', initials: 'M' },
  { id: 'jason',  name: 'Jason',  color: '#757575', initials: 'J' },
]

export const getMember = (id) => TEAM_MEMBERS.find(m => m.id === id) || null
