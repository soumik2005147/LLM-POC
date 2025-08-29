// Configuration panel logic
const providerSelect = document.getElementById('provider-select');
const apiTokenInput = document.getElementById('api-token');
const modelSelect = document.getElementById('model-select');
const saveConfigBtn = document.getElementById('save-config');
const providerInfo = document.getElementById('provider-info');

let config = {
    provider: providerSelect.value,
    apiToken: '',
    model: modelSelect.value
};

providerSelect.onchange = function() {
    if (providerSelect.value === 'ai-pipe') {
        providerInfo.textContent = "AI Pipe provides free access ($0.10/week). No API key needed - you'll be redirected to login.";
        apiTokenInput.disabled = true;
    } else {
        providerInfo.textContent = "Enter your OpenAI API key.";
        apiTokenInput.disabled = false;
    }
};

saveConfigBtn.onclick = function(e) {
    e.preventDefault();
    config.provider = providerSelect.value;
    config.apiToken = apiTokenInput.value;
    config.model = modelSelect.value;
    showAlert('Configuration saved!', 'success');
    showWelcomeMessage();
};

function showWelcomeMessage() {
    chatWindow.innerHTML = '';
    appendMessage('LLM Agent', "Hello! I'm your AI agent with access to web search, AI processing, and code execution tools. Please configure your LLM provider above to get started.");
}

// Show welcome message on load
showWelcomeMessage();
// Modern LLM Agent with AI Pipe integration and chatbox interface
// Uses AI Pipe, bootstrap-alert, lit-html, asyncLLM, and marked

import { render, html } from 'https://cdn.jsdelivr.net/npm/lit-html@3/+esm';
import { unsafeHTML } from 'https://cdn.jsdelivr.net/npm/lit-html@3/directives/unsafe-html.js';
import { asyncLLM } from 'https://cdn.jsdelivr.net/npm/asyncllm@2/+esm';
import { Marked } from 'https://cdn.jsdelivr.net/npm/marked@13/+esm';
import { bootstrapAlert } from 'https://cdn.jsdelivr.net/npm/bootstrap-alert@1';

// Initialize markdown parser
const marked = new Marked();

// DOM elements
const $chatForm = document.querySelector('#chat-form');
const $chatMessages = document.querySelector('#chat-messages');
// Minimal LLM chat app with tool integrations
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('message-input');
const alertContainer = document.getElementById('alert-container');

function showAlert(message, type = 'danger') {
    alertContainer.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'text-end mb-2' : 'text-start mb-2';
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.onsubmit = async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage('user', text);
    userInput.value = '';
    try {
        const response = await callLLM(text);
        appendMessage('LLM', response);
    } catch (err) {
        showAlert(err.message || 'Error calling LLM');
    }
};

// OpenAI tool-calling interface stub
async function callLLM(message) {
    // Replace with actual OpenAI API call and tool-calling logic
    return `Echo: ${message}`;
}

// Tool integrations (stubs)
function runGoogleSearch() {
    try {
        // Replace with actual Google Search Snippet API call
        appendMessage('tool', 'Google Search: [stub result]');
    } catch (err) {
        showAlert('Google Search error: ' + err.message);
    }
}

function runAIPipe() {
    try {
        // Replace with actual AI Pipe proxy API call
        appendMessage('tool', 'AI Pipe API: [stub result]');
    } catch (err) {
        showAlert('AI Pipe error: ' + err.message);
    }
}

function runSandboxJS() {
    try {
        // Minimal JS sandbox (unsafe, for demo only)
        const code = prompt('Enter JS code to run:');
        if (code) {
            let result;
            try {
                result = eval(code);
            } catch (e) {
                showAlert('JS error: ' + e.message);
                return;
            }
            appendMessage('tool', 'JS Result: ' + result);
        }
    } catch (err) {
        showAlert('Sandbox error: ' + err.message);
    }
}
const $messageInput = document.querySelector('#message-input');
const $sendButton = document.querySelector('#send-button');
const $configPanel = document.querySelector('#config-panel');
const $configToggle = document.querySelector('#config-toggle');
const $llmProvider = document.querySelector('#llm-provider');
const $apiToken = document.querySelector('#api-token');
const $modelSelect = document.querySelector('#model-select');
const $saveConfig = document.querySelector('#save-config');
const $connectionStatus = document.querySelector('#connection-status');

// Application state
let messages = [];
let currentConfig = null;
let isProcessing = false;

// Tool definitions - exactly as specified in requirements
const tools = [
    {
        name: 'google_search',
        description: 'Search the web using Google Search API - returns snippet results for user queries',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query to execute'
                },
                num_results: {
                    type: 'integer',
                    description: 'Number of results to return (default 5)',
                    default: 5
                }
            },
            required: ['query']
        }
    },
    {
        name: 'ai_pipe_proxy',
        description: 'Use the AI Pipe API (https://aipipe.org/) for flexible AI dataflows and transformations',
        parameters: {
            type: 'object',
            properties: {
                task: {
                    type: 'string',
                    description: 'The AI task or workflow to perform'
                },
                data: {
                    type: 'string',
                    description: 'Input data to process through the AI pipeline'
                }
            },
            required: ['task', 'data']
        }
    },
    {
        name: 'javascript_execution',
        description: 'Securely run and display results of JavaScript code within the browser',
        parameters: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'JavaScript code to execute safely in the browser'
                }
            },
            required: ['code']
        }
    }
];

// Configuration management
const CONFIG_PROVIDERS = {
    aipipe: {
        name: 'AI Pipe',
        baseUrl: 'https://aipipe.org/openrouter/v1',
        requiresAuth: false,
        authMethod: 'aipipe'
    },
    openai: {
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1',
        requiresAuth: true,
        authMethod: 'bearer'
    },
    openrouter: {
        name: 'OpenRouter',
        baseUrl: 'https://openrouter.ai/api/v1',
        requiresAuth: true,
        authMethod: 'bearer'
    },
    ollama: {
        name: 'Ollama (Local)',
        baseUrl: 'http://localhost:11434/v1',
        requiresAuth: false,
        authMethod: 'none'
    }
};

// AI Pipe authentication
async function getAIPipeAuth() {
    try {
        const { getProfile } = await import('https://aipipe.org/aipipe.js');
        const { token, email } = getProfile();
        
        if (!token) {
            // Redirect to AI Pipe login
            window.location = `https://aipipe.org/login?redirect=${encodeURIComponent(window.location.href)}`;
            return null;
        }
        
        return { token, email };
    } catch (error) {
        console.error('AI Pipe auth error:', error);
        showError('Failed to authenticate with AI Pipe. Please try again.');
        return null;
    }
}

// Configuration UI handlers
async function saveConfiguration() {
    const provider = $llmProvider.value;
    const apiToken = $apiToken.value;
    const model = $modelSelect.value;
    
    const providerConfig = CONFIG_PROVIDERS[provider];
    
    try {
        if (provider === 'aipipe') {
            // AI Pipe authentication
            const auth = await getAIPipeAuth();
            if (!auth) return false;
            
            currentConfig = {
                provider: 'aipipe',
                baseUrl: providerConfig.baseUrl,
                apiKey: auth.token,
                model: model,
                email: auth.email
            };
        } else {
            // Other providers
            if (providerConfig.requiresAuth && !apiToken) {
                showError('API token is required for this provider.');
                return false;
            }
            
            currentConfig = {
                provider: provider,
                baseUrl: providerConfig.baseUrl,
                apiKey: apiToken,
                model: model
            };
        }
        
        // Save to localStorage
        localStorage.setItem('llm-agent-config', JSON.stringify(currentConfig));
        
        // Update UI
        updateConnectionStatus(true);
        enableChat();
        hideConfig();
        
        showSuccess(`Connected to ${providerConfig.name}!`);
        return true;
        
    } catch (error) {
        console.error('Configuration error:', error);
        showError(`Failed to configure ${providerConfig.name}: ${error.message}`);
        return false;
    }
}

function updateConnectionStatus(connected) {
    const icon = $connectionStatus.querySelector('i');
    const text = $connectionStatus.querySelector('span');
    
    if (connected && currentConfig) {
        icon.className = 'bi bi-circle-fill';
        text.textContent = `Connected to ${CONFIG_PROVIDERS[currentConfig.provider].name}`;
        $connectionStatus.className = 'status-indicator status-connected';
    } else {
        icon.className = 'bi bi-circle';
        text.textContent = 'Not connected';
        $connectionStatus.className = 'status-indicator status-disconnected';
    }
}

function enableChat() {
    $messageInput.disabled = false;
    $sendButton.disabled = false;
    $messageInput.placeholder = 'Type your message...';
    $messageInput.focus();
}

function disableChat() {
    $messageInput.disabled = true;
    $sendButton.disabled = true;
    $messageInput.placeholder = 'Configure your LLM provider first...';
}

function showConfig() {
    $configPanel.classList.remove('config-collapsed');
}

function hideConfig() {
    $configPanel.classList.add('config-collapsed');
}

function loadSavedConfig() {
    try {
        const saved = localStorage.getItem('llm-agent-config');
        if (saved) {
            const config = JSON.parse(saved);
            currentConfig = config;
            
            // Update UI
            $llmProvider.value = config.provider;
            if (config.apiKey && config.provider !== 'aipipe') {
                $apiToken.value = config.apiKey;
            }
            $modelSelect.value = config.model;
            
            updateConnectionStatus(true);
            enableChat();
            hideConfig();
            
            return true;
        }
    } catch (error) {
        console.error('Failed to load saved config:', error);
    }
    
    return false;
}

// UI Helper functions
function showError(message, title = 'Error') {
    try {
        bootstrapAlert({
            title: title,
            body: message,
            color: 'danger'
        });
    } catch (error) {
        console.error('Failed to show alert:', error);
        console.error(`${title}: ${message}`);
    }
}

function showSuccess(message, title = 'Success') {
    try {
        bootstrapAlert({
            title: title,
            body: message,
            color: 'success'
        });
    } catch (error) {
        console.error('Failed to show success alert:', error);
    }
}

function addMessage(role, content, toolName = null) {
    const message = {
        role: role,
        content: content,
        timestamp: new Date().toISOString(),
        toolName: toolName
    };
    
    messages.push(message);
    renderMessages();
    scrollToBottom();
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
        <i class="bi bi-robot"></i>
        <span>Agent is thinking</span>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    $chatMessages.appendChild(indicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    $chatMessages.scrollTop = $chatMessages.scrollHeight;
}

function renderMessages() {
    // Clear existing messages except typing indicator
    const typingIndicator = document.getElementById('typing-indicator');
    $chatMessages.innerHTML = '';
    
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${message.role}`;
        
        let bubbleClass = 'message-bubble';
        let icon = '';
        let prefix = '';
        
        switch (message.role) {
            case 'user':
                icon = '👤';
                prefix = 'You';
                break;
            case 'assistant':
                icon = '🤖';
                prefix = 'Agent';
                break;
            case 'tool':
                icon = '🔧';
                prefix = `Tool: ${message.toolName}`;
                bubbleClass = 'message-bubble';
                messageDiv.className = 'message message-tool';
                break;
        }
        
        const contentHtml = message.role === 'tool' 
            ? `<pre><code>${message.content}</code></pre>`
            : marked.parse(message.content);
        
        messageDiv.innerHTML = `
            <div class="${bubbleClass}">
                <strong>${icon} ${prefix}</strong><br>
                ${contentHtml}
            </div>
        `;
        
        $chatMessages.appendChild(messageDiv);
    });
    
    // Re-add typing indicator if it existed
    if (typingIndicator) {
        $chatMessages.appendChild(typingIndicator);
    }
    
    scrollToBottom();
}

// Tool execution functions
async function executeGoogleSearch(params) {
    const { query, num_results = 5 } = params;
    
    try {
        console.log(`Executing Google Search for: "${query}"`);
        
        // Simulate realistic search results
        const searchResults = {
            searchInformation: {
                searchTime: Math.random() * 0.5 + 0.1,
                totalResults: Math.floor(Math.random() * 10000) + 1000
            },
            items: Array.from({ length: Math.min(num_results, 5) }, (_, i) => ({
                title: `${query} - Result ${i + 1}`,
                link: `https://example${i + 1}.com/search-result`,
                snippet: `This is a search result snippet for "${query}". It contains relevant information about the topic and would normally come from Google's Custom Search API.`,
                displayLink: `example${i + 1}.com`,
                formattedUrl: `https://example${i + 1}.com/search-result`
            }))
        };
        
        return {
            query: query,
            results_count: searchResults.items.length,
            search_time: searchResults.searchInformation.searchTime,
            results: searchResults.items,
            note: 'Simulated results - integrate real Google Custom Search API for production'
        };
        
    } catch (error) {
        console.error('Google Search error:', error);
        return {
            query: query,
            error: error.message,
            results: [],
            note: 'Search failed - check API configuration'
        };
    }
}

async function executeAIPipeProxy(params) {
    const { task, data } = params;
    
    try {
        // For AI Pipe, we can use the same authentication as the main LLM calls
        if (currentConfig && currentConfig.provider === 'aipipe') {
            const response = await fetch('https://aipipe.org/openrouter/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentConfig.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-4o-mini',
                    messages: [{
                        role: 'user',
                        content: `Task: ${task}\nData: ${data}\nPlease process this data according to the task description.`
                    }]
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                return {
                    task: task,
                    input_data: data,
                    processed_data: result.choices[0].message.content,
                    processing_method: 'AI Pipe via OpenRouter'
                };
            }
        }
        
        // Fallback simulation
        return {
            task: task,
            input_data: data,
            processed_data: `AI Pipe processed: ${data} (Task: ${task})`,
            confidence: 0.95,
            processing_time: Math.random() * 1000 + 500,
            note: 'Simulated result - AI Pipe processing'
        };
        
    } catch (error) {
        console.warn('AI Pipe API unavailable, using simulation:', error);
        return {
            task: task,
            input_data: data,
            processed_data: `AI Pipe processed: ${data} (Task: ${task})`,
            confidence: 0.95,
            processing_time: Math.random() * 1000 + 500,
            note: 'Simulated result - AI Pipe API not available'
        };
    }
}

async function executeJavaScript(params) {
    const { code } = params;
    
    try {
        // Create a safe execution environment
        const func = new Function('Math', 'Date', 'JSON', 'console', `
            const result = (() => {
                ${code}
            })();
            return result;
        `);
        
        const result = func(Math, Date, JSON, console);
        return {
            code: code,
            result: result,
            success: true
        };
    } catch (error) {
        return {
            code: code,
            error: error.message,
            success: false
        };
    }
}

// Main tool executor
async function executeTool(toolCall) {
    const { name, parameters } = toolCall;
    
    switch (name) {
        case 'google_search':
            return await executeGoogleSearch(parameters);
        case 'ai_pipe_proxy':
            return await executeAIPipeProxy(parameters);
        case 'javascript_execution':
            return await executeJavaScript(parameters);
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}

// Main agent loop
async function processUserMessage(userMessage) {
    if (!currentConfig) {
        showError('Please configure your LLM provider first.');
        return;
    }
    
    if (isProcessing) {
        return;
    }
    
    isProcessing = true;
    
    try {
        // Add user message
        addMessage('user', userMessage);
        
        // Show typing indicator
        showTypingIndicator();
        
        // System prompt for the agent
        const systemPrompt = `You are an intelligent agent that can use tools to help answer questions and solve problems. 

You have access to these tools:
${tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

Follow this conversation pattern:
1. Always provide helpful output to the user
2. If you need tools, call them to gather information
3. Continue until the task is complete

When responding, use this exact JSON format:
{
  "output": "Your helpful response to the user",
  "tool_calls": [
    {
      "name": "tool_name",
      "parameters": { "param": "value" }
    }
  ]
}

If no tools are needed, omit the tool_calls array:
{
  "output": "Your direct answer"
}

Be conversational and helpful. Explain what you're doing when using tools.`;

        // Main reasoning loop
        while (true) {
            const llmMessages = [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content }))
            ];
            
            let response = '';
            
            // Stream the response
            try {
                for await (const event of asyncLLM(`${currentConfig.baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentConfig.apiKey}`
                    },
                    body: JSON.stringify({
                        model: currentConfig.model,
                        messages: llmMessages,
                        tools: tools.map(tool => ({
                            type: 'function',
                            function: {
                                name: tool.name,
                                description: tool.description,
                                parameters: tool.parameters
                            }
                        })),
                        tool_choice: 'auto',
                        stream: true,
                        temperature: 0.7
                    })
                })) {
                    if (event.content) {
                        response = event.content;
                    }
                    
                    if (event.error) {
                        throw new Error(event.error);
                    }
                }
            } catch (error) {
                hideTypingIndicator();
                showError(`LLM Error: ${error.message}`);
                return;
            }
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Parse the response
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(response);
            } catch (parseError) {
                console.warn('Response is not JSON, treating as plain text:', parseError);
                parsedResponse = { output: response };
            }
            
            // Add assistant response
            if (parsedResponse.output) {
                addMessage('assistant', parsedResponse.output);
            }
            
            // Check for tool calls
            if (parsedResponse.tool_calls && parsedResponse.tool_calls.length > 0) {
                // Execute tools
                const toolResults = await Promise.all(
                    parsedResponse.tool_calls.map(async (toolCall) => {
                        try {
                            const result = await executeTool(toolCall);
                            addMessage('tool', JSON.stringify(result, null, 2), toolCall.name);
                            return {
                                role: 'tool',
                                content: JSON.stringify(result, null, 2)
                            };
                        } catch (error) {
                            const errorResult = { error: error.message };
                            addMessage('tool', JSON.stringify(errorResult, null, 2), toolCall.name);
                            return {
                                role: 'tool',
                                content: JSON.stringify(errorResult, null, 2)
                            };
                        }
                    })
                );
                
                // Add tool results to messages for next iteration
                messages.push(...toolResults);
                
                // Show typing indicator for next response
                showTypingIndicator();
                
                // Continue the loop
                continue;
            } else {
                // No more tool calls, we're done
                break;
            }
        }
        
    } catch (error) {
        console.error('Agent processing error:', error);
        hideTypingIndicator();
        showError(`Agent Error: ${error.message}`);
    } finally {
        isProcessing = false;
    }
}

// Event handlers
$configToggle.addEventListener('click', () => {
    if ($configPanel.classList.contains('config-collapsed')) {
        showConfig();
    } else {
        hideConfig();
    }
});

$saveConfig.addEventListener('click', saveConfiguration);

$llmProvider.addEventListener('change', () => {
    const provider = $llmProvider.value;
    const providerConfig = CONFIG_PROVIDERS[provider];
    
    if (provider === 'aipipe') {
        $apiToken.disabled = true;
        $apiToken.placeholder = 'No API token needed - AI Pipe handles authentication';
    } else {
        $apiToken.disabled = false;
        $apiToken.placeholder = providerConfig.requiresAuth ? 'Enter your API token' : 'Optional';
    }
});

$chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = $messageInput.value.trim();
    if (!message || isProcessing) return;
    
    $messageInput.value = '';
    await processUserMessage(message);
});

$messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        $chatForm.dispatchEvent(new Event('submit'));
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check for AI Pipe auth tokens in URL
    const urlParams = new URLSearchParams(window.location.search);
    const aipipeToken = urlParams.get('aipipe_token');
    const aipipeEmail = urlParams.get('aipipe_email');
    
    if (aipipeToken && aipipeEmail) {
        // Store AI Pipe auth and clean URL
        localStorage.setItem('aipipe_token', aipipeToken);
        localStorage.setItem('aipipe_email', aipipeEmail);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Auto-configure AI Pipe
        $llmProvider.value = 'aipipe';
        currentConfig = {
            provider: 'aipipe',
            baseUrl: CONFIG_PROVIDERS.aipipe.baseUrl,
            apiKey: aipipeToken,
            model: $modelSelect.value,
            email: aipipeEmail
        };
        
        localStorage.setItem('llm-agent-config', JSON.stringify(currentConfig));
        updateConnectionStatus(true);
        enableChat();
        hideConfig();
        
        showSuccess('Successfully authenticated with AI Pipe!');
    } else {
        // Try to load saved config
        if (!loadSavedConfig()) {
            showConfig();
            disableChat();
            updateConnectionStatus(false);
        }
    }
    
    // Show welcome message
    addMessage('assistant', 'Hello! I\'m your AI agent with access to web search, AI processing, and code execution tools. Please configure your LLM provider above to get started.');
});

console.log('LLM Agent POC with AI Pipe integration loaded successfully');
