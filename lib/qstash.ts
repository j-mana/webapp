'use server'

import { Client } from "@upstash/qstash"

const client = new Client({
  token: process.env.QSTASH_TOKEN!,
})

export async function createScreenshotJob(experimentId: string, url: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/screenshot/background`
  
  console.log('Creating screenshot job for experiment', experimentId, 'with url', url)
  await client.publish({
    url: apiUrl,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ experimentId, url }),
  })
}

export async function createNameExperimentJob(experimentId: string, goal: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/name-experiment`
  
  console.log('Creating name experiment job for experiment', experimentId, 'with goal', goal)
  await client.publish({
    url: apiUrl,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ experimentId, goal }),
  })
}