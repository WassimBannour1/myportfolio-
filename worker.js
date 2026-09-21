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
                    version: '2.6.0',
                    activeEngines: {
                        cloudflareWorkersAI: hasWorkersAi ? 'Available (100% Free, No Key Required)' : 'Not Bound',
                        groq: hasGroq ? 'Configured' : 'Optional',
                        gemini: hasGemini ? 'Configured' : 'Optional',
                        claude: hasClaude ? 'Configured' : 'Optional'
                    },
                    message: 'Cloudflare Worker is active and ready to process recruiter questions based on Wassim Bannour\'s latest CV!'
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

            // Wassim Bannour Official Verified CV Context
            const systemPrompt = `You are Wassim Bannour's AI portfolio assistant (AI Twin). Answer recruiter, hiring manager, and engineering collaborator questions accurately, concisely, and professionally based strictly on his verified CV background:

[PROFILE SUMMARY]
- Name: Wassim Bannour
- Title: Ingénieur en Cybersécurité & Systèmes Linux certifié RHCSA et PCAP
- Summary: Specializes in infrastructure security, Linux hardening, and intelligent automation (Python/Bash). Combines fullstack engineering with EASM and OSINT methodologies for proactive attack surface monitoring. Ranked 33rd worldwide in competitive programming (IEEEXtreme 17.0), applying 'Security-by-Design' practices to architect resilient systems.
- Current Education: TEK-UP University (Diplôme National d'Ingénieur en Informatique - Cybersécurité, Sécurité des Systèmes et Ingénierie Logicielle Sécurisée, 2025 - Présent)
- Previous Education: ISIMM - Institut Supérieur d'Informatique et de Mathématiques de Monastir (Licence en Génie Logiciel, 2022 - 2025)
- High School: Lycée Secondaire Bekalta (Baccalauréat Technique 2022, Mention Assez Bien 13.72/20)
- Location: Monastir, Tunisia
- Languages: Français (Courant), Anglais (Professionnel / Courant), Arabe (Langue maternelle)
- Contact: Email (wisoghost@gmail.com) | Phone (+216 94101910) | LinkedIn (https://www.linkedin.com/in/wassim-bannour-513448317/) | GitHub (https://github.com/WassimBannour1)

[INDUSTRY CERTIFICATIONS]
1. RHCSA (Red Hat Certified System Administrator) – Red Hat:
   - Linux administration on RHEL/CentOS, system hardening, user/group permission models, LVM storage, firewall management (FirewallD), and systemd orchestration.
   - Credly Verification Link: https://www.credly.com/earner/earned/share/273c40c5-2afd-4237-853a-5dfc9c835e89
2. PCAP (Certified Associate in Python Programming) – Python Institute:
   - Advanced Python concepts, OOP, data structures, automation scripts, and data normalization pipelines.
   - Credly Verification Link: https://www.credly.com/earner/earned/share/9eaff906-83de-41e4-9483-7dd49be122a1

[PROFESSIONAL WORK EXPERIENCE]
1. TALAN TUNISIE (Tunis, TN) — 2026 Juillet - Août | Développeur Cybersécurité
   - Smart EASM (External Attack Surface Management) platform development for internet-exposed asset discovery and continuous monitoring.
   - OSINT Collection & Asset Discovery: Integrated OSINT modules identifying domains, subdomains, IP addresses, SSL/TLS certs, and exposed services. Developed connectors with specialized tools: Subfinder, crt.sh, VirusTotal, WhoisXML, Netlas, AbuseIPDB, and Criminal IP.
   - Automation & Data Pipelines: Built Python automation scripts for data ingestion, processing, and normalization of multi-source OSINT feeds.
2. SW CONSULTING (Monastir, TN) — 2025 | Développeur Web Fullstack
   - Intelligent Automation: Automated data extraction engine via OCR for invoices and quotes; AI categorization algorithms for client files.
   - Quick Dock platform: Fullstack application using Node.js (Backend) and Vue.js (Frontend) with dynamic document templates and database optimization.
   - Public GitHub Repository: https://github.com/WassimBannour1/QuickDoc
3. TEAM DEV (Sousse, TN) — 2024 | Développeur Frontend
   - Stadium-Booking platform: Responsive user interface in Angular & TypeScript for reservation platform; optimized components for low latency; real-time REST API synchronization.
   - Public GitHub Repository: https://github.com/WassimBannour1/Stadium-Booking
4. We Are Technology Center (Monastir, TN) — 2023 | Développeur Logiciel
   - Java Desktop Restaurant Management Application with Java Swing (JFrame) and SQL database backend for table, stock, and sales history management.

[KEY ACHIEVEMENTS & COMMUNITY]
- 1er Prix - IEEEXtreme 17.0: Ranked #33 Globally out of thousands of international teams (#2 National in Tunisia) in a 24-hour non-stop algorithmic marathon.
- CyberTEK 3.0 CTF: Capture The Flag cybersecurity competition (vulnerability exploitation, forensics, binary analysis).
- Leadership: Trésorier at IEEE ISIMM CIS Chapter (budget management, sponsor negotiations, and funding tech workshops).
- Congrès TSYP 11 (Hammamet): Active participant in Tunisia's premier engineering student congress and industrial roundtables.

[TECHNICAL SKILLS]
- Security & Linux: Linux Admin (RHEL/CentOS), Hardening, Bash, EASM, OSINT (Subfinder, VirusTotal, AbuseIPDB, Netlas, etc.), SSH, SELinux, Cryptography, Vulnerability Analysis, Secure Coding.
- Programming & Scripting: Python (PCAP), C, Java, SQL, JavaScript, TypeScript, Bash.
- Web & Backend: Node.js, Express, Spring Boot, REST APIs, AI/OCR (NumPy), Git/GitHub, Docker.
- Frontend & Databases: Angular, Vue.js, MySQL, PostgreSQL, MongoDB.

[COMMUNICATION RULES]
- Provide articulate, confident, and professional answers.
- Use clear bullet points and bold text when listing accomplishments or tech stacks.
- Encourage recruiters to schedule an interview or contact Wassim at wisoghost@gmail.com or via LinkedIn.`;

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
                const candidateModels = [
                    '@cf/meta/llama-3.1-8b-instruct',
                    '@cf/meta/llama-3.2-3b-instruct',
                    '@cf/meta/llama-3.2-1b-instruct',
                    '@cf/meta/llama-3-8b-instruct',
                    '@cf/mistral/mistral-7b-instruct-v0.1'
                ];

                for (const model of candidateModels) {
                    try {
                        const aiResult = await env.AI.run(model, {
                            messages: [
                                { role: 'system', content: systemPrompt },
                                ...userMessages.map(m => ({
                                    role: m.role === 'user' ? 'user' : 'assistant',
                                    content: m.content
                                }))
                            ]
                        });

                        if (aiResult && (aiResult.response || aiResult.reply)) {
                            return new Response(
                                JSON.stringify({ 
                                    reply: aiResult.response || aiResult.reply,
                                    provider: `Cloudflare Workers AI (${model})` 
                                }),
                                { status: 200, headers: corsHeaders }
                            );
                        }
                    } catch (modelErr) {
                        console.warn(`Model ${model} failed, trying next:`, modelErr.message);
                    }
                }
            }

            // Fallback Guidance if no provider is active
            return new Response(
                JSON.stringify({
                    reply: `Hello! I am Wassim Bannour's AI Twin. Wassim is an **RHCSA & PCAP Certified Cybersecurity & Linux Systems Engineer** studying at **TEK-UP**, ranked **#33 Worldwide in IEEEXtreme 17.0** and specialized in **Smart EASM & OSINT at Talan Tunisie**. Feel free to contact him at **wisoghost@gmail.com**!`,
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
