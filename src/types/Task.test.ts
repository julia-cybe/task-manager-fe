import { describe, it, expect } from 'vitest'
import { type Task, type Status } from './Task'

describe('Task interface', () => {
  it('should have all required properties', () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'TODO' as Status,
      dueDate: '2024-12-31'
    }

    expect(task.id).toBe(1)
    expect(task.title).toBe('Test Task')
    expect(task.description).toBe('Test Description')
    expect(task.status).toBe('TODO')
    expect(task.dueDate).toBe('2024-12-31')
  })

  it('should allow optional description', () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      status: 'TODO' as Status
    }

    expect(task.id).toBe(1)
    expect(task.title).toBe('Test Task')
    expect(task.status).toBe('TODO')
    expect(task.description).toBeUndefined()
    expect(task.dueDate).toBeUndefined()
  })

  it('should support all status values', () => {
    const todoTask: Task = {
      id: 1,
      title: 'TODO Task',
      status: 'TODO' as Status
    }

    const inProgressTask: Task = {
      id: 2,
      title: 'In Progress Task',
      status: 'IN_PROGRESS' as Status
    }

    const doneTask: Task = {
      id: 3,
      title: 'Done Task',
      status: 'DONE' as Status
    }

    expect(todoTask.status).toBe('TODO')
    expect(inProgressTask.status).toBe('IN_PROGRESS')
    expect(doneTask.status).toBe('DONE')
  })
})

describe('Status type', () => {
  it('should have correct values', () => {
    const statuses: Status[] = ['TODO', 'IN_PROGRESS', 'DONE']
    
    expect(statuses).toContain('TODO')
    expect(statuses).toContain('IN_PROGRESS')
    expect(statuses).toContain('DONE')
    expect(statuses).toHaveLength(3)
  })
})