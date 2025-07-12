import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sendEmail from '@/lib/email';

// Helper function to check if user is admin
async function isAdmin(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { userType: true }
    });
    return user?.userType === 'ADMIN';
}

// GET - Admin can get all users, logged in users can get their own info
export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        // If userId is provided, return single user info
        if (userId) {
            const isUserAdmin = await isAdmin(session.user.id);
            // Allow access if user is requesting their own info or is admin
            if (userId !== session.user.id && !isUserAdmin) {
                return NextResponse.json({ error: "Cannot access other users' info" }, { status: 403 });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    Article: true,
                }
            });

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            return NextResponse.json(user);
        }

        // If no userId provided, check if admin for full list
        const isUserAdmin = await isAdmin(session.user.id);
        if (!isUserAdmin) {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            orderBy:{
                createdAt:"desc",
            },
            include: {
                Article: true,
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to fetch users"}, { status: 500 });
    }
}

// POST - Only admin can create users
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const isUserAdmin = await isAdmin(session.user.id);
        if (!isUserAdmin) {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        const data = await request.json();
        const user = await prisma.user.create({ data });

        // Send welcome email
        const emailContent = `
          <h2>Welcome to Newsfy, ${user.name}!</h2>
          <p>Your account has been created by an administrator. You now have access to the Newsfy dashboard where you can:</p>
          <ul>
            <li>Create and publish news articles</li>
            <li>Manage your content and Bot content</li>
            <li>Contribute to our growing platform</li>
          </ul>
          <p>Get started by logging into your account and exploring our platform.</p>
          <a href="https://newsfy-nine.vercel.app/dashboard" class="button" style="color: white;">Access Dashboard</a>
        `;

        await sendEmail(
          'Welcome to Newsfy - Account Created Successfully',
          emailContent,
          user.email,
          'Newsfy Team'
        );

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user"+error }, { status: 500 });
    }
}

// PUT - Any logged-in user can edit their own profile
export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();
        const userId = data.id;

        // Check if user is updating their own profile or is admin
        const isUserAdmin = await isAdmin(session.user.id);
        if (userId !== session.user.id && !isUserAdmin) {
            return NextResponse.json({ error: "Cannot update other users' profiles" }, { status: 403 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
                image: data.image,
                password: data.password,
                istempPassword: data.istempPassword,
                temporaryPassword: data.temporaryPassword,
                temporaryPasswordExpires: data.temporaryPasswordExpires,
                userType: data.userType
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

// DELETE - Only admin can delete users
export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const isUserAdmin = await isAdmin(session.user.id);
        if (!isUserAdmin) {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user"+error }, { status: 500 });
    }
}