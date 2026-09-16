/**
 * Wassim Bannour Portfolio - Client Script
 * 
 * Features:
 * 1. Dynamic Cyber Matrix Particle Canvas Background
 * 2. Mobile Drawer Navigation & Scroll Spy
 * 3. Interactive Skills Matrix Filtering
 * 4. AI Twin Chat Client with Cloudflare Worker Support & Deep Knowledge Fallback
 * 5. In-Chat Settings & Connection Tester
 */

// Cloudflare Worker URL stored in localStorage or empty initially
let CLOUDFLARE_WORKER_URL = localStorage.getItem('WB_WORKER_URL') || '';

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------
    // 1. DYNAMIC CYBER MATRIX CANVAS BACKGROUND
    // -------------------------------------------------------------
    const canvas = document.getElementById('cyberCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Grid particle nodes
        const nodes = Array.from({ length: 45 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 1
        }));

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            // Connecting lines
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
            ctx.lineWidth = 0.6;

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    // -------------------------------------------------------------
    // 2. MOBILE MENU TOGGLE
    // -------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // -------------------------------------------------------------
    // 3. SKILLS MATRIX FILTERING
    // -------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 3.1 INTERACTIVE EXPERIENCE ACCORDION
    // -------------------------------------------------------------
    const experienceCards = document.querySelectorAll('.experience-card');

    experienceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Ignore clicks on links or interactive buttons inside the card
            if (e.target.closest('a') || e.target.closest('button:not(.expand-status-badge)')) {
                return;
            }

            const isCurrentlyExpanded = card.classList.contains('is-expanded');
            
            // Toggle current card
            if (isCurrentlyExpanded) {
                card.classList.remove('is-expanded');
                const btnText = card.querySelector('.expand-btn-text');
                if (btnText) btnText.textContent = 'Détails';
            } else {
                card.classList.add('is-expanded');
                const btnText = card.querySelector('.expand-btn-text');
                if (btnText) btnText.textContent = 'Fermer';
            }
        });
    });

    // -------------------------------------------------------------
    // 4. AI TWIN CHAT WIDGET & CLOUDFLARE WORKER CLIENT
    // -------------------------------------------------------------
    const aiChatModal = document.getElementById('aiChatModal');
    const openAiChatBtn = document.getElementById('openAiChatBtn');
    const mobileAiChatBtn = document.getElementById('mobileAiChatBtn');
    const floatingChatBtn = document.getElementById('floatingChatBtn');
    const closeAiChatBtn = document.getElementById('closeAiChatBtn');

    const chatSettingsToggleBtn = document.getElementById('chatSettingsToggleBtn');
    const chatSettingsPanel = document.getElementById('chatSettingsPanel');
    const closeSettingsPanelBtn = document.getElementById('closeSettingsPanelBtn');
    const workerUrlInput = document.getElementById('workerUrlInput');
    const saveWorkerUrlBtn = document.getElementById('saveWorkerUrlBtn');
    const testWorkerBtn = document.getElementById('testWorkerBtn');
    const workerTestResult = document.getElementById('workerTestResult');

    const backendModeBadge = document.getElementById('backendModeBadge');
    const backendStatusSubtext = document.getElementById('backendStatusSubtext');
    const headerStatusDot = document.getElementById('headerStatusDot');

    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const promptPills = document.querySelectorAll('.prompt-pill');

    // Initialize Worker URL input and status UI
    if (workerUrlInput && CLOUDFLARE_WORKER_URL) {
        workerUrlInput.value = CLOUDFLARE_WORKER_URL;
        updateBackendStatusUI('worker', 'Cloudflare Worker configured');
    } else {
        updateBackendStatusUI('autonomous', 'Engine: Autonomous AI Active');
    }

    // Toggle Chat Window
    function toggleChat(show) {
        if (show) {
            aiChatModal.classList.add('active');
            if (floatingChatBtn) floatingChatBtn.classList.add('scale-0');
            if (chatInput) chatInput.focus();
        } else {
            aiChatModal.classList.remove('active');
            if (floatingChatBtn) floatingChatBtn.classList.remove('scale-0');
        }
    }

    if (openAiChatBtn) openAiChatBtn.addEventListener('click', () => toggleChat(true));
    if (mobileAiChatBtn) mobileAiChatBtn.addEventListener('click', () => toggleChat(true));
    if (floatingChatBtn) floatingChatBtn.addEventListener('click', () => toggleChat(true));
    if (closeAiChatBtn) closeAiChatBtn.addEventListener('click', () => toggleChat(false));

    // Settings panel toggle
    if (chatSettingsToggleBtn && chatSettingsPanel) {
        chatSettingsToggleBtn.addEventListener('click', () => {
            chatSettingsPanel.classList.toggle('hidden');
        });
    }

    if (closeSettingsPanelBtn && chatSettingsPanel) {
        closeSettingsPanelBtn.addEventListener('click', () => {
            chatSettingsPanel.classList.add('hidden');
        });
    }

    // Save Cloudflare Worker URL to localStorage
    if (saveWorkerUrlBtn && workerUrlInput) {
        saveWorkerUrlBtn.addEventListener('click', () => {
            const url = workerUrlInput.value.trim().replace(/\/$/, '');
            CLOUDFLARE_WORKER_URL = url;
            localStorage.setItem('WB_WORKER_URL', url);

            if (url) {
                updateBackendStatusUI('worker', 'Cloudflare Worker configured');
                showTestMessage(`Worker URL saved: ${url}`, 'success');
            } else {
                updateBackendStatusUI('autonomous', 'Engine: Autonomous AI Active');
                showTestMessage('Worker URL cleared. Running on built-in Autonomous Engine.', 'info');
            }
        });
    }

    // Test Cloudflare Worker connectivity
    if (testWorkerBtn && workerUrlInput) {
        testWorkerBtn.addEventListener('click', async () => {
            const url = (workerUrlInput.value.trim() || CLOUDFLARE_WORKER_URL).replace(/\/$/, '');
            if (!url) {
                showTestMessage('Please enter your Cloudflare Worker URL first.', 'error');
                return;
            }

            showTestMessage('Pinging Cloudflare Worker...', 'loading');

            try {
                const res = await fetch(url, { method: 'GET', mode: 'cors' });
                if (res.ok) {
                    const data = await res.json().catch(() => ({ status: 'online' }));
                    showTestMessage(`Online: Cloudflare Worker responded (${data.service || 'Ready'})!`, 'success');
                    updateBackendStatusUI('worker', 'Cloudflare Worker: Online');
                } else {
                    showTestMessage(`Worker returned status ${res.status}. Check CORS or endpoint URL.`, 'warn');
                }
            } catch (err) {
                showTestMessage(`Connection failed (${err.message}). Verify URL and Cloudflare Worker status.`, 'error');
            }
        });
    }

    function showTestMessage(msg, type) {
        if (!workerTestResult) return;
        workerTestResult.classList.remove('hidden');
        
        let colorClass = 'text-gray-300';
        if (type === 'success') colorClass = 'text-[#00ff9d] border-[#00ff9d]/40';
        else if (type === 'error') colorClass = 'text-red-400 border-red-500/40';
        else if (type === 'warn') colorClass = 'text-yellow-400 border-yellow-500/40';
        else if (type === 'loading') colorClass = 'text-[#00f0ff] border-[#00f0ff]/40';

        workerTestResult.className = `text-[11px] p-2 rounded bg-[#111827] border ${colorClass}`;
        workerTestResult.innerHTML = msg;
    }

    function updateBackendStatusUI(mode, subtext) {
        if (backendModeBadge) {
            if (mode === 'worker') {
                backendModeBadge.textContent = 'WORKER-LIVE';
                backendModeBadge.className = 'text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono';
            } else {
                backendModeBadge.textContent = 'CYBER-AI';
                backendModeBadge.className = 'text-[9px] px-1.5 py-0.2 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-mono';
            }
        }
        if (backendStatusSubtext) {
            backendStatusSubtext.innerHTML = `
                <span class="w-1.5 h-1.5 rounded-full ${mode === 'worker' ? 'bg-[#00ff9d]' : 'bg-[#00f0ff]'} inline-block"></span>
                <span>${subtext}</span>
            `;
        }
        if (headerStatusDot) {
            headerStatusDot.className = `w-2.5 h-2.5 rounded-full ${mode === 'worker' ? 'bg-[#00ff9d]' : 'bg-[#00f0ff]'} border-2 border-[#0b0f19] absolute -top-1 -right-1`;
        }
    }

    // Prompt pills handler
    promptPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const promptText = pill.getAttribute('data-prompt');
            if (promptText) {
                chatInput.value = promptText;
                submitUserMessage(promptText);
            }
        });
    });

    // Helper: Markdown to HTML Formatter
    function formatMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-black/40 text-[#00f0ff] font-mono text-xs">$1</code>')
            .replace(/^-\s+(.*)$/gm, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    // Append user/assistant message to UI stream
    function appendMessage(role, content) {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `chat-bubble ${role} flex items-start gap-2.5 max-w-[90%] ${role === 'user' ? 'ml-auto flex-row-reverse' : ''}`;

        const avatar = document.createElement('div');
        if (role === 'user') {
            avatar.className = 'w-8 h-8 rounded-xl text-xs shrink-0 mt-0.5 flex items-center justify-center font-mono font-bold bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/50';
            avatar.textContent = 'YOU';
        } else {
            avatar.className = 'w-8 h-8 rounded-xl overflow-hidden border-2 border-[#00f0ff]/60 shrink-0 mt-0.5 shadow-md';
            avatar.innerHTML = '<img src="1000015101.jpg" alt="Wassim" class="w-full h-full object-cover object-top">';
        }

        const bubble = document.createElement('div');
        bubble.className = `p-3.5 rounded-2xl border leading-relaxed ${
            role === 'user'
                ? 'bg-[#38bdf8]/20 text-white border-[#38bdf8]/40'
                : 'bg-[#070b14] text-gray-200 border-[#1e293b]'
        }`;
        bubble.innerHTML = formatMarkdown(content);

        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(bubble);
        chatMessages.appendChild(messageWrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Typing Indicator UI
    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const indicatorWrapper = document.createElement('div');
        indicatorWrapper.id = id;
        indicatorWrapper.className = 'chat-bubble assistant flex items-start gap-2.5 max-w-[90%]';

        indicatorWrapper.innerHTML = `
            <div class="w-8 h-8 rounded-xl overflow-hidden border-2 border-[#00f0ff]/60 shrink-0 mt-0.5 shadow-md">
                <img src="1000015101.jpg" alt="Wassim" class="w-full h-full object-cover object-top">
            </div>
            <div class="p-3.5 rounded-2xl bg-[#070b14] text-gray-200 border border-[#1e293b] flex items-center gap-2">
                <span class="text-xs font-mono text-gray-400">AI Twin is analyzing CV context...</span>
                <div class="typing-dots inline-flex gap-1">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;

        chatMessages.appendChild(indicatorWrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        const elem = document.getElementById(id);
        if (elem) elem.remove();
    }

    // -------------------------------------------------------------
    // 5. DEEP KNOWLEDGE ENGINE (Autonomous Local AI)
    // -------------------------------------------------------------
    function getDeepKnowledgeResponse(query) {
        const q = query.toLowerCase().trim();

        // 1. Greetings & Introduction
        if (q.includes('who are you') || q.includes('who is wassim') || q.includes('introduce') || q.includes('about yourself') || q === 'hi' || q === 'hello' || q === 'hey' || q.includes('bonjour') || q.includes('salut') || q.includes('qui es-tu')) {
            return `Hello! I am **Wassim Bannour's AI Twin**.\n\nWassim is a **Cybersecurity & Linux Systems Engineer** certified **RHCSA** and **PCAP**, currently preparing his Diplôme National d'Ingénieur at **TEK-UP University**.\n\nKey highlights:\n- 🛡️ **Cybersecurity Flagship**: Developed a Smart EASM (External Attack Surface Management) platform & OSINT modules at **TALAN TUNISIE**.\n- 📜 **Dual Certifications**: **RHCSA** (Red Hat) & **PCAP** (Python Institute).\n- 🏆 **Global Rank**: **#33 Worldwide** in **IEEEXtreme 17.0** (2nd in Tunisia).\n- 💻 **Fullstack & AI**: Automated OCR engines and modern web platforms (Node.js, Vue.js, Angular).\n\nWhat would you like to explore regarding his experience, skills, or projects?`;
        }

        // 2. Talan Tunisie & Cybersecurity / EASM / OSINT
        if (q.includes('talan') || q.includes('easm') || q.includes('osint') || q.includes('subfinder') || q.includes('virustotal') || q.includes('attack surface') || q.includes('surface d\'attaque')) {
            return `At **TALAN TUNISIE** (Juillet - Août 2026, Tunis), Wassim worked as a **Cybersecurity Developer** on a **Smart EASM (External Attack Surface Management)** platform:\n\n1. **EASM Core Platform**:\n- Participated in engineering an external attack surface discovery & monitoring platform for internet-exposed assets.\n- Hardened platform stability and component reliability.\n\n2. **OSINT Intelligence & Asset Discovery**:\n- Built modules detecting exposed domains, subdomains, IP ranges, SSL/TLS certs, and open services.\n- Developed specialized API connectors with **Subfinder, crt.sh, VirusTotal, WhoisXML, Netlas, AbuseIPDB, and Criminal IP**.\n\n3. **Python Automation & Threat Feeds**:\n- Automated OSINT data ingestion, parsing, and normalization pipelines with Python.\n- Consolidated threat intelligence for proactive risk assessment.`;
        }

        // 3. Certifications (RHCSA & PCAP)
        if (q.includes('cert') || q.includes('rhcsa') || q.includes('pcap') || q.includes('red hat') || q.includes('python institute')) {
            return `Wassim holds two industry-standard certifications:\n\n1. 🔴 **RHCSA (Red Hat Certified System Administrator)** – *Red Hat*:\n- Enterprise Linux administration (RHEL/CentOS)\n- User & group access control, storage management (LVM, Stratis)\n- System security hardening, SELinux enforcement, FirewallD & systemd service management.\n\n2. 🟡 **PCAP (Certified Associate in Python Programming)** – *Python Institute*:\n- Advanced OOP, complex algorithmic data structures\n- Automated scripting, multi-source data processing, and data normalization pipelines.`;
        }

        // 4. Competitions, IEEEXtreme Rank, CTF & Leadership
        if (q.includes('rank') || q.includes('ieee') || q.includes('extreme') || q.includes('winner') || q.includes('competition') || q.includes('cybertek') || q.includes('ctf') || q.includes('tsyp') || q.includes('33')) {
            return `Wassim's Competitive Track Record & Community Impact:\n\n- 🏆 **IEEEXtreme 17.0 (1er Prix)**:\n  - Ranked **#33 Worldwide** out of thousands of international university engineering teams.\n  - Ranked **#2 Nationally in Tunisia** during a 24-hour non-stop algorithmic marathon.\n- 🛡️ **CyberTEK 3.0 CTF**: Competitive Capture The Flag player focusing on vulnerability exploitation, binary analysis, and packet forensics.\n- 👥 **Leadership: Trésorier IEEE ISIMM CIS Chapter**: Managed chapter budgets, negotiated sponsorships & strategic partnerships for student technical workshops.\n- 🌐 **Congrès TSYP 11 (Hammamet)**: Active participant in Tunisia's premier engineering student congress and industrial roundtables.`;
        }

        // 5. Work Experience & Internships
        if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('consulting') || q.includes('sw consulting') || q.includes('team dev') || q.includes('quick dock') || q.includes('quickdoc') || q.includes('stadium') || q.includes('ocr') || q.includes('restaurant')) {
            return `Wassim's Professional Experience:\n\n1. **TALAN TUNISIE (2026, Tunis)** - *Développeur Cybersécurité*\n- Smart EASM platform, OSINT integration (Subfinder, VirusTotal, AbuseIPDB, Netlas), and Python automation pipelines.\n\n2. **SW CONSULTING (2025, Monastir)** - *Développeur Web Fullstack*\n- Intelligent document extraction via OCR and AI categorization algorithms.\n- Developed the 'Quick Dock' fullstack platform using **Node.js** and **Vue.js**.\n- 📁 **Repository**: [GitHub - WassimBannour1/QuickDoc](https://github.com/WassimBannour1/QuickDoc)\n\n3. **TEAM DEV (2024, Sousse)** - *Développeur Frontend*\n- Built responsive, adaptive Stadium-Booking reservation interface with **Angular & TypeScript**, with real-time REST API synchronization.\n- 📁 **Repository**: [GitHub - WassimBannour1/Stadium-Booking](https://github.com/WassimBannour1/Stadium-Booking)\n\n4. **We Are Technology Center (2023, Monastir)** - *Développeur Logiciel*\n- Desktop Restaurant Management Solution with **Java Swing (JFrame)** and relational SQL backend.`;
        }

        // 6. Education & Academic Background
        if (q.includes('education') || q.includes('tek-up') || q.includes('isimm') || q.includes('university') || q.includes('school') || q.includes('degree') || q.includes('bac') || q.includes('bekalta')) {
            return `Wassim's Academic Background:\n\n1. 🎓 **TEK-UP University (2025 - Présent, Ariana)**:\n- **Diplôme National d'Ingénieur en Informatique**\n- Specialization: *Cybersécurité, Sécurité des Systèmes et Ingénierie Logicielle Sécurisée*.\n- Relevant Courses: Advanced Linux Admin, Cryptography, Vulnerability Analysis, Secure Coding.\n\n2. 🎓 **ISIMM (2022 - 2025, Monastir)**:\n- **Licence en Génie Logiciel**\n- Algorithms, software architecture, data structures, and database engineering.\n\n3. 🎓 **Lycée Secondaire Bekalta (2018 - 2022, Monastir)**:\n- **Baccalauréat Technique** (Mention: Assez Bien - 13.72/20).`;
        }

        // 7. Languages
        if (q.includes('language') || q.includes('langue') || q.includes('french') || q.includes('francais') || q.includes('english') || q.includes('anglais') || q.includes('arabic') || q.includes('arabe')) {
            return `Wassim's Language Proficiencies:\n\n- 🇫🇷 **Français**: Courant (Fluent)\n- 🇬🇧 **Anglais**: Professionnel / Courant (Professional Proficiency)\n- 🇹🇳 **Arabe**: Langue maternelle (Native)`;
        }

        // 8. Skills & Tech Stack
        if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('linux') || q.includes('docker') || q.includes('python') || q.includes('java') || q.includes('c ') || q.includes('angular') || q.includes('vue') || q.includes('database') || q.includes('sql') || q.includes('mongo')) {
            return `Wassim's Technical Stack:\n\n- **Cybersecurity & Systems**: Linux Administration (RHEL/CentOS - RHCSA), Bash Scripting, EASM, OSINT (Subfinder, VirusTotal, Netlas, AbuseIPDB, Criminal IP, WhoisXML), System Hardening, Cryptography, Secure Coding.\n- **Programming & Automation**: Python (PCAP), C, Java, SQL, JavaScript, TypeScript, Bash.\n- **Web & Backend**: Node.js, Express, Spring Boot, RESTful APIs, AI/OCR (NumPy), Git/GitHub, Docker.\n- **Frontend & Databases**: Angular, Vue.js, MySQL, PostgreSQL, MongoDB.`;
        }

        // 9. Why Hire Wassim / Recruiter Value
        if (q.includes('hire') || q.includes('why') || q.includes('recruit') || q.includes('value') || q.includes('strengths') || q.includes('role')) {
            return `Why Wassim Bannour is an exceptional addition to your team:\n\n1. **Dual System & Software Mastery**: Certified Linux Administrator (**RHCSA**) and Certified Python Programmer (**PCAP**) bridging infrastructure security with modern fullstack software development.\n2. **Demonstrated Cybersecurity Expertise**: Hands-on experience developing Smart EASM and OSINT threat pipelines at **Talan Tunisie**.\n3. **Elite Problem Solver**: **#33 Worldwide in IEEEXtreme 17.0** proves world-class algorithmic performance under extreme pressure.\n4. **End-to-End Production Deliverables**: Delivered AI/OCR document engines, reactive fullstack apps (Node/Vue/Angular), and Java desktop systems.`;
        }

        // 10. Contact & Socials
        if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('linkedin') || q.includes('github') || q.includes('location') || q.includes('address')) {
            return `Connect with Wassim directly:\n\n- 📧 **Email**: [wisoghost@gmail.com](mailto:wisoghost@gmail.com)\n- 📱 **Phone**: **+216 94101910**\n- 💼 **LinkedIn**: [linkedin.com/in/wassim-bannour-513448317](https://www.linkedin.com/in/wassim-bannour-513448317/)\n- 🐙 **GitHub**: [github.com/WassimBannour1](https://github.com/WassimBannour1)\n- 📍 **Location**: Monastir, Tunisia (Open to on-site, hybrid, and remote roles).`;
        }

        // Default Fallback Synthesis
        return `Wassim Bannour is an **RHCSA & PCAP Certified Cybersecurity & Linux Systems Engineer** at **TEK-UP University**, ranked **#33 Worldwide in IEEEXtreme 17.0**.\n\nHis core expertise covers **External Attack Surface Management (EASM), OSINT automation (Talan Tunisie), Linux hardening, and fullstack AI/OCR software engineering**.\n\nFeel free to ask about his **Talan cybersecurity experience**, **certifications**, **projects**, or contact him at **wisoghost@gmail.com**!`;
    }

    // -------------------------------------------------------------
    // 6. MESSAGE SUBMISSION & WORKER DISPATCHER
    // -------------------------------------------------------------
    async function submitUserMessage(userQuery) {
        if (!userQuery || !userQuery.trim()) return;

        // Render user message immediately
        appendMessage('user', userQuery);
        chatInput.value = '';

        const typingId = showTypingIndicator();

        // Determine target backend endpoints to try in order
        const endpointsToTry = [];

        // 1. Explicitly configured Cloudflare Worker URL
        if (CLOUDFLARE_WORKER_URL) {
            const cleanWorker = CLOUDFLARE_WORKER_URL.replace(/\/$/, '');
            endpointsToTry.push(`${cleanWorker}/api/chat`);
            endpointsToTry.push(cleanWorker);
        }

        // 2. Relative endpoint if served via same origin
        if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
            endpointsToTry.push('/api/chat');
        }

        let replyReceived = null;

        for (const endpoint of endpointsToTry) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [
                            { role: 'user', content: userQuery }
                        ]
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    if (data && (data.reply || data.response)) {
                        replyReceived = data.reply || data.response;
                        updateBackendStatusUI('worker', 'Cloudflare Worker: Online');
                        break;
                    }
                }
            } catch (err) {
                // Worker unreachable or timed out
            }
        }

        // If worker was not reachable or not configured yet, use Deep Knowledge Engine
        if (!replyReceived) {
            await new Promise(res => setTimeout(res, 350));
            replyReceived = getDeepKnowledgeResponse(userQuery);
        }

        removeTypingIndicator(typingId);
        appendMessage('assistant', replyReceived);
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitUserMessage(chatInput.value);
        });
    }

    // -------------------------------------------------------------
    // 7. SECTION SCROLL ACTIVE LINK HIGHLIGHTING
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
