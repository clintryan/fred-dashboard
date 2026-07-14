export type Persona = 'all' | 'fluentrx' | 'coder' | 'teacher' | 'trader'
export type TodoTag = 'fluentrx' | 'coder' | 'teacher' | 'trader' | 'fred'
export type AgentStatus = 'active' | 'done' | 'blocked'
export type RoadmapStatus = 'active' | 'queued' | 'planned' | 'vision'
export type BuildType = 'feature' | 'automation' | 'fix' | 'infra' | 'ops'
export type SocialStatus = 'draft' | 'posted'
export type LogStatus = 'done' | 'pending' | 'blocked'
export type LogType = 'decision' | 'task' | 'idea'

export interface Todo {
  id: string
  text: string
  tag: TodoTag
}

export interface AgentSession {
  id: string
  task: string
  tag: TodoTag
  status: AgentStatus
  since: string
  todoId?: string
}

export interface SocialPost {
  date: string
  persona: string
  tag: TodoTag
  draft: string
  status: SocialStatus
}

export interface FridayFixEntry {
  date: string
  type: LogType
  status: LogStatus
  text: string
}

export interface BuildEntry {
  date: string
  title: string
  description: string
  type: BuildType
  tag: TodoTag
}

export interface RoadmapItem {
  phase: string
  title: string
  status: RoadmapStatus
  target: string
  description: string
  branch: string | null
  tag: TodoTag
}

export interface StripeData {
  mtd_revenue: number
  last_month: number
  last_updated: string
}

export interface ManualData {
  teaching_mtd: number
  other_mtd: number
  note: string
}

export interface SessionData {
  sessions_mtd: number
  sessions_last_month: number
  active_students: number
  trials_mtd: number
}

export interface GoalData {
  target: number
  current: number
  deadline: string
}

export interface JournalEntry {
  ts: string
  run_id?: string
  harness?: string
  machine?: string
  project: string
  persona: string
  status: string
  summary: string
  files_changed?: string[]
  tokens?: string
  followups?: string[]
  resume?: string
  event?: string
}
