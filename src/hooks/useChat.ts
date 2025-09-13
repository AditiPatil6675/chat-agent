import { useState, useCallback } from 'react'
import { Message, ChatState } from '@/types'
import { sendMessageToWeatherAgent, parseStreamingResponse } from '@/utils/api'

export const useChat = () => {
	const [chatState, setChatState] = useState<ChatState>({
		messages: [],
		isLoading: false,
		error: null
	})

	const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
		const newMessage: Message = {
			...message,
			id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			timestamp: new Date()
		}
		
		console.log('Adding message:', newMessage.id, newMessage.role, newMessage.content)
		
		setChatState(prev => ({
			...prev,
			messages: [...prev.messages, newMessage]
		}))
		
		return newMessage.id
	}, [])

	const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
		console.log('Updating message:', messageId, updates)
		setChatState(prev => ({
			...prev,
			messages: prev.messages.map(msg => 
				msg.id === messageId ? { ...msg, ...updates } : msg
			)
		}))
	}, [])

	const sendMessage = useCallback(async (content: string, threadId?: string) => {
		if (!content.trim() || chatState.isLoading) return

		setChatState(prev => ({ ...prev, isLoading: true, error: null }))

		// Build conversation history BEFORE adding new messages
		const conversationHistory = chatState.messages
			.filter(msg => 
				!msg.content.startsWith('Error:') && 
				msg.content.trim() !== '' && 
				!msg.isStreaming
			)
			.map(msg => ({
				role: msg.role,
				content: msg.content
			}))

		// Add the new user message to conversation history
		conversationHistory.push({
			role: 'user' as const,
			content: content.trim()
		})

		// Add user message to UI
		const userMessageId = addMessage({
			role: 'user',
			content: content.trim()
		})
		console.log('User message ID:', userMessageId)

		// Add assistant message placeholder
		const assistantMessageId = addMessage({
			role: 'assistant',
			content: '',
			isStreaming: true
		})
		console.log('Assistant message ID:', assistantMessageId)

		try {

			const stream = await sendMessageToWeatherAgent(conversationHistory, threadId)
			
			let accumulatedContent = ''

			await parseStreamingResponse(stream, {
				onMessage: (contentChunk: string) => {
					accumulatedContent += contentChunk
					updateMessage(assistantMessageId, {
						content: accumulatedContent,
						isStreaming: true
					})
				},
				onFinish: () => {
					updateMessage(assistantMessageId, {
						content: accumulatedContent,
						isStreaming: false
					})
					setChatState(prev => ({ ...prev, isLoading: false }))
				},
				onError: (error: string) => {
					updateMessage(assistantMessageId, {
						content: `Error: ${error}`,
						isStreaming: false
					})
					setChatState(prev => ({ 
						...prev, 
						isLoading: false, 
						error 
					}))
				}
			})
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
			updateMessage(assistantMessageId, {
				content: `Error: ${errorMessage}`,
				isStreaming: false
			})
			setChatState(prev => ({ 
				...prev, 
				isLoading: false, 
				error: errorMessage 
			}))
		}
	}, [chatState.messages, chatState.isLoading, addMessage, updateMessage])

	const clearChat = useCallback(() => {
		setChatState({
			messages: [],
			isLoading: false,
			error: null
		})
	}, [])

	const searchMessages = useCallback((query: string) => {
		if (!query.trim()) return chatState.messages
		
		return chatState.messages.filter(message =>
			message.content.toLowerCase().includes(query.toLowerCase())
		)
	}, [chatState.messages])

	return {
		...chatState,
		sendMessage,
		clearChat,
		searchMessages,
		addMessage,
		updateMessage
	}
}

