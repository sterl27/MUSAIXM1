<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Musaix - AI Music Platform</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            overflow: hidden;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1f2937; } /* gray-800 */
        ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; } /* gray-600 */
        ::-webkit-scrollbar-thumb:hover { background: #6b7280; } /* gray-500 */
        textarea { resize: none; }
        /* Typing animation */
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1.0); }
        }
    </style>
</head>
<body class="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white antialiased">

    <div id="app-container" class="h-screen flex overflow-hidden">
      <!-- Sidebar -->
      <aside id="sidebar" class="w-80 bg-gray-800/80 backdrop-blur-xl border-r border-gray-700/50 flex flex-col transition-all duration-300 flex-shrink-0">
        <!-- Sidebar Header -->
        <div class="p-6 border-b border-gray-700/50">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <i data-lucide="music" style="width:20px; height:20px;"></i>
            </div>
            <div class="sidebar-content">
              <h1 class="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Musaix
              </h1>
              <p class="text-gray-400 text-sm">AI Music Platform</p>
            </div>
          </div>
          
          <div class="relative sidebar-content">
            <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" style="width:16px; height:16px;"></i>
            <input 
              type="text" 
              placeholder="Search conversations..."
              class="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <!-- Navigation -->
        <nav class="p-4">
          <div class="space-y-2">
            <button data-view="dashboard" class="nav-button w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all">
              <i data-lucide="home" style="width:18px; height:18px;"></i>
              <span class="sidebar-content">Dashboard</span>
            </button>
            <button data-view="chat" class="nav-button w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all">
              <i data-lucide="message-square" style="width:18px; height:18px;"></i>
              <span class="sidebar-content">AI Analysis</span>
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-all">
              <i data-lucide="history" style="width:18px; height:18px;"></i>
              <span class="sidebar-content">History</span>
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-all">
              <i data-lucide="library" style="width:18px; height:18px;"></i>
              <span class="sidebar-content">Library</span>
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-all">
              <i data-lucide="settings" style="width:18px; height:18px;"></i>
              <span class="sidebar-content">Settings</span>
            </button>
          </div>
        </nav>

        <!-- Music Player -->
        <div class="mt-auto p-4 border-t border-gray-700/50">
          <div class="bg-gradient-to-r from-gray-700/50 to-gray-600/50 backdrop-blur rounded-xl p-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <i data-lucide="music" style="width:16px; height:16px;"></i>
              </div>
              <div class="sidebar-content flex-1 min-w-0">
                <p id="current-song" class="text-sm font-medium truncate">Bohemian Rhapsody - Queen</p>
                <p class="text-xs text-gray-400">Now Playing</p>
              </div>
              <button id="play-pause-btn" class="sidebar-content w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg">
                <i data-lucide="play" style="width:16px; height:16px;"></i>
              </button>
            </div>
            <div class="mt-3 sidebar-content">
              <div class="w-full bg-gray-600/50 rounded-full h-1.5">
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full w-1/3 transition-all"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-400 mt-2">
                <span>1:23</span>
                <span>5:55</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Collapse Button -->
        <button id="sidebar-toggle-btn" class="absolute top-4 -right-3 w-6 h-6 bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-600 transition-all z-10">
          <i data-lucide="more-horizontal" style="width:12px; height:12px;"></i>
        </button>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col">
        <!-- Top Bar -->
        <header class="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <h2 id="main-title" class="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"></h2>
              <p id="main-subtitle" class="text-gray-400 mt-1"></p>
            </div>
            <div class="flex items-center gap-3">
              <div class="px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-xs text-green-400 font-medium">AI Agent Active</span>
                </div>
              </div>
              <button class="p-2 hover:bg-gray-700/50 rounded-lg transition-all">
                <i data-lucide="bell" style="width:20px; height:20px;" class="text-gray-400"></i>
              </button>
              <button class="p-2 hover:bg-gray-700/50 rounded-lg transition-all">
                <i data-lucide="user" style="width:20px; height:20px;" class="text-gray-400"></i>
              </button>
            </div>
          </div>
        </header>

        <!-- Content Area -->
        <div id="content-area" class="flex-1 overflow-auto"></div>

        <!-- Status Bar -->
        <footer class="bg-gray-800/50 backdrop-blur-xl border-t border-gray-700/50 px-6 py-3 flex-shrink-0">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <div class="flex items-center gap-6">
              <span>Powered by AI SDK</span>
              <span>&bull;</span>
              <span>Deployed on Vercel</span>
              <span>&bull;</span>
              <span class="flex items-center gap-1">
                <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                System Healthy
              </span>
            </div>
            <div class="flex items-center gap-4">
              <span>Response Time: 1.2s</span>
              <span>&bull;</span>
              <span>API Status: 99.7%</span>
            </div>
          </div>
        </footer>
      </main>
    </div>

    <script>
      document.addEventListener('DOMContentLoaded', () => {
        // --- STATE ---
        const state = {
          input: '',
          isLoading: false,
          isPlaying: false,
          currentSong: 'Bohemian Rhapsody - Queen',
          sidebarCollapsed: false,
          currentView: 'dashboard',
          messages: [
            {
              id: '1',
              role: 'user',
              content: 'Analyze the emotional progression in Bohemian Rhapsody',
              timestamp: new Date(Date.now() - 120000)
            },
            {
              id: '2',
              role: 'assistant',
              content: `**Emotional Journey Analysis: "Bohemian Rhapsody" by Queen**

This masterpiece showcases a remarkable emotional progression through three distinct phases:

**🎭 Phase 1: Introspective Ballad**
- Quiet contemplation and vulnerability
- "Is this the real life? Is this just fantasy?"
- Piano-driven, intimate atmosphere

**🎪 Phase 2: Operatic Drama**
- Theatrical chaos and internal conflict
- Multi-layered vocal harmonies
- Represents psychological turmoil and denial

**⚡ Phase 3: Hard Rock Climax**
- Explosive anger and cathartic release
- Heavy guitar riffs and aggressive drums
- Resolution through acceptance

The song mirrors the five stages of grief, using different musical elements—piano, opera, and rock—to represent distinct emotional states.`,
              timestamp: new Date(Date.now() - 100000),
              toolCalls: [
                { toolName: 'analyzeSong' },
                { toolName: 'analyzeMusicTheory' }
              ]
            }
          ]
        };

        // --- DATA ---
        const examplePrompts = [
          "What makes The Beatles so influential?",
          "Analyze the lyrics of Imagine by John Lennon",
          "Recommend songs similar to Hotel California",
          "Explain the music theory behind jazz improvisation"
        ];

        const recentAnalyses = [
          { id: 1, title: 'The Dark Side of the Moon - Pink Floyd', type: 'Album Analysis', status: 'completed' },
          { id: 2, title: 'Stairway to Heaven - Led Zeppelin', type: 'Song Structure', status: 'processing' },
          { id: 3, title: 'Kind of Blue - Miles Davis', type: 'Jazz Theory', status: 'completed' },
          { id: 4, title: 'OK Computer - Radiohead', type: 'Lyrical Analysis', status: 'completed' }
        ];

        const stats = [
          { label: 'Songs Analyzed', value: '2,847', trend: '+12%', icon: 'music' },
          { label: 'Active Users', value: '1,249', trend: '+8%', icon: 'users' },
          { label: 'API Calls', value: '45.2K', trend: '+23%', icon: 'zap' },
          { label: 'Data Points', value: '892K', trend: '+15%', icon: 'database' }
        ];

        // --- DOM ELEMENTS ---
        const sidebar = document.getElementById('sidebar');
        const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
        const navButtons = document.querySelectorAll('.nav-button');
        const contentArea = document.getElementById('content-area');
        const mainTitle = document.getElementById('main-title');
        const mainSubtitle = document.getElementById('main-subtitle');
        const playPauseBtn = document.getElementById('play-pause-btn');

        // --- UTILITY FUNCTIONS ---
        const formatTimestamp = (timestamp) => {
          const now = new Date();
          const diff = now - timestamp;
          const minutes = Math.floor(diff / 60000);
          const hours = Math.floor(diff / 3600000);
          if (minutes < 1) return 'Just now';
          if (minutes < 60) return `${minutes}m ago`;
          if (hours < 24) return `${hours}h ago`;
          return timestamp.toLocaleDateString();
        };

        // --- RENDER FUNCTIONS ---

        function renderDashboard() {
            const statsHtml = stats.map(stat => `
                <div class="bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-400 text-sm">${stat.label}</p>
                            <p class="text-2xl font-bold text-white">${stat.value}</p>
                            <p class="text-green-400 text-sm">${stat.trend}</p>
                        </div>
                        <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <i data-lucide="${stat.icon}" style="width:24px; height:24px;"></i>
                        </div>
                    </div>
                </div>
            `).join('');

            const recentAnalysesHtml = recentAnalyses.map(analysis => `
                <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                        <p class="text-white font-medium">${analysis.title}</p>
                        <p class="text-gray-400 text-sm">${analysis.type}</p>
                    </div>
                    <div class="px-3 py-1 rounded-full text-xs ${analysis.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}">
                        ${analysis.status}
                    </div>
                </div>
            `).join('');

            return `
                <div class="p-6">
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">${statsHtml}</div>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div class="bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
                                <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <i data-lucide="activity" style="width:20px; height:20px;"></i> Recent Analyses
                                </h3>
                                <div class="space-y-3">${recentAnalysesHtml}</div>
                            </div>
                            <div class="bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
                                <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <i data-lucide="trending-up" style="width:20px; height:20px;"></i> Analytics Overview
                                </h3>
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between"><span class="text-gray-400">Response Time</span><span class="text-green-400">1.2s avg</span></div>
                                    <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-3/4"></div></div>
                                    <div class="flex items-center justify-between"><span class="text-gray-400">API Success Rate</span><span class="text-green-400">99.7%</span></div>
                                    <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-full"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        function renderChat() {
            const messagesHtml = state.messages.map(message => {
                if (message.role === 'user') {
                    return `
                        <div class="flex justify-end">
                            <div class="max-w-2xl bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl rounded-br-md p-4 shadow-lg">
                                <p class="text-white whitespace-pre-line">${message.content}</p>
                                <p class="text-purple-200 text-xs mt-2 opacity-70">${formatTimestamp(message.timestamp)}</p>
                            </div>
                        </div>
                    `;
                } else { // assistant
                    const toolCallsHtml = message.toolCalls && message.toolCalls.length > 0 ? `
                        <div class="mt-4 pt-3 border-t border-gray-700/50">
                            <p class="text-xs text-gray-400 mb-2 flex items-center gap-2">
                                <i data-lucide="sparkles" style="width:12px; height:12px;"></i> AI Tools Used:
                            </p>
                            <div class="flex flex-wrap gap-2">
                                ${message.toolCalls.map(tool => `
                                    <span class="text-xs bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white px-3 py-1 rounded-full border border-purple-500/30">${tool.toolName}</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : '';
                    
                    const contentHtml = message.content.split('\n').map(line => {
                         const isHeader = line.startsWith('**');
                         const cleanedLine = line.replace(/\*\*/g, '');
                         return `<div class="${isHeader ? 'font-semibold text-purple-300 mt-3 first:mt-0' : ''}">${cleanedLine}</div>`;
                    }).join('');

                    return `
                        <div class="flex justify-start">
                            <div class="flex gap-4 max-w-2xl">
                                <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                                    <i data-lucide="sparkles" style="width:16px; height:16px;"></i>
                                </div>
                                <div class="bg-gray-800/80 backdrop-blur rounded-2xl rounded-bl-md p-4 shadow-lg border border-gray-700/50">
                                    <div class="text-gray-100 leading-relaxed">${contentHtml}</div>
                                    ${toolCallsHtml}
                                </div>
                            </div>
                        </div>
                    `;
                }
            }).join('<div class="my-2"></div>');

            const loadingIndicatorHtml = state.isLoading ? `
                <div class="flex justify-start">
                    <div class="flex gap-4 max-w-2xl">
                        <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                           <i data-lucide="loader-2" style="width:16px; height:16px;" class="animate-spin"></i>
                        </div>
                        <div class="bg-gray-800/80 backdrop-blur rounded-2xl rounded-bl-md p-4 shadow-lg border border-gray-700/50">
                            <div class="flex items-center gap-3 text-gray-400">
                                <div class="flex space-x-1">
                                    <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                    <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                    <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                                </div>
                                <span>Analyzing your music request...</span>
                            </div>
                        </div>
                    </div>
                </div>
            ` : '';
            
            const examplePromptsHtml = state.messages.length <= 2 ? `
                 <div class="mb-4">
                     <p class="text-sm text-gray-400 mb-3 flex items-center gap-2">
                         <i data-lucide="sparkles" style="width:14px; height:14px;"></i> Try these examples:
                     </p>
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                         ${examplePrompts.map(prompt => `
                             <button class="example-prompt-btn text-left p-3 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 rounded-xl text-sm text-gray-300 hover:text-white transition-all">
                                 ${prompt}
                             </button>
                         `).join('')}
                     </div>
                 </div>
            ` : '';

            const chatHtml = `
                <div class="flex-1 flex flex-col h-full">
                    <div class="flex-1 overflow-y-auto p-6">
                        <div class="max-w-4xl mx-auto space-y-6">${messagesHtml}${loadingIndicatorHtml}</div>
                    </div>
                    <div class="p-6 border-t border-gray-700/50">
                        <div class="max-w-4xl mx-auto">
                            ${examplePromptsHtml}
                            <form id="chat-form" class="flex gap-4">
                                <div class="flex-1 relative">
                                    <textarea id="message-input" placeholder="Ask about song meanings, analyze lyrics, explore musical elements..." class="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl p-4 pr-20 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur" rows="3"></textarea>
                                    <div class="absolute bottom-3 right-3 flex items-center gap-2">
                                        <button type="button" class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-600/50 transition-all"><i data-lucide="mic" style="width:18px; height:18px;"></i></button>
                                        <button type="button" class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-600/50 transition-all"><i data-lucide="upload" style="width:18px; height:18px;"></i></button>
                                    </div>
                                </div>
                                <button id="send-btn" type="submit" class="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl px-6 py-4 flex items-center justify-center transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                                     <i data-lucide="send" style="width:20px; height:20px;"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            return chatHtml;
        }

        function render() {
            // Render main content
            if (state.currentView === 'dashboard') {
                mainTitle.textContent = 'Analytics Dashboard';
                mainSubtitle.textContent = 'Monitor your music analysis platform performance';
                contentArea.innerHTML = renderDashboard();
            } else {
                mainTitle.textContent = 'AI Music Analysis';
                mainSubtitle.textContent = 'Explore the deeper meaning behind your favorite tracks';
                contentArea.innerHTML = renderChat();
                // Re-attach listeners for dynamically created chat elements
                attachChatListeners();
            }

            // Update sidebar appearance
            sidebar.classList.toggle('w-20', state.sidebarCollapsed);
            sidebar.classList.toggle('w-80', !state.sidebarCollapsed);
            document.querySelectorAll('.sidebar-content').forEach(el => el.classList.toggle('hidden', state.sidebarCollapsed));

            // Update nav buttons
            navButtons.forEach(btn => {
                const view = btn.dataset.view;
                if (view === state.currentView) {
                    btn.className = 'nav-button w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg';
                } else {
                    btn.className = 'nav-button w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-300 hover:bg-gray-700/50';
                }
            });
            
             // Update player
            playPauseBtn.innerHTML = `<i data-lucide="${state.isPlaying ? 'pause' : 'play'}" style="width:16px; height:16px;"></i>`;

            // Re-render icons
            lucide.createIcons();
        }

        // --- EVENT HANDLERS ---
        function handleNavClick(e) {
            const button = e.target.closest('.nav-button');
            if (button && button.dataset.view) {
                state.currentView = button.dataset.view;
                render();
            }
        }

        function handleSidebarToggle() {
            state.sidebarCollapsed = !state.sidebarCollapsed;
            render();
        }
        
        async function handleSubmit(e) {
            e.preventDefault();
            const messageInput = document.getElementById('message-input');
            const input = messageInput.value.trim();
            if (!input || state.isLoading) return;

            const userMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: input,
                timestamp: new Date()
            };

            state.messages.push(userMessage);
            state.isLoading = true;
            render(); // show user message and loader
            messageInput.value = '';

            // Simulate AI response
            setTimeout(() => {
                const aiMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `I've analyzed your request: "${input}". Here's a comprehensive breakdown of the musical elements, emotional themes, and theoretical aspects that make this piece unique.`,
                    timestamp: new Date(),
                    toolCalls: [{ toolName: 'analyzeSong' }, { toolName: 'getLyrics' }]
                };
                state.messages.push(aiMessage);
                state.isLoading = false;
                render();
            }, 2000);
        }

        function handleExamplePromptClick(e) {
             const button = e.target.closest('.example-prompt-btn');
             if (button) {
                document.getElementById('message-input').value = button.textContent.trim();
                document.getElementById('message-input').focus();
             }
        }
        
        function attachChatListeners() {
            const chatForm = document.getElementById('chat-form');
            if (chatForm) {
                chatForm.addEventListener('submit', handleSubmit);
            }
             const messageInput = document.getElementById('message-input');
             if(messageInput){
                 messageInput.addEventListener('keydown', (e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         handleSubmit(e);
                     }
                 });
             }
            document.querySelectorAll('.example-prompt-btn').forEach(btn => {
                btn.addEventListener('click', handleExamplePromptClick);
            });
        }

        // --- INITIALIZATION ---
        sidebarToggleBtn.addEventListener('click', handleSidebarToggle);
        navButtons.forEach(btn => btn.addEventListener('click', handleNavClick));
        playPauseBtn.addEventListener('click', () => {
             state.isPlaying = !state.isPlaying;
             render();
        });

        // Initial render
        render();
      });
    </script>
</body>
</html>

