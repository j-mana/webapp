import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
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
    const screenshotBase64 = Buffer.from(screenshot).toString('base64')
    const screenshotDataUrl = `data:image/png;base64,${screenshotBase64}`

    return NextResponse.json({
      success: true,
      screenshot: screenshotDataUrl,
      title,
      url: fullUrl
    })

  } catch (error) {
    console.error('Screenshot error:', error)
    return NextResponse.json({ 
      error: 'Failed to take screenshot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 