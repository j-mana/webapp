import { db, id } from './db'

// Project mutations
export async function createProject(name: string) {
  const projectId = id()
  await db.transact(
    db.tx.projects[projectId].update({
      name,
      createdAt: Date.now(), // Use Date.now() for timestamp numbers
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
        createdAt: Date.now(), // Use Date.now() for timestamp numbers
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

// Canvas node mutations
export async function createCanvasNode(experimentId: string, type: string, x: number, y: number, data: any, width?: number, height?: number) {
  const nodeId = id()
  await db.transact(
    db.tx.canvasNodes[nodeId]
      .update({
        type,
        x,
        y,
        width,
        height,
        data,
        createdAt: Date.now(),
      })
      .link({ experiment: experimentId })
  )
  return nodeId
}

export async function createScreenshotNode(experimentId: string, url: string) {
  try {
    // Take screenshot
    const apiUrl = typeof window !== 'undefined' 
      ? '/api/screenshot' 
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/screenshot`;
      
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error('Failed to take screenshot')
    }

    const { screenshot, title } = await response.json()

    // Create canvas node with screenshot data
    const nodeId = await createCanvasNode(
      experimentId,
      'screenshot',
      100, // default x position
      100, // default y position
      {
        screenshot,
        title,
        url: url.startsWith('http') ? url : `https://${url}`,
      },
      320, // default width
      200  // default height
    )

    return nodeId
  } catch (error) {
    console.error('Error creating screenshot node:', error)
    throw error
  }
} 