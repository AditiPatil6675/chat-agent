import { WeatherAgentRequest, MessageRole } from '@/types'

/**
 * Base URL for the weather agent API endpoint
 */
const API_BASE_URL = 'https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream'

/**
 * Generates a unique thread ID for conversation tracking
 * @returns A unique thread identifier string
 */
const generateThreadId = (): string => {
	const timestamp = Date.now()
	const randomSuffix = Math.random().toString(36).substring(2, 11)
	return `thread-${timestamp}-${randomSuffix}`
}

/**
 * Sends a message to the weather agent API and returns a streaming response
 * @param messages - Array of conversation messages to send
 * @param threadId - Optional thread ID for conversation continuity
 * @returns Promise resolving to a ReadableStream for streaming responses
 * @throws Error if the API request fails or returns an error status
 */
export const sendMessageToWeatherAgent = async (
	messages: Array<{ role: MessageRole; content: string }>,
	threadId: string = generateThreadId()
): Promise<ReadableStream<Uint8Array>> => {
	const requestBody: WeatherAgentRequest = {
		messages,
		runId: 'weatherAgent',
		maxRetries: 2,
		maxSteps: 5,
		temperature: 0.5,
		topP: 1,
		runtimeContext: {},
		threadId,
		resourceId: 'weatherAgent'
	}

	console.log('Sending request to:', API_BASE_URL)
	console.log('Request payload:', JSON.stringify(requestBody, null, 2))

	const response = await fetch(API_BASE_URL, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	})

	console.log('Response status:', response.status)
	console.log('Response headers:', Object.fromEntries(response.headers.entries()))

	if (!response.ok) {
		const errorText = await response.text()
		console.error('Error response:', errorText)
		throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
	}

	if (!response.body) {
		throw new Error('No response body')
	}

	return response.body
}

/**
 * Callback functions for handling streaming response events
 */
interface StreamingCallbacks {
	/** Called when new content is received */
	onMessage: (content: string) => void
	/** Called when the stream finishes successfully */
	onFinish: () => void
	/** Called when an error occurs during streaming */
	onError: (error: string) => void
}

/**
 * Parses a streaming response from the weather agent API
 * Handles different response formats and manages the stream lifecycle
 * @param stream - The ReadableStream from the API response
 * @param callbacks - Object containing callback functions for different events
 */
export const parseStreamingResponse = async (
	stream: ReadableStream<Uint8Array>,
	callbacks: StreamingCallbacks
): Promise<void> => {
	const { onMessage, onFinish, onError } = callbacks
	const reader = stream.getReader()
	const decoder = new TextDecoder()

	try {
		while (true) {
			const { done, value } = await reader.read()
			
			if (done) {
				onFinish()
				break
			}

			const chunk = decoder.decode(value, { stream: true })
			const lines = chunk.split('\n')

			for (const line of lines) {
				if (line.trim() === '') continue
				
				try {
					await processStreamLine(line, onMessage, onFinish)
				} catch (parseError) {
					console.warn('Failed to parse stream line:', line, parseError)
					// Continue processing other lines even if one fails
				}
			}
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown streaming error occurred'
		onError(errorMessage)
	} finally {
		reader.releaseLock()
	}
}

/**
 * Processes a single line from the streaming response
 * @param line - The line to process
 * @param onMessage - Callback for content messages
 * @param onFinish - Callback for finish events
 */
const processStreamLine = async (
	line: string,
	onMessage: (content: string) => void,
	onFinish: () => void
): Promise<void> => {
	// Handle different response formats based on the API response structure
	if (line.startsWith('f:')) {
		// Handle messageId format - skip these lines
		const messageData = line.substring(2)
		const parsed = JSON.parse(messageData)
		if (parsed.messageId) {
			return // Skip messageId lines
		}
	} else if (line.startsWith('0:')) {
		// Handle content chunks
		const content = line.substring(2).replace(/"/g, '')
		if (content.trim()) {
			onMessage(content)
		}
	} else if (line.startsWith('e:')) {
		// Handle finish event
		const finishData = line.substring(2)
		const parsed = JSON.parse(finishData)
		if (parsed.finishReason === 'stop') {
			onFinish()
			return
		}
	} else if (line.startsWith('d:')) {
		// Handle final data
		onFinish()
		return
	}
}

