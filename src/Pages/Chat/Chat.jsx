import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { Search, Send, ArrowLeft, MessageCircle, UserRoundPlus, MoreVertical, Trash2 } from 'lucide-react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import socket from '../../Hooks/socket';
import { toast } from 'react-toastify';
import { Avatar, AvatarImage, AvatarFallback } from '../../Components/ui/avatar';
import { Button } from '../../Components/ui/button';
import { Input } from '../../Components/ui/input';
import { Skeleton } from '../../Components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../../Components/ui/dialog';

const avatarUrl = (seed) => `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
const initials = (name) => (name || '?').slice(0, 2).toUpperCase();

const isSameDay = (a, b) =>
    a && b && new Date(a).toDateString() === new Date(b).toDateString();

const dayLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatMessageTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const Chat = () => {
    const axiosSecure = useAxiosSecure();
    const { dbUser } = useAuth();
    const location = useLocation();

    // ── STATE ────────────────────────────────────────────────────────
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [userResults, setUserResults] = useState([]);
    const [userSearching, setUserSearching] = useState(false);

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [conversationsError, setConversationsError] = useState(null);
    const [messagesError, setMessagesError] = useState(null);
    const [mobileView, setMobileView] = useState('list');

    const [openMenuId, setOpenMenuId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const bottomRef = useRef(null);
    const typingTimeout = useRef(null);
    const selectedChatRef = useRef(selectedChat);
    const isEmittingTyping = useRef(false);
    const menuRefs = useRef({});

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        if (location.state?.conversation) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedChat(location.state.conversation);
            setMobileView('chat');
        }
    }, [location.state?.conversation]);

    // ── CLOSE OPEN MENU ON OUTSIDE CLICK ──────────────────────────
    useEffect(() => {
        if (!openMenuId) return;

        const handleClickOutside = (e) => {
            const menuEl = menuRefs.current[openMenuId];
            if (menuEl && !menuEl.contains(e.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    // ── LOAD CONVERSATIONS ON PAGE OPEN ─────────────────────────────
    useEffect(() => {
        axiosSecure.get('/conversations')
            .then(res => {
                setConversations(res.data.data);
                setConversationsError(null);
            })
            .catch(() => setConversationsError('Failed to load conversations. Please refresh.'))
            .finally(() => setLoading(false));
    }, [axiosSecure]);

    // ── USER SEARCH (DEBOUNCED) ──────────────────────────────────────
    useEffect(() => {
        const q = searchQuery.trim();
        if (!q) return;

        const timer = setTimeout(() => {
            setUserSearching(true);
            axiosSecure.get(`/users/search?q=${encodeURIComponent(q)}`)
                .then(res => setUserResults(res.data.data))
                .catch(() => setUserResults([]))
                .finally(() => setUserSearching(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, axiosSecure]);

    // ── WHEN USER CLICKS A CONVERSATION ─────────────────────────────
    useEffect(() => {
        if (!selectedChat) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages([]);
        setMessagesError(null);
        setIsTyping(false);
        setMessage('');
        setMessagesLoading(true);
        axiosSecure.get(`/conversations/${selectedChat.id}/messages`)
            .then(res => {
                setMessages(res.data.data);
                setMessagesError(null);
            })
            .catch(() => setMessagesError('Failed to load messages. Please try again.'))
            .finally(() => setMessagesLoading(false));

        socket.emit('join:conversations', [selectedChat.id]);
        socket.emit('message:read', { conversationId: selectedChat.id });

        setConversations(prev =>
            prev.map(c => c.id === selectedChat.id ? { ...c, unread: 0 } : c)
        );
    }, [axiosSecure, selectedChat]);

    // ── SOCKET EVENT LISTENERS ───────────────────────────────────────
    useEffect(() => {
        socket.on('message:new', (msg) => {
            const current = selectedChatRef.current;
            if (current && msg.conversationId === current.id) {
                setMessages(prev =>
                    prev.some(m => m.id === msg.id) ? prev : [...prev, msg]
                );
                socket.emit('message:read', { conversationId: msg.conversationId });
            } else {
                setConversations(prev =>
                    prev.map(chat =>
                        chat.id === msg.conversationId
                            ? { ...chat, unread: (chat.unread || 0) + 1 }
                            : chat
                    )
                );
            }

            setConversations(prev =>
                prev.map(chat =>
                    chat.id === msg.conversationId
                        ? { ...chat, lastMessage: { content: msg.content, createdAt: msg.createdAt } }
                        : chat
                )
            );
        });

        socket.on('unread:update', ({ conversationId, unread }) => {
            setConversations(prev =>
                prev.map(chat =>
                    chat.id === conversationId ? { ...chat, unread } : chat
                )
            );
        });

        socket.on('typing:start', () => setIsTyping(true));
        socket.on('typing:stop', () => setIsTyping(false));

        socket.on('conversation:deleted', ({ conversationId }) => {
            setConversations(prev => prev.filter(chat => chat.id !== conversationId));
            setSelectedChat(prev => (prev?.id === conversationId ? null : prev));
        });

        return () => {
            socket.off('message:new');
            socket.off('unread:update');
            socket.off('typing:start');
            socket.off('typing:stop');
            socket.off('conversation:deleted');
        };
    }, [selectedChat?.id]);

    // ── AUTO SCROLL ──────────────────────────────────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // ── SEND MESSAGE ─────────────────────────────────────────────────
    const handleSendMessage = () => {
        if (!message.trim() || !selectedChat) return;

        socket.emit('message:send', {
            conversationId: selectedChat.id,
            content: message.trim()
        });

        setMessage('');

        clearTimeout(typingTimeout.current);
        isEmittingTyping.current = false;
        socket.emit('typing:stop', { conversationId: selectedChat.id });
    };

    // ── TYPING INDICATOR ─────────────────────────────────────────────
    const handleTyping = (e) => {
        setMessage(e.target.value);
        if (!selectedChat) return;

        if (!isEmittingTyping.current) {
            socket.emit('typing:start', { conversationId: selectedChat.id });
            isEmittingTyping.current = true;
        }

        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socket.emit('typing:stop', { conversationId: selectedChat.id });
            isEmittingTyping.current = false;
        }, 1500);
    };

    const handleSelectChat = (convo) => {
        setSelectedChat(convo);
        setMobileView('chat');
    };

    const handleDeleteConversation = async () => {
        if (!deleteTarget) return;

        setDeleting(true);
        try {
            await axiosSecure.delete(`/conversations/${deleteTarget.id}`);
            setConversations(prev => prev.filter(c => c.id !== deleteTarget.id));
            if (selectedChat?.id === deleteTarget.id) {
                setSelectedChat(null);
                setMessages([]);
            }
            setDeleteTarget(null);
            setOpenMenuId(null);
            toast.success('Conversation deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete conversation');
        } finally {
            setDeleting(false);
        }
    };

    const handleStartChat = async (user) => {
        try {
            const res = await axiosSecure.post('/conversations', { recipientId: user.id });
            const conversation = res.data.data;
            setConversations(prev =>
                prev.some(c => c.id === conversation.id) ? prev : [conversation, ...prev]
            );
            setSearchQuery('');
            setUserResults([]);
            handleSelectChat(conversation);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to start conversation');
        }
    };

    const handleBack = () => {
        setMobileView('list');
    };

    const filteredChats = conversations.filter(convo =>
        convo.otherUser?.userName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const newUsers = userResults.filter(
        user => user.id !== dbUser?.id && !conversations.some(convo => convo.otherUser?.id === user.id)
    );

    const peerPhoto = (convo) => convo?.otherUser?.photo || avatarUrl(convo?.otherUser?.userName);

    // ── RENDER ───────────────────────────────────────────────────────
    return (
        <div className="mx-auto w-full max-w-6xl px-2 pt-20 pb-6 md:px-4 md:pt-24">
            <Helmet><title>Blabber - Chat</title></Helmet>

            <div className="flex h-[calc(100dvh-10rem)] min-h-[30rem] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm md:flex-row">

                {/* ── CONVERSATIONS SIDEBAR ── */}
                <motion.aside
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`${mobileView === 'chat' ? 'hidden' : 'flex'} w-full shrink-0 flex-col border-b border-border/70 md:flex md:w-80 md:border-b-0 md:border-r lg:w-96`}
                >
                    <div className="border-b border-border/70 p-3 md:p-4">
                        <h2 className="text-lg font-semibold">Messages</h2>
                        <div className="relative mt-3">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        {/* User search results */}
                        {searchQuery.trim() && (
                            <div className="border-b border-border/60">
                                <div className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                                    People
                                </div>
                                {userSearching ? (
                                    <div className="space-y-2 px-3 py-2">
                                        {Array.from({ length: 2 }).map((_, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <Skeleton className="size-10 shrink-0 rounded-full" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        ))}
                                    </div>
                                ) : newUsers.length > 0 ? (
                                    newUsers.map(user => (
                                        <button
                                            type="button"
                                            key={user.id}
                                            onClick={() => handleStartChat(user)}
                                            className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-accent/60 focus-visible:bg-accent/60"
                                        >
                                            <Avatar className="size-10 shrink-0 bg-linear-to-br from-primary/80 to-secondary/80">
                                                <AvatarImage src={user.photo || avatarUrl(user.userName)} alt={user.userName} />
                                                <AvatarFallback>{initials(user.userName)}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold">{user.userName}</p>
                                                <p className="text-xs text-muted-foreground">Start a conversation</p>
                                            </div>
                                            <UserRoundPlus className="size-4 shrink-0 text-muted-foreground" />
                                        </button>
                                    ))
                                ) : (
                                    !userSearching && (
                                        <div className="px-3 py-3 text-xs text-muted-foreground">
                                            No users found
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 border-b border-border/60 px-3 py-3">
                                    <Skeleton className="size-12 shrink-0 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            ))
                        ) : conversationsError ? (
                            <div className="px-4 py-8 text-center text-sm text-destructive">
                                {conversationsError}
                            </div>
                        ) : filteredChats.length === 0 ? (
                            <div className="px-4 py-10 text-center">
                                <p className="text-sm font-medium text-foreground">
                                    {conversations.length === 0 ? 'No conversations yet' : 'No matches'}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {conversations.length === 0
                                        ? 'Open a profile and tap Message to start.'
                                        : 'Try a different name.'}
                                </p>
                            </div>
                        ) : (
                            filteredChats.map((convo) => (
                                <div
                                    key={convo.id}
                                    onClick={() => handleSelectChat(convo)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSelectChat(convo)}
                                    className={`flex w-full cursor-pointer items-center gap-3 border-b border-border/60 px-3 py-3 text-left transition-colors last:border-0 hover:bg-accent/60 focus-visible:bg-accent/60 ${
                                        selectedChat?.id === convo.id ? 'bg-primary/10' : ''
                                    }`}
                                >
                                    <div className="relative shrink-0">
                                        <Avatar
                                            className={`size-12 bg-linear-to-br from-primary/80 to-secondary/80 ${
                                                convo.unread > 0
                                                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                                                    : ''
                                            }`}
                                        >
                                            <AvatarImage src={peerPhoto(convo)} alt={convo.otherUser?.userName} />
                                            <AvatarFallback>{initials(convo.otherUser?.userName)}</AvatarFallback>
                                        </Avatar>
                                        {convo.unread > 0 && (
                                            <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-primary ring-2 ring-card" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <span className="truncate text-sm font-semibold">
                                                {convo.otherUser?.userName}
                                            </span>
                                            <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                                                {formatTime(convo.lastMessage?.createdAt || convo.updatedAt)}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                            {convo.lastMessage?.content || 'No messages yet'}
                                        </p>
                                    </div>

                                    <span
                                        ref={(el) => (menuRefs.current[convo.id] = el)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="relative shrink-0 self-center"
                                    >
                                        <button
                                            type="button"
                                            aria-label={`Options for ${convo.otherUser?.userName}`}
                                            aria-haspopup="menu"
                                            aria-expanded={openMenuId === convo.id}
                                            onClick={() => setOpenMenuId(openMenuId === convo.id ? null : convo.id)}
                                            className="grid size-8 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-none"
                                        >
                                            <MoreVertical className="size-4" />
                                        </button>
                                        {openMenuId === convo.id && (
                                            <div
                                                role="menu"
                                                className="absolute top-full right-full z-20 mr-1 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                                            >
                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    onClick={() => {
                                                        setOpenMenuId(null);
                                                        setDeleteTarget(convo);
                                                    }}
                                                    className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-left text-xs text-destructive transition-colors hover:bg-destructive/10 focus-visible:bg-destructive/10 focus-visible:outline-none"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </motion.aside>

                {/* ── THREAD ── */}
                {selectedChat ? (
                    <motion.div
                        key={selectedChat.id}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`${mobileView === 'list' ? 'hidden' : 'flex'} min-h-0 min-w-0 flex-1 flex-col md:flex`}
                    >
                        {/* Header */}
                        <div className="flex shrink-0 items-center gap-3 border-b border-border/70 p-3 md:p-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={handleBack}
                                aria-label="Back to conversations"
                            >
                                <ArrowLeft />
                            </Button>
                            <Avatar className="size-10 shrink-0 bg-linear-to-br from-primary/80 to-secondary/80">
                                <AvatarImage src={peerPhoto(selectedChat)} alt={selectedChat.otherUser?.userName} />
                                <AvatarFallback>{initials(selectedChat.otherUser?.userName)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                    {selectedChat.otherUser?.userName}
                                </p>
                                <p className="min-h-4 text-xs text-muted-foreground">
                                    {isTyping && <span className="animate-pulse">typing…</span>}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-6">
                            {messagesError ? (
                                <div className="flex h-full items-center justify-center">
                                    <p className="text-sm text-destructive">{messagesError}</p>
                                </div>
                            ) : messagesLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-end gap-2 ${i % 2 ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {i % 2 === 0 && <Skeleton className="size-7 shrink-0 rounded-full" />}
                                            <Skeleton className={`h-10 rounded-2xl ${i % 2 ? 'w-1/2' : 'w-2/3'}`} />
                                        </div>
                                    ))}
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex h-full items-center justify-center p-6">
                                    <div className="text-center">
                                        <div className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-muted">
                                            <MessageCircle className="size-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium">No messages yet</p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Say hello to {selectedChat.otherUser?.userName} to start.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                (() => {
                                    let prevDate = null;
                                    let prevSender = null;
                                    return messages.map((msg) => {
                                        const isOwn = msg.senderId === dbUser?.id;
                                        const firstOfDay = !prevDate || !isSameDay(prevDate, msg.createdAt);
                                        const firstOfGroup = firstOfDay || !prevSender || prevSender !== msg.senderId;
                                        prevDate = msg.createdAt;
                                        prevSender = msg.senderId;

                                        return (
                                            <React.Fragment key={msg.id}>
                                                {firstOfDay && (
                                                    <div className="my-3 flex justify-center">
                                                        <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
                                                            {dayLabel(msg.createdAt)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className={`my-1 flex items-end gap-2 ${firstOfGroup ? 'mt-2.5' : ''} ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                    {!isOwn &&
                                                        (firstOfGroup ? (
                                                            <Avatar className="size-7 shrink-0 bg-linear-to-br from-primary/70 to-secondary/70">
                                                                <AvatarImage src={peerPhoto(selectedChat)} alt={selectedChat.otherUser?.userName} />
                                                                <AvatarFallback>{initials(selectedChat.otherUser?.userName)}</AvatarFallback>
                                                            </Avatar>
                                                        ) : (
                                                            <span className="w-7 shrink-0" />
                                                        ))}
                                                    <div
                                                        className={`max-w-[75%] px-3.5 py-2 text-sm break-words ${
                                                            isOwn
                                                                ? 'rounded-2xl rounded-br-md bg-primary text-primary-foreground'
                                                                : 'rounded-2xl rounded-bl-md bg-muted text-foreground'
                                                        }`}
                                                    >
                                                        <p>{msg.content}</p>
                                                        <p className={`mt-1 text-[9px] tabular-nums ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                            {formatMessageTime(msg.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    });
                                })()
                            )}

                            {isTyping && (
                                <div className="mt-2 flex items-end gap-2">
                                    <Avatar className="size-7 shrink-0 bg-linear-to-br from-primary/70 to-secondary/70">
                                        <AvatarImage src={peerPhoto(selectedChat)} alt={selectedChat.otherUser?.userName} />
                                        <AvatarFallback>{initials(selectedChat.otherUser?.userName)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                                        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                                        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                                        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            )}

                            <div ref={bottomRef} />
                        </div>

                        {/* Composer */}
                        <div className="shrink-0 border-t border-border/70 p-3 md:p-4">
                            <div className="flex items-end gap-2 rounded-2xl border border-input bg-background p-2 pl-4 transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40">
                                <input
                                    type="text"
                                    placeholder="Type a message…"
                                    value={message}
                                    onChange={handleTyping}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    maxLength={500}
                                    className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                                />
                                <Button
                                    size="icon"
                                    className="rounded-full"
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                    aria-label="Send message"
                                >
                                    <Send />
                                </Button>
                            </div>
                            <p className="mt-2 text-right text-[11px] text-muted-foreground tabular-nums">
                                {message.length}/500
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="hidden flex-1 items-center justify-center md:flex">
                        <div className="px-6 text-center">
                            <div className="mx-auto mb-3 grid size-16 place-items-center rounded-2xl bg-muted">
                                <MessageCircle className="size-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-base font-semibold">Pick a conversation</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Your messages appear here.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── DELETE CONVERSATION CONFIRM ── */}
            <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete conversation?</DialogTitle>
                        <DialogDescription>
                            Delete the conversation with {deleteTarget?.otherUser?.userName}? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConversation} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Chat;
