import React, { useState, useEffect, useRef } from 'react';
import { IoSearch, IoSendSharp, IoArrowBack } from 'react-icons/io5';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import socket from '../../Hooks/socket';
import { useLocation } from 'react-router';

const Chat = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();  // gives us user.uid to check if message is ours
    const location = useLocation();
    // ── STATE ────────────────────────────────────────────────────────
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);

    // FIX 2: error state for user-facing feedback
    const [conversationsError, setConversationsError] = useState(null);
    const [messagesError, setMessagesError] = useState(null);

    // FIX 6: mobile view toggle — 'list' shows sidebar, 'chat' shows window
    const [mobileView, setMobileView] = useState('list');

    const bottomRef = useRef(null);
    const typingTimeout = useRef(null);
    useEffect(() => {
        if (location.state?.conversation) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedChat(location.state.conversation);
            setMobileView('chat');
        }
    }, [location.state?.conversation]);
    // FIX 1: ref mirror of selectedChat to avoid stale closures in socket handlers
    const selectedChatRef = useRef(selectedChat);
    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    // FIX 5: track whether we are already in a "typing" session to throttle emissions
    const isEmittingTyping = useRef(false);

    // ── LOAD CONVERSATIONS ON PAGE OPEN ─────────────────────────────
    useEffect(() => {
        axiosSecure.get('/conversations')
            .then(res => {
                setConversations(res.data);
                setConversationsError(null);
            })
            // FIX 2: catch and surface errors instead of swallowing them
            .catch(() => setConversationsError('Failed to load conversations. Please refresh.'))
            .finally(() => setLoading(false));
    }, [axiosSecure]);

    // ── WHEN USER CLICKS A CONVERSATION ─────────────────────────────
    useEffect(() => {
        if (!selectedChat) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages([]);
        setMessagesError(null);
        setIsTyping(false);
        setMessage('');
        axiosSecure.get(`/conversations/${selectedChat._id}/messages`)
            .then(res => {
                setMessages(res.data);
                setMessagesError(null);
            })
            // FIX 2: catch message history failures
            .catch(() => setMessagesError('Failed to load messages. Please try again.'));

        socket.emit('join:conversations', [selectedChat._id]);
        socket.emit('message:read', { conversationId: selectedChat._id });

        setConversations(prev =>
            prev.map(c => c._id === selectedChat._id ? { ...c, unread: 0 } : c)
        );
    }, [axiosSecure, selectedChat]);

    // ── SOCKET EVENT LISTENERS ───────────────────────────────────────
    useEffect(() => {
        socket.on('message:new', (msg) => {
            const current = selectedChatRef.current;
            if (current && msg.conversationId === current._id) {
                setMessages(prev => [...prev, msg]);
                socket.emit('message:read', { conversationId: msg.conversationId });
            } else {
                setConversations(prev =>
                    prev.map(chat =>
                        chat._id === msg.conversationId
                            ? { ...chat, unread: (chat.unread || 0) + 1 }
                            : chat
                    )
                );
            }

            setConversations(prev =>
                prev.map(chat =>
                    chat._id === msg.conversationId
                        ? { ...chat, lastMessage: { content: msg.content, createdAt: msg.createdAt } }
                        : chat
                )
            );
        });

        socket.on('typing:start', () => setIsTyping(true));
        socket.on('typing:stop', () => setIsTyping(false));

        return () => {
            socket.off('message:new');
            socket.off('typing:start');
            socket.off('typing:stop');
        };
    }, [selectedChat?._id]);

    // ── AUTO SCROLL ──────────────────────────────────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // ── SEND MESSAGE ─────────────────────────────────────────────────
    const handleSendMessage = () => {
        if (!message.trim() || !selectedChat) return;

        socket.emit('message:send', {
            conversationId: selectedChat._id,
            content: message.trim()
        });

        setMessage('');

        clearTimeout(typingTimeout.current);
        // FIX 5: reset typing session flag when message is sent
        isEmittingTyping.current = false;
        socket.emit('typing:stop', { conversationId: selectedChat._id });
    };

    // ── TYPING INDICATOR ─────────────────────────────────────────────
    const handleTyping = (e) => {
        setMessage(e.target.value);
        if (!selectedChat) return;

        // FIX 5: only emit typing:start once per typing session, not on every keystroke
        if (!isEmittingTyping.current) {
            socket.emit('typing:start', { conversationId: selectedChat._id });
            isEmittingTyping.current = true;
        }

        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socket.emit('typing:stop', { conversationId: selectedChat._id });
            // reset so next typing session emits typing:start again
            isEmittingTyping.current = false;
        }, 1500);
    };

    // ── FORMAT TIMESTAMP ─────────────────────────────────────────────
    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        return isToday
            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const filteredChats = conversations.filter(convo =>
        convo.otherUser?.userName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // FIX 6: select a conversation and switch to chat view on mobile
    const handleSelectChat = (convo) => {
        setSelectedChat(convo);
        setMobileView('chat');
    };

    // FIX 6: go back to conversation list on mobile
    const handleBack = () => {
        setMobileView('list');
    };

    // ── RENDER ───────────────────────────────────────────────────────
    return (
        <div className="fixed inset-x-0 top-18 bottom-0 overflow-hidden">
            <div className="max-w-6xl mx-auto h-full overflow-hidden">
                <Helmet><title>Blabber - Chat</title></Helmet>
                <div className="flex h-full gap-4 px-4 pt-4 pb-0 overflow-hidden">

                    {/* ── SIDEBAR ── */}
                    {/* FIX 6: on mobile, hide sidebar when a chat is open */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex w-full md:w-80 bg-white/8 backdrop-blur-2 border border-white/20 rounded-xl overflow-hidden flex-col`}
                    >
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-xl font-bold mb-4">Messages</h2>
                            <div className="relative">
                                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
                            ) : conversationsError ? (
                                // FIX 2: show error message if conversations failed to load
                                <div className="p-4 text-center text-red-400 text-sm">{conversationsError}</div>
                            ) : (
                                <AnimatePresence>
                                    {filteredChats.length > 0 ? filteredChats.map((convo) => (
                                        <motion.div
                                            key={convo._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            // FIX 6: use handleSelectChat instead of setSelectedChat directly
                                            onClick={() => handleSelectChat(convo)}
                                            className={`p-3 border-b border-white/5 cursor-pointer transition ${selectedChat?._id === convo._id
                                                ? 'bg-primary/20 border-primary/30'
                                                : 'hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                                                    <img
                                                        src={convo.otherUser?.photo ||
                                                            `https://api.dicebear.com/7.x/initials/svg?seed=${convo.otherUser?.userName}`}
                                                        alt={convo.otherUser?.userName}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold text-sm">{convo.otherUser?.userName}</h3>
                                                        <span className="text-xs opacity-60">
                                                            {formatTime(convo.lastMessage?.createdAt || convo.updatedAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs opacity-60 truncate">
                                                        {convo.lastMessage?.content || 'No messages yet'}
                                                    </p>
                                                </div>
                                                {convo.unread > 0 && (
                                                    <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                        {convo.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="p-4 text-center text-gray-400">
                                            <p>No conversations found</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>

                    {/* ── CHAT WINDOW ── */}
                    {selectedChat ? (
                        <motion.div
                            key={selectedChat._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            // FIX 6: on mobile, show chat when mobileView === 'chat', always show on md+
                            className={`${mobileView === 'list' ? 'hidden' : 'flex'} md:flex flex-1 min-h-0 bg-white/8 backdrop-blur-2 border border-white/20 rounded-xl overflow-hidden flex-col`}
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center gap-3">
                                {/* FIX 6: back button visible only on mobile */}
                                <button
                                    onClick={handleBack}
                                    className="md:hidden text-white/70 hover:text-white transition mr-1"
                                    aria-label="Back to conversations"
                                >
                                    <IoArrowBack size={20} />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                                    <img
                                        src={selectedChat.otherUser?.photo ||
                                            `https://api.dicebear.com/7.x/initials/svg?seed=${selectedChat.otherUser?.userName}`}
                                        alt={selectedChat.otherUser?.userName}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{selectedChat.otherUser?.userName}</h3>
                                    {/* {isTyping
                                    ? <p className="text-xs text-primary animate-pulse">typing...</p>
                                    : <p className="text-xs opacity-60"></p>
                                } */}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                                {/* FIX 2: show error if messages failed to load */}
                                {messagesError ? (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-red-400 text-sm">{messagesError}</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    // FIX 7: empty messages state
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-sm opacity-40">No messages yet. Say hello! 👋</p>
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {messages.map((msg) => {
                                            const isOwn = msg.sender === user.uid;
                                            return (
                                                <motion.div
                                                    key={msg._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-xs px-4 py-2 rounded-lg wrap-break-word ${isOwn
                                                        ? 'bg-primary text-white rounded-br-none'
                                                        : 'bg-white/10 text-white rounded-bl-none'
                                                        }`}>
                                                        <p className="text-sm">{msg.content}</p>
                                                        <p className={`text-xs mt-1 ${isOwn ? 'opacity-70' : 'opacity-60'}`}>
                                                            {formatTime(msg.createdAt)}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                )}

                                {/* Animated typing bubble */}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-white/10 px-4 py-3 rounded-lg rounded-bl-none">
                                            <div className="flex gap-1 items-center">
                                                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0ms]" />
                                                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:150ms]" />
                                                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:300ms]" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div ref={bottomRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-white/10">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={message}
                                        onChange={handleTyping}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        maxLength={500}
                                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!message.trim()}
                                        className="bg-primary hover:bg-primary/80 disabled:opacity-50 text-white rounded-lg p-2 transition flex items-center justify-center"
                                        aria-label="Send message"
                                    >
                                        <IoSendSharp size={20} />
                                    </button>
                                </div>
                                <p className="text-xs opacity-50 mt-2">{message.length}/500</p>
                            </div>
                        </motion.div>
                    ) : (
                        // Empty state — only visible on md+ since on mobile you only see the sidebar
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hidden md:flex flex-1 bg-white/8 backdrop-blur-2 border border-white/20 rounded-xl flex-col items-center justify-center"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                                    <IoSendSharp size={32} className="opacity-50" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                                <p className="text-sm opacity-60">Choose a conversation from the sidebar to start chatting</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;