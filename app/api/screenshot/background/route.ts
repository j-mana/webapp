import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateId } from "@/lib/supabase";
import { DateTime } from 'luxon';
import { NextRequest, NextResponse } from 'next/server'
import { chromium } from "playwright-core";
import { Browserbase } from "@browserbasehq/sdk";

// ID for app: Manafold
const APP_ID = '3a4c7162-eb2c-49f3-a422-1c0f6b4ba430';

export async function POST(request: NextRequest) {
  try {
    const { experimentId, url } = await request.json()

    if (!experimentId || !url) {
      return NextResponse.json({ error: 'experimentId and url are required' }, { status: 400 })
    }

    // Add https:// if no protocol is specified
    const fullUrl = url.startsWith('http') ? url : `https://${url}`

    console.log("Starting remote browser...");
    
    // Create Browserbase session
    const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
    const session = await bb.sessions.create({
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
    });

    // Connect to the browser using Playwright
    const browser = await chromium.connectOverCDP(session.connectUrl);
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages()[0];

    // Set viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Navigate to the page
    await page.goto(fullUrl, { waitUntil: 'load', timeout: 60000 });
    
    // Wait a bit more for dynamic content to load
    await page.waitForTimeout(2000);
    
    console.log("Taking a screenshot using CDP...");

    // Create a CDP session for faster screenshots
    const client = await defaultContext.newCDPSession(page);

    // Capture the screenshot using CDP
    const { data } = await client.send("Page.captureScreenshot", {
      format: "png",
      quality: 100,
      captureBeyondViewport: true,
    });
    
    // Get page title
    const title = await page.title();
    
    console.log("Shutting down...");
    await page.close();
    await browser.close();

    // Convert screenshot to data URL (data is already base64)
    const screenshotDataUrl = `data:image/png;base64,${data}`;

    const nodeId = generateId()
    const { data: canvasNodeData, error: canvasNodeError } = await supabaseAdmin
      .from('canvas_nodes')
      .insert({
        id: nodeId,
        experiment_id: experimentId,
        type: 'screenshot',
        x: 100,
        y: 100,
        width: 1280,
        height: 800,
        data: {
          screenshot: screenshotDataUrl,
          url: fullUrl,
        },
      })

    console.log("Canvas node created:", canvasNodeData); 
    console.log("Canvas node error:", canvasNodeError); 

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