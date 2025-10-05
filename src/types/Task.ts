export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number
  title: string
  description?: string
  status: Status
  dueDate?: string
}