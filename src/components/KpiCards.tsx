import { STRIPE_DATA, MANUAL_DATA, SESSION_DATA, GOAL } from '@/data/static'
import { Progress } from '@/components/ui/progress'
import type { Persona } from '@/data/types'

function pctChange(cur: number, last: number) {
  if (!last) return null
  return Math.round(((cur - last) / last) * 100)
}
function daysUntil(dateStr: string) {
  const target = new Date(dateStr + 'T00:00:00')
  return Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86400000))
}

interface KpiCardData {
  label: string
  value: string | number
  delta?: number | null
  sub?: string
  variant?: 'default' | 'warn' | 'green'
  goal?: { current: number; target: number; pct: number }
}

function KpiCard({ card }: { card: KpiCardData }) {
  const accentColor = card.variant === 'warn' ? '#F59E0B' : card.variant === 'green' ? '#10B981' : '#00D4FF'
  return (
    <div
      className="rounded-[10px] px-5 py-[18px] relative overflow-hidden"
      style={{ background: '#131929', border: '1px solid #1E2D45' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: accentColor, opacity: 0.5 }}
      />
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2.5" style={{ color: '#64748B' }}>
        {card.label}
      </div>
      <div className="text-[28px] font-bold leading-none mb-2" style={{ fontFamily: "'Space Mono', monospace", color: '#E2E8F0' }}>
        {card.value}
      </div>
      {card.delta !== null && card.delta !== undefined && (
        <div
          className="text-[11px] font-mono"
          style={{ color: card.delta >= 0 ? '#10B981' : '#F43F5E' }}
        >
          {card.delta >= 0 ? '↑' : '↓'} {Math.abs(card.delta)}% vs last month
        </div>
      )}
      {card.goal && (
        <>
          <Progress
            value={card.goal.pct}
            variant={card.goal.pct < 30 ? 'danger' : card.goal.pct < 70 ? 'warn' : 'accent'}
            className="mt-2"
          />
          <div className="text-[10px] mt-1.5" style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}>
            ${card.goal.current} of ${card.goal.target} — recoup Claude Max
          </div>
        </>
      )}
      {card.sub && (
        <div className="text-[11px] mt-1" style={{ color: '#64748B' }}>{card.sub}</div>
      )}
    </div>
  )
}

export function KpiCards({ persona }: { persona: Persona }) {
  const totalMTD = STRIPE_DATA.mtd_revenue + MANUAL_DATA.teaching_mtd + MANUAL_DATA.other_mtd
  const goalPct  = Math.min(100, Math.round((GOAL.current / GOAL.target) * 100))
  const revDelta = pctChange(totalMTD, STRIPE_DATA.last_month)

  let cards: KpiCardData[] = []

  if (persona === 'all') {
    cards = [
      { label: 'Revenue MTD', value: '$' + totalMTD.toLocaleString(), delta: revDelta, sub: `Stripe + manual · $${STRIPE_DATA.last_month.toLocaleString()} last month` },
      { label: 'Active Students', value: SESSION_DATA.active_students, sub: `${SESSION_DATA.trials_mtd} trial(s) this month · ${SESSION_DATA.sessions_mtd} sessions MTD` },
      { label: 'April Goal (Fred)', value: goalPct + '%', variant: 'warn', goal: { current: GOAL.current, target: GOAL.target, pct: goalPct } },
    ]
  } else if (persona === 'fluentrx') {
    const sesDelta = pctChange(SESSION_DATA.sessions_mtd, SESSION_DATA.sessions_last_month)
    cards = [
      { label: 'Revenue MTD', value: '$' + STRIPE_DATA.mtd_revenue.toLocaleString(), delta: revDelta, sub: `Stripe · last month $${STRIPE_DATA.last_month.toLocaleString()}` },
      { label: 'Sessions MTD', value: SESSION_DATA.sessions_mtd, delta: sesDelta, sub: `vs ${SESSION_DATA.sessions_last_month} last month`, variant: 'green' },
      { label: 'Active Students', value: SESSION_DATA.active_students, sub: `${SESSION_DATA.trials_mtd} trial(s) · ~$34–40/session` },
    ]
  } else if (persona === 'teacher') {
    const dLeft = daysUntil('2026-05-05')
    cards = [
      { label: 'Days to BCC Start', value: dLeft, sub: 'May 5, 2026', variant: 'warn' },
      { label: 'Contract', value: 'PENDING', sub: 'Signing Apr 10, 10am · BCC Silom', variant: 'warn' },
      { label: 'Monthly Salary', value: '฿73k', sub: '55k base + 14k allowance + 4k homeroom' },
    ]
  } else if (persona === 'coder') {
    cards = [
      { label: 'Active Projects', value: '1', sub: 'bybit-trading-bot (live)' },
      { label: 'Revenue Opps', value: '4', sub: 'Fiverr · Voice Agent · Landing · SaaS' },
      { label: 'Top Priority', value: 'Fiverr', sub: 'AI automations angle — first listing' },
    ]
  } else if (persona === 'trader') {
    cards = [
      { label: 'SOL Portfolio', value: '~$1k', sub: '3E5D…hZEZr · Nest egg', variant: 'warn' },
      { label: 'Bot Status', value: 'WAITING', sub: "Pending Paradise training docs" },
      { label: 'Job Monitoring', value: 'PASSIVE', sub: 'Singapore / Asian FinTech roles only' },
    ]
  }

  return (
    <div className="grid gap-3.5 mb-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)', minHeight: '110px' }}>
      {cards.map((c, i) => <KpiCard key={i} card={c} />)}
    </div>
  )
}
