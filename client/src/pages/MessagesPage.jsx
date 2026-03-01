"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../redux/slices/messageSlice";
import MessageItem from "../components/MessageItem";
import Loader from "../components/Loader";
import { FaComments } from "react-icons/fa";
import PageContainer from "../components/PageContainer";

import MessageSidebar from "../components/MessageSidebar";

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { conversations, loading } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] pb-10 md:pb-0">
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-64px)] flex overflow-hidden">
        {/* Conversations List - Full width on mobile, 350px on desktop */}
        <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0">
          <MessageSidebar />
        </div>

        {/* Placeholder for Conversation Detail on Desktop */}
        <div className="hidden md:flex flex-grow bg-white dark:bg-slate-900 items-center justify-center border-l dark:border-slate-800">
          <div className="text-center p-8 max-w-sm">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaComments className="text-emerald-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Your Messages
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              select a conversation to view and send messages. direct communication with farmers and consumers helps build trust and improve business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
