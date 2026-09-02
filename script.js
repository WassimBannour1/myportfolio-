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
            floatingChatBtn.classList.add('scale-0');
            chatInput.focus();
        } else {
            aiChatModal.classList.remove('active');
            floatingChatBtn.classList.remove('scale-0');
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
        avatar.className = `w-7 h-7 rounded text-xs shrink-0 mt-0.5 flex items-center justify-center font-mono font-bold ${
            role === 'user'
                ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40'
                : 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
        }`;
        avatar.textContent = role === 'user' ? 'YOU' : 'WB';

        const bubble = document.createElement('div');
        bubble.className = `p-3.5 rounded-xl border leading-relaxed ${
            role === 'user'
                ? 'bg-[#3b82f6]/20 text-white border-[#3b82f6]/40'
                : 'bg-[#1f293d]/80 text-gray-200 border-[#1f293d]'
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
            <div class="w-7 h-7 rounded bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 flex items-center justify-center text-xs shrink-0 mt-0.5 font-mono font-bold">
                WB
            </div>
            <div class="p-3.5 rounded-xl bg-[#1f293d]/80 text-gray-200 border border-[#1f293d] flex items-center gap-2">
                <span class="text-xs font-mono text-gray-400">Claude AI is analyzing CV context...</span>
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
        if (q.includes('who are you') || q.includes('who is wassim') || q.includes('introduce') || q.includes('about yourself') || q === 'hi' || q === 'hello' || q === 'hey' || q.includes('bonjour') || q.includes('salut')) {
            return `Hello! I am **Wassim Bannour's AI Twin**.\n\nWassim is a Software Engineering Student at **TEK-UP University** (focusing on Cybersecurity & Systems Engineering), holding two industry-recognized certifications:\n- **RHCSA** (Red Hat Certified System Administrator)\n- **PCAP** (Certified Associate in Python Programming)\n\nHe is also a **Top 33 Worldwide Winner in IEEEXtreme 17.0** (2nd in Tunisia). What would you like to explore regarding his skills, projects, or experience?`;
        }

        // 2. Certifications
        if (q.includes('cert') || q.includes('rhcsa') || q.includes('pcap') || q.includes('red hat') || q.includes('python institute')) {
            return `Wassim holds two prestigious certifications:\n\n1. **RHCSA (Red Hat Certified System Administrator)**:\n- Enterprise Linux administration (RHEL/CentOS)\n- User/group permissions, storage management (LVM), security policies\n- Systemd service orchestration, networking, and automated provisioning.\n\n2. **PCAP (Certified Associate in Python Programming)**:\n- Python Institute certified\n- Advanced OOP, algorithms, automated data processing, and scripting.`;
        }

        // 3. Competitions & IEEEXtreme Rank
        if (q.includes('rank') || q.includes('ieee') || q.includes('extreme') || q.includes('winner') || q.includes('competition') || q.includes('cybertek') || q.includes('ctf') || q.includes('award') || q.includes('33')) {
            return `Wassim has an exceptional competitive track record:\n\n- 🏆 **IEEEXtreme 17.0 (1er Prix)**: Ranked **#33 Worldwide** out of thousands of international university engineering teams, taking **2nd Place National Rank in Tunisia** in a non-stop 24-hour algorithmic problem-solving marathon.\n- 🛡️ **CyberTEK 3.0 CTF**: Competitor in Capture-The-Flag cybersecurity challenges.\n- 👥 **IEEE ISIMM CIS Chapter**: Served as Treasurer, organizing technical workshops and competitive coding events.`;
        }

        // 4. Education & Academic Background
        if (q.includes('education') || q.includes('tek-up') || q.includes('isimm') || q.includes('university') || q.includes('school') || q.includes('degree') || q.includes('study') || q.includes('studies')) {
            return `Wassim's Academic Background:\n\n1. **TEK-UP University (2025 - 2028)**\n- Diplôme National d'Ingénieur in Computer Science & Cybersecurity\n- In-depth focus on Systems Security, Network Defense, and Secure Software Architectures.\n\n2. **ISIMM - Higher Institute of Informatics & Mathematics of Monastir (2022 - 2025)**\n- Licence en Génie Logiciel (Bachelor's in Software Engineering)\n- Strong algorithmic foundation, fullstack development, and mathematics.`;
        }

        // 5. Work Experience & Internships
        if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('consulting') || q.includes('sw consulting') || q.includes('team dev') || q.includes('intern') || q.includes('quick dock') || q.includes('ocr')) {
            return `Wassim has proven hands-on industry experience:\n\n1. **SW CONSULTING (2025)** - *Fullstack Developer & AI/OCR Integration*\n- Engineered an automated document data extraction engine with OCR pipelines.\n- Developed the **Quick Dock** platform using Node.js, Express, and Vue.js.\n\n2. **TEAM DEV (2024)** - *Frontend Developer*\n- Built responsive, user-centric web applications using **Angular** with real-time REST API synchronization.\n\n3. **We Are Technology Center (2023)** - *Software Developer*\n- Designed and implemented a Java Desktop Restaurant Management Application with Java Swing/JFrame and relational database integration.`;
        }

        // 6. Skills & Tech Stack
        if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language') || q.includes('linux') || q.includes('docker') || q.includes('python') || q.includes('java') || q.includes('c ') || q.includes('angular') || q.includes('vue') || q.includes('database') || q.includes('sql') || q.includes('mongo')) {
            return `Wassim's Technical Stack:\n\n- **Systems & DevOps**: Red Hat Enterprise Linux (RHCSA), Bash Scripting, Docker, Security Hardening, Git/GitHub.\n- **Programming Languages**: Python (PCAP), C, Java, JavaScript, TypeScript, SQL.\n- **Web & Frameworks**: Node.js, Express, Spring Boot, Angular, Vue.js, Tailwind CSS, HTML5/CSS3.\n- **Databases & AI**: MySQL, PostgreSQL, MongoDB, AI/OCR Document Processing Pipelines, RESTful APIs.`;
        }

        // 7. Why Hire Wassim / Recruiter Value
        if (q.includes('hire') || q.includes('why') || q.includes('recruit') || q.includes('value') || q.includes('strengths') || q.includes('role')) {
            return `Why Wassim Bannour stands out for your team:\n\n1. **Dual System & Code Mastery**: Certified Linux Administrator (RHCSA) combined with certified software development (PCAP) allows him to bridge the gap between infrastructure security and modern application development.\n2. **Elite Problem Solver**: Proven #33 Global rank in IEEEXtreme proves he can deliver under intense pressure and solve complex algorithms.\n3. **Production Experience**: Proven track record delivering AI/OCR integrations and fullstack production applications.\n4. **Cybersecurity Mindset**: Proactive security awareness and defense-in-depth approach built into software design.`;
        }

        // 8. Contact & Socials
        if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('linkedin') || q.includes('github') || q.includes('location') || q.includes('address')) {
            return `You can connect with Wassim directly:\n\n- 📧 **Email**: [wisoghost@gmail.com](mailto:wisoghost@gmail.com)\n- 📱 **Phone**: **+216 94101910**\n- 💼 **LinkedIn**: [linkedin.com/in/wassim-bannour](https://linkedin.com/in/wassim-bannour)\n- 🐙 **GitHub**: [github.com/WassimBannour1](https://github.com/WassimBannour1)\n- 📍 **Location**: Monastir, Tunisia (Open to remote & relocation opportunities).`;
        }

        // 9. Default Fallback Synthesis
        return `Wassim Bannour is an **RHCSA & PCAP Certified Software Engineering Student at TEK-UP University**, ranked **#33 Worldwide in IEEEXtreme 17.0**.\n\nHis expertise spans **Linux Systems Security, Python Automation, Fullstack AI/OCR Integration (Node.js/Angular/Vue.js), and Docker Containerization**.\n\nFeel free to ask about his **certifications**, **projects**, or contact him at **wisoghost@gmail.com**!`;
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
