import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface MessageInputProps {
	onSendMessage: (message: string) => void
	isLoading: boolean
	placeholder?: string
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
	onSendMessage, 
	isLoading, 
	placeholder = "Ask about the weather..." 
}) => {
	const [message, setMessage] = useState('')
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (message.trim() && !isLoading) {
			onSendMessage(message.trim())
			setMessage('')
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit(e)
		}
	}

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		}
	}, [message])

	return (
		<div className="p-4">
			<form onSubmit={handleSubmit} className="flex gap-2 items-center">
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder={placeholder}
					disabled={isLoading}
					className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
				/>
				
				<button
					type="submit"
					disabled={!message.trim() || isLoading}
					className="w-10 h-10 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors disabled:cursor-not-allowed"
				>
					{isLoading ? (
						<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
					) : (
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
						</svg>
					)}
				</button>
			</form>
		</div>
	)
}

