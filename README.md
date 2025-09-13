# Weather Agent Chat Application

A modern, minimalist chat interface for interacting with a weather agent API. Built with Next.js 13+, React, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Real-time Chat Interface**: Clean, minimalist design with dark/light theme support
- **Streaming Responses**: Real-time message streaming from the weather agent API
- **Theme Toggle**: Seamless switching between light and dark modes with persistence
- **Export Functionality**: Download chat history as JSON files
- **Responsive Design**: Optimized for all device sizes
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Comprehensive error management with user-friendly messages

## 🏗️ Architecture Overview

### Approach

The application follows a **component-driven architecture** with clear separation of concerns:

```
src/
├── app/                 # Next.js 13+ App Router
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks for state management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and API logic
```

### Core Design Principles

1. **Minimalist UI**: Clean, distraction-free interface focusing on content
2. **Type Safety**: Comprehensive TypeScript implementation with strict typing
3. **Custom Hooks**: Encapsulated state management and business logic
4. **Streaming-First**: Optimized for real-time API responses
5. **Accessibility**: Proper semantic HTML and keyboard navigation

## 🔧 Technical Implementation

### Custom React Hooks

#### `useChat` Hook
```typescript
const {
  messages,
  isLoading,
  error,
  sendMessage,
  clearChat,
  searchMessages
} = useChat()
```

**Responsibilities:**
- Chat state management (messages, loading, errors)
- Message creation and updates
- API communication with streaming support
- Error filtering and conversation history management

#### `useThemeState` Hook
```typescript
const { isDark, toggleTheme } = useThemeState()
```

**Responsibilities:**
- Theme state management
- Local storage persistence
- System preference detection
- DOM class manipulation for Tailwind dark mode

### API Integration

#### Streaming Response Handling
The application implements a sophisticated streaming parser that handles multiple response formats:

```typescript
// Response format examples:
'f:{"messageId":"123"}'     // Message ID (skipped)
'0:"Hello world"'           // Content chunk
'e:{"finishReason":"stop"}' // Finish event
'd:{}'                      // Final data
```

#### Error Handling Strategy
- **Network Errors**: Graceful handling of API failures
- **Parsing Errors**: Individual line failures don't break the stream
- **User Feedback**: Clear error messages displayed in the UI
- **Recovery**: Automatic retry mechanisms where appropriate

### Component Architecture

#### `Chat` Component (Main Container)
- Orchestrates the entire chat interface
- Manages theme and export functionality
- Handles error display and layout

#### `MessagesList` Component
- Displays conversation history
- Handles auto-scrolling
- Shows loading indicators during streaming

#### `Message` Component
- Renders individual messages
- Supports streaming indicators
- Clean bubble design with proper alignment

#### `MessageInput` Component
- Text input with send functionality
- Loading state management
- Keyboard shortcuts (Enter to send)

## 📋 Assumptions Made

### API Assumptions
1. **Endpoint Stability**: The Mastra weather agent API endpoint remains consistent
2. **Response Format**: Streaming responses follow the documented format patterns
3. **Authentication**: No authentication required for the current implementation
4. **Rate Limiting**: API handles rate limiting appropriately

### User Experience Assumptions
1. **Browser Support**: Modern browsers with ES6+ support
2. **JavaScript Enabled**: Application requires JavaScript to function
3. **Local Storage**: Users allow local storage for theme persistence
4. **Network Connectivity**: Stable internet connection for API calls

### Technical Assumptions
1. **Next.js 13+**: App Router and Server Components support
2. **Tailwind CSS**: Dark mode classes are available
3. **TypeScript**: Strict type checking enabled
4. **React 18+**: Concurrent features and hooks support

## ⚠️ Known Limitations

### Current Limitations

#### 1. **API Dependency**
- **Issue**: Application is tightly coupled to the specific Mastra API endpoint
- **Impact**: Changes to API structure could break functionality
- **Mitigation**: Comprehensive error handling and logging for debugging

#### 2. **Single Agent Support**
- **Issue**: Only supports weather agent, not extensible to other agents
- **Impact**: Limited functionality scope
- **Future Enhancement**: Abstract agent configuration for multiple agents

#### 3. **No Message Persistence**
- **Issue**: Chat history is lost on page refresh
- **Impact**: Poor user experience for long conversations
- **Future Enhancement**: Implement local storage or database persistence

#### 4. **Limited Error Recovery**
- **Issue**: No automatic retry mechanisms for failed requests
- **Impact**: Users must manually retry failed messages
- **Future Enhancement**: Implement exponential backoff retry logic

#### 5. **No Message Search**
- **Issue**: Search functionality exists but no UI implementation
- **Impact**: Users cannot easily find previous messages
- **Future Enhancement**: Add search modal with filtering capabilities

### Performance Limitations

#### 1. **Memory Usage**
- **Issue**: All messages stored in memory indefinitely
- **Impact**: Potential memory leaks with very long conversations
- **Mitigation**: Consider message pagination or cleanup strategies

#### 2. **Streaming Buffer**
- **Issue**: No limits on streaming response size
- **Impact**: Potential memory issues with very large responses
- **Mitigation**: Implement response size limits and chunking

## 🚀 Areas for Improvement

### Short-term Improvements

#### 1. **Enhanced Error Handling**
```typescript
// Implement retry logic with exponential backoff
const retryWithBackoff = async (fn: Function, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}
```

#### 2. **Message Persistence**
- Implement local storage for chat history
- Add database integration for persistent storage
- Implement message synchronization across devices

#### 3. **Search Functionality**
- Add search modal UI component
- Implement message filtering and highlighting
- Add keyboard shortcuts for search

### Medium-term Enhancements

#### 1. **Multi-Agent Support**
```typescript
interface AgentConfig {
  id: string
  name: string
  endpoint: string
  capabilities: string[]
}

const useAgentManager = () => {
  // Agent selection and management logic
}
```

#### 2. **Advanced Streaming**
- Implement message chunking for large responses
- Add streaming progress indicators
- Implement partial message rendering

#### 3. **Accessibility Improvements**
- Add ARIA labels and roles
- Implement keyboard navigation
- Add screen reader support
- Implement focus management

### Long-term Vision

#### 1. **Real-time Collaboration**
- Multi-user chat support
- Message threading and replies
- User presence indicators

#### 2. **AI Integration**
- Multiple AI model support
- Custom prompt templates
- Response customization

#### 3. **Analytics and Monitoring**
- Usage analytics
- Performance monitoring
- Error tracking and reporting

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd weather-agent-chat

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration
```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream
```

## 📚 API Documentation

### Weather Agent API

#### Endpoint
```
POST https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream
```

#### Request Format
```typescript
interface WeatherAgentRequest {
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  runId: string
  maxRetries: number
  maxSteps: number
  temperature: number
  topP: number
  runtimeContext: Record<string, unknown>
  threadId: string
  resourceId: string
}
```

#### Response Format
The API returns a streaming response with the following line formats:
- `f:{"messageId":"..."}` - Message identifier (ignored)
- `0:"content"` - Content chunk
- `e:{"finishReason":"stop"}` - Finish event
- `d:{}` - Final data

## 🤝 Contributing

### Code Standards
- Follow TypeScript strict mode
- Use meaningful variable and function names
- Add JSDoc comments for all public functions
- Maintain consistent code formatting
- Write comprehensive error handling

### Testing
- Unit tests for utility functions
- Integration tests for API communication
- Component tests for UI interactions
- E2E tests for user workflows

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Powered by [Mastra](https://mastra.ai/) weather agent API
