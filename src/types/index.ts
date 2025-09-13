/**
 * Message roles supported by the chat system
 */
export type MessageRole = 'user' | 'assistant'

/**
 * Core message interface representing a single chat message
 */
export interface Message {
	/** Unique identifier for the message */
	id: string
	/** Role of the message sender */
	role: MessageRole
	/** Text content of the message */
	content: string
	/** Timestamp when the message was created */
	timestamp: Date
	/** Whether the message is currently being streamed */
	isStreaming?: boolean
}

/**
 * Complete state of the chat application
 */
export interface ChatState {
	/** Array of all messages in the conversation */
	messages: Message[]
	/** Whether a request is currently in progress */
	isLoading: boolean
	/** Current error message, if any */
	error: string | null
}

/**
 * Request payload for the weather agent API
 */
export interface WeatherAgentRequest {
	/** Conversation history to send to the agent */
	messages: Array<{
		role: MessageRole
		content: string
	}>
	/** Identifier for the agent run */
	runId: string
	/** Maximum number of retry attempts */
	maxRetries: number
	/** Maximum number of processing steps */
	maxSteps: number
	/** Temperature setting for response generation */
	temperature: number
	/** Top-p setting for response generation */
	topP: number
	/** Additional runtime context */
	runtimeContext: Record<string, unknown>
	/** Unique thread identifier */
	threadId: string
	/** Resource identifier for the agent */
	resourceId: string
}

/**
 * Streaming response types from the API
 */
export type StreamingResponseType = 'message' | 'error' | 'finish'

/**
 * Streaming response structure
 */
export interface StreamingResponse {
	type: StreamingResponseType
	data: unknown
}

/**
 * Theme context interface for dark/light mode management
 */
export interface ThemeContextType {
	/** Whether dark mode is currently active */
	isDark: boolean
	/** Function to toggle between dark and light themes */
	toggleTheme: () => void
}

/**
 * Export data structure for chat history
 */
export interface ChatExportData {
	/** ISO timestamp of when the export was created */
	exportDate: string
	/** Array of messages with serialized timestamps */
	messages: Array<{
		role: MessageRole
		content: string
		timestamp: string
	}>
}

