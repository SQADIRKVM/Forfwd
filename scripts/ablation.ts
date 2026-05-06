/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * CareerX Ablation Study (v2 - uses API routes)
 * 
 * Condition A: LLM-Only — calls a minimal endpoint with no retrieval
 * Condition B: Full System — calls the standard generate-dashboard endpoint
 * 
 * Both go through localhost:3000 so they have env access.
 */

export {};

const BASE_URL = 'http://localhost:3000';

interface AblationProfile {
    label: string;
    studentType: string;
    userName: string;
    location: string;
    currency: string;
    answers: Record<string, string>;
}

const PROFILES: AblationProfile[] = [
    {
        label: 'CS Student (India)',
        studentType: "Bachelor's degree / B.Tech student",
        userName: 'Arjun',
        location: 'Kerala, India',
        currency: 'INR',
        answers: {
            '_role': "Bachelor's degree / B.Tech student",
            '_currentEducationLevel': "Bachelor's degree / B.Tech student",
            'What subjects excite you?': 'AI, Web Development',
            'Dream role?': 'AI Engineer',
            'Open to abroad?': 'Yes',
        }
    },
    {
        label: 'HR Professional (USA)',
        studentType: 'Working Professional - Human Resources',
        userName: 'Sarah',
        location: 'New York, USA',
        currency: 'USD',
        answers: {
            '_role': 'Working Professional - Human Resources',
            '_currentEducationLevel': "Master's degree",
            'Current role?': 'HR Manager',
            'Target role?': 'CHRO',
            'Years experience?': '7',
        }
    },
    {
        label: 'High School Student (UAE)',
        studentType: 'High School Student (Plus Two)',
        userName: 'Ahmed',
        location: 'Dubai, UAE',
        currency: 'AED',
        answers: {
            '_role': 'High School Student (Plus Two)',
            '_currentEducationLevel': 'High School / Plus Two',
            'Favourite subjects?': 'Physics, Mathematics',
            'Dream career?': 'Aerospace Engineer',
            'Study abroad?': 'Yes, USA or Germany',
        }
    }
];

const VAGUE_PHRASES = [
    'various universities', 'many options', 'several programs', 'top companies',
    'competitive salary', 'good opportunities', 'numerous careers', 'wide range',
    'growing field', 'in-demand', 'highly sought', 'lucrative career',
    'promising career', 'excellent prospects', 'great potential'
];

function analyzeOutput(data: any) {
    const text = JSON.stringify(data).toLowerCase();
    let genericCount = 0;
    for (const phrase of VAGUE_PHRASES) {
        genericCount += (text.split(phrase).length - 1);
    }
    
    const pathways = data?.careerPathways?.length || 0;
    const unis = data?.topUniversities?.length || 0;
    const jobs = data?.jobs?.length || 0;
    const certs = data?.education?.certifications?.length || 0;
    const sources = data?.sources?.length || 0;
    const hasCitations = sources > 0;
    
    // Check if salaries have actual numbers
    let salaryWithNumbers = 0;
    let totalSalaries = 0;
    for (const j of (data?.jobs || [])) {
        totalSalaries++;
        if (/\d/.test(j.entrySalary || '')) salaryWithNumbers++;
    }
    for (const p of (data?.careerPathways || [])) {
        totalSalaries++;
        if (/\d/.test(p.salaryRange || '')) salaryWithNumbers++;
    }
    
    return {
        pathways, unis, jobs, certs, sources,
        hasCitations,
        genericPhrases: genericCount,
        salarySpecificity: totalSalaries > 0 ? Math.round((salaryWithNumbers / totalSalaries) * 100) : 0,
        totalTextLength: text.length
    };
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║        CareerX Ablation Study v2                       ║');
    console.log('║  Condition A: LLM-Only  vs  Condition B: Full System   ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    
    const results: any[] = [];
    
    for (let i = 0; i < PROFILES.length; i++) {
        const p = PROFILES[i];
        console.log(`\n${'═'.repeat(60)}`);
        console.log(`🧪 Profile ${i + 1}: ${p.label}`);
        console.log(`${'═'.repeat(60)}`);
        
        // ── Condition A: LLM-Only (through ablation API) ──────────
        console.log('\n  📌 Condition A: LLM-Only...');
        let llmData: any = null;
        let llmTime = 0;
        try {
            const start = Date.now();
            const res = await fetch(`${BASE_URL}/api/ablation-llm-only`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers: p.answers,
                    studentType: p.studentType,
                    userName: p.userName,
                    location: p.location,
                    currency: p.currency
                })
            });
            llmTime = Date.now() - start;
            const json = await res.json();
            if (json.status === 'complete') {
                llmData = json.data;
                console.log(`    ✅ ${(llmTime / 1000).toFixed(1)}s`);
            } else {
                console.log(`    ❌ ${json.message || 'Failed'}`);
            }
        } catch (err: any) {
            console.log(`    ❌ ${err.message}`);
        }
        
        // Cooldown to avoid rate limit
        console.log('    ⏳ Cooling 15s...');
        await new Promise(r => setTimeout(r, 15000));
        
        // ── Condition B: Full Pipeline ────────────────────────────
        console.log('  📌 Condition B: Full CareerX...');
        let fullData: any = null;
        let fullTime = 0;
        let fullMeta: any = {};
        try {
            const start = Date.now();
            const res = await fetch(`${BASE_URL}/api/generate-dashboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers: p.answers,
                    studentType: p.studentType,
                    userName: p.userName,
                    location: p.location,
                    currency: p.currency
                })
            });
            fullTime = Date.now() - start;
            const json = await res.json();
            if (json.status === 'complete') {
                fullData = json.data;
                fullMeta = json.meta || {};
                console.log(`    ✅ ${(fullTime / 1000).toFixed(1)}s (${fullMeta.sourcesUsed || 0} sources)`);
            } else {
                console.log(`    ❌ ${json.message || 'Failed'}`);
            }
        } catch (err: any) {
            console.log(`    ❌ ${err.message}`);
        }
        
        // ── Compare ──────────────────────────────────────────────
        const llmAnalysis = llmData ? analyzeOutput(llmData) : null;
        const fullAnalysis = fullData ? analyzeOutput(fullData) : null;
        
        const row = {
            profile: p.label,
            llmOnly: { timeMs: llmTime, ...llmAnalysis },
            fullSystem: { timeMs: fullTime, sourcesRetrieved: fullMeta.sourcesUsed || 0, ...fullAnalysis }
        };
        results.push(row);
        
        if (llmAnalysis && fullAnalysis) {
            console.log(`\n  📊 Comparison:`);
            console.log(`  ${'Metric'.padEnd(25)} ${'LLM-Only'.padEnd(15)} Full CareerX`);
            console.log(`  ${'─'.repeat(55)}`);
            console.log(`  ${'Time'.padEnd(25)} ${(llmTime / 1000).toFixed(1).padEnd(15)}s ${(fullTime / 1000).toFixed(1)}s`);
            console.log(`  ${'Pathways'.padEnd(25)} ${String(llmAnalysis.pathways).padEnd(15)} ${fullAnalysis.pathways}`);
            console.log(`  ${'Universities'.padEnd(25)} ${String(llmAnalysis.unis).padEnd(15)} ${fullAnalysis.unis}`);
            console.log(`  ${'Jobs'.padEnd(25)} ${String(llmAnalysis.jobs).padEnd(15)} ${fullAnalysis.jobs}`);
            console.log(`  ${'Source Citations'.padEnd(25)} ${String(llmAnalysis.sources).padEnd(15)} ${fullAnalysis.sources}`);
            console.log(`  ${'Generic Phrases'.padEnd(25)} ${String(llmAnalysis.genericPhrases).padEnd(15)} ${fullAnalysis.genericPhrases}`);
            console.log(`  ${'Salary Specificity'.padEnd(25)} ${(llmAnalysis.salarySpecificity + '%').padEnd(15)} ${fullAnalysis.salarySpecificity}%`);
            console.log(`  ${'Has URL Citations'.padEnd(25)} ${'No'.padEnd(15)} ${fullAnalysis.hasCitations ? 'Yes' : 'No'}`);
        }
        
        // Cooldown between profiles
        if (i < PROFILES.length - 1) {
            console.log('\n  ⏳ Cooling 20s before next profile...');
            await new Promise(r => setTimeout(r, 20000));
        }
    }
    
    // ── Save ─────────────────────────────────────────────────────
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, '..', 'ablation_results.json');
    fs.writeFileSync(outputPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        comparisons: results
    }, null, 2));
    
    console.log(`\n\n💾 Saved to: ${outputPath}`);
    console.log('✅ Ablation study complete.\n');
}

main().catch(console.error);
