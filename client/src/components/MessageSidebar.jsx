"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../redux/slices/messageSlice";
import MessageItem from "./MessageItem";
import Loader from "./Loader";
import { FaComments, FaSearch } from "react-icons/fa";

const MessageSidebar = ({ activeUserId }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { conversations, loading } = useSelector((state) => state.messages);
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    dispatch(getConversations());

    // Force hide loader after 0.4s for extra fast feel
    const timer = setTimeout(() => setDelayedLoading(false), 400);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r dark:border-slate-800">
      <div className="p-4 border-b dark:border-slate-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Chats</h2>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search or start a new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700/50 focus:border-emerald-500 focus:ring-0 outline-none rounded-xl text-xs transition-all dark:text-white"
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {delayedLoading && loading && conversations.length === 0 ? (
          <div className="p-4"><Loader /></div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <div 
              key={conversation.user._id}
              className={`${activeUserId === conversation.user._id ? "bg-emerald-50 dark:bg-slate-800" : ""} rounded-xl transition-colors`}
            >
              <MessageItem conversation={conversation} />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageSidebar;
