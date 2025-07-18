import { db, id } from './db'
import { DateTime } from 'luxon'

// Project mutations
export async function createProject(name: string) {
  const projectId = id()
  await db.transact(
    db.tx.projects[projectId].update({
      name,
      createdAt: DateTime.now().toISO(),
    })
  )
  return projectId
}

export async function updateProject(projectId: string, updates: { name?: string }) {
  await db.transact(
    db.tx.projects[projectId].update(updates)
  )
}

export async function deleteProject(projectId: string) {
  // Delete all experiments associated with the project first
  const { data } = await db.queryOnce({
    experiments: {
      $: {
        where: { 'project.id': projectId }
      }
    }
  })
  
  if (data?.experiments) {
    const deleteTxs = data.experiments.map(exp => 
      db.tx.experiments[exp.id].delete()
    )
    if (deleteTxs.length > 0) {
      await db.transact(deleteTxs)
    }
  }
  
  // Then delete the project
  await db.transact(
    db.tx.projects[projectId].delete()
  )
}

// Experiment mutations
export async function createExperiment(projectId: string, name: string, url: string) {
  const experimentId = id()
  await db.transact(
    db.tx.experiments[experimentId]
      .update({
        name,
        url,
        createdAt: DateTime.now().toISO(),
      })
      .link({ project: projectId })
  )
  return experimentId
}

export async function updateExperiment(experimentId: string, updates: { name?: string, url?: string }) {
  await db.transact(
    db.tx.experiments[experimentId].update(updates)
  )
}

export async function deleteExperiment(experimentId: string) {
  // Delete all chat messages associated with the experiment first
  const { data } = await db.queryOnce({
    chatMessages: {
      $: {
        where: { 'experiment.id': experimentId }
      }
    }
  })
  
  if (data?.chatMessages) {
    const deleteTxs = data.chatMessages.map(msg => 
      db.tx.chatMessages[msg.id].delete()
    )
    if (deleteTxs.length > 0) {
      await db.transact(deleteTxs)
    }
  }
  
  // Then delete the experiment
  await db.transact(
    db.tx.experiments[experimentId].delete()
  )
}

// Chat message mutations
export async function addChatMessage(experimentId: string, message: string, role: 'user' | 'assistant') {
  const messageId = id()
  await db.transact(
    db.tx.chatMessages[messageId]
      .update({
        message,
        role,
        createdAt: Date.now(),
      })
      .link({ experiment: experimentId })
  )
  return messageId
} 