import { PERSONAS } from '@/data/static'
import type { Persona } from '@/data/types'

interface PersonaTabsProps {
  active: Persona
  onChange: (p: Persona) => void
}

const TABS: { key: Persona; label: string; color: string }[] = [
  { key: 'all',      label: 'ALL',             color: '#00D4FF' },
  { key: 'fluentrx', label: 'FluentRx',        color: '#00D4FF' },
  { key: 'coder',    label: 'CoderClint',      color: '#A78BFA' },
  { key: 'teacher',  label: 'ClintTeacher',    color: '#10B981' },
  { key: 'trader',   label: 'TraderSkinFlint', color: '#F59E0B' },
]

export function PersonaTabs({ active, onChange }: PersonaTabsProps) {
  return (
    <nav
      className="flex items-stretch px-7 border-b overflow-x-auto gap-0.5"
      style={{ background: '#131929', borderColor: '#1E2D45' }}
    >
      {TABS.map(({ key, label, color }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="border-b-2 text-[10px] font-bold uppercase tracking-[0.12em] px-[18px] py-[13px] cursor-pointer whitespace-nowrap -mb-px flex-shrink-0 transition-colors duration-150"
            style={{
              fontFamily: "'Space Mono', monospace",
              background: 'none',
              border: 'none',
              borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
              color: isActive ? color : '#64748B',
            }}
          >
            {label}
          </button>
        )
      })}
    </nav>
  )
}

export { PERSONAS }
