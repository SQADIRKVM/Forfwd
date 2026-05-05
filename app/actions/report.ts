"use server";

import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

function getSql() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }
    return neon(process.env.DATABASE_URL);
}

export async function saveReportAction(dashboardData: any) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const sql = getSql();
    try {
        // Save the report to Neon
        // We use JSON.stringify for safety, Neon driver handles JSONB well
        await sql`
            INSERT INTO reports (user_id, data)
            VALUES (${userId}, ${JSON.stringify(dashboardData)})
        `;
        return { success: true };
    } catch (error) {
        console.error("Neon Save Error:", error);
        return { success: false, error: "Failed to save to database" };
    }
}

export async function getLatestReportAction() {
    const { userId } = await auth();
    if (!userId) return null;

    const sql = getSql();
    try {
        const result = await sql`
            SELECT data FROM reports 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC 
            LIMIT 1
        `;
        
        if (result.length === 0) return null;
        return result[0].data;
    } catch (error) {
        console.error("Neon Fetch Error:", error);
        return null;
    }
}
