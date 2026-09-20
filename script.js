/**
 * Wassim Bannour Portfolio - Client Script
 * 
 * Features:
 * 1. Dynamic Cyber Matrix Particle Canvas with Magnetic Mouse Interaction
 * 2. Dynamic Hero Typewriter Rotating Subtitles
 * 3. Interactive Live Cyber Terminal HUD with Command Line Engine
 * 4. Smooth IntersectionObserver Scroll-Reveal & Animated Number Counters
 * 5. Web Audio API Futuristic SFX Synthesizer (Zero External Audio Files)
 * 6. Reading Progress Bar & Back to Top Action
 * 7. Mobile Drawer Navigation & Scroll Spy
 * 8. Interactive Skills Matrix Filtering & Experience Accordion
 * 9. AI Twin Chat Client with Cloudflare Worker Support & Deep Knowledge Fallback
 */

// Cloudflare Worker URL stored in localStorage or empty initially
let CLOUDFLARE_WORKER_URL = localStorage.getItem('WB_WORKER_URL') || '';

// Audio SFX state
let SFX_ENABLED = localStorage.getItem('WB_SFX_ENABLED') !== 'false';
let audioCtx = null;

// Multi-Language & Theme State
let CURRENT_LANG = localStorage.getItem('WB_LANG') || 'fr';
let CURRENT_THEME = localStorage.getItem('WB_THEME') || 'dark';

// Complete Bilingual Dictionary (French & English)
const I18N_DATA = {
    fr: {
        // Navigation
        'nav.achievements': 'Distinctions',
        'nav.certs': 'Certifications',
        'nav.experience': 'Expérience',
        'nav.pipeline': 'Radar',
        'nav.skills': 'Formation',
        'nav.contact': 'Contact',
        'nav.fasttrack': 'FAST-TRACK',
        'nav.aichat': 'AI TWIN',
        'nav.cv_download': 'Télécharger le CV Officiel (PDF)',
        'nav.launch_ai': 'LANCER L\'AI TWIN',

        // Hero
        'hero.badge': 'INGÉNIEUR CYBERSÉCURITÉ & SYSTÈMES LINUX',
        'hero.role_prefix': 'role:~$',
        'hero.education': 'Diplôme National d\'Ingénieur Cybersécurité @ <span class="text-white font-bold underline decoration-[#38bdf8]">TEK-UP</span>',
        'hero.bio': 'Spécialisé dans la <strong>sécurisation des infrastructures</strong> et l’<strong>automatisation intelligente</strong> (<em>Python / Bash</em>). Allie une expertise technique en développement Full Stack à une maîtrise des méthodologies <strong>EASM</strong> et <strong>OSINT</strong> pour la surveillance proactive des surfaces d’attaque. Classé <strong>33ᵉ mondial</strong> en programmation compétitive (<strong>IEEEXtreme</strong>), combinant rigueur algorithmique et pratiques de <em>\'Security-by-Design\'</em>.',
        'hero.btn_fasttrack': 'RECRUITER FAST-TRACK (60s)',
        'hero.btn_aichat': 'Chat AI Twin',
        'hero.status_pill': 'STATUT : ACTIF // DISPONIBLE',
        'hero.stat_rank': 'Mondial IEEEXtreme',
        'hero.stat_rank_sub': '2ᵉ National en Tunisie',
        'hero.stat_certs': 'Red Hat SysAdmin',
        'hero.stat_certs_sub': 'Noyau Linux Entreprise',
        'hero.stat_stage': 'Python Institute',
        'hero.stat_stage_sub': 'Algorithmes & Pipelines',
        'hero.stat_sec': 'Talan Tunisie',
        'hero.stat_sec_sub': 'Surface d\'Attaque & OSINT',
        'hero.telemetry_title': '// Télémétrie Système',
        'hero.security_by_design': 'Sécurité dès la Conception',
        'hero.stack_label': '<span class="text-[#38bdf8]">Stack :</span> Admin Linux (RHEL), Python, EASM, OSINT, Node.js, Angular, Docker',

        // Section 01: Achievements
        'achievements.tag': '01. // Parcours & Distinctions',
        'achievements.title': 'Réalisations Majeures & Distinctions',
        'achievements.subtitle': 'Excellence prouvée en résolution algorithmique sous pression, cybersécurité compétitive et leadership technique.',
        'achievements.c1_badge': '1er Prix',
        'achievements.c1_type': 'Compétition Mondiale',
        'achievements.c1_li1': '<strong class="text-white">33ème Place Mondiale</strong> parmi des milliers d\'équipes d\'ingénieurs internationales.',
        'achievements.c1_li2': '<strong class="text-white">2ème Place Nationale</strong> en Tunisie.',
        'achievements.c1_li3': 'Résolution de problèmes algorithmiques complexes en 24h non-stop.',
        'achievements.c2_badge': 'Cybersécurité',
        'achievements.c2_type': 'Capture-The-Flag',
        'achievements.c2_li1': 'Compétition Capture The Flag : Exploitation de failles & défense d\'infrastructure.',
        'achievements.c2_li2': 'Analyse de paquets réseaux, reverse engineering et sécurité binaire.',
        'achievements.c3_badge': 'Leadership',
        'achievements.c3_type': 'Bureau Exécutif',
        'achievements.c3_title': 'Trésorier IEEE ISIMM',
        'achievements.c3_li1': 'Gestion rigoureuse du budget et optimisation financière des événements techniques.',
        'achievements.c3_li2': 'Négociation de sponsors et partenariats stratégiques pour financer ateliers et conférences.',
        'achievements.c4_badge': 'Réseautage',
        'achievements.c4_type': 'Congrès National',
        'achievements.c4_title': 'Congrès TSYP 11',
        'achievements.c4_li1': 'Participation au plus grand congrès étudiant en Tunisie (Hammamet).',
        'achievements.c4_li2': 'Immersion dans les tendances technologiques et tables rondes industrielles.',

        // Section 02: Certifications
        'certs.tag': '02. // Titres & Certifications Professionnelles',
        'certs.title': 'Certifications Professionnelles Vérifiées',
        'certs.rhcsa_badge': 'RED HAT CERTIFIÉ',
        'certs.issuer_prefix': 'Émetteur :',
        'certs.credly_verified': 'Badge Credly Vérifié',
        'certs.rhcsa_desc': 'Expertise en administration d\'entreprise Linux (RHEL/CentOS), durcissement système, automatisation Bash, gestion des droits et utilisateurs, stockage LVM, pare-feu FirewallD et orchestration de services systemd sécurisés.',
        'certs.rhcsa_verify_id': 'ID de Vérification Red Hat',
        'certs.pcap_badge': 'PYTHON INSTITUTE',
        'certs.pcap_desc': 'Maîtrise certifiée de la programmation orientée objet (POO), des structures de données complexes, des scripts d\'automatisation, des pipelines de normalisation de flux de données et de l\'architecture logicielle propre.',
        'certs.pcap_verify_id': 'ID de Vérification Python Institute',
        'certs.verify_credly': 'Vérifier sur Credly',

        // Section 03: Experience
        'exp.tag': '03. // Parcours Professionnel & Projets',
        'exp.title': 'Expérience Professionnelle & Stages',
        'exp.subtitle': 'Cliquez sur une expérience pour afficher les détails d\'architecture, réalisations techniques et dépôts de code source.',
        'exp.btn_details': 'Détails',
        'exp.btn_attestation': 'Attestation',
        'exp.btn_code': 'Code',
        'exp.talan_badge': 'FLAGSHIP CYBERSECURITY',
        'exp.talan_role': 'Développeur Cybersécurité — Plateforme Smart EASM',
        'exp.talan_sub': 'External Attack Surface Management & Threat Intelligence',
        'exp.talan_date': '2026 Juil - Août',
        'exp.talan_summary': 'Conception et développement de la plateforme <strong class="text-white">Smart EASM</strong> pour la découverte continue, la cartographie et la surveillance des actifs exposés sur Internet, avec automatisation avancée des flux <strong class="text-[#00f0ff]">OSINT & Threat Intelligence</strong>.',
        'exp.talan_b1_title': 'Architecture EASM',
        'exp.talan_b1_desc': 'Architecture modulaire conçue pour la découverte passive et active des vecteurs d\'attaque externes : domaines racine, sous-domaines orphelins, adresses IP publiques, certificats TLS expirés et ports/services vulnérables.',
        'exp.talan_b2_title': 'Connecteurs OSINT',
        'exp.talan_b2_desc': 'Intégration d\'APIs tierces et d\'outils de reconnaissance : <strong>Subfinder, crt.sh, VirusTotal, WhoisXML, Netlas, AbuseIPDB et Criminal IP</strong> pour une couverture exhaustive de la surface d\'attaque.',
        'exp.talan_b3_title': 'Pipelines Python',
        'exp.talan_b3_desc': 'Développement de pipelines <strong>Python</strong> hautement optimisés pour dédupliquer, corréler, normaliser et filtrer les flux volumineux de données OSINT brutes vers des tableaux de bord exploitables.',
        'exp.talan_verify': 'Vérification & Source Code TALAN :',
        'exp.btn_view_attest': 'Consulter l\'Attestation',
        'exp.btn_explore_repo': 'Explorer le Repo',
        'exp.btn_ask_ai': 'Poser une question à l\'IA',
        'exp.sw_badge': 'FULLSTACK & IA/OCR',
        'exp.sw_role': 'Développeur Web Fullstack — OCR & IA Documentaire',
        'exp.sw_sub': 'Plateforme Quick Dock & Moteur d\'Extraction Intelligente',
        'exp.sw_summary': 'Conception du moteur d\'extraction automatique de données par <strong class="text-white">OCR</strong> pour la dématérialisation comptable et développement de la plateforme web <strong class="text-[#00f0ff]">Quick Dock</strong> (Node.js/Express + Vue.js).',
        'exp.sw_b1_title': 'Moteur OCR & IA Documentaire',
        'exp.sw_b1_desc': 'Algorithmes de reconnaissance optique de caractères (OCR) avec pré-traitement d\'images (NumPy), extraction automatique des montants HT/TTC, dates et numéros de TVA, éliminant 85% de la saisie manuelle.',
        'exp.sw_b2_title': 'Plateforme Quick Dock (Vue.js + Node.js)',
        'exp.sw_b2_desc': 'Génération dynamique de devis et factures avec rendu PDF temps réel, gestion sécurisée des sessions utilisateurs, API RESTful modulaire et intégration de base de données hybride SQL/NoSQL.',
        'exp.sw_verify': 'Code & Architecture Quick Dock :',
        'exp.sw_explore_repo': 'Explorer le Repo QuickDoc',
        'exp.sw_learn_ai': 'En savoir plus via l\'IA',
        'exp.team_badge': 'ARCHITECTURE FRONTEND',
        'exp.team_role': 'Développeur Frontend — Interface Responsive Angular',
        'exp.team_sub': 'Plateforme Stadium-Booking & Synchronisation REST API',
        'exp.team_summary': 'Développement d\'interfaces utilisateur modernes sous <strong class="text-white">Angular & TypeScript</strong> avec design adaptatif haute fidélité et intégration asynchrone des flux REST.',
        'exp.team_b1_title': 'Design System & UI Responsive',
        'exp.team_b1_desc': 'Structure modulaire de composants réutilisables, formulaires réactifs avec validation dynamique et gestion fluide des états d\'affichage sur mobiles, tablettes et écrans larges.',
        'exp.team_b2_title': 'Performance & Intégration REST',
        'exp.team_b2_desc': 'Optimisation du temps de rendu DOM, mise en cache côté client, gestion des erreurs HTTP et synchronisation temps réel avec les microservices backend.',
        'exp.team_verify': 'Code Frontend Angular :',
        'exp.team_explore_repo': 'Explorer le Repo Stadium-Booking',
        'exp.team_chat_ai': 'Discuter avec l\'IA',
        'exp.tech_badge': 'JAVA DESKTOP & SQL',
        'exp.tech_role': 'Développeur Logiciel — Solution de Gestion en Java',
        'exp.tech_sub': 'Application Desktop Restaurant Management (Swing/JFrame & SQL)',
        'exp.tech_summary': 'Digitalisation complète de la prise de commande, de la gestion des tables et du suivi des stocks via une application desktop <strong class="text-white">Java Swing (JFrame)</strong> connectée à une base de données relationnelle SQL.',
        'exp.tech_b1_title': 'Gestion Opérationnelle & Prise de Commande',
        'exp.tech_b1_desc': 'Interface ergonomique pour les serveurs et gérants : attribution dynamique des tables, calcul instantané des additions, génération de tickets de caisse et traçabilité des commandes en temps réel.',
        'exp.tech_b2_title': 'Persistance des Données & Inventaire SQL',
        'exp.tech_b2_desc': 'Schéma relationnel robuste pour l\'inventaire des ingrédients, alertes de rupture de stock, statistiques de vente journalières et historique d\'activité financière.',
        'exp.tech_verify': 'Code Source Java Desktop :',
        'exp.tech_explore_repo': 'Explorer le Repo GitHub',
        'exp.tech_chat_ai': 'Discuter avec l\'IA',

        // Section 04: Radar & Milestone Timeline
        'pipeline.tag': '04. // RADAR DE DÉFENSE & TRAJECTOIRE',
        'pipeline.title': 'Radar des Opérations Cyber & Pipeline',
        'pipeline.subtitle': 'Télémétrie de sécurité temps réel, renseignement sur les surfaces d\'attaque et architecture chronologique des jalons de Wassim.',
        'pipeline.livescan': 'Scan Direct',
        'pipeline.telemetry_title': 'SEC_OPS // TÉLÉMÉTRIE RADAR',
        'pipeline.posture_label': '[+] POSTURE : DURCIE',
        'pipeline.selinux_label': 'SELinux : STRICT (ENFORCING)',
        'pipeline.easm_label': '[+] EASM : RECON ACTIVE',
        'pipeline.ieee_label': 'IEEE : #33 MONDIAL',
        'pipeline.capabilities_label': '// Capacités de la Station :',
        'pipeline.btn_details': 'Consulter les Détails',
        'pipeline.btn_ask_ai': 'Interroger l\'AI Twin sur ce jalon',

        // Section 05: Education & Degrees
        'edu.tag': '05. // Formation & Diplômes Académiques',
        'edu.title': 'Cursus Universitaire & Diplômes',
        'edu.badge_ing': 'INGÉNIEUR',
        'edu.tekup_date': '2025 - Présent',
        'edu.tekup_title': 'Diplôme National d\'Ingénieur en Informatique',
        'edu.tekup_spec': '<strong>Spécialisation :</strong> Cybersécurité, Sécurité des Systèmes et Ingénierie Logicielle Sécurisée.',
        'edu.tekup_desc': '<strong>Cours pertinents :</strong> Administration Linux Avancée, Cryptographie, Analyse de Vulnérabilités, Secure Coding.',
        'edu.tekup_track': 'Cursus Cybersécurité',
        'edu.badge_lic': 'LICENCE',
        'edu.isimm_title': 'Licence en Génie Logiciel',
        'edu.isimm_inst': 'Institut Supérieur d\'Informatique et de Mathématiques de Monastir.',
        'edu.isimm_desc': 'Fondations algorithmiques, architectures logicielles, structures de données, POO avancée et bases de données.',
        'edu.isimm_nat': 'Diplôme National',
        'edu.badge_bac': 'BACCALAURÉAT',
        'edu.bac_title': 'Baccalauréat Technique',
        'edu.bac_mention': '<strong>Mention :</strong> Assez Bien (13.72 / 20)',
        'edu.bac_desc': 'Sciences techniques, logique électronique et modélisation mathématique.',
        'edu.bac_mention_tag': 'Mention Assez Bien',

        // Section 05.1: Languages & Communication
        'lang.title': 'Langues & Communication',
        'lang.french': 'Français',
        'lang.french_level': 'Courant',
        'lang.english': 'Anglais',
        'lang.english_level': 'Professionnel (Courant)',
        'lang.arabic': 'Arabe',
        'lang.arabic_level': 'Langue maternelle',

        // Section 05.2: Skills Matrix
        'skills.tag': '05.2 // Matrice de Compétences Techniques',
        'skills.title': 'Stack Technique & Outils de Sécurité',
        'skills.subtitle': 'Filtrer les compétences par sécurité des systèmes, développement et chaîne d\'outils.',
        'skills.filter_all': 'Toutes les compétences',
        'skills.filter_sys': 'Sécurité & Linux',
        'skills.filter_dev': 'Langages & Web',
        'skills.filter_tools': 'DevOps, OSINT & BDD',
        'skills.rhel_sub': 'Certifié RHCSA',
        'skills.python_sub': 'Certifié PCAP',
        'skills.easm_sub': 'Gestion Surface d\'Attaque',
        'skills.osint_sub': 'Subfinder, VT, Netlas',
        'skills.bash_sub': 'Automatisation Système',
        'skills.c_sub': 'Systèmes Bas Niveau',
        'skills.java_sub': 'POO & Spring Boot',
        'skills.docker_sub': 'Conteneurs',
        'skills.node_sub': 'APIs Express / REST',
        'skills.angular_sub': 'TypeScript SPA',
        'skills.vue_sub': 'UI Web Réactive',
        'skills.db_sub': 'MySQL, Postgres, Mongo',
        'skills.ai_sub': 'NumPy & Extraction Doc',
        'skills.sec_sub': 'SELinux, SSH & Audits',

        // Section 06: Contact & Fast-Track Banner
        'contact.tag': '06. // Communication & Prise de Contact',
        'contact.title': 'Initier une Proposition ou un Échange',
        'contact.desc': 'Disponible immédiatement pour des opportunités en Cybersécurité, Administration Linux RHEL, DevSecOps ou Développement Python.',
        'contact.email_title': 'Email Direct',
        'contact.email_btn': 'Envoyer',
        'contact.email_copy': 'Copier l\'email',
        'contact.linkedin_title': 'Profil LinkedIn',
        'contact.linkedin_btn': 'Ouvrir',
        'contact.linkedin_copy': 'Copier le lien LinkedIn',
        'contact.phone_title': 'Téléphone Mobile',
        'contact.phone_btn': 'Appeler',
        'contact.phone_copy': 'Copier le numéro',
        'contact.banner_text': '⚡ Recruteurs & Responsables Techniques : Téléchargez le dossier complet en 1 clic',
        'contact.btn_fasttrack': 'RECRUITER FAST-TRACK (60s)',
        'contact.btn_cv_pdf': 'TÉLÉCHARGER LE CV (PDF)',

        // Modals & Proof Viewer
        'hire.title': 'Dossier Recruteur Express (60s)',
        'hire.subtitle': 'Pourquoi recruter Wassim Bannour en 60 secondes',
        'hire.pillar1_title': 'Certifié RHCSA (Linux)',
        'hire.pillar1_desc': 'Administration système RHEL entreprise, tuning kernel, politiques SELinux et automatisation Bash en production.',
        'hire.pillar2_title': 'Certifié PCAP (Python)',
        'hire.pillar2_desc': 'Pipelines d\'ingestion haute performance, algorithmes OCR (NumPy) et architecture orientée objet rigoureuse.',
        'hire.pillar3_title': 'Top 33 Mondial (IEEE)',
        'hire.pillar3_desc': 'Classé 33ème mondial en algorithmique sous pression extrême (24h non-stop) parmi des milliers d\'équipes d\'ingénieurs.',
        'hire.pillar4_title': 'EASM & Threat Intel (Talan)',
        'hire.pillar4_desc': 'Conception réelle de plateforme d\'attaque surface externe, connecteurs OSINT multiples et surveillance continue des vulnérabilités.',
        'hire.avail': 'Disponibilité : Immédiate // PFE & Postes Ingénieur',
        'hire.target_roles': '<strong>Postes cibles :</strong> Ingénieur Cybersécurité, Administrateur Systèmes Linux / RHEL, Ingénieur DevSecOps, Développeur Python / Backend Sécurisé.',
        'hire.btn_email': 'Envoyer une Proposition (Email)',
        'hire.btn_call': 'Appel Direct (+216 94101910)',
        'hire.cv_pdf': 'Télécharger le CV Complet (PDF)',
        'hire.close': 'Fermer',
        'doc.title_default': 'Attestation Officielle',
        'doc.issuer_default': 'Organisme Émetteur',
        'doc.verified': 'VÉRIFIABLE',
        'doc.cert_btn': 'Certificat',
        'doc.attest_btn': 'Attestation',
        'doc.diploma_btn': 'Diplôme',
        'doc.status_title': 'Document Officiel',
        'doc.status_subtext': 'Ce document est stocké dans le répertoire <code class="text-[#00f0ff]">proofs/</code> pour vérification authentique.',
        'doc.download': 'Télécharger le Document',
        'doc.fullscreen': 'Ouvrir Plein Écran',
        'doc.authenticity': '<i class="fa-solid fa-shield-halved text-[#10b981] mr-1"></i> Authenticité garantie • Wassim Bannour',
        'doc.ask_email': 'Demander par Email',
        'doc.close': 'Fermer',
        'ai.title': 'AI Twin de Wassim',
        'ai.engine_status': 'Moteur : Prêt (Autonome / Worker)',
        'ai.welcome': 'Bonjour ! Je suis l\'AI Twin de Wassim. Posez-moi des questions sur ses <strong>certifications RHCSA & PCAP</strong>, son travail en <strong>Smart EASM & OSINT chez Talan Tunisie</strong>, son <strong>33ᵉ rang mondial à IEEEXtreme</strong> ou son profil d\'ingénieur !',
        'ai.pill1': '⚡ Compétences & Certifs',
        'ai.pill2': '🛡️ Talan EASM & OSINT',
        'ai.pill3': '🏆 Rang #33 IEEEXtreme',
        'ai.pill4': '🚀 Pourquoi recruter Wassim ?',
        'ai.input_ph': 'Posez vos questions de recruteur...',
        'footer.copy': '© 2026 Wassim Bannour. Sécurité des Systèmes & Ingénierie Linux.',
        'footer.status': 'Statut : Systèmes Opérationnels & Disponible Immédiatement',
        'terminal.title': 'wassim@tekup-sec: ~ (Console Cybersécurité Interactive)',
        'terminal.subtext': 'Tapez une commande ou cliquez sur un bouton ci-dessous',
        'terminal.quickrun': 'Exécution Rapide :',
        'terminal.clear_btn': 'effacer',
        'terminal.exec_btn': 'EXÉC',
        'terminal.placeholder': 'tapez \'help\', \'whoami\', \'certs\', \'easm\', \'skills\', \'clear\'...'
    },
    en: {
        // Navigation
        'nav.achievements': 'Achievements',
        'nav.certs': 'Certifications',
        'nav.experience': 'Experience',
        'nav.pipeline': 'Radar',
        'nav.skills': 'Education',
        'nav.contact': 'Contact',
        'nav.fasttrack': 'FAST-TRACK',
        'nav.aichat': 'AI TWIN',
        'nav.cv_download': 'Download Official CV (PDF)',
        'nav.launch_ai': 'LAUNCH AI TWIN',

        // Hero
        'hero.badge': 'CYBERSECURITY & SYSTEMS LINUX ENGINEER',
        'hero.role_prefix': 'role:~$',
        'hero.education': 'National Engineering Degree in Cybersecurity @ <span class="text-white font-bold underline decoration-[#38bdf8]">TEK-UP</span>',
        'hero.bio': 'Specialized in <strong>infrastructure hardening</strong> and <strong>intelligent automation</strong> (<em>Python / Bash</em>). Combines technical full-stack software expertise with <strong>EASM</strong> and <strong>OSINT</strong> methodologies for proactive attack surface monitoring. Ranked <strong>33rd worldwide</strong> in competitive programming (<strong>IEEEXtreme</strong>), combining algorithmic precision with <em>\'Security-by-Design\'</em> principles.',
        'hero.btn_fasttrack': 'RECRUITER FAST-TRACK (60s)',
        'hero.btn_aichat': 'Chat AI Twin',
        'hero.status_pill': 'STATUS: ACTIVE // OPEN TO ROLES',
        'hero.stat_rank': 'Worldwide IEEEXtreme',
        'hero.stat_rank_sub': '2nd National in Tunisia',
        'hero.stat_certs': 'Red Hat SysAdmin',
        'hero.stat_certs_sub': 'Enterprise Linux Kernel',
        'hero.stat_stage': 'Python Institute',
        'hero.stat_stage_sub': 'Algorithms & Pipelines',
        'hero.stat_sec': 'Talan Tunisie',
        'hero.stat_sec_sub': 'Attack Surface & OSINT',
        'hero.telemetry_title': '// System Telemetry',
        'hero.security_by_design': 'Security-by-Design',
        'hero.stack_label': '<span class="text-[#38bdf8]">Stack:</span> Linux Admin (RHEL), Python, EASM, OSINT, Node.js, Angular, Docker',

        // Section 01: Achievements
        'achievements.tag': '01. // Track Record & Distinctions',
        'achievements.title': 'Major Achievements & Distinctions',
        'achievements.subtitle': 'Proven track record in algorithmic problem solving under pressure, competitive cybersecurity, and engineering leadership.',
        'achievements.c1_badge': '1st Prize',
        'achievements.c1_type': 'Global Competition',
        'achievements.c1_li1': '<strong class="text-white">33rd Worldwide Rank</strong> among thousands of international engineering teams.',
        'achievements.c1_li2': '<strong class="text-white">2nd National Rank</strong> in Tunisia.',
        'achievements.c1_li3': 'Complex algorithmic problem solving in a 24-hour non-stop marathon.',
        'achievements.c2_badge': 'Cybersecurity',
        'achievements.c2_type': 'Capture-The-Flag',
        'achievements.c2_li1': 'Capture The Flag competition: Exploit development & infrastructure defense.',
        'achievements.c2_li2': 'Network packet analysis, reverse engineering, and binary security.',
        'achievements.c3_badge': 'Leadership',
        'achievements.c3_type': 'Executive Board',
        'achievements.c3_title': 'IEEE ISIMM Treasurer',
        'achievements.c3_li1': 'Rigorous budget management and financial optimization for technical events.',
        'achievements.c3_li2': 'Sponsorship negotiations and strategic partnerships to fund workshops and tech conferences.',
        'achievements.c4_badge': 'Networking',
        'achievements.c4_type': 'National Congress',
        'achievements.c4_title': 'TSYP 11 Congress',
        'achievements.c4_li1': 'Participation in the largest engineering student congress in Tunisia (Hammamet).',
        'achievements.c4_li2': 'Immersion in emerging technology trends and industrial panel discussions.',

        // Section 02: Certifications
        'certs.tag': '02. // Verified Industry Credentials',
        'certs.title': 'Professional Certifications',
        'certs.rhcsa_badge': 'RED HAT CERTIFIED',
        'certs.issuer_prefix': 'Issuer:',
        'certs.credly_verified': 'Verified Credly Badge',
        'certs.rhcsa_desc': 'Expertise in enterprise Linux administration (RHEL/CentOS), system hardening, Bash automation, user & permissions management, LVM storage, FirewallD security, and systemd service orchestration.',
        'certs.rhcsa_verify_id': 'Red Hat Verification ID',
        'certs.pcap_badge': 'PYTHON INSTITUTE',
        'certs.pcap_desc': 'Certified mastery of object-oriented programming (OOP), complex data structures, automation scripting, data stream normalization pipelines, and clean software architecture.',
        'certs.pcap_verify_id': 'Python Institute Verification ID',
        'certs.verify_credly': 'Verify on Credly',

        // Section 03: Experience
        'exp.tag': '03. // Career History & Projects',
        'exp.title': 'Professional Experience & Internships',
        'exp.subtitle': 'Click any experience card below to expand in-depth architecture breakdowns, technical achievements, and source code repositories.',
        'exp.btn_details': 'Details',
        'exp.btn_attestation': 'Attestation',
        'exp.btn_code': 'Code',
        'exp.talan_badge': 'FLAGSHIP CYBERSECURITY',
        'exp.talan_role': 'Cybersecurity Developer — Smart EASM Platform',
        'exp.talan_sub': 'External Attack Surface Management & Threat Intelligence',
        'exp.talan_date': '2026 Jul - Aug',
        'exp.talan_summary': 'Design and development of the <strong class="text-white">Smart EASM</strong> platform for continuous discovery, mapping, and monitoring of Internet-exposed assets with advanced <strong class="text-[#00f0ff]">OSINT & Threat Intelligence</strong> automation.',
        'exp.talan_b1_title': 'EASM Architecture',
        'exp.talan_b1_desc': 'Modular architecture engineered for passive and active external attack vector discovery: apex domains, orphaned subdomains, public IPs, expired TLS certificates, and vulnerable exposed ports/services.',
        'exp.talan_b2_title': 'OSINT Connectors',
        'exp.talan_b2_desc': 'Integration of 3rd-party APIs and reconnaissance tools: <strong>Subfinder, crt.sh, VirusTotal, WhoisXML, Netlas, AbuseIPDB, and Criminal IP</strong> for comprehensive attack surface coverage.',
        'exp.talan_b3_title': 'Python Pipelines',
        'exp.talan_b3_desc': 'Development of highly optimized <strong>Python</strong> pipelines to deduplicate, correlate, normalize, and filter large streams of raw OSINT telemetry into actionable dashboards.',
        'exp.talan_verify': 'TALAN Verification & Source Code:',
        'exp.btn_view_attest': 'View Attestation',
        'exp.btn_explore_repo': 'Explore Repo',
        'exp.btn_ask_ai': 'Ask AI Twin',
        'exp.sw_badge': 'FULLSTACK & AI/OCR',
        'exp.sw_role': 'Fullstack Web Developer — OCR & Document AI',
        'exp.sw_sub': 'Quick Dock Platform & Smart Extraction Engine',
        'exp.sw_summary': 'Design of the automated <strong class="text-white">OCR</strong> data extraction engine for accounting dematerialization and development of the <strong class="text-[#00f0ff]">Quick Dock</strong> web platform (Node.js/Express + Vue.js).',
        'exp.sw_b1_title': 'OCR Engine & Document AI',
        'exp.sw_b1_desc': 'Optical character recognition (OCR) algorithms with image pre-processing (NumPy), automatic extraction of net/gross amounts, invoice dates, and VAT numbers, eliminating 85% of manual data entry.',
        'exp.sw_b2_title': 'Quick Dock Platform (Vue.js + Node.js)',
        'exp.sw_b2_desc': 'Dynamic quotation and invoice generation with real-time PDF rendering, secure session handling, modular RESTful APIs, and hybrid SQL/NoSQL database integration.',
        'exp.sw_verify': 'Quick Dock Code & Architecture:',
        'exp.sw_explore_repo': 'Explore QuickDoc Repo',
        'exp.sw_learn_ai': 'Learn more via AI',
        'exp.team_badge': 'FRONTEND ARCHITECTURE',
        'exp.team_role': 'Frontend Developer — Responsive Angular Interface',
        'exp.team_sub': 'Stadium-Booking Platform & REST API Sync',
        'exp.team_summary': 'Development of modern user interfaces with <strong class="text-white">Angular & TypeScript</strong> featuring high-fidelity responsive design and asynchronous REST API synchronization.',
        'exp.team_b1_title': 'Design System & Responsive UI',
        'exp.team_b1_desc': 'Modular reusable component structure, reactive forms with dynamic client validation, and fluid state management across mobile, tablet, and desktop views.',
        'exp.team_b2_title': 'Performance & REST Integration',
        'exp.team_b2_desc': 'DOM rendering optimization, client-side caching, robust HTTP error handling, and real-time state synchronization with backend microservices.',
        'exp.team_verify': 'Angular Frontend Code:',
        'exp.team_explore_repo': 'Explore Stadium-Booking Repo',
        'exp.team_chat_ai': 'Chat with AI',
        'exp.tech_badge': 'JAVA DESKTOP & SQL',
        'exp.tech_role': 'Software Developer — Java Management Solution',
        'exp.tech_sub': 'Desktop Restaurant Management Application (Swing/JFrame & SQL)',
        'exp.tech_summary': 'Complete digitization of table ordering, restaurant service workflows, and inventory tracking through a <strong class="text-white">Java Swing (JFrame)</strong> desktop application connected to a relational SQL database.',
        'exp.tech_b1_title': 'Operational Management & Order Taking',
        'exp.tech_b1_desc': 'Ergonomic interface for servers and managers: dynamic table allocation, instant bill computation, receipt generation, and real-time order traceability.',
        'exp.tech_b2_title': 'Data Persistence & SQL Inventory',
        'exp.tech_b2_desc': 'Robust relational schema for ingredients inventory, low-stock threshold alerts, daily sales analytics, and audit logging of financial activities.',
        'exp.tech_verify': 'Java Desktop Source Code:',
        'exp.tech_explore_repo': 'Explore GitHub Repo',
        'exp.tech_chat_ai': 'Chat with AI',

        // Section 04: Radar & Milestone Timeline
        'pipeline.tag': '04. // DEFENSE RADAR & PIPELINE TRAJECTORY',
        'pipeline.title': 'Cyber Operations Radar & Pipeline',
        'pipeline.subtitle': 'Real-time security telemetry, attack surface intelligence, and chronological milestone architecture across Wassim\'s career.',
        'pipeline.livescan': 'Live Scan',
        'pipeline.telemetry_title': 'SEC_OPS // TELEMETRY RADAR',
        'pipeline.posture_label': '[+] POSTURE: HARDENED',
        'pipeline.selinux_label': 'SELinux: ENFORCING',
        'pipeline.easm_label': '[+] EASM: RECON ACTIVE',
        'pipeline.ieee_label': 'IEEE: #33 GLOBAL',
        'pipeline.capabilities_label': '// Station Capabilities:',
        'pipeline.btn_details': 'View Milestone Details',
        'pipeline.btn_ask_ai': 'Ask AI Twin about this milestone',

        // Section 05: Education & Degrees
        'edu.tag': '05. // Academic Background & Degrees',
        'edu.title': 'Academic Degrees & Engineering Studies',
        'edu.badge_ing': 'ENGINEER',
        'edu.tekup_date': '2025 - Present',
        'edu.tekup_title': 'National Engineering Degree in Computer Science',
        'edu.tekup_spec': '<strong>Specialization:</strong> Cybersecurity, Systems Security, and Secure Software Engineering.',
        'edu.tekup_desc': '<strong>Relevant Coursework:</strong> Advanced Linux Administration, Applied Cryptography, Vulnerability Analysis, Secure Coding.',
        'edu.tekup_track': 'Cybersecurity Track',
        'edu.badge_lic': 'BACHELOR\'S',
        'edu.isimm_title': 'Bachelor\'s Degree in Software Engineering',
        'edu.isimm_inst': 'Higher Institute of Computer Science and Mathematics of Monastir.',
        'edu.isimm_desc': 'Algorithmic foundations, software architectures, data structures, advanced OOP, and relational databases.',
        'edu.isimm_nat': 'National Degree',
        'edu.badge_bac': 'BACCALAUREATE',
        'edu.bac_title': 'Technical Baccalaureate',
        'edu.bac_mention': '<strong>Honors:</strong> Honors / Assez Bien (13.72 / 20)',
        'edu.bac_desc': 'Engineering sciences, digital electronics logic, and mathematical modeling.',
        'edu.bac_mention_tag': 'Honors Mention',

        // Section 05.1: Languages & Communication
        'lang.title': 'Languages & Communication',
        'lang.french': 'French',
        'lang.french_level': 'Fluent',
        'lang.english': 'English',
        'lang.english_level': 'Professional (Fluent)',
        'lang.arabic': 'Arabic',
        'lang.arabic_level': 'Native',

        // Section 05.2: Skills Matrix
        'skills.tag': '05.2 // Technical Skills Matrix',
        'skills.title': 'Technical Stack & Security Tooling',
        'skills.subtitle': 'Filter skills across systems security, development, and toolchains.',
        'skills.filter_all': 'All Stack',
        'skills.filter_sys': 'Security & Linux',
        'skills.filter_dev': 'Languages & Web',
        'skills.filter_tools': 'DevOps, OSINT & DB',
        'skills.rhel_sub': 'RHCSA Certified',
        'skills.python_sub': 'PCAP Certified',
        'skills.easm_sub': 'Attack Surface Mgmt',
        'skills.osint_sub': 'Subfinder, VT, Netlas',
        'skills.bash_sub': 'System Automation',
        'skills.c_sub': 'Low-Level Systems',
        'skills.java_sub': 'OOP & Spring Boot',
        'skills.docker_sub': 'Containers',
        'skills.node_sub': 'Express / REST APIs',
        'skills.angular_sub': 'TypeScript SPA',
        'skills.vue_sub': 'Reactive Web UI',
        'skills.db_sub': 'MySQL, Postgres, Mongo',
        'skills.ai_sub': 'NumPy & Doc Extraction',
        'skills.sec_sub': 'SELinux, SSH & Audits',

        // Section 06: Contact & Fast-Track Banner
        'contact.tag': '06. // Contact & Inquiries',
        'contact.title': 'Start a Discussion or Job Proposal',
        'contact.desc': 'Available immediately for roles in Cybersecurity, Linux/RHEL Administration, DevSecOps, or Python Software Security.',
        'contact.email_title': 'Direct Email',
        'contact.email_btn': 'Send',
        'contact.email_copy': 'Copy email',
        'contact.linkedin_title': 'LinkedIn Profile',
        'contact.linkedin_btn': 'Open',
        'contact.linkedin_copy': 'Copy LinkedIn link',
        'contact.phone_title': 'Mobile Phone',
        'contact.phone_btn': 'Call',
        'contact.phone_copy': 'Copy phone number',
        'contact.banner_text': '⚡ Recruiters & Technical Hiring Managers: Download the complete dossier in 1 click',
        'contact.btn_fasttrack': 'RECRUITER FAST-TRACK (60s)',
        'contact.btn_cv_pdf': 'DOWNLOAD CV (PDF)',

        // Modals & Proof Viewer
        'hire.title': 'Recruiter Fast-Track Dossier',
        'hire.subtitle': 'Why Hire Wassim Bannour in 60 Seconds',
        'hire.pillar1_title': 'RHCSA Certified (Linux)',
        'hire.pillar1_desc': 'Enterprise RHEL system administration, kernel tuning, SELinux security policies, and production Bash automation.',
        'hire.pillar2_title': 'PCAP Certified (Python)',
        'hire.pillar2_desc': 'High-performance data ingestion pipelines, OCR algorithms (NumPy), and clean object-oriented architecture.',
        'hire.pillar3_title': 'Top 33 Worldwide (IEEE)',
        'hire.pillar3_desc': 'Ranked 33rd worldwide in extreme algorithmic problem solving (24h non-stop) among thousands of engineering teams.',
        'hire.pillar4_title': 'EASM & Threat Intel (Talan)',
        'hire.pillar4_desc': 'Production external attack surface platform, multiple OSINT connectors, and continuous vulnerability monitoring.',
        'hire.avail': 'Availability: Immediate // PFE & Full-Time Engineer Roles',
        'hire.target_roles': '<strong>Target Roles:</strong> Cybersecurity Engineer, Linux / RHEL Systems Administrator, DevSecOps Engineer, Python / Backend Security Developer.',
        'hire.btn_email': 'Send Job Proposal (Email)',
        'hire.btn_call': 'Direct Phone Call (+216 94101910)',
        'hire.cv_pdf': 'Download Full CV (PDF)',
        'hire.close': 'Close',
        'doc.title_default': 'Official Proof Document',
        'doc.issuer_default': 'Issuing Organization',
        'doc.verified': 'VERIFIABLE',
        'doc.cert_btn': 'Certificate',
        'doc.attest_btn': 'Attestation',
        'doc.diploma_btn': 'Diploma',
        'doc.status_title': 'Official Document',
        'doc.status_subtext': 'This document is stored in the <code class="text-[#00f0ff]">proofs/</code> directory for authentic verification.',
        'doc.download': 'Download Document',
        'doc.fullscreen': 'Open Fullscreen',
        'doc.authenticity': '<i class="fa-solid fa-shield-halved text-[#10b981] mr-1"></i> Guaranteed Authenticity • Wassim Bannour',
        'doc.ask_email': 'Request via Email',
        'doc.close': 'Close',
        'ai.title': 'Wassim\'s AI Twin',
        'ai.engine_status': 'Engine: Ready (Autonomous / Worker)',
        'ai.welcome': 'Hello! I am Wassim\'s AI Twin. Ask me about his <strong>RHCSA & PCAP certifications</strong>, his <strong>Smart EASM & OSINT work at Talan Tunisie</strong>, his <strong>33rd global rank in IEEEXtreme</strong>, or his fullstack engineering background!',
        'ai.pill1': '⚡ Top Skills & Certs',
        'ai.pill2': '🛡️ Talan EASM & OSINT',
        'ai.pill3': '🏆 IEEEXtreme #33 Rank',
        'ai.pill4': '🚀 Why hire Wassim?',
        'ai.input_ph': 'Ask recruiter questions...',
        'footer.copy': '© 2026 Wassim Bannour. Systems Security & Linux Engineering.',
        'footer.status': 'Status: Systems Operational & Ready for Hire',
        'terminal.title': 'wassim@tekup-sec: ~ (Interactive Live Cyber Console)',
        'terminal.subtext': 'Type a command or click a chip below',
        'terminal.quickrun': 'Quick Run:',
        'terminal.clear_btn': 'clear',
        'terminal.exec_btn': 'EXEC',
        'terminal.placeholder': 'type \'help\', \'whoami\', \'certs\', \'easm\', \'skills\', \'clear\'...'
    }
};

function playFuturisticTone(freq = 880, duration = 0.04, type = 'sine', volume = 0.03) {
    if (!SFX_ENABLED) return;
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // AudioContext not allowed before user interaction
    }
}

/**
 * Render and reset Terminal HUD screen content according to active language
 */
window.renderTerminalScreen = function(lang) {
    const terminalScreen = document.getElementById('terminalScreen');
    if (!terminalScreen) return;
    const isFr = lang === 'fr';
    terminalScreen.innerHTML = `
        <div class="terminal-log-line info text-gray-400">${isFr ? '// Wassim Bannour Terminal de Télémétrie Cyber v2.4 (RHCSA / PCAP / EASM)' : '// Wassim Bannour Cyber Telemetry Terminal v2.4 (RHCSA / PCAP / EASM)'}</div>
        <div class="terminal-log-line info text-gray-400">${isFr ? '// Tapez \'help\' pour voir les opérations ou cliquez sur un bouton ci-dessus.' : '// Type \'help\' to view available operations or click any quick chip above.'}</div>
        <div class="terminal-log-line cmd mt-2">
            <span class="text-[#10b981]">wassim@tekup-sec</span>:<span class="text-[#38bdf8]">~</span>$ easm --status
        </div>
        <div class="terminal-log-line success">${isFr ? '[+] Plateforme Surface d\'Attaque : Active & Surveillance Continue' : '[+] Attack Surface Platform: Active & Monitoring'}</div>
        <div class="terminal-log-line info">${isFr ? '[+] Certifications Vérifiées : Red Hat RHCSA & Python PCAP' : '[+] Verified Certifications: Red Hat RHCSA & Python PCAP'}</div>
        <div class="terminal-log-line info">${isFr ? '[+] Classement Mondial : #33 Mondial IEEEXtreme 17.0 (2ème National TN)' : '[+] Global Ranking: #33 Worldwide IEEEXtreme 17.0 (2nd National TN)'}</div>
        <div class="terminal-log-line text-[#00f0ff] font-bold">${isFr ? '[✓] Statut : Prêt pour opportunités à fort impact en Cybersécurité & Ingénierie Systèmes.' : '[✓] Status: Ready for High-Impact Cybersecurity & Systems Engineering Opportunities.'}</div>
    `;
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
};

/**
 * Set and apply active language (fr / en) across the portfolio
 */
window.setLanguage = function(lang, silent = false) {
    if (!I18N_DATA[lang]) lang = 'fr';
    CURRENT_LANG = lang;
    localStorage.setItem('WB_LANG', lang);
    document.documentElement.lang = lang;

    const dict = I18N_DATA[lang];

    // Update Text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });

    // Update HTML elements
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key]) el.innerHTML = dict[key];
    });

    // Update Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    // Update Titles / Tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key]) el.setAttribute('title', dict[key]);
    });

    // Update Language Buttons Text
    const langBtnText = document.getElementById('langBtnText');
    const mobileLangText = document.getElementById('mobileLangText');
    if (langBtnText) langBtnText.textContent = lang.toUpperCase();
    if (mobileLangText) mobileLangText.textContent = lang.toUpperCase();

    // Trigger Typewriter language update
    if (window.updateTypewriterPhrases) {
        window.updateTypewriterPhrases(lang);
    }

    // Trigger Terminal Screen update
    if (window.renderTerminalScreen) {
        window.renderTerminalScreen(lang);
    }

    // Trigger Radar Station & Highway nodes update
    if (window.selectCyberStation) {
        window.selectCyberStation(window.currentStationIdx !== undefined ? window.currentStationIdx : 0, false);
    }
    if (window.updateStationChipsAndNodes) {
        window.updateStationChipsAndNodes(lang);
    }

    // Update experience accordion buttons text if needed
    document.querySelectorAll('.experience-card').forEach(card => {
        const isExpanded = card.classList.contains('is-expanded');
        const btnText = card.querySelector('.expand-btn-text');
        if (btnText) {
            btnText.textContent = isExpanded ? (lang === 'fr' ? 'Fermer' : 'Close') : (lang === 'fr' ? 'Détails' : 'Details');
        }
    });

    if (!silent && window.showCyberToast) {
        window.showCyberToast(lang === 'fr' ? 'Langue : Français activé' : 'Language: English activated', 'info');
    }
};

/**
 * Set and apply active theme (dark / light) across the portfolio
 */
window.setTheme = function(theme, silent = false) {
    if (theme !== 'light' && theme !== 'dark') theme = 'dark';
    CURRENT_THEME = theme;
    localStorage.setItem('WB_THEME', theme);

    const isLight = theme === 'light';
    document.documentElement.classList.toggle('light-mode', isLight);
    document.body.classList.toggle('light-mode', isLight);

    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    if (themeIcon) {
        themeIcon.className = isLight ? 'fa-solid fa-sun text-amber-500' : 'fa-solid fa-moon text-yellow-400';
    }
    if (mobileThemeIcon) {
        mobileThemeIcon.className = isLight ? 'fa-solid fa-sun text-amber-500' : 'fa-solid fa-moon text-yellow-400';
    }
    if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', isLight ? 'Basculer en Mode Sombre' : 'Basculer en Mode Clair');
    }

    if (!silent && window.showCyberToast) {
        window.showCyberToast(isLight ? 'Mode Clair Activé' : 'Mode Sombre Activé', 'info');
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Theme and Language from Storage (silently on load)
    window.setTheme(CURRENT_THEME, true);
    window.setLanguage(CURRENT_LANG, true);

    // Language Toggle Buttons
    const langToggleBtn = document.getElementById('langToggleBtn');
    const mobileLangBtn = document.getElementById('mobileLangBtn');
    function toggleLanguage() {
        const nextLang = CURRENT_LANG === 'fr' ? 'en' : 'fr';
        window.setLanguage(nextLang);
        playFuturisticTone(980, 0.04, 'sine', 0.04);
    }
    if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLanguage);
    if (mobileLangBtn) mobileLangBtn.addEventListener('click', toggleLanguage);

    // Theme Toggle Buttons
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const mobileThemeBtn = document.getElementById('mobileThemeBtn');
    function toggleTheme() {
        const nextTheme = CURRENT_THEME === 'dark' ? 'light' : 'dark';
        window.setTheme(nextTheme);
        playFuturisticTone(1100, 0.05, 'sine', 0.04);
    }
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);

    // -------------------------------------------------------------
    // 0. SFX AUDIO TOGGLE CONTROLLER
    // -------------------------------------------------------------
    const sfxToggleBtn = document.getElementById('sfxToggleBtn');
    const sfxBtnText = document.getElementById('sfxBtnText');
    const mobileSfxBtn = document.getElementById('mobileSfxBtn');

    function updateSfxUI() {
        if (sfxBtnText) sfxBtnText.textContent = SFX_ENABLED ? 'SFX: ON' : 'SFX: OFF';
        if (mobileSfxBtn) mobileSfxBtn.textContent = SFX_ENABLED ? 'SFX: ON' : 'SFX: OFF';
        if (sfxToggleBtn) {
            if (SFX_ENABLED) sfxToggleBtn.classList.remove('sfx-muted');
            else sfxToggleBtn.classList.add('sfx-muted');
        }
    }

    function toggleSfx() {
        SFX_ENABLED = !SFX_ENABLED;
        localStorage.setItem('WB_SFX_ENABLED', SFX_ENABLED ? 'true' : 'false');
        updateSfxUI();
        if (SFX_ENABLED) playFuturisticTone(1100, 0.06, 'sine', 0.05);
    }

    if (sfxToggleBtn) sfxToggleBtn.addEventListener('click', toggleSfx);
    if (mobileSfxBtn) mobileSfxBtn.addEventListener('click', toggleSfx);
    updateSfxUI();

    // Attach subtle audio feedback on buttons & links
    document.querySelectorAll('button, a, .terminal-chip, .skill-filter-btn').forEach(elem => {
        elem.addEventListener('mouseenter', () => playFuturisticTone(1200, 0.015, 'sine', 0.012));
        elem.addEventListener('click', () => playFuturisticTone(750, 0.04, 'sine', 0.035));
    });

    // -------------------------------------------------------------
    // 1. DYNAMIC CYBER MATRIX CANVAS BACKGROUND (MAGNETIC PARTICLES)
    // -------------------------------------------------------------
    const canvas = document.getElementById('cyberCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        let mouseX = -1000;
        let mouseY = -1000;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Grid particle nodes
        const nodes = Array.from({ length: 48 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            radius: Math.random() * 1.5 + 1
        }));

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            const isLight = document.documentElement.classList.contains('light-mode');
            const lineBaseColor = isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(0, 240, 255, 0.07)';
            const nodeFillColor = isLight ? 'rgba(2, 132, 199, 0.5)' : 'rgba(0, 240, 255, 0.45)';

            // Connecting lines between close nodes
            ctx.strokeStyle = lineBaseColor;
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

                // Connect to mouse if near
                const mdx = nodes[i].x - mouseX;
                const mdy = nodes[i].y - mouseY;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < 120) {
                    ctx.strokeStyle = isLight 
                        ? `rgba(2, 132, 199, ${0.35 * (1 - mdist / 120)})`
                        : `rgba(0, 240, 255, ${0.25 * (1 - mdist / 120)})`;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                }
            }

            // Draw nodes
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                ctx.fillStyle = nodeFillColor;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    // -------------------------------------------------------------
    // 1.1 DYNAMIC HERO ROTATING TYPEWRITER
    // -------------------------------------------------------------
    const heroTypewriter = document.getElementById('heroTypewriter');
    if (heroTypewriter) {
        const phrasesFr = [
            "Ingénieur Cybersécurité & Linux",
            "Certifié RHCSA (Red Hat) & PCAP (Python)",
            "Smart EASM & OSINT Developer @ Talan",
            "Top 33 Mondial @ IEEEXtreme 17.0",
            "Security-by-Design & Fullstack Developer"
        ];
        const phrasesEn = [
            "Cybersecurity & Linux Systems Engineer",
            "RHCSA (Red Hat) & PCAP (Python) Certified",
            "Smart EASM & OSINT Developer @ Talan",
            "Top 33 Worldwide @ IEEEXtreme 17.0",
            "Security-by-Design & Fullstack Developer"
        ];
        let phrases = CURRENT_LANG === 'en' ? phrasesEn : phrasesFr;
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 65;

        window.updateTypewriterPhrases = function(lang) {
            phrases = lang === 'en' ? phrasesEn : phrasesFr;
            phraseIdx = 0;
            charIdx = 0;
            isDeleting = false;
        };

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx] || phrases[0];
            
            if (isDeleting) {
                heroTypewriter.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 30;
            } else {
                heroTypewriter.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 65;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                typingSpeed = 2200; // Pause at full phrase
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 400; // Pause before next phrase
            }

            setTimeout(typeLoop, typingSpeed);
        }

        typeLoop();
    }

    // -------------------------------------------------------------
    // 1.2 INTERACTIVE LIVE CYBER TERMINAL CLI ENGINE
    // -------------------------------------------------------------
    const terminalForm = document.getElementById('terminalForm');
    const terminalInput = document.getElementById('terminalInput');
    const terminalScreen = document.getElementById('terminalScreen');
    const terminalChips = document.querySelectorAll('.terminal-chip');

    function appendTerminalLog(type, content) {
        if (!terminalScreen) return;
        const line = document.createElement('div');
        line.className = `terminal-log-line ${type}`;
        line.innerHTML = content;
        terminalScreen.appendChild(line);
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }

    function executeTerminalCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        const isFr = CURRENT_LANG === 'fr';

        appendTerminalLog('cmd', `<span class="text-[#10b981]">wassim@tekup-sec</span>:<span class="text-[#38bdf8]">~</span>$ ${rawCmd}`);
        playFuturisticTone(950, 0.03, 'square', 0.02);

        if (cmd === 'clear') {
            terminalScreen.innerHTML = '';
            appendTerminalLog('info text-gray-400', isFr ? '// Écran du terminal effacé. Tapez "help" pour voir les options.' : '// Terminal screen cleared. Type "help" for options.');
            return;
        }

        if (cmd === 'help') {
            if (isFr) {
                appendTerminalLog('info', `Commandes Disponibles:\n- <strong class="text-[#00f0ff]">whoami</strong> : Identité, cursus TEK-UP & spécialisation Linux / Sécurité\n- <strong class="text-[#00f0ff]">certs</strong> : Certifications officielles Red Hat RHCSA & Python PCAP\n- <strong class="text-[#00f0ff]">proofs</strong> : Répertoire des attestations de stages & diplômes vérifiables\n- <strong class="text-[#00f0ff]">easm</strong> : Modules Smart EASM & connecteurs OSINT @ Talan Tunisie\n- <strong class="text-[#00f0ff]">skills</strong> : Stack technique complète (Linux, DevSecOps, Python, Web)\n- <strong class="text-[#00f0ff]">rank</strong> : Performance IEEEXtreme 17.0 (#33 mondial, #2 Tunisie)\n- <strong class="text-[#00f0ff]">hire</strong> : Ouvrir le Dossier Recruteur Express (60s)\n- <strong class="text-[#00f0ff]">cv</strong> : Télécharger le CV officiel de Wassim Bannour (PDF)\n- <strong class="text-[#00f0ff]">contact</strong> : Coordonnées directes (Email, téléphone, LinkedIn)\n- <strong class="text-[#00f0ff]">clear</strong> : Effacer l'écran de la console`);
            } else {
                appendTerminalLog('info', `Available Commands:\n- <strong class="text-[#00f0ff]">whoami</strong> : Identity, education & current specialization\n- <strong class="text-[#00f0ff]">certs</strong> : Verified Red Hat RHCSA & Python PCAP credentials\n- <strong class="text-[#00f0ff]">proofs</strong> : Official verified documents, attestations & degrees\n- <strong class="text-[#00f0ff]">easm</strong> : Smart EASM & OSINT threat modules (Talan)\n- <strong class="text-[#00f0ff]">skills</strong> : Complete security, development & toolchain stack\n- <strong class="text-[#00f0ff]">rank</strong> : IEEEXtreme 17.0 #33 worldwide performance\n- <strong class="text-[#00f0ff]">hire</strong> : Recruiter Fast-Track (Open in 60s summary)\n- <strong class="text-[#00f0ff]">cv</strong> : Download official Wassim Bannour CV (PDF)\n- <strong class="text-[#00f0ff]">contact</strong> : Direct email, phone & LinkedIn links\n- <strong class="text-[#00f0ff]">clear</strong> : Clear terminal console`);
            }
            return;
        }

        if (cmd === 'whoami') {
            if (isFr) {
                appendTerminalLog('success', `[+] Nom : Wassim Bannour`);
                appendTerminalLog('info', `[+] Rôle : Ingénieur Cybersécurité & Systèmes Linux (Certifié RHCSA & PCAP)`);
                appendTerminalLog('info', `[+] Université : TEK-UP (Diplôme National d'Ingénieur en Cybersécurité)`);
                appendTerminalLog('info', `[+] Localisation : Monastir / Tunis, Tunisie (Disponible sur site, hybride & remote)`);
            } else {
                appendTerminalLog('success', `[+] Name: Wassim Bannour`);
                appendTerminalLog('info', `[+] Role: Cybersecurity & Linux Systems Engineer (RHCSA & PCAP Certified)`);
                appendTerminalLog('info', `[+] University: TEK-UP (National Engineering Degree in Cybersecurity)`);
                appendTerminalLog('info', `[+] Location: Monastir / Tunis, Tunisia (Open to on-site, hybrid, & remote)`);
            }
            return;
        }

        if (cmd === 'certs' || cmd.includes('cert') || cmd === 'cat certs.txt') {
            if (isFr) {
                appendTerminalLog('success', `[+] 1. Red Hat Certified System Administrator (RHCSA) — Red Hat, Inc.`);
                appendTerminalLog('info', `    Identifiant : Vérifié | Lien Credly : https://www.credly.com/earner/earned/share/273c40c5-2afd-4237-853a-5dfc9c835e89`);
                appendTerminalLog('success', `[+] 2. Certified Associate in Python Programming (PCAP) — Python Institute`);
                appendTerminalLog('info', `    Identifiant : Vérifié | Lien Credly : https://www.credly.com/earner/earned/share/9eaff906-83de-41e4-9483-7dd49be122a1`);
            } else {
                appendTerminalLog('success', `[+] 1. Red Hat Certified System Administrator (RHCSA) — Red Hat, Inc.`);
                appendTerminalLog('info', `    Credential ID: Verified | Credly Link: https://www.credly.com/earner/earned/share/273c40c5-2afd-4237-853a-5dfc9c835e89`);
                appendTerminalLog('success', `[+] 2. Certified Associate in Python Programming (PCAP) — Python Institute`);
                appendTerminalLog('info', `    Credential ID: Verified | Credly Link: https://www.credly.com/earner/earned/share/9eaff906-83de-41e4-9483-7dd49be122a1`);
            }
            return;
        }

        if (cmd.includes('proof') || cmd.includes('attest') || cmd.includes('doc')) {
            if (isFr) {
                appendTerminalLog('success', `[+] Répertoire des Attestations Officielles (proofs/) :`);
                appendTerminalLog('info', `    [1] TALAN Tunisie (Stage EASM & OSINT) -> proofs/attestation_talan.pdf`);
                appendTerminalLog('info', `    [2] SW Consulting (Stage QuickDoc AI/OCR) -> proofs/attestation_sw_consulting.pdf`);
                appendTerminalLog('info', `    [3] Team Dev (Stage Stadium-Booking Angular) -> proofs/attestation_teamdev.pdf`);
                appendTerminalLog('info', `    [4] We Are TechCenter (Stage Java Desktop) -> proofs/attestation_techcenter.pdf`);
                appendTerminalLog('info', `    [5] ISIMM Licence en Sciences de l'Informatique -> proofs/diplome_isimm.pdf`);
                appendTerminalLog('info', `    [6] TEK-UP Cursus Ingénieur Cybersécurité -> proofs/tekup_attestation.pdf`);
                appendTerminalLog('info', `    [7] Baccalauréat Technique Mention Assez Bien -> proofs/diplome_bac.pdf`);
                appendTerminalLog('info', `    [8] IEEEXtreme 17.0 World Top 33 Certificate -> proofs/cert_ieeextreme.pdf`);
                appendTerminalLog('text-[#00f0ff]', `[✓] Cliquez sur un bouton [Attestation] ou [Diplôme] sur le site pour ouvrir la visionneuse.`);
            } else {
                appendTerminalLog('success', `[+] Official Documents Directory (proofs/):`);
                appendTerminalLog('info', `    [1] TALAN Tunisie (EASM & OSINT Stage) -> proofs/attestation_talan.pdf`);
                appendTerminalLog('info', `    [2] SW Consulting (QuickDoc AI/OCR Stage) -> proofs/attestation_sw_consulting.pdf`);
                appendTerminalLog('info', `    [3] Team Dev (Stadium-Booking Angular Stage) -> proofs/attestation_teamdev.pdf`);
                appendTerminalLog('info', `    [4] We Are TechCenter (Java Desktop Stage) -> proofs/attestation_techcenter.pdf`);
                appendTerminalLog('info', `    [5] ISIMM Licence en Sciences de l'Informatique -> proofs/diplome_isimm.pdf`);
                appendTerminalLog('info', `    [6] TEK-UP Cursus Ingénieur Cybersécurité -> proofs/tekup_attestation.pdf`);
                appendTerminalLog('info', `    [7] Baccalauréat Technique Mention Assez Bien -> proofs/diplome_bac.pdf`);
                appendTerminalLog('info', `    [8] IEEEXtreme 17.0 World Top 33 Certificate -> proofs/cert_ieeextreme.pdf`);
                appendTerminalLog('text-[#00f0ff]', `[✓] Click any [Attestation] / [Diplôme] button on the portfolio to open the verification lightbox.`);
            }
            return;
        }

        if (cmd.startsWith('easm') || cmd.includes('osint') || cmd.includes('talan')) {
            if (isFr) {
                appendTerminalLog('success', `[+] Environnement Cible : Plateforme Smart EASM @ TALAN TUNISIE`);
                appendTerminalLog('info', `[+] Connecteurs Threat Intelligence : Subfinder, crt.sh, VirusTotal, WhoisXML, Netlas, AbuseIPDB, Criminal IP`);
                appendTerminalLog('info', `[+] Automatisation : Pipelines d'ingestion Python, cartographie de surface d'attaque & validation TLS.`);
            } else {
                appendTerminalLog('success', `[+] Target Environment: Smart EASM Platform @ TALAN TUNISIE`);
                appendTerminalLog('info', `[+] Threat Intelligence Connectors: Subfinder, crt.sh, VirusTotal, WhoisXML, Netlas, AbuseIPDB, Criminal IP`);
                appendTerminalLog('info', `[+] Automation: Python data ingestion pipelines, attack surface mapping & TLS validation.`);
            }
            return;
        }

        if (cmd.startsWith('nmap') || cmd.includes('skill') || cmd === 'stack') {
            appendTerminalLog('success', `[+] PORT 22/tcp   OPEN  Linux Enterprise (RHEL / CentOS / Bash / SELinux)`);
            appendTerminalLog('success', `[+] PORT 443/tcp  OPEN  Web & API (Node.js / Express / Vue.js / Angular)`);
            appendTerminalLog('success', `[+] PORT 8080/tcp OPEN  Python Automation / OCR Pipelines / NumPy`);
            appendTerminalLog('success', `[+] PORT 3306/tcp OPEN  Relational & NoSQL (SQL, MySQL, MongoDB, Docker)`);
            return;
        }

        if (cmd.includes('rank') || cmd.includes('ieee')) {
            if (isFr) {
                appendTerminalLog('success', `[+] IEEEXtreme 17.0 : 33ème Place Mondiale parmi des milliers d'équipes d'ingénieurs.`);
                appendTerminalLog('info', `[+] Rang National : 2ème en Tunisie (Marathon algorithmique de 24h non-stop).`);
            } else {
                appendTerminalLog('success', `[+] IEEEXtreme 17.0: #33 Worldwide out of thousands of university engineering teams.`);
                appendTerminalLog('info', `[+] National Rank: #2 in Tunisia (24-hour algorithmic marathon).`);
            }
            return;
        }

        if (cmd.includes('hire') || cmd.includes('value') || cmd.includes('pitch') || cmd.includes('fasttrack')) {
            if (isFr) {
                appendTerminalLog('success', `[✓] Valeur Clé : Administrateur Linux Certifié (RHCSA) + Développeur Python Certifié (PCAP) + Top 33 Mondial.`);
                appendTerminalLog('info', `[✓] Expérience : Réalisations prouvées en production chez Talan Tunisie, SW Consulting, Team Dev, TechCenter.`);
                appendTerminalLog('text-[#00f0ff]', `[+] Ouverture du Dossier Recruteur Express (60s)...`);
            } else {
                appendTerminalLog('success', `[✓] Key Value: Certified Linux Admin (RHCSA) + Certified Python Dev (PCAP) + Global Top 33.`);
                appendTerminalLog('info', `[✓] Experience: Proven production deliverables at Talan Tunisie, SW Consulting, Team Dev, TechCenter.`);
                appendTerminalLog('text-[#00f0ff]', `[+] Launching Recruiter Fast-Track Dossier in 60s...`);
            }
            if (window.openHireMeModal) window.openHireMeModal();
            return;
        }

        if (cmd === 'cv' || cmd.includes('resume') || cmd.includes('download')) {
            appendTerminalLog('success', isFr ? `[+] Téléchargement du CV officiel en cours : Wassim_Bannour_CV.pdf` : `[+] Initiating official CV download: Wassim_Bannour_CV.pdf`);
            const link = document.createElement('a');
            link.href = 'wassim_bnannour_cv.pdf';
            link.download = 'Wassim_Bannour_CV.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        if (cmd.includes('contact')) {
            appendTerminalLog('success', `[+] Email: wisoghost@gmail.com`);
            appendTerminalLog('info', `[+] Phone: +216 94101910`);
            appendTerminalLog('info', `[+] LinkedIn: https://www.linkedin.com/in/wassim-bannour-513448317/`);
            appendTerminalLog('info', `[+] GitHub: https://github.com/WassimBannour1`);
            return;
        }

        if (cmd.includes('pipeline') || cmd.includes('radar') || cmd.includes('road') || cmd.includes('journey')) {
            if (isFr) {
                appendTerminalLog('success', `[+] Initialisation du Radar des Opérations & Pipeline de Sécurité...`);
                appendTerminalLog('info', `[+] Télémétrie : 8 Étapes Actives | Télémétrie Opérationnelle.`);
            } else {
                appendTerminalLog('success', `[+] Initializing Cyber Operations Radar & Defense Pipeline...`);
                appendTerminalLog('info', `[+] Telemetry: 8 Milestones Active | Real-Time Telemetry Operational.`);
            }
            const pipelineSection = document.getElementById('pipeline');
            if (pipelineSection) {
                pipelineSection.scrollIntoView({ behavior: 'smooth' });
                if (window.selectCyberStation) window.selectCyberStation(currentStationIdx || 0);
            }
            return;
        }

        // Default unknown command
        appendTerminalLog('warn', isFr ? `Commande non reconnue : "${rawCmd}". Tapez <strong class="text-[#00f0ff]">help</strong> pour la liste des commandes.` : `Command not found: "${rawCmd}". Type <strong class="text-[#00f0ff]">help</strong> for a list of valid commands.`);
    }

    if (terminalForm && terminalInput) {
        terminalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = terminalInput.value;
            terminalInput.value = '';
            executeTerminalCommand(val);
        });
    }

    terminalChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            if (cmd) executeTerminalCommand(cmd);
        });
    });

    // -------------------------------------------------------------
    // 1.3 SCROLL PROGRESS BAR & BACK TO TOP ACTION
    // -------------------------------------------------------------
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrollFraction}%`;
        }

        if (backToTopBtn) {
            if (window.scrollY > 450) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
            } else {
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -------------------------------------------------------------
    // 1.4 SCROLL REVEAL OBSERVER & ANIMATED NUMBER COUNTERS
    // -------------------------------------------------------------
    const revealCards = document.querySelectorAll('.reveal-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    // Stagger reveal slightly for children in the same viewport
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, (idx % 4) * 80);

                    // If it contains a count-target, trigger counter animation
                    const counter = entry.target.querySelector('.count-target');
                    if (counter && !counter.dataset.animated) {
                        counter.dataset.animated = 'true';
                        animateCountNumber(counter);
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealCards.forEach(card => observer.observe(card));
    } else {
        revealCards.forEach(card => card.classList.add('revealed'));
    }

    function animateCountNumber(elem) {
        const target = parseInt(elem.getAttribute('data-count'), 10) || 33;
        const suffix = elem.getAttribute('data-suffix') || '';
        let start = 1;
        const duration = 1200;
        const stepTime = Math.max(10, Math.floor(duration / target));

        const timer = setInterval(() => {
            start++;
            elem.textContent = start + suffix;
            if (start >= target) {
                elem.textContent = target + suffix;
                clearInterval(timer);
            }
        }, stepTime);
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
    // 3.2 INTERACTIVE CYBER OPERATIONS RADAR & ENGINEERING PIPELINE
    // -------------------------------------------------------------
    const CYBER_STATIONS_DATA = [
        {
            id: 'bac',
            badge: { fr: 'FONDATIONS', en: 'FOUNDATIONS' },
            badgeColor: 'text-[#00f0ff] bg-[#00f0ff]/20 border-[#00f0ff]/40',
            date: { fr: '2018 - 2022', en: '2018 - 2022' },
            location: { fr: 'Bekalta, TN', en: 'Bekalta, TN' },
            title: { fr: 'Baccalauréat Technique (Mention Assez Bien)', en: 'Technical Baccalaureate (Honors)' },
            org: { fr: 'Lycée Secondaire Bekalta — Moyenne 13.72 / 20', en: 'Bekalta Secondary High School — GPA 13.72 / 20' },
            desc: { fr: 'Solides fondations en logique électronique, analyse combinatoire et séquentielle, manipulation de structures de données primitives et modélisation algorithmique.', en: 'Solid foundations in digital electronics, combinatorial/sequential logic, primitive data structures, and algorithmic modeling.' },
            speech: { fr: '"[+] Logique électronique & modélisation numérique initialisées avec succès."', en: '"[+] Foundational logic circuits & hardware systems initialized at Bekalta!"' },
            tags: { fr: ['Logique Numérique', 'Électronique', 'Algorithmique', 'Systèmes Techniques'], en: ['Digital Logic', 'Electronics', 'Algorithms', 'Technical Systems'] },
            actionText: { fr: 'Détails Formation', en: 'Curriculum Details' },
            actionHref: '#skills',
            nodeTitle: { fr: 'Baccalauréat', en: 'Baccalaureate' },
            nodeSub: { fr: '2018 - 2022', en: '2018 - 2022' },
            chipLabel: { fr: '01. Bac (2018)', en: '01. Bac (2018)' }
        },
        {
            id: 'isimm',
            badge: { fr: 'LICENCE PRO', en: 'BACHELOR' },
            badgeColor: 'text-[#38bdf8] bg-[#38bdf8]/20 border-[#38bdf8]/40',
            date: { fr: '2022 - 2025', en: '2022 - 2025' },
            location: { fr: 'Monastir, TN', en: 'Monastir, TN' },
            title: { fr: 'Licence en Génie Logiciel', en: 'Bachelor\'s Degree in Software Engineering' },
            org: { fr: 'ISIMM — Institut Supérieur d\'Informatique et de Mathématiques', en: 'ISIMM — Higher Institute of Computer Science & Mathematics' },
            desc: { fr: 'Formation approfondie en conception logicielle, programmation orientée objet (Java, C++), bases de données relationnelles & NoSQL, et architectures web distribuées.', en: 'Comprehensive software engineering, advanced object-oriented design (Java, C++), relational & NoSQL databases, and distributed web architectures.' },
            speech: { fr: '"[+] Conception logicielle OOP, algorithmique avancée & architectures distribuées validées."', en: '"[+] Software engineering foundations, OOP & distributed database architecture mastered at ISIMM."' },
            tags: { fr: ['Java (OOP)', 'C++', 'SQL / NoSQL', 'Architecture Web', 'Design Patterns'], en: ['Java (OOP)', 'C++', 'SQL / NoSQL', 'Web Architecture', 'Design Patterns'] },
            actionText: { fr: 'Consulter le Cursus', en: 'View Bachelor Curriculum' },
            actionHref: '#skills',
            nodeTitle: { fr: 'ISIMM Licence', en: 'ISIMM Bachelor' },
            nodeSub: { fr: '2022 - 2025', en: '2022 - 2025' },
            chipLabel: { fr: '02. ISIMM (2022)', en: '02. ISIMM (2022)' }
        },
        {
            id: 'ieee',
            badge: { fr: 'TOP MONDIAL', en: 'GLOBAL HONORS' },
            badgeColor: 'text-[#00f0ff] bg-[#00f0ff]/20 border-[#00f0ff]/40',
            date: { fr: '2023 - 2024', en: '2023 - 2024' },
            location: { fr: 'Global / ISIMM', en: 'Global / ISIMM' },
            title: { fr: 'Top 33 Mondial IEEEXtreme 17.0 & Trésorier IEEE', en: 'Top 33 Worldwide IEEEXtreme 17.0 & IEEE Treasurer' },
            org: { fr: 'IEEE Region 8 & IEEE ISIMM Student Branch', en: 'IEEE Region 8 & IEEE ISIMM Student Branch' },
            desc: { fr: '33ème rang mondial parmi des milliers d\'équipes d\'ingénieurs internationales et 2ème rang national en Tunisie (24h de marathon algorithmique non-stop). Trésorier de l\'exécutif IEEE pour la gestion financière des événements.', en: 'Ranked 33rd worldwide among thousands of international engineering teams and 2nd in Tunisia (24h continuous algorithmic sprint). Executive Treasurer managing finances for technical conferences.' },
            speech: { fr: '"[+] Performance algorithmique confirmée : Top 33 Mondial IEEEXtreme 17.0 (24h marathon non-stop)."', en: '"[+] Algorithmic excellence verified: Ranked #33 Worldwide in 24h extreme coding marathon!"' },
            tags: { fr: ['IEEEXtreme #33', 'Algorithmique Avancée', 'Marathon 24h', 'Leadership Exécutif', 'Trésorerie'], en: ['IEEEXtreme #33', 'Competitive Coding', '24h Marathon', 'Executive Leadership', 'Treasury'] },
            actionText: { fr: 'Voir les Honneurs', en: 'View Global Honors' },
            actionHref: '#achievements',
            nodeTitle: { fr: 'IEEE #33 Global', en: 'IEEE #33 Global' },
            nodeSub: { fr: '2023 - 2024', en: '2023 - 2024' },
            chipLabel: { fr: '03. IEEE #33 (2023)', en: '03. IEEE #33 (2023)' }
        },
        {
            id: 'swconsult',
            badge: { fr: 'IA & OCR', en: 'AI AUTOMATION' },
            badgeColor: 'text-purple-400 bg-purple-500/20 border-purple-500/40',
            date: { fr: '2025', en: '2025' },
            location: { fr: 'Monastir, TN', en: 'Monastir, TN' },
            title: { fr: 'Développeur Fullstack & IA OCR (QuickDoc)', en: 'Fullstack & Document AI/OCR Developer (QuickDoc)' },
            org: { fr: 'SW CONSULTING — Plateforme d\'Extraction Intelligente', en: 'SW CONSULTING — Intelligent Extraction Platform' },
            desc: { fr: 'Développement complet de QuickDoc pour l\'automatisation de l\'extraction de factures/devis par OCR et classification IA. Conception avec Vue.js, Node.js, Express et NumPy.', en: 'Engineered QuickDoc automated OCR extraction engine and full-stack billing platform using Vue.js, Node.js, Express REST API, and NumPy image matrix processing.' },
            speech: { fr: '"[+] Pipeline OCR & extraction automatisée par IA déployés en production chez SW Consulting."', en: '"[+] Production OCR extraction engine & Vue.js web platform deployed at SW Consulting."' },
            tags: { fr: ['Vue.js', 'Node.js', 'IA / OCR', 'NumPy', 'Scrum Agile'], en: ['Vue.js', 'Node.js', 'AI / OCR', 'NumPy', 'Scrum Agile'] },
            actionText: { fr: 'GitHub QuickDoc', en: 'GitHub QuickDoc' },
            actionHref: 'https://github.com/WassimBannour1/QuickDoc',
            nodeTitle: { fr: 'SW Consult', en: 'SW Consult' },
            nodeSub: { fr: '2025 (IA OCR)', en: '2025 (AI OCR)' },
            chipLabel: { fr: '04. SW Consult (2025)', en: '04. SW Consult (2025)' }
        },
        {
            id: 'talan',
            badge: { fr: 'CYBERSÉCURITÉ', en: 'FLAGSHIP CYBERSEC' },
            badgeColor: 'text-[#10b981] bg-emerald-500/20 border-emerald-500/40',
            date: { fr: '2026 (Juil - Août)', en: '2026 (Jul - Aug)' },
            location: { fr: 'Tunis, TN', en: 'Tunis, TN' },
            title: { fr: 'Développeur Cybersécurité — Smart EASM & OSINT', en: 'Cybersecurity Developer — Smart EASM & OSINT' },
            org: { fr: 'TALAN TUNISIE — External Attack Surface Management', en: 'TALAN TUNISIE — External Attack Surface Management' },
            desc: { fr: 'Conception et développement de la plateforme Smart EASM pour la découverte continue des actifs exposés et la corrélation de renseignements sur les menaces (VirusTotal, Subfinder, crt.sh, AbuseIPDB, Criminal IP).', en: 'Engineered Smart EASM platform for continuous discovery of exposed digital assets and threat intelligence correlation (VirusTotal, Subfinder, crt.sh, AbuseIPDB, Criminal IP).' },
            speech: { fr: '"[+] Connecteurs OSINT multi-sources & cartographie de surface d\'attaque externe opérationnels chez Talan."', en: '"[+] Multi-source OSINT connectors & external attack surface platform operational at Talan."' },
            tags: { fr: ['Smart EASM', 'Connecteurs OSINT', 'Python', 'API VirusTotal', 'Subfinder', 'Threat Intelligence'], en: ['Smart EASM', 'OSINT Connectors', 'Python', 'VirusTotal API', 'Subfinder', 'Threat Intelligence'] },
            actionText: { fr: 'Détails Expérience', en: 'View Experience Details' },
            actionHref: '#experience',
            nodeTitle: { fr: 'TALAN EASM', en: 'TALAN EASM' },
            nodeSub: { fr: '2026 (OSINT)', en: '2026 (OSINT)' },
            chipLabel: { fr: '05. TALAN EASM (2026)', en: '05. TALAN EASM (2026)' }
        },
        {
            id: 'certs',
            badge: { fr: 'BADGES CREDLY', en: 'CREDLY VERIFIED' },
            badgeColor: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40',
            date: { fr: '2026', en: '2026' },
            location: { fr: 'Accréditation Mondiale', en: 'Global Credentials' },
            title: { fr: 'Certifications RHCSA & PCAP Vérifiées', en: 'Verified RHCSA & PCAP Credentials' },
            org: { fr: 'Red Hat, Inc. & Python Institute (Badges Credly Officiels)', en: 'Red Hat, Inc. & Python Institute (Official Credly Badges)' },
            desc: { fr: 'Double certification d\'élite : Red Hat Certified System Administrator (Administration Linux Enterprise RHEL, SELinux, Storage LVM, FirewallD) + Certified Associate in Python Programming.', en: 'Elite dual certification: Red Hat Certified System Administrator (Enterprise Linux RHEL, SELinux, LVM Storage, FirewallD) + Python Institute PCAP Certified Associate.' },
            speech: { fr: '"[+] Double accréditation officielle validée : Red Hat RHCSA (Linux Kernel) & PCAP (Python Institute)."', en: '"[+] Official dual industry certifications verified on Credly: Red Hat RHCSA & Python PCAP."' },
            tags: { fr: ['RHCSA (Red Hat)', 'PCAP (Python)', 'SELinux Enforcing', 'Stockage LVM', 'Badges Credly'], en: ['RHCSA (Red Hat)', 'PCAP (Python)', 'SELinux Enforcing', 'LVM Storage', 'Credly Badges'] },
            actionText: { fr: 'Vérifier sur Credly', en: 'Verify on Credly' },
            actionHref: '#certifications',
            nodeTitle: { fr: 'RHCSA & PCAP', en: 'RHCSA & PCAP' },
            nodeSub: { fr: '2026 (Certs)', en: '2026 (Certs)' },
            chipLabel: { fr: '06. RHCSA & PCAP (2026)', en: '06. RHCSA & PCAP (2026)' }
        },
        {
            id: 'tekup',
            badge: { fr: 'STATION ACTIVE', en: 'ACTIVE STATION' },
            badgeColor: 'text-[#00f0ff] bg-[#00f0ff]/20 border-[#00f0ff]/40',
            date: { fr: '2025 - Présent', en: '2025 - Present' },
            location: { fr: 'Ariana, TN', en: 'Ariana, TN' },
            title: { fr: 'Diplôme National d\'Ingénieur en Cybersécurité', en: 'National Engineering Degree in Cybersecurity' },
            org: { fr: 'TEK-UP University — Cycle Ingénieur', en: 'TEK-UP University — Engineering Cycle' },
            desc: { fr: 'Spécialisation avancée en Sécurité des Systèmes d\'Information, Durcissement Linux (Hardening), Cryptographie appliquée, Analyse de Vulnérabilités et Pratiques Security-by-Design.', en: 'Advanced engineering specialization in Systems Security, Linux Hardening, Applied Cryptography, Vulnerability Analysis, and Security-by-Design software architecture.' },
            speech: { fr: '"[+] Poste actif : Sécurisation d\'infrastructures critiques, Linux Hardening & Security-by-Design chez TEK-UP."', en: '"[+] Active station: Engineering Degree in Cybersecurity & Systems Hardening at TEK-UP."' },
            tags: { fr: ['Ingénieur Cybersécurité', 'Durcissement Linux', 'Crypto Appliquée', 'Security-by-Design', 'TEK-UP'], en: ['Cybersecurity Engineer', 'Linux Hardening', 'Applied Cryptography', 'Security-by-Design', 'TEK-UP'] },
            actionText: { fr: 'Détails Cursus', en: 'View Engineering Curriculum' },
            actionHref: '#skills',
            nodeTitle: { fr: 'TEK-UP Active', en: 'TEK-UP Active' },
            nodeSub: { fr: '2025 - Présent', en: '2025 - Present' },
            chipLabel: { fr: '07. TEK-UP Active', en: '07. TEK-UP Active' }
        },
        {
            id: 'target',
            badge: { fr: 'VECTEUR FUTUR', en: 'FORWARD VECTOR' },
            badgeColor: 'text-[#38bdf8] bg-[#38bdf8]/20 border-[#38bdf8]/40',
            date: { fr: 'Horizon Recrutement', en: 'Career Horizon' },
            location: { fr: 'Sur site / Hybride / Télétravail', en: 'On-site / Hybrid / Remote' },
            title: { fr: 'Ingénierie Cybersécurité & Systèmes Linux', en: 'Cybersecurity & Linux Systems Engineering' },
            org: { fr: 'Prêt pour Rôles à Fort Impact Stratégique', en: 'Ready for High-Impact Strategic Roles' },
            desc: { fr: 'Disponible pour intégrer des équipes d\'ingénierie d\'élite en Cybersécurité, Administration Systèmes Linux Enterprise, DevSecOps et Conception Logicielle Résiliente.', en: 'Ready for deployment in elite engineering teams across Cybersecurity, Enterprise Linux Systems Administration, DevSecOps, and Resilient Software Development.' },
            speech: { fr: '"[+] Prêt pour déploiement immédiat en ingénierie Cybersécurité, Administration Linux Enterprise & DevSecOps."', en: '"[+] Ready for immediate high-impact deployment in Cybersecurity, Linux Administration & DevSecOps."' },
            tags: { fr: ['Disponible Immédiatement', 'Ingénieur Cybersécurité', 'Admin Linux RHEL', 'DevSecOps', 'Tunisie / International'], en: ['Open to Roles', 'Cybersecurity Engineer', 'Linux Admin RHEL', 'DevSecOps', 'Tunisia / International'] },
            actionText: { fr: 'Contacter Wassim', en: 'Contact Wassim' },
            actionHref: '#contact',
            nodeTitle: { fr: 'Next Vector', en: 'Next Vector' },
            nodeSub: { fr: 'Postes Entreprise', en: 'Enterprise Roles' },
            chipLabel: { fr: '08. Next Vector', en: '08. Next Vector' }
        }
    ];

    let currentStationIdx = 0;
    window.currentStationIdx = 0;
    let autoCruiseInterval = null;
    let isAutoCruising = false;

    window.updateStationChipsAndNodes = function(lang) {
        const langKey = lang === 'en' ? 'en' : 'fr';
        
        // Update Horizontal Chip Buttons
        const stationBtns = document.querySelectorAll('.station-btn');
        stationBtns.forEach((btn, idx) => {
            if (CYBER_STATIONS_DATA[idx]) {
                const spanText = btn.querySelector('span:last-child');
                if (spanText) {
                    spanText.textContent = CYBER_STATIONS_DATA[idx].chipLabel[langKey];
                }
            }
        });

        // Update Bottom Highway Node Cards
        const nodeCards = document.querySelectorAll('.road-node-card');
        nodeCards.forEach((card, idx) => {
            if (CYBER_STATIONS_DATA[idx]) {
                const titleSpan = card.querySelector('span.block');
                const subSpan = card.querySelector('span.text-gray-400');
                if (titleSpan) titleSpan.textContent = CYBER_STATIONS_DATA[idx].nodeTitle[langKey];
                if (subSpan) subSpan.textContent = CYBER_STATIONS_DATA[idx].nodeSub[langKey];
            }
        });
    };

    window.selectCyberStation = function(idx, playSfx = true) {
        if (idx < 0) idx = CYBER_STATIONS_DATA.length - 1;
        if (idx >= CYBER_STATIONS_DATA.length) idx = 0;
        currentStationIdx = idx;
        window.currentStationIdx = idx;
        const station = CYBER_STATIONS_DATA[idx];
        const langKey = CURRENT_LANG === 'en' ? 'en' : 'fr';

        // Update station buttons
        const stationBtns = document.querySelectorAll('.station-btn');
        stationBtns.forEach((btn, bIdx) => {
            if (bIdx === idx) {
                btn.classList.add('active');
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                btn.classList.remove('active');
            }
        });

        // Update Highway node cards
        const nodeCards = document.querySelectorAll('.road-node-card');
        nodeCards.forEach((card, cIdx) => {
            if (cIdx === idx) {
                card.classList.add('active');
                card.style.transform = 'translateY(-3px)';
            } else {
                card.classList.remove('active');
                card.style.transform = 'translateY(0)';
            }
        });

        // Update Telemetry Callout & HUD
        const tuxSpeechText = document.getElementById('tuxSpeechText');
        const tuxStationBadge = document.getElementById('tuxStationBadge');
        if (tuxSpeechText) tuxSpeechText.textContent = station.speech[langKey];
        if (tuxStationBadge) tuxStationBadge.textContent = `${langKey === 'fr' ? 'JALON' : 'MILESTONE'} 0${idx + 1} / 08`;

        // Pulse Radar Screen
        const radarContainer = document.getElementById('cyberTuxContainer');
        if (radarContainer) {
            radarContainer.style.transform = 'scale(1.04)';
            setTimeout(() => {
                radarContainer.style.transform = 'scale(1)';
            }, 300);
        }

        // Update Dossier Card
        const dossierBadge = document.getElementById('dossierBadge');
        const dossierDate = document.getElementById('dossierDate');
        const dossierLocation = document.getElementById('dossierLocation');
        const dossierTitle = document.getElementById('dossierTitle');
        const dossierOrg = document.getElementById('dossierOrg');
        const dossierDesc = document.getElementById('dossierDesc');
        const dossierTags = document.getElementById('dossierTags');
        const dossierActionBtn = document.getElementById('dossierActionBtn');
        const dossierActionText = document.getElementById('dossierActionText');

        if (dossierBadge) {
            dossierBadge.textContent = station.badge[langKey];
            dossierBadge.className = `px-2.5 py-0.5 rounded-md font-mono text-xs font-extrabold border ${station.badgeColor}`;
        }
        if (dossierDate) dossierDate.textContent = station.date[langKey];
        if (dossierLocation) dossierLocation.innerHTML = `<i class="fa-solid fa-location-dot text-[#00f0ff]"></i> ${station.location[langKey]}`;
        if (dossierTitle) dossierTitle.textContent = station.title[langKey];
        if (dossierOrg) dossierOrg.textContent = station.org[langKey];
        if (dossierDesc) dossierDesc.textContent = station.desc[langKey];

        if (dossierTags) {
            dossierTags.innerHTML = station.tags[langKey].map((t, i) => 
                `<span class="px-2 py-0.5 rounded bg-[#0f172a] ${i === 0 ? 'text-[#00f0ff] border border-[#00f0ff]/30 font-bold' : 'text-gray-300 border border-[#1e293b]'}">${t}</span>`
            ).join('');
        }

        if (dossierActionBtn) {
            dossierActionBtn.href = station.actionHref;
            if (station.actionHref.startsWith('http')) {
                dossierActionBtn.target = '_blank';
                dossierActionBtn.rel = 'noopener noreferrer';
            } else {
                dossierActionBtn.removeAttribute('target');
                dossierActionBtn.removeAttribute('rel');
            }
        }
        if (dossierActionText) dossierActionText.textContent = station.actionText[langKey];

        if (playSfx) {
            playFuturisticTone(850 + idx * 45, 0.035, 'triangle', 0.025);
        }
    };

    // Attach Station Button Clicks
    const stationBtns = document.querySelectorAll('.station-btn');
    stationBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            selectCyberStation(idx);
            stopAutoCruise();
        });
    });

    // Prev / Next Station Controls
    const prevStationBtn = document.getElementById('prevStationBtn');
    const nextStationBtn = document.getElementById('nextStationBtn');
    if (prevStationBtn) {
        prevStationBtn.addEventListener('click', () => {
            selectCyberStation(currentStationIdx - 1);
            stopAutoCruise();
        });
    }
    if (nextStationBtn) {
        nextStationBtn.addEventListener('click', () => {
            selectCyberStation(currentStationIdx + 1);
            stopAutoCruise();
        });
    }

    // Auto-Cruise / Live Scan Mode
    const autoCruiseBtn = document.getElementById('autoCruiseBtn');
    const autoCruiseIcon = document.getElementById('autoCruiseIcon');
    const autoCruiseText = document.getElementById('autoCruiseText');

    function startAutoCruise() {
        isAutoCruising = true;
        if (autoCruiseIcon) autoCruiseIcon.className = 'fa-solid fa-pause text-xs';
        if (autoCruiseText) autoCruiseText.textContent = CURRENT_LANG === 'fr' ? 'Scan en cours...' : 'Scanning...';
        if (autoCruiseBtn) {
            autoCruiseBtn.classList.add('bg-[#10b981]/20', 'shadow-[0_0_15px_rgba(16,185,129,0.5)]');
        }
        autoCruiseInterval = setInterval(() => {
            selectCyberStation(currentStationIdx + 1, false);
            playFuturisticTone(900, 0.02, 'sine', 0.015);
        }, 3600);
    }

    function stopAutoCruise() {
        isAutoCruising = false;
        if (autoCruiseInterval) {
            clearInterval(autoCruiseInterval);
            autoCruiseInterval = null;
        }
        if (autoCruiseIcon) autoCruiseIcon.className = 'fa-solid fa-radar text-xs';
        if (autoCruiseText) autoCruiseText.textContent = CURRENT_LANG === 'fr' ? 'Scan Direct' : 'Live Scan';
        if (autoCruiseBtn) {
            autoCruiseBtn.classList.remove('bg-[#10b981]/20', 'shadow-[0_0_15px_rgba(16,185,129,0.5)]');
        }
    }

    if (autoCruiseBtn) {
        autoCruiseBtn.addEventListener('click', () => {
            if (isAutoCruising) stopAutoCruise();
            else startAutoCruise();
        });
    }

    // Interactive Radar Screen Click Telemetry
    const radarContainerElem = document.getElementById('cyberTuxContainer');
    if (radarContainerElem) {
        const securityStatusReports = [
            "[+] SELinux Status: Enforcing. Kernel security profile: Optimal.",
            "[+] RHEL 9 Enterprise stack verified. Red Hat RHCSA Certified.",
            "[+] External Attack Surface Management (EASM) recon feeds active.",
            "[+] IEEEXtreme 17.0: #33 Worldwide global rank verified.",
            "[+] Python PCAP automated normalization pipelines online.",
            "[+] System Integrity: 100% | Security-by-Design architecture enforced."
        ];
        let reportIdx = 0;

        radarContainerElem.addEventListener('click', () => {
            const tuxSpeechText = document.getElementById('tuxSpeechText');
            if (tuxSpeechText) {
                tuxSpeechText.textContent = `"${securityStatusReports[reportIdx % securityStatusReports.length]}"`;
                reportIdx++;
            }
            playFuturisticTone(1200, 0.05, 'sawtooth', 0.035);
            radarContainerElem.style.transform = 'scale(1.06)';
            setTimeout(() => {
                radarContainerElem.style.transform = 'scale(1)';
            }, 300);
        });
    }

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
        if (q.includes('cert') || q.includes('rhcsa') || q.includes('pcap') || q.includes('red hat') || q.includes('python institute') || q.includes('credly')) {
            return `Wassim holds two industry-standard certifications verified on **Credly**:\n\n1. 🔴 **RHCSA (Red Hat Certified System Administrator)** – *Red Hat*:\n- Enterprise Linux administration (RHEL/CentOS), user & group access control, LVM storage, SELinux enforcement, FirewallD & systemd orchestration.\n- 🏅 **Credly Verification**: [Verify Red Hat RHCSA on Credly](https://www.credly.com/earner/earned/share/273c40c5-2afd-4237-853a-5dfc9c835e89)\n\n2. 🟡 **PCAP (Certified Associate in Python Programming)** – *Python Institute*:\n- Advanced OOP, complex algorithmic data structures, automated scripting, and multi-source data normalization pipelines.\n- 🏅 **Credly Verification**: [Verify Python PCAP on Credly](https://www.credly.com/earner/earned/share/9eaff906-83de-41e4-9483-7dd49be122a1)`;
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

// -------------------------------------------------------------
// 8. GLOBAL UTILITIES: CYBER TOAST, CLIPBOARD & MODAL HANDLERS
// -------------------------------------------------------------

/**
 * Show a sleek glowing Cyber Toast notification on screen
 */
window.showCyberToast = function(message, type = 'success') {
    const container = document.getElementById('cyberToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'cyber-toast px-4 py-3 rounded-2xl bg-[#070b14]/95 border border-[#00f0ff]/60 text-white font-mono text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] backdrop-blur-xl flex items-center gap-2.5 pointer-events-auto max-w-sm';
    
    let iconHtml = '<i class="fa-solid fa-circle-check text-[#10b981] text-sm"></i>';
    if (type === 'info') iconHtml = '<i class="fa-solid fa-circle-info text-[#00f0ff] text-sm"></i>';
    if (type === 'warn') iconHtml = '<i class="fa-solid fa-triangle-exclamation text-yellow-400 text-sm"></i>';

    toast.innerHTML = `
        ${iconHtml}
        <span class="flex-1 leading-tight">${message}</span>
        <button class="text-gray-400 hover:text-white text-xs ml-1 focus:outline-none" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);
    playFuturisticTone(1050, 0.04, 'sine', 0.04);

    setTimeout(() => {
        toast.classList.add('closing');
        setTimeout(() => toast.remove(), 260);
    }, 3600);
};

/**
 * Copy text to clipboard with instant Cyber Toast feedback
 */
window.copyToClipboard = function(text, label = 'Élément') {
    const isFr = CURRENT_LANG === 'fr';
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            window.showCyberToast(`<strong>${label}</strong> ${isFr ? 'copié dans le presse-papier !' : 'copied to clipboard!'}`, 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(text, label);
        });
    } else {
        fallbackCopyTextToClipboard(text, label);
    }
};

function fallbackCopyTextToClipboard(text, label) {
    const isFr = CURRENT_LANG === 'fr';
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        window.showCyberToast(`<strong>${label}</strong> ${isFr ? 'copié dans le presse-papier !' : 'copied to clipboard!'}`, 'success');
    } catch (err) {
        window.showCyberToast(`${isFr ? 'Impossible de copier automatiquement :' : 'Unable to copy automatically:'} ${text}`, 'warn');
    }
    document.body.removeChild(textArea);
}

/**
 * Open Official Document Verification Lightbox
 */
window.openDocViewer = function(title, issuer, filePath, description) {
    const modal = document.getElementById('docViewerModal');
    const modalTitle = document.getElementById('docModalTitle');
    const modalIssuer = document.getElementById('docModalIssuer');
    const modalDesc = document.getElementById('docModalDesc');
    const downloadBtn = document.getElementById('docDirectDownloadBtn');
    const openTabBtn = document.getElementById('docOpenTabBtn');
    const statusTitle = document.getElementById('docViewerStatusTitle');
    const statusSubtext = document.getElementById('docViewerStatusSubtext');

    if (!modal) return;
    const isFr = CURRENT_LANG === 'fr';

    if (modalTitle) modalTitle.textContent = title;
    if (modalIssuer) modalIssuer.textContent = `${isFr ? 'Émis par :' : 'Issued by:'} ${issuer}`;
    if (modalDesc) modalDesc.textContent = description || (isFr ? `Document officiel de référence attestant des compétences et réalisations de Wassim Bannour.` : `Official proof document verifying Wassim Bannour's credentials and achievements.`);

    if (downloadBtn) {
        downloadBtn.href = filePath;
        downloadBtn.setAttribute('download', filePath.split('/').pop() || 'document.pdf');
    }

    if (openTabBtn) {
        openTabBtn.href = filePath;
    }

    if (statusTitle) statusTitle.textContent = `${title}`;
    if (statusSubtext) statusSubtext.innerHTML = `${isFr ? 'Fichier indexé :' : 'Indexed File:'} <code class="text-[#00f0ff]">${filePath}</code><br><span class="text-[11px] text-gray-400 mt-1 block">${isFr ? 'Consultez en plein écran ou téléchargez la copie officielle numérisée.' : 'View in full screen or download the official digitized copy.'}</span>`;

    modal.classList.add('active');
    playFuturisticTone(880, 0.05, 'sine', 0.04);
};

window.closeDocViewer = function() {
    const modal = document.getElementById('docViewerModal');
    if (modal) {
        modal.classList.remove('active');
        playFuturisticTone(520, 0.04, 'sine', 0.03);
    }
};

/**
 * Open Recruiter Fast-Track Dossier Modal
 */
window.openHireMeModal = function() {
    const modal = document.getElementById('hireMeModal');
    if (modal) {
        modal.classList.add('active');
        playFuturisticTone(920, 0.06, 'sine', 0.05);
    }
};

window.closeHireMeModal = function() {
    const modal = document.getElementById('hireMeModal');
    if (modal) {
        modal.classList.remove('active');
        playFuturisticTone(520, 0.04, 'sine', 0.03);
    }
};

// Close modals when clicking backdrop outside container
document.addEventListener('click', (e) => {
    const docModal = document.getElementById('docViewerModal');
    if (docModal && docModal.classList.contains('active') && e.target === docModal) {
        window.closeDocViewer();
    }
    const hireModal = document.getElementById('hireMeModal');
    if (hireModal && hireModal.classList.contains('active') && e.target === hireModal) {
        window.closeHireMeModal();
    }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.closeDocViewer();
        window.closeHireMeModal();
        const aiChatModal = document.getElementById('aiChatModal');
        if (aiChatModal && aiChatModal.classList.contains('active')) {
            document.getElementById('closeAiChatBtn')?.click();
        }
    }
});
