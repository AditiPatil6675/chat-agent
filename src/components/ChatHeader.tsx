import React from 'react'
import { Sun, Moon, Trash2, Search, Download } from 'lucide-react'

interface ChatHeaderProps {
	isDark: boolean
	onToggleTheme: () => void
	onClearChat: () => void
	onSearch?: () => void
	onExport?: () => void
	messageCount: number
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
	isDark,
	onToggleTheme,
	onClearChat,
	onSearch,
	onExport,
	messageCount
}) => {
	return (
		<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
					<Sun className="w-5 h-5 text-white" />
				</div>
				<div>
					<h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						Weather Agent
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{messageCount} messages
					</p>
				</div>
			</div>

			<div className="flex items-center gap-2">
				{onSearch && (
					<button
						onClick={onSearch}
						className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
						title="Search messages"
					>
						<Search size={18} />
					</button>
				)}
				
				{onExport && (
					<button
						onClick={onExport}
						className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
						title="Export chat"
					>
						<Download size={18} />
					</button>
				)}

				<button
					onClick={onClearChat}
					className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
					title="Clear chat"
				>
					<Trash2 size={18} />
				</button>

				<button
					onClick={onToggleTheme}
					className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
					title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
				>
					{isDark ? <Sun size={18} /> : <Moon size={18} />}
				</button>
			</div>
		</div>
	)
}

