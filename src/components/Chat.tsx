'use client'

import React from 'react'
import { useChat } from '@/hooks/useChat'
import { useThemeState } from '@/hooks/useTheme'
import { MessagesList } from './MessagesList'
import { MessageInput } from './MessageInput'
import { ChatExportData } from '@/types'

/**
 * Main Chat component that orchestrates the entire chat interface
 * Handles theme management, message handling, and export functionality
 */
export const Chat: React.FC = () => {
	// Theme management hook
	const { isDark, toggleTheme } = useThemeState()
	
	// Chat state and functionality hook
	const {
		messages,
		isLoading,
		error,
		sendMessage
	} = useChat()

	/**
	 * Exports the current chat history as a JSON file
	 * Creates a downloadable file with all messages and metadata
	 */
	const handleExportChat = (): void => {
		const chatData: ChatExportData = {
			exportDate: new Date().toISOString(),
			messages: messages.map(msg => ({
				role: msg.role,
				content: msg.content,
				timestamp: msg.timestamp.toISOString()
			}))
		}

		// Create and download the JSON file
		const blob = new Blob([JSON.stringify(chatData, null, 2)], {
			type: 'application/json'
		})
		
		const url = URL.createObjectURL(blob)
		const downloadLink = document.createElement('a')
		downloadLink.href = url
		downloadLink.download = `weather-chat-${new Date().toISOString().split('T')[0]}.json`
		
		// Trigger download
		document.body.appendChild(downloadLink)
		downloadLink.click()
		document.body.removeChild(downloadLink)
		
		// Clean up the object URL
		URL.revokeObjectURL(url)
	}

	return (
		<div className="flex flex-col h-screen bg-white dark:bg-gray-900">
			{/* Simple header with controls */}
			<div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
				<h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Weather Chat</h1>
				<div className="flex gap-2">
					<button
						onClick={handleExportChat}
						className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					>
						Export
					</button>
					<button
						onClick={toggleTheme}
						className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					>
						{isDark ? (
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						) : (
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
							</svg>
						)}
					</button>
				</div>
			</div>

			<MessagesList messages={messages} isLoading={isLoading} />

			{error && (
				<div className="px-4 py-2 text-red-600 dark:text-red-400 text-sm">
					Error: {error}
				</div>
			)}

			<MessageInput
				onSendMessage={sendMessage}
				isLoading={isLoading}
				placeholder="Ask about the weather..."
			/>
		</div>
	)
}

