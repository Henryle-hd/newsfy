import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Retrieve current scraper settings
export async function GET() {
  try {
    console.log("Fetching scraper settings");
    
    const settings = await prisma.scraperSetting.findFirst({
      orderBy: { createdAt: "desc" }
    });

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        status: "success",
        settings: {
          isAuto: false,
          timeGap: 24,
          makeArticlePublic: false
        },
        message: "No settings found, returning defaults"
      });
    }

    return NextResponse.json({
      status: "success",
      settings: {
        id: settings.id,
        isAuto: settings.isAuto,
        timeGap: settings.timeGap,
        makeArticlePublic: settings.makeArticlePublic,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt
      }
    });
  } catch (error) {
    console.error("Error fetching scraper settings:", error);
    return NextResponse.json({
      status: "error",
      message: "Failed to fetch scraper settings",
      error: error
    }, { status: 500 });
  }
}

// POST - Create or update scraper settings
export async function POST(req: NextRequest) {
  try {
    console.log("Creating/updating scraper settings");
    
    const body = await req.json();
    const { isAuto, timeGap, makeArticlePublic } = body;

    // Validate input
    if (typeof isAuto !== 'boolean') {
      return NextResponse.json({
        status: "error",
        message: "isAuto must be a boolean"
      }, { status: 400 });
    }

    if (typeof timeGap !== 'number' || timeGap <= 0) {
      return NextResponse.json({
        status: "error",
        message: "timeGap must be a positive number"
      }, { status: 400 });
    }

    if (typeof makeArticlePublic !== 'boolean') {
      return NextResponse.json({
        status: "error",
        message: "makeArticlePublic must be a boolean"
      }, { status: 400 });
    }

    // Check if settings already exist
    const existingSettings = await prisma.scraperSetting.findFirst({
      orderBy: { createdAt: "desc" }
    });

    let settings;
    if (existingSettings) {
      // Update existing settings
      console.log(`Updating existing settings with ID: ${existingSettings.id}`);
      settings = await prisma.scraperSetting.update({
        where: { id: existingSettings.id },
        data: {
          isAuto,
          timeGap,
          makeArticlePublic,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new settings
      console.log("Creating new scraper settings");
      settings = await prisma.scraperSetting.create({
        data: {
          isAuto,
          timeGap,
          makeArticlePublic
        }
      });
    }

    console.log("Scraper settings saved successfully");
    return NextResponse.json({
      status: "success",
      settings: {
        id: settings.id,
        isAuto: settings.isAuto,
        timeGap: settings.timeGap,
        makeArticlePublic: settings.makeArticlePublic,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt
      },
      message: existingSettings ? "Settings updated successfully" : "Settings created successfully"
    });

  } catch (error) {
    console.error("Error saving scraper settings:", error);
    return NextResponse.json({
      status: "error",
      message: "Failed to save scraper settings",
      error: error
    }, { status: 500 });
  }
}

// PUT - Update specific fields of scraper settings
export async function PUT(req: NextRequest) {
  try {
    console.log("Updating specific scraper settings fields");
    
    const body = await req.json();
    const updates: {isAuto?: boolean, timeGap?: number, makeArticlePublic?: boolean, updatedAt?: Date} = {};

    // Only include fields that are provided
    if (body.hasOwnProperty('isAuto')) {
      if (typeof body.isAuto !== 'boolean') {
        return NextResponse.json({
          status: "error",
          message: "isAuto must be a boolean"
        }, { status: 400 });
      }
      updates.isAuto = body.isAuto;
    }

    if (body.hasOwnProperty('timeGap')) {
      if (typeof body.timeGap !== 'number' || body.timeGap <= 0) {
        return NextResponse.json({
          status: "error",
          message: "timeGap must be a positive number"
        }, { status: 400 });
      }
      updates.timeGap = body.timeGap;
    }

    if (body.hasOwnProperty('makeArticlePublic')) {
      if (typeof body.makeArticlePublic !== 'boolean') {
        return NextResponse.json({
          status: "error",
          message: "makeArticlePublic must be a boolean"
        }, { status: 400 });
      }
      updates.makeArticlePublic = body.makeArticlePublic;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({
        status: "error",
        message: "No valid fields provided for update"
      }, { status: 400 });
    }

    // Get the latest settings
    const existingSettings = await prisma.scraperSetting.findFirst({
      orderBy: { createdAt: "desc" }
    });

    if (!existingSettings) {
      return NextResponse.json({
        status: "error",
        message: "No existing settings found to update"
      }, { status: 404 });
    }

    // Update the settings
    updates.updatedAt = new Date();
    const settings = await prisma.scraperSetting.update({
      where: { id: existingSettings.id },
      data: updates
    });

    console.log("Scraper settings updated successfully");
    return NextResponse.json({
      status: "success",
      settings: {
        id: settings.id,
        isAuto: settings.isAuto,
        timeGap: settings.timeGap,
        makeArticlePublic: settings.makeArticlePublic,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt
      },
      message: "Settings updated successfully",
      updatedFields: Object.keys(updates).filter(key => key !== 'updatedAt')
    });

  } catch (error) {
    console.error("Error updating scraper settings:", error);
    return NextResponse.json({
      status: "error",
      message: "Failed to update scraper settings",
      error: error
    }, { status: 500 });
  }
}