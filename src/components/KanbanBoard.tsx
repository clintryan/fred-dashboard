import { useState } from 'react'
import { TODOS, AGENT_SESSIONS, PERSONAS, TAG_LABELS } from '@/data/static'
import { Card, CardHeader, CardTitle, CardMeta, CardContent } from '@/components/ui/card'
import type { Persona, Todo } from '@/data/types'

const STORAGE_KEY = 'fred_checked'

function useDoneSet() {
  const [done, setDone] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')) }
    catch { return new Set() }
  })
  const toggle = (id: string) => {
    setDone(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }
  return { done, toggle }
}

const TAG_COLORS: Record<string, string> = {
  fluentrx: '#00D4FF', coder: '#A78BFA', teacher: '#10B981', trader: '#F59E0B', fred: '#64748B'
}

function PersonaTag({ tag }: { tag: string }) {
  const color = TAG_COLORS[tag] || '#64748B'
  return (
    <span
      className="inline-block text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm mt-1"
      style={{ background: `${color}1a`, color }}
    >
      {TAG_LABELS[tag] || tag}
    </span>
  )
}

function KanbanColumn({
  title, items, done, toggle, variant
}: {
  title: string
  items: Todo[]
  done: Set<string>
  toggle: (id: string) => void
  variant: 'must' | 'should' | 'could'
}) {
  const color = variant === 'must' ? '#00D4FF' : variant === 'should' ? '#F59E0B' : '#A78BFA'
  const sorted = [...items].sort((a, b) => (done.has(a.id) ? 1 : 0) - (done.has(b.id) ? 1 : 0))
  const remaining = items.filter(t => !done.has(t.id)).length

  return (
    <div>
      <div
        className="text-[9px] font-bold uppercase tracking-[0.18em] pb-2 border-b-2 mb-3 flex justify-between items-center"
        style={{ color, borderColor: color }}
      >
        <span>⬥ {title}</span>
        <span style={{ opacity: 0.6 }}>{remaining}/{items.length}</span>
      </div>
      {sorted.length === 0 && (
        <div className="text-[11px] italic py-2" style={{ color: '#64748B' }}>Nothing here</div>
      )}
      {sorted.map(t => {
        const isDone = done.has(t.id)
        const agent = AGENT_SESSIONS.find(a => a.todoId === t.id)
        return (
          <div
            key={t.id}
            className="rounded-lg px-3 py-2.5 mb-2 flex gap-2.5 items-start cursor-pointer select-none transition-opacity duration-200"
            style={{
              background: '#1A2238',
              border: '1px solid #263350',
              opacity: isDone ? 0.35 : 1,
            }}
            onClick={() => toggle(t.id)}
          >
            <input
              type="checkbox"
              checked={isDone}
              onChange={() => toggle(t.id)}
              onClick={e => e.stopPropagation()}
              className="mt-0.5 flex-shrink-0 cursor-pointer w-3 h-3"
              style={{ accentColor: '#00D4FF' }}
            />
            <div className="flex-1">
              <div
                className="text-[12px] leading-[1.45]"
                style={{
                  color: isDone ? '#64748B' : '#E2E8F0',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}
              >
                {t.text}
              </div>
              <PersonaTag tag={t.tag} />
              {agent && (
                <div className="flex items-center gap-1 mt-1.5 text-[10px]" style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}>
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      background: agent.status === 'active' ? '#10B981' : agent.status === 'blocked' ? '#F43F5E' : '#64748B',
                      boxShadow: agent.status === 'active' ? '0 0 4px #10B981' : 'none',
                    }}
                  />
                  <span style={{ color: agent.status === 'active' ? '#10B981' : agent.status === 'blocked' ? '#F43F5E' : '#64748B' }}>
                    {agent.status === 'active' ? '🔄 Agent active' : agent.status === 'done' ? '✅ Agent done' : '⏸️ Blocked'} · {agent.since}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function KanbanBoard({ persona }: { persona: Persona }) {
  const { done, toggle } = useDoneSet()
  const tag = PERSONAS[persona].tag

  const filter = (todos: Todo[]) => tag ? todos.filter(t => t.tag === tag) : todos

  const must   = filter(TODOS.must)
  const should = filter(TODOS.should)
  const could  = filter(TODOS.could)

  const title = tag ? `${PERSONAS[persona].label} Todos` : 'All Todos'

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardMeta>MoSCoW · click to complete</CardMeta>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <KanbanColumn title="Must Do"   items={must}   done={done} toggle={toggle} variant="must" />
          <KanbanColumn title="Should Do" items={should} done={done} toggle={toggle} variant="should" />
          <KanbanColumn title="Could Do"  items={could}  done={done} toggle={toggle} variant="could" />
        </div>
      </CardContent>
    </Card>
  )
}
