# LLM Agent POC v2.0

![LLM Agent POC Screenshot](screenshot.png)

A modern proof-of-concept for an LLM-powered agent that demonstrates browser-based multi-tool reasoning. Built using the [apiagent](https://github.com/sanand0/apiagent) architecture with [bootstrap-llm-provider](https://github.com/sanand0/bootstrap-llm-provider) and [bootstrap-alert](https://github.com/sanand0/bootstrap-alert).

## 🚀 Features

- **Multi-Tool Reasoning**: Agent can use multiple tools to solve complex problems
- **Real-time Streaming**: Live responses using asyncLLM for better user experience  
- **Modern Architecture**: Built with ES6+ modules, lit-html, and Bootstrap 5.3
- **Provider Flexibility**: Support for OpenAI, Claude, and custom LLM providers
- **Tool Integration**: Google Search API, AI Pipe workflows, and JavaScript execution
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Graceful error management with bootstrap-alert notifications

## 🛠️ Available Tools

### 1. Google Search API
- Search the web for current information
- Configurable number of results
- Simulated responses for development

### 2. AI Pipe Proxy  
- Process data through AI workflows
- Advanced text analysis and transformations
- Confidence scoring and metadata

### 3. JavaScript Execution
- Safe code execution in sandboxed environment
- Mathematical calculations and data processing
- Real-time result display

## 🏗️ Architecture

This project follows the [apiagent](https://github.com/sanand0/apiagent) design pattern:

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (HTML)                   │
├─────────────────────────────────────────────────────┤
│  bootstrap-llm-provider  │  bootstrap-alert         │
├─────────────────────────────────────────────────────┤
│           lit-html (Templating)                     │
├─────────────────────────────────────────────────────┤
│  asyncLLM (Streaming)   │  marked (Markdown)        │
├─────────────────────────────────────────────────────┤
│              Agent Logic (ES6 Modules)              │
├─────────────────────────────────────────────────────┤
│                    Tool Layer                       │
│  Google Search  │  AI Pipe Proxy  │  JS Execution   │
└─────────────────────────────────────────────────────┘
```

### Key Dependencies

- **[Bootstrap 5.3.3](https://getbootstrap.com/)** - UI framework
- **[lit-html 3](https://lit.dev/)** - HTML templating library  
- **[asyncLLM 2](https://npmjs.com/package/asyncllm)** - Streaming LLM responses
- **[marked 13](https://marked.js.org/)** - Markdown parsing
- **[bootstrap-llm-provider](https://github.com/sanand0/bootstrap-llm-provider)** - LLM provider selection
- **[bootstrap-alert](https://github.com/sanand0/bootstrap-alert)** - Error notifications

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.7+ (for local development server)
- LLM API key (OpenAI, Anthropic, etc.)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd llm-agent-poc
   ```

2. **Start the development server**
   ```bash
   # Windows
   start-server.bat
   
   # Or manually
   python server.py
   ```

3. **Open in browser**
   - Agent Interface: http://localhost:8000/index.html
   - Examples: http://localhost:8000/demo.html

4. **Configure your LLM provider**
   - Choose your provider (OpenAI, Claude, etc.)
   - Enter your API key (stored locally in browser)
   - Select your preferred model

5. **Start asking questions!**
   - Try the sample questions or ask your own
   - Watch the agent reason through problems step by step
   - See real-time tool usage and results

## 💡 Example Usage

### Web Search & Analysis
```
User: What are the current trends in artificial intelligence for 2024?

Agent: I'll search for the latest AI trends to give you current information.
🔧 Using google_search("AI trends 2024")...

Result: Based on my search, here are the key AI trends for 2024:
- Generative AI Maturation
- Multimodal AI Models  
- AI Agents & Automation
- Enterprise AI Adoption
- Edge AI Computing
```

### Mathematical Calculations
```
User: Calculate compound interest on $10,000 at 5% for 10 years.

Agent: I'll use JavaScript to calculate this precisely.
🔧 Using javascript_execution...

const amount = 10000 * Math.pow(1.05, 10);
// Result: $16,288.95 (Interest: $6,288.95)
```

### AI Processing
```
User: Analyze this text: "Revenue increased 23% due to cloud division performance"

Agent: I'll process this through AI analysis workflows.
🔧 Using ai_pipe_proxy("text analysis", data)...

Result: Key insights:
- Growth Rate: 23% quarterly increase
- Driver: Cloud computing division
- Sentiment: Positive performance indicator
```

## 🔧 Configuration

### LLM Providers
The agent supports multiple LLM providers through bootstrap-llm-provider:

- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude 3 Sonnet, Claude 3 Haiku  
- **Custom**: Local or hosted models via OpenAI-compatible API

### Tool Configuration
Tools can be enabled/disabled in `package.json`:

```json
{
  "config": {
    "tools": {
      "google_search": { "enabled": true, "simulated": true },
      "ai_pipe_proxy": { "enabled": true, "simulated": true },
      "javascript_execution": { "enabled": true, "sandbox": true }
    }
  }
}
```

## 🛡️ Security

- **Sandboxed Execution**: JavaScript code runs in isolated environment
- **Local Storage**: API keys stored only in browser localStorage
- **CORS Protection**: Requests limited to allowed domains
- **Input Validation**: User input sanitized before processing

## 🔄 Development

### Project Structure
```
llm-agent-poc/
├── index.html          # Main agent interface
├── demo.html           # Examples and documentation  
├── agent.js            # Core agent logic (ES6 modules)
├── server.py           # Development server with CORS
├── package.json        # Project configuration
├── README.md           # This file
└── start-server.bat    # Windows launcher script
```

### Making Changes

1. **Agent Logic**: Edit `agent.js` for core functionality
2. **UI Updates**: Modify `index.html` and `demo.html`
3. **Tool Integration**: Add new tools in the tools array
4. **Styling**: Use Bootstrap classes or add custom CSS

### Adding New Tools

```javascript
// In agent.js - tools array
{
    name: 'my_new_tool',
    description: 'Description of what this tool does',
    parameters: {
        type: 'object',
        properties: {
            input: {
                type: 'string',
                description: 'Tool input parameter'
            }
        },
        required: ['input']
    }
}

// Add execution function
async function executeMyNewTool(params) {
    const { input } = params;
    // Tool logic here
    return result;
}
```

## 🤝 Contributing

This project is inspired by and follows the patterns from:
- [apiagent](https://github.com/sanand0/apiagent) - Reference architecture
- [bootstrap-llm-provider](https://github.com/sanand0/bootstrap-llm-provider) - LLM provider management
- [bootstrap-alert](https://github.com/sanand0/bootstrap-alert) - User notifications

## 📝 License

MIT License - feel free to use this code for your own projects!

## 🚀 What's New in v2.0

- **Modern Architecture**: Rebuilt using apiagent design patterns
- **Better Library Integration**: Using bootstrap-llm-provider and bootstrap-alert
- **Improved Streaming**: Real-time responses with asyncLLM
- **Cleaner Code**: Simplified and more maintainable ES6+ modules
- **Enhanced UI**: Better responsive design with Bootstrap 5.3
- **Tool Simplification**: Streamlined tool execution and error handling

## 🎯 Next Steps

- [ ] Add real Google Search API integration
- [ ] Implement actual AI Pipe workflows
- [ ] Add more tool types (file upload, data visualization)
- [ ] Create tool marketplace/plugin system
- [ ] Add conversation memory and context management
- [ ] Implement multi-agent collaboration

---

**Happy coding!** 🤖✨
