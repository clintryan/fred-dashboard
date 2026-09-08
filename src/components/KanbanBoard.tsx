import { useState, useEffect, useCallback } from 'react'
import { AGENT_SESSIONS, PERSONAS, TAG_LABELS } from '@/data/static'
import { Card, CardHeader, CardTitle, CardMeta, CardContent } from '@/components/ui/card'
import type { Persona, Todo } from '@/data/types'

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
  title, items, toggle, variant
}: {
  title: string
  items: Todo[]
  toggle: (id: string, currentStatus: string, taskText: string, tag: string, agent_id: string) => void
  variant: 'must' | 'should' | 'could'
}) {
  const color = variant === 'must' ? '#00D4FF' : variant === 'should' ? '#F59E0B' : '#A78BFA'
  const sorted = [...items].sort((a, b) => (a.status === 'done' ? 1 : 0) - (b.status === 'done' ? 1 : 0))
  const remaining = items.filter(t => t.status !== 'done').length

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
        const isDone = t.status === 'done'
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
            onClick={() => toggle(t.id, t.status || 'todo', t.text, t.tag, t.agent_id || '')}
          >
            <input
              type="checkbox"
              checked={isDone}
              onChange={() => toggle(t.id, t.status || 'todo', t.text, t.tag, t.agent_id || '')}
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
  const [tasks, setTasks] = useState<Todo[]>([])
  
  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch('http://127.0.0.1:8787/api/tasks')
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
      }
    } catch (e) {
      console.error('Failed to load tasks', e)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const toggle = async (id: string, currentStatus: string, text: string, tag: string, agent_id: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done'
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
    try {
      await fetch('http://127.0.0.1:8787/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, text, tag, agent_id })
      })
    } catch (e) {
      console.error('Failed to update task', e)
      // Revert optimistic update
      loadTasks()
    }
  }

  const tag = PERSONAS[persona].tag

  const filter = (todos: Todo[]) => tag ? todos.filter(t => t.tag === tag) : todos

  // Simple mapping since db tasks don't have must/should/could explicitly yet. 
  // For now, put everything in Must Do, or map by some logic.
  // We will distribute tasks evenly or put all in Must.
  const filtered = filter(tasks)
  const must = filtered

  const title = tag ? `${PERSONAS[persona].label} Agent Queue` : 'All Agent Queue'

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardMeta>Task Queue · click to complete</CardMeta>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
          <KanbanColumn title="Agent Tasks" items={must} toggle={toggle} variant="must" />
        </div>
      </CardContent>
    </Card>
  )
}
