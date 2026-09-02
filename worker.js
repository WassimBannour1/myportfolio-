/**
 * Multi-Provider Cloudflare Worker Backend for Wassim Bannour's AI Twin
 * 
 * Free-Tier Ready:
 * 1. Cloudflare Workers AI (Llama 3.1 8B) -> 100% FREE, runs on Cloudflare GPUs with ZERO API key!
 * 2. Groq Cloud (Llama 3.3 70B / 3.1 8B) -> Ultra-fast 100% Free with GROQ_API_KEY
 * 3. Google Gemini (Gemini 1.5/2.0 Flash) -> 100% Free with GEMINI_API_KEY
 * 4. Anthropic Claude (Claude 3.5 Sonnet) -> High-tier with CLAUDE_API_KEY
 */

export default {
    async fetch(request, env, ctx) {
        // Standard CORS Headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
            'Content-Type': 'application/json'
        };

        // 1. Handle CORS Preflight (OPTIONS)
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        // 2. Health Check Endpoint (GET)
        if (request.method === 'GET') {
            const hasWorkersAi = Boolean(env.AI);
            const hasClaude = Boolean(env.CLAUDE_API_KEY);
            const hasGroq = Boolean(env.GROQ_API_KEY);
            const hasGemini = Boolean(env.GEMINI_API_KEY);

            return new Response(
                JSON.stringify({
                    status: 'online',
                    service: 'Wassim Bannour AI Twin Backend',
                    version: '2.5.0',
                    activeEngines: {
                        cloudflareWorkersAI: hasWorkersAi ? 'Available (100% Free, No Key Required)' : 'Not Bound',
                        groq: hasGroq ? 'Configured' : 'Optional',
                        gemini: hasGemini ? 'Configured' : 'Optional',
                        claude: hasClaude ? 'Configured' : 'Optional'
                    },
                    message: 'Cloudflare Worker is active and ready to process recruiter questions!'
                }),
                { status: 200, headers: corsHeaders }
            );
        }

        if (request.method !== 'POST') {
            return new Response(
                JSON.stringify({ error: 'Method not allowed. Use POST for chat requests.' }),
                { status: 405, headers: corsHeaders }
            );
        }

        try {
            const body = await request.json().catch(() => ({}));
            const userMessages = body.messages || [];

            if (!Array.isArray(userMessages) || userMessages.length === 0) {
                return new Response(
                    JSON.stringify({ error: 'Invalid payload: "messages" array is required.' }),
                    { status: 400, headers: corsHeaders }
                );
            }

            // Wassim Bannour Verified CV Context
            const systemPrompt = `You are Wassim Bannour's AI portfolio assistant (AI Twin). Answer recruiter, hiring manager, and collaborator questions accurately, concisely, and professionally based strictly on his verified background:

[PROFILE SUMMARY]
- Name: Wassim Bannour
- Title: Software Engineering Student & Systems/Cybersecurity Specialist
- Current Education: TEK-UP University (Diplôme National d'Ingénieur in Computer Science & Cybersecurity, 2025 - 2028)
- Previous Education: ISIMM - Institut Supérieur d'Informatique et de Mathématiques de Monastir (Licence en Génie Logiciel / Software Engineering, 2022 - 2025)
- Location: Monastir, Tunisia
- Contact: Email (wisoghost@gmail.com) | Phone (+216 94101910) | LinkedIn (https://www.linkedin.com/in/wassim-bannour-513448317/) | GitHub (https://github.com/WassimBannour1)

[INDUSTRY CERTIFICATIONS]
1. RHCSA (Red Hat Certified System Administrator) - Red Hat Enterprise Linux (RHEL), user/group administration, storage configuration (LVM), security policies (SELinux), systemd services, automated provisioning.
2. PCAP (Certified Associate in Python Programming) - Python Institute, object-oriented programming, data structures, algorithms, automation scripts.

[KEY COMPETITIONS & GLOBAL HONORS]
- 1er Prix - IEEEXtreme 17.0 World Final: Ranked #33 Globally out of thousands of international engineering teams (2nd Place National Rank in Tunisia) after a grueling 24-hour algorithmic programming marathon.
- CyberTEK 3.0 CTF: Active competitor in cybersecurity and capture-the-flag competitions.
- Leadership: Treasurer at IEEE ISIMM CIS Chapter.

[TECHNICAL SKILLS]
- Systems & Security: Linux Administration (RHEL, CentOS, Debian), Shell Scripting (Bash), Docker Containerization, Security Policies, Network Basics.
- Languages: Python, C, Java, JavaScript, TypeScript, SQL (MySQL, PostgreSQL), NoSQL (MongoDB).
- Frameworks & Web: Node.js, Express, Spring Boot, Angular, Vue.js, Tailwind CSS, HTML5/CSS3.
- AI & Integrations: AI/OCR Document Processing Engine, REST API architecture, Git & GitHub.

[WORK EXPERIENCE]
1. SW CONSULTING (2025) - Fullstack Web Developer & AI/OCR Integration
   - Developed automated data extraction and OCR document engine.
   - Built 'Quick Dock' platform utilizing Node.js, Express, and Vue.js.
2. TEAM DEV (2024) - Frontend Developer
   - Built responsive, interactive user interfaces with Angular and real-time REST API synchronization.
3. We Are Technology Center (2023) - Software Developer
   - Developed Java Desktop Restaurant Management Application with Java Swing/JFrame.

[INSTRUCTIONS]
- Provide articulate, confident, and professional answers.
- Use clean formatting (bullet points, bold text) when summarizing qualifications.
- Encourage recruiters to invite Wassim for an interview or contact him via email (wisoghost@gmail.com) or LinkedIn.`;

            // Provider Priority Strategy:
            // 1. Anthropic Claude (if CLAUDE_API_KEY is set)
            if (env.CLAUDE_API_KEY) {
                const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': env.CLAUDE_API_KEY,
                        'anthropic-version': '2023-06-01',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'claude-3-5-sonnet-20241022',
                        max_tokens: 1000,
                        system: systemPrompt,
                        messages: userMessages.map(m => ({
                            role: m.role === 'user' ? 'user' : 'assistant',
                            content: m.content
                        }))
                    })
                });

                if (anthropicRes.ok) {
                    const data = await anthropicRes.json();
                    return new Response(
                        JSON.stringify({ 
                            reply: data.content?.[0]?.text || "Sorry, no response generated.",
                            provider: 'Anthropic Claude 3.5 Sonnet' 
                        }),
                        { status: 200, headers: corsHeaders }
                    );
                }
            }

            // 2. Groq Cloud (if GROQ_API_KEY is set - 100% Free & Fast)
            if (env.GROQ_API_KEY) {
                const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'llama-3.3-70b-versatile',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            ...userMessages.map(m => ({
                                role: m.role === 'user' ? 'user' : 'assistant',
                                content: m.content
                            }))
                        ]
                    })
                });

                if (groqRes.ok) {
                    const data = await groqRes.json();
                    return new Response(
                        JSON.stringify({
                            reply: data.choices?.[0]?.message?.content || "No response generated.",
                            provider: 'Groq Cloud (Llama 3.3 70B)'
                        }),
                        { status: 200, headers: corsHeaders }
                    );
                }
            }

            // 3. Google Gemini (if GEMINI_API_KEY is set - 100% Free)
            if (env.GEMINI_API_KEY) {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
                const geminiRes = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: systemPrompt }] },
                        contents: userMessages.map(m => ({
                            role: m.role === 'user' ? 'user' : 'model',
                            parts: [{ text: m.content }]
                        }))
                    })
                });

                if (geminiRes.ok) {
                    const data = await geminiRes.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        return new Response(
                            JSON.stringify({ reply: text, provider: 'Google Gemini 1.5 Flash' }),
                            { status: 200, headers: corsHeaders }
                        );
                    }
                }
            }

            // 4. Cloudflare Workers AI (Native on Cloudflare GPUs - 100% Free, NO API Key needed!)
            if (env.AI) {
                const aiResult = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...userMessages.map(m => ({
                            role: m.role === 'user' ? 'user' : 'assistant',
                            content: m.content
                        }))
                    ]
                });

                if (aiResult && aiResult.response) {
                    return new Response(
                        JSON.stringify({
                            reply: aiResult.response,
                            provider: 'Cloudflare Workers AI (Llama 3.1 8B - 100% Free)'
                        }),
                        { status: 200, headers: corsHeaders }
                    );
                }
            }

            // Fallback Guidance if no provider is active
            return new Response(
                JSON.stringify({
                    reply: `Hello! I am Wassim Bannour's AI Twin. Wassim is an **RHCSA & PCAP Certified Software Engineer** studying Cybersecurity at **TEK-UP**, ranked **#33 Worldwide in IEEEXtreme 17.0**. Feel free to contact him at **wisoghost@gmail.com**!`,
                    provider: 'Autonomous Fallback Engine'
                }),
                { status: 200, headers: corsHeaders }
            );

        } catch (err) {
            console.error('Worker internal error:', err);
            return new Response(
                JSON.stringify({ 
                    error: 'Internal Worker Server Error', 
                    message: err.message 
                }),
                { status: 500, headers: corsHeaders }
            );
        }
    }
};
