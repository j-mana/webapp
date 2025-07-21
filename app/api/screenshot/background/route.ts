import { id, init } from '@instantdb/admin';
import { DateTime } from 'luxon';
import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
// ID for app: Manafold
const APP_ID = '3a4c7162-eb2c-49f3-a422-1c0f6b4ba430';
const db = init({
  appId: APP_ID,
  adminToken: process.env.INSTANT_APP_ADMIN_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const { experimentId, url } = await request.json()

    if (!experimentId || !url) {
      return NextResponse.json({ error: 'experimentId and url are required' }, { status: 400 })
    }

    // Add https:// if no protocol is specified
    const fullUrl = url.startsWith('http') ? url : `https://${url}`

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    })

    const page = await browser.newPage()
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 })
    
    // Navigate to the page
    await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 })
    
    // Take screenshot
    const screenshot = await page.screenshot({ fullPage: true })
    
    // Get page title
    const title = await page.title()
    
    await browser.close()

    // Convert screenshot to base64
    const screenshotBase64 = (screenshot as Buffer).toString('base64')
    const screenshotDataUrl = `data:image/png;base64,${screenshotBase64}`

    const nodeId = id()
    await db.transact(
      db.tx.canvasNodes[nodeId]
        .update({
          type: 'screenshot',
          x: 100,
          y: 100,
          width: 1280,
          height: 800,
          data: {
            screenshot: screenshotDataUrl,
            url: fullUrl,
          },
        createdAt: DateTime.now(),
      })
      .link({ experiment: experimentId })
    )

    return NextResponse.json({
      success: true,
      nodeId,
      screenshot: screenshotDataUrl,
      title,
      url: fullUrl
    })

  } catch (error) {
    console.error('Background screenshot error:', error)
    return NextResponse.json({ 
      error: 'Failed to take screenshot in background',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 