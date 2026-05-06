"use server";

import { auth } from '@/lib/auth/server';
import { prisma } from "@/lib/prisma";

import type { DashboardData } from '@/lib/schemas';

export async function saveReportAction(dashboardData: DashboardData) {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        await prisma.report.create({
            data: {
                userId: session.user.id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data: dashboardData as any,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Prisma Save Error:", error);
        return { success: false, error: "Failed to save to database" };
    }
}

export async function getLatestReportAction() {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) return null;

    try {
        const report = await prisma.report.findFirst({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
        });
        return report?.data || null;
    } catch (error) {
        console.error("Prisma Fetch Error:", error);
        return null;
    }
}

export async function getAllReportsAction() {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) return [];

    try {
        const reports = await prisma.report.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                createdAt: true,
                data: true,
            },
        });
        return reports;
    } catch (error) {
        console.error("Prisma Fetch All Error:", error);
        return [];
    }
}

export async function deleteReportAction(reportId: string) {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        await prisma.report.delete({
            where: { id: reportId, userId: session.user.id },
        });
        return { success: true };
    } catch (error) {
        console.error("Prisma Delete Error:", error);
        return { success: false };
    }
}
