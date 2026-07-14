import { STRIPE_DATA } from '@/data/static'

export function Header() {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <header
      className="flex items-center justify-between px-7 py-4 border-b"
      style={{ background: '#131929', borderColor: '#1E2D45' }}
    >
      <div>
        <div
          className="text-[22px] font-bold tracking-[0.06em]"
          style={{ fontFamily: "'Space Mono', monospace", color: '#00D4FF' }}
        >
          FRED
        </div>
        <div
          className="text-[10px] uppercase tracking-[0.12em] mt-0.5"
          style={{ color: '#64748B' }}
        >
          Command Center · Clint Ryan
        </div>
      </div>
      <div className="text-right" style={{ fontFamily: "'Space Mono', monospace" }}>
        <div className="text-[13px] font-semibold mb-0.5" style={{ color: '#E2E8F0' }}>
          {date}
        </div>
        <div className="text-[11px]" style={{ color: '#64748B' }}>
          Stripe: {STRIPE_DATA.last_updated}
        </div>
      </div>
    </header>
  )
}
