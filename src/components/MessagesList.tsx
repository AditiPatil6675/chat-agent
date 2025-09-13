import React, { useEffect, useRef } from 'react'
import { Message } from './Message'
import { Message as MessageType } from '@/types'

interface MessagesListProps {
	messages: MessageType[]
	isLoading: boolean
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages, isLoading }) => {
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	if (messages.length === 0) {
		return <div className="flex-1" />
	}

	return (
		<div className="flex-1 overflow-y-auto p-4 space-y-4">
			{messages.map((message) => (
				<Message key={message.id} message={message} />
			))}
			
			{/* Loading indicator */}
			{isLoading && (
				<div className="flex justify-start">
					<div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg">
						<div className="flex space-x-1">
							<div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
							<div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
							<div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
						</div>
					</div>
				</div>
			)}
			
			<div ref={messagesEndRef} />
		</div>
	)
}

