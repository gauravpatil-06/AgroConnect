/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  clearConversation,
} from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import { FaArrowLeft, FaPaperPlane, FaTrash } from "react-icons/fa";
import { IoCheckmarkDone } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import MessageSidebar from "../components/MessageSidebar";

const ConversationPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const prevMessagesLength = useRef(0);

  const [newMessage, setNewMessage] = useState("");
  const [showClearModal, setShowClearModal] = useState(false);
  const { messages, loading } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  const conversationMessages = messages[userId] || [];

  useEffect(() => {
    dispatch(getConversationMessages(userId));
    dispatch(markMessagesAsRead(userId));

    // Poll for new messages every 5 seconds for "real-time" feel without Socket.io
    const interval = setInterval(() => {
      dispatch(getConversationMessages(userId));
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, userId]);

  useEffect(() => {
    // Only scroll to bottom if message length increased (prevents jumping on every re-render/poll)
    if (conversationMessages.length > prevMessagesLength.current) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
      prevMessagesLength.current = conversationMessages.length;
    }
  }, [conversationMessages.length]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    dispatch(
      sendMessage({
        receiver: userId,
        content: newMessage,
      })
    );
    setNewMessage("");
  };

  const handleClearChat = () => {
    dispatch(clearConversation(userId));
    setShowClearModal(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] pb-10 md:pb-0">
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] flex overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on tablet+ */}
        <div className="hidden md:block w-full md:w-[380px] lg:w-[420px] flex-shrink-0">
          <MessageSidebar activeUserId={userId} />
        </div>

        {/* Conversation Detail Area */}
        <div className="flex-grow flex flex-col bg-white dark:bg-slate-900 border-none md:border-l dark:border-slate-800 relative h-[calc(100vh-64px)] md:h-full w-full max-w-full">

          {/* custom clear chat modal */}
          <AnimatePresence>
            {showClearModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-[320px] w-full overflow-hidden"
                >
                  <div className="p-6 text-center border-b border-gray-100 dark:border-slate-700">
                    <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaTrash className="text-rose-500 text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Clear Chat?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to clear this chat history? This will only clear it for you.
                    </p>
                  </div>
                  <div className="flex p-3 gap-2 bg-gray-50 dark:bg-slate-900/50">
                    <button
                      onClick={() => setShowClearModal(false)}
                      className="flex-1 px-4 py-2.5 text-xs bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all border border-gray-200 dark:border-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearChat}
                      className="flex-1 px-4 py-2.5 text-xs bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-md shadow-rose-200 dark:shadow-none cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="bg-emerald-600 text-white p-3 flex items-center justify-between shrink-0 shadow-sm z-10 w-full relative">
            <div className="flex items-center gap-3">
              <Link
                to="/messages"
                className="md:hidden flex items-center justify-center p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <FaArrowLeft />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold flex-shrink-0 overflow-hidden border border-white/30">
                  {conversationMessages.length > 0 ? (
                    (() => {
                      const otherUser = (conversationMessages[0].sender._id === user._id || conversationMessages[0].sender === user._id)
                        ? conversationMessages[0].receiver
                        : conversationMessages[0].sender;
                      
                      return otherUser.profileImage ? (
                        <img 
                          src={otherUser.profileImage.startsWith('data:image') || otherUser.profileImage.startsWith('http') 
                            ? otherUser.profileImage 
                            : `${import.meta.env.VITE_BACKEND_URL}${otherUser.profileImage}`} 
                          alt={otherUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{otherUser.name.charAt(0)}</span>
                      );
                    })()
                  ) : (
                    "C"
                  )}
                </div>
                <h2 className="text-lg font-semibold truncate sm:max-w-[400px]">
                  {conversationMessages.length > 0
                    ? (conversationMessages[0].sender._id === user._id || conversationMessages[0].sender === user._id)
                      ? conversationMessages[0].receiver.name
                      : conversationMessages[0].sender.name
                    : "Conversation"}
                </h2>
              </div>
            </div>
            <button
              onClick={() => setShowClearModal(true)}
              className="flex flex-shrink-0 items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/40 transition-all active:scale-95 shadow-sm"
              title="clear my chat history"
            >
              <FaTrash size={12} />
              <span className="hidden sm:inline-block">clear chat</span>
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollContainerRef}
            className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-slate-900 custom-scrollbar w-full"
          >
            {conversationMessages.length > 0 ? (
              <div className="space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender._id === user._id
                        ? "justify-end"
                        : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg py-1.5 px-3 ${(message.sender._id === user._id || message.sender === user._id)
                          ? "bg-green-500 text-white rounded-tr-none"
                          : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/50 text-slate-800 dark:text-gray-200 rounded-tl-none"
                        }`}
                    >
                      <p className="mb-0">{message.content}</p>
                      <div className="flex items-center justify-end space-x-1 mt-0.5">
                        <span
                          className={`text-[10px] ${(message.sender._id === user._id || message.sender === user._id)
                              ? "text-emerald-100/80"
                              : "text-gray-500"
                            }`}
                        >
                          {formatTime(message.createdAt)}
                        </span>
                        {(message.sender._id === user._id || message.sender === user._id) && (
                          <IoCheckmarkDone
                            size={14}
                            className={`${message.isRead ? "text-emerald-200" : "text-white/30"}`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">
                  No messages yet. Start the conversation!
                </p>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t dark:border-slate-700 shrink-0 w-full relative">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 w-full">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700/50 focus:border-emerald-500 focus:ring-0 outline-none rounded-xl px-5 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 transition-all shadow-sm"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:grayscale shrink-0"
                disabled={newMessage.trim() === ""}
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
