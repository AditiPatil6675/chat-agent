import React from 'react'
import { Message as MessageType } from '@/types'
import { User, Bot, Clock } from 'lucide-react'

interface MessageProps {
	message: MessageType
}

export const Message: React.FC<MessageProps> = ({ message }) => {
	const isUser = message.role === 'user'
	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}

	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
			<div className={`max-w-[80%] px-4 py-3 rounded-lg ${
				isUser
					? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
					: 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
			}`}>
				<p className="text-sm leading-relaxed whitespace-pre-wrap">
					{message.content}
					{message.isStreaming && (
						<span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
					)}
				</p>
			</div>
		</div>
	)
}

