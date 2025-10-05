import { describe, it, expect } from 'vitest'
import { type Task, Status } from './Task'

describe('Task interface', () => {
  it('should have all required properties', () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: Status.TODO,
      dueDate: '2024-12-31'
    }

    expect(task.id).toBe(1)
    expect(task.title).toBe('Test Task')
    expect(task.description).toBe('Test Description')
    expect(task.status).toBe(Status.TODO)
    expect(task.dueDate).toBe('2024-12-31')
  })

  it('should allow optional description', () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      status: Status.TODO
    }

    expect(task.id).toBe(1)
    expect(task.title).toBe('Test Task')
    expect(task.status).toBe(Status.TODO)
    expect(task.description).toBeUndefined()
    expect(task.dueDate).toBeUndefined()
  })

  it('should support all status values', () => {
    const todoTask: Task = {
      id: 1,
      title: 'TODO Task',
      status: Status.TODO
    }

    const inProgressTask: Task = {
      id: 2,
      title: 'In Progress Task',
      status: Status.IN_PROGRESS
    }

    const doneTask: Task = {
      id: 3,
      title: 'Done Task',
      status: Status.DONE
    }

    expect(todoTask.status).toBe(Status.TODO)
    expect(inProgressTask.status).toBe(Status.IN_PROGRESS)
    expect(doneTask.status).toBe(Status.DONE)
  })
})

describe('Status enum', () => {
  it('should have correct values', () => {
    expect(Status.TODO).toBe('TODO')
    expect(Status.IN_PROGRESS).toBe('IN_PROGRESS')
    expect(Status.DONE).toBe('DONE')
  })
})