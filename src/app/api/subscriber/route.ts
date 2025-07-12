/**
 * API route handlers for subscriber management
 * Routes:
 * - GET: Retrieves all subscribers (authenticated)
 * - POST: Creates a new subscriber (public)
 * - DELETE: Removes a specific subscriber (authenticated)
 */
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all subscribers (requires auth)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscribers = await prisma.subscriber.findMany({
      include: {
        commentForNew: true
      }
    });
    return NextResponse.json(subscribers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error"+error }, { status: 500 });
  }
}

// POST new subscriber (public endpoint)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        name,
        email
      }
    });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error"+error }, { status: 500 });
  }
}

// DELETE subscriber (requires auth)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing subscriber ID" }, { status: 400 });
    }

    await prisma.subscriber.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Subscriber deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error"+error }, { status: 500 });
  }
}
