import React, { useState, useEffect } from 'react'
import { Search, X, Clock } from 'lucide-react'
import { Message as MessageType } from '@/types'

interface SearchModalProps {
	isOpen: boolean
	onClose: () => void
	messages: MessageType[]
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, messages }) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState<MessageType[]>([])

	useEffect(() => {
		if (searchQuery.trim()) {
			const results = messages.filter(message =>
				message.content.toLowerCase().includes(searchQuery.toLowerCase())
			)
			setSearchResults(results)
		} else {
			setSearchResults([])
		}
	}, [searchQuery, messages])

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Search Messages
					</h2>
					<button
						onClick={onClose}
						className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				{/* Search Input */}
				<div className="p-6 border-b border-gray-200 dark:border-gray-700">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search in messages..."
							className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
							autoFocus
						/>
					</div>
				</div>

				{/* Results */}
				<div className="flex-1 overflow-y-auto p-6">
					{searchQuery.trim() ? (
						searchResults.length > 0 ? (
							<div className="space-y-4">
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
								</p>
								{searchResults.map((message) => (
									<div
										key={message.id}
										className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
									>
										<div className="flex items-center justify-between mb-2">
											<span className={`text-sm font-medium ${
												message.role === 'user' 
													? 'text-blue-600 dark:text-blue-400' 
													: 'text-green-600 dark:text-green-400'
											}`}>
												{message.role === 'user' ? 'You' : 'Weather Agent'}
											</span>
											<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
												<Clock size={12} />
												<span>{formatTime(message.timestamp)}</span>
											</div>
										</div>
										<p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
											{message.content}
										</p>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8">
								<Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-600 dark:text-gray-400">
									No messages found matching "{searchQuery}"
								</p>
							</div>
						)
					) : (
						<div className="text-center py-8">
							<Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-600 dark:text-gray-400">
								Enter a search term to find messages
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

