import { Link } from "react-router-dom"
import { FaCircle } from "react-icons/fa"

const MessageItem = ({ conversation }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { 
        hour: "numeric", 
        minute: "2-digit", 
        hour12: true 
      })
    }

    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }

    // Otherwise show full date
    return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <Link to={`/messages/${conversation.user._id}`} className="block">
      <div className="card p-4 mb-4 hover:bg-gray-50 dark:hover:bg-emerald-500/10 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-emerald-50 dark:border-slate-700 shadow-sm shrink-0">
              {conversation.user.profileImage ? (
                <img
                  src={conversation.user.profileImage.startsWith('data:image') || conversation.user.profileImage.startsWith('http') 
                    ? conversation.user.profileImage 
                    : `${import.meta.env.VITE_BACKEND_URL}${conversation.user.profileImage}`}
                  alt={conversation.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                  {conversation.user.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{conversation.user.name}</h3>
                <span className="text-xs text-gray-500 capitalize">({conversation.user.role})</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">{conversation.lastMessage.content}</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 mb-1">{formatDate(conversation.lastMessage.createdAt)}</span>
            {conversation.unreadCount > 0 && (
              <div className="flex items-center space-x-1">
                <FaCircle className="text-green-500 text-xs" />
                <span className="text-xs font-medium">{conversation.unreadCount} new</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MessageItem
