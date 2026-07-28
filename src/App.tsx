import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { PersonaTabs } from '@/components/PersonaTabs'
import { KpiCards } from '@/components/KpiCards'
import { KanbanBoard } from '@/components/KanbanBoard'
import { CalendarPanel } from '@/components/CalendarPanel'
import { HabitTracker } from '@/components/HabitTracker'
import { SocialQueue } from '@/components/SocialQueue'
import { AgentsPanel } from '@/components/AgentsPanel'
import { ProductRoadmap } from '@/components/ProductRoadmap'
import { FridayFixLog } from '@/components/FridayFixLog'
import { BuildLog } from '@/components/BuildLog'
import { EntryDetail } from '@/components/EntryDetail'
import { STRIPE_DATA, JOURNAL_ENTRIES } from '@/data/static'
import type { Persona } from '@/data/types'

export default function App() {
  const [persona, setPersona] = useState<Persona>('all')
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)

  // Parse URL hash for entry ID
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash.startsWith('entry/')) {
        const entryId = hash.slice(6)
        setSelectedEntryId(entryId)
      } else {
        setSelectedEntryId(null)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange() // Initial parse

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Find selected entry
  const selectedEntry = selectedEntryId
    ? JOURNAL_ENTRIES.find(e => e.run_id === selectedEntryId)
    : null

  const handleCloseEntry = () => {
    window.location.hash = ''
    setSelectedEntryId(null)
  }

  return (
    <div style={{ background: '#0B0F1A', minHeight: '100vh', color: '#E2E8F0' }}>
      <Header />
      <PersonaTabs active={persona} onChange={setPersona} />

      <div className="px-7 py-5 mx-auto" style={{ maxWidth: '1700px' }}>

        {/* KPI Row */}
        <KpiCards persona={persona} />

        {/* Kanban + Calendar */}
        <div
          className="gap-[18px] mb-[18px]"
          style={{ display: 'grid', gridTemplateColumns: '1fr 320px' }}
        >
          <KanbanBoard persona={persona} />
          <CalendarPanel persona={persona} />
        </div>

        {/* Personal Habits */}
        <div className="mb-[18px]">
          <HabitTracker />
        </div>

        {/* Social Queue + Active Agents */}
        <div
          className="gap-[18px] mb-[18px]"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
        >
          <SocialQueue />
          <AgentsPanel />
        </div>

        {/* Roadmap */}
        <div className="mb-[18px]">
          <ProductRoadmap />
        </div>

        {/* Friday Fix Log */}
        <div className="mb-[18px]">
          <FridayFixLog />
        </div>

        {/* Build Log */}
        <div className="mb-[18px]">
          <BuildLog />
        </div>

      </div>

      {/* Footer */}
      <footer
        className="border-t px-7 py-3 flex justify-between items-center text-[10px]"
        style={{
          fontFamily: "'Space Mono', monospace",
          color: '#64748B',
          borderColor: '#1E2D45',
          marginTop: '4px',
        }}
      >
        <div>FRED v3 · April 2026</div>
        <div>Stripe data: {STRIPE_DATA.last_updated}</div>
        <div>clintryan.github.io/fred-dashboard</div>
      </footer>

      {/* Entry Detail Modal */}
      {selectedEntry && <EntryDetail entry={selectedEntry} onClose={handleCloseEntry} />}
    </div>
  )
}
