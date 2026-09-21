import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMessages,
  deleteMessage,
  replyToMessage,
  updateMessageStatus,
} from "../api/adminApi";
import {
  Mail,
  Trash2,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Search,
  Star,
  Send,
  Paperclip,
  Clock,
  MessageSquare,
  Sparkles,
  Inbox,
  Reply,
  ExternalLink,
} from "lucide-react";

/**
 * Visitor Messages Inbox:
 * - Dynamic metrics based on actual messages
 * - Empty state with generic notice when no messages are found
 * - Real dynamic communication: sends replies via backend SMTP and stores thread history
 */
const MessagesInbox = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [starredIds, setStarredIds] = useState(new Set());
  const [replyText, setReplyText] = useState("");
  const [notice, setNotice] = useState(null);

  const { data: rawMessages = [] } = useQuery({
    queryKey: ["adminMessages"],
    queryFn: fetchMessages,
  });

  // Purely dynamic messages from MongoDB / backend - no demo entries
  const messages = useMemo(() => {
    return Array.isArray(rawMessages) ? rawMessages : [];
  }, [rawMessages]);

  const unreadCount = useMemo(
    () => messages.filter((m) => m.isUnread).length,
    [messages]
  );
  const awaitingReplyCount = useMemo(
    () => messages.filter((m) => !m.replied).length,
    [messages]
  );
  const repliedCount = useMemo(
    () => messages.filter((m) => m.replied).length,
    [messages]
  );
  const responseRate = useMemo(() => {
    if (messages.length === 0) return "100%";
    return `${Math.round((repliedCount / messages.length) * 100)}%`;
  }, [messages, repliedCount]);

  const selectedMessage = useMemo(() => {
    if (selectedMessageId) {
      const found = messages.find((m) => (m._id || m.id) === selectedMessageId);
      if (found) return found;
    }
    return messages[0] || null;
  }, [messages, selectedMessageId]);

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
      setNotice({ type: "success", text: "Message removed from inbox." });
      setTimeout(() => setNotice(null), 3000);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to delete message" });
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, replyText, subject }) =>
      replyToMessage(id, { replyText, subject }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
      setNotice({
        type: "success",
        text: data?.message || "Reply sent successfully!",
      });
      setReplyText("");
      setTimeout(() => setNotice(null), 4000);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to send reply" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, updates }) => updateMessageStatus(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
    },
  });

  const toggleStar = (id, e) => {
    if (e) e.stopPropagation();
    const isStarred = starredIds.has(id);
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    statusMutation.mutate({ id, updates: { isStarred: !isStarred } });
  };

  const toggleReadStatus = (id, currentUnread, e) => {
    if (e) e.stopPropagation();
    statusMutation.mutate({ id, updates: { isUnread: !currentUnread } });
  };

  const handleQuickReply = (text) => {
    setReplyText(text);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    const msgId = selectedMessage._id || selectedMessage.id;
    replyMutation.mutate({
      id: msgId,
      replyText: replyText.trim(),
      subject: selectedMessage.subject,
    });
  };

  // Filtered List
  const filteredMessages = useMemo(() => {
    return messages
      .filter((msg) => {
        if (activeTab === "Unread") return msg.isUnread;
        if (activeTab === "Important") return starredIds.has(msg._id || msg.id);
        if (activeTab === "Replied") return msg.replied;
        return true;
      })
      .filter((msg) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          msg.senderName?.toLowerCase().includes(q) ||
          msg.senderEmail?.toLowerCase().includes(q) ||
          msg.subject?.toLowerCase().includes(q) ||
          msg.message?.toLowerCase().includes(q)
        );
      });
  }, [messages, activeTab, starredIds, searchQuery]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "var(--admin-accent)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            COMMUNICATION
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--admin-text-primary)",
              marginBottom: 4,
            }}
          >
            Visitor Messages Inbox
          </h1>
          <p style={{ color: "var(--admin-text-secondary)", fontSize: "0.92rem" }}>
            Inquiries and collaboration requests submitted by visitors through your portfolio contact form.
          </p>
        </div>

        <a
          href="mailto:kanhucharansahoo595@gmail.com"
          className="btn-neumorph-primary"
          style={{ textDecoration: "none", padding: "10px 18px" }}
        >
          <Mail size={16} />
          <span>Compose Email</span>
        </a>
      </div>

      {/* Real-time Notice */}
      {notice && (
        <div
          className="neumorph-card-sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background:
              notice.type === "success"
                ? "rgba(16, 185, 129, 0.12)"
                : "rgba(239, 68, 68, 0.12)",
            border:
              notice.type === "success"
                ? "1px solid rgba(16, 185, 129, 0.3)"
                : "1px solid rgba(239, 68, 68, 0.3)",
            color: notice.type === "success" ? "#10b981" : "#ef4444",
            padding: "10px 18px",
          }}
        >
          {notice.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{notice.text}</span>
        </div>
      )}

      {/* 4 Metric Stat Cards */}
      <div className="grid-4">
        {/* Total Messages */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
              }}
            >
              <Inbox size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {messages.length}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Total Inquiries
              </div>
            </div>
          </div>
        </div>

        {/* Unread Inquiries */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <Mail size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {unreadCount}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Unread Messages
              </div>
            </div>
          </div>
        </div>

        {/* Awaiting Reply */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f59e0b",
              }}
            >
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {awaitingReplyCount}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Awaiting Reply
              </div>
            </div>
          </div>
        </div>

        {/* Response Rate */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#a855f7",
              }}
            >
              <MessageSquare size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {responseRate}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 700, marginTop: 4 }}>
                {repliedCount} of {messages.length} answered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div
        className="neumorph-card"
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div
          className="neumorph-inset-sm"
          style={{ display: "inline-flex", padding: 4, borderRadius: 9999, gap: 4 }}
        >
          <button
            className={`filter-pill ${activeTab === "All" ? "active" : ""}`}
            onClick={() => setActiveTab("All")}
          >
            All ({messages.length})
          </button>
          <button
            className={`filter-pill ${activeTab === "Unread" ? "active" : ""}`}
            onClick={() => setActiveTab("Unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter-pill ${activeTab === "Replied" ? "active" : ""}`}
            onClick={() => setActiveTab("Replied")}
          >
            Replied ({repliedCount})
          </button>
          <button
            className={`filter-pill ${activeTab === "Important" ? "active" : ""}`}
            onClick={() => setActiveTab("Important")}
          >
            Important ({starredIds.size})
          </button>
        </div>

        {/* Search */}
        <div
          className="neumorph-inset-sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 14px",
            minWidth: 280,
          }}
        >
          <Search size={15} color="var(--admin-text-muted)" />
          <input
            type="text"
            placeholder="Search messages by sender or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--admin-text-primary)",
              fontSize: "0.85rem",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Dynamic Inbox Workspace or Empty State */}
      {messages.length === 0 ? (
        <div
          className="neumorph-card"
          style={{
            padding: "60px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 16,
            borderRadius: 16,
          }}
        >
          <div
            className="neumorph-inset"
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--admin-accent)",
            }}
          >
            <Inbox size={34} />
          </div>
          <div style={{ maxWidth: 440 }}>
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                margin: "0 0 8px 0",
                color: "var(--admin-text-primary)",
              }}
            >
              No Messages Yet
            </h3>
            <p
              style={{
                fontSize: "0.88rem",
                color: "var(--admin-text-muted)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Your inbox is clean. Any contact messages or inquiries submitted by visitors through your live portfolio will appear here dynamically.
            </p>
          </div>
        </div>
      ) : (
        /* Split 2-Column Inbox Workspace */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24 }}>
        {/* Left Column: Messages List */}
        <div
          className="neumorph-card"
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            maxHeight: 680,
            overflowY: "auto",
          }}
        >
          {filteredMessages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--admin-text-muted)" }}>
              No messages found.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const id = msg._id || msg.id;
              const isSelected = selectedMessage && (selectedMessage._id || selectedMessage.id) === id;
              const isStarred = starredIds.has(id);

              return (
                <div
                  key={id}
                  onClick={() => setSelectedMessageId(id)}
                  className={isSelected ? "neumorph-inset-sm" : "neumorph-card-sm"}
                  style={{
                    padding: "14px 16px",
                    cursor: "pointer",
                    border: isSelected
                      ? "1px solid var(--admin-border-accent)"
                      : "var(--admin-border)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                        }}
                      >
                        {msg.senderName?.charAt(0) || "V"}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                        {msg.senderName}
                      </span>
                      {msg.isUnread && (
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "2px 7px",
                            borderRadius: 9999,
                            background: "rgba(16, 185, 129, 0.16)",
                            color: "#10b981",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                          }}
                        >
                          New
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.74rem", color: "var(--admin-text-muted)" }}>
                        {new Date(msg.createdAt || Date.now()).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <button
                        onClick={(e) => toggleStar(id, e)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: isStarred ? "#fbbf24" : "var(--admin-text-muted)",
                          display: "flex",
                        }}
                      >
                        <Star size={15} fill={isStarred ? "#fbbf24" : "none"} />
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "0.84rem",
                      fontWeight: 600,
                      color: "var(--admin-text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    {msg.subject || "Inquiry from Portfolio"}
                  </div>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--admin-text-secondary)",
                      lineHeight: 1.45,
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {msg.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Message Detail Viewer */}
        {selectedMessage ? (
          <div
            className="neumorph-card"
            style={{
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <div>
              {/* Sender Info Top Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  paddingBottom: 18,
                  borderBottom: "1px solid var(--admin-border-subtle)",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                    }}
                  >
                    {selectedMessage.senderName?.charAt(0) || "V"}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.08rem", fontWeight: 700, margin: 0 }}>
                      {selectedMessage.senderName}
                    </h3>
                    <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 2 }}>
                      {selectedMessage.senderEmail || "visitor@inquiry.com"}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    onClick={() => toggleStar(selectedMessage._id || selectedMessage.id)}
                    className="btn-neumorph"
                    style={{ padding: "7px 10px" }}
                    title="Star message"
                  >
                    <Star
                      size={15}
                      fill={
                        starredIds.has(selectedMessage._id || selectedMessage.id)
                          ? "#fbbf24"
                          : "none"
                      }
                      color={
                        starredIds.has(selectedMessage._id || selectedMessage.id)
                          ? "#fbbf24"
                          : "inherit"
                      }
                    />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(selectedMessage._id || selectedMessage.id)}
                    className="btn-neumorph-danger"
                    style={{ padding: "7px 10px" }}
                    title="Delete message"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Subject Title */}
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "var(--admin-text-primary)",
                  marginBottom: 16,
                }}
              >
                {selectedMessage.subject || "Collaboration Inquiry"}
              </h2>

              {/* Message Body Inset Box */}
              <div
                className="neumorph-inset"
                style={{
                  padding: "20px 22px",
                  borderRadius: 16,
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "var(--admin-text-secondary)",
                  whiteSpace: "pre-wrap",
                  marginBottom: 20,
                }}
              >
                {selectedMessage.message}
              </div>

              {/* Threaded Reply History if Available */}
              {Array.isArray(selectedMessage.replies) && selectedMessage.replies.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "var(--admin-accent)",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Reply History ({selectedMessage.replies.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {selectedMessage.replies.map((rep, rIdx) => (
                      <div
                        key={rIdx}
                        className="neumorph-card-sm"
                        style={{
                          padding: "12px 16px",
                          borderRadius: 12,
                          background: "var(--admin-card-bg-elevated)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.74rem",
                            color: "var(--admin-text-muted)",
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ fontWeight: 700, color: "var(--admin-accent)" }}>
                            {rep.sentBy || "Admin"} (You)
                          </span>
                          <span>
                            {rep.sentAt ? new Date(rep.sentAt).toLocaleString() : "Just now"}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--admin-text-primary)",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {rep.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Reply Pills */}
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--admin-text-muted)",
                    marginBottom: 8,
                  }}
                >
                  Quick Replies:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    "Thanks for reaching out!",
                    "I'm interested in discussing further!",
                    "Let's schedule a brief call this week.",
                    "Thank you, but not currently available.",
                  ].map((quick, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(quick)}
                      className="btn-neumorph"
                      style={{ fontSize: "0.76rem", padding: "5px 12px", borderRadius: 9999 }}
                    >
                      {quick}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Reply Composer */}
            <div
              className="neumorph-card-sm"
              style={{
                padding: "16px 18px",
                borderRadius: 16,
                background: "var(--admin-card-bg-elevated)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Reply size={15} color="var(--admin-accent)" />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                    Reply to {selectedMessage.senderName}
                  </span>
                </div>
                {selectedMessage.senderEmail && (
                  <a
                    href={`mailto:${selectedMessage.senderEmail}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || "Your Inquiry"
                    )}&body=${encodeURIComponent(replyText || "")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: "0.74rem",
                      color: "var(--admin-accent)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      textDecoration: "none",
                    }}
                  >
                    Open in Mail Client <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <textarea
                rows={3}
                placeholder="Type your response here..."
                className="neumorph-input"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ marginBottom: 12 }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={replyMutation.isPending || !replyText.trim()}
                  className="btn-neumorph-primary"
                  style={{
                    padding: "8px 18px",
                    fontSize: "0.85rem",
                    opacity: replyMutation.isPending || !replyText.trim() ? 0.6 : 1,
                  }}
                >
                  <Send size={15} />
                  <span>{replyMutation.isPending ? "Sending..." : "Send Response"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="neumorph-card"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
              color: "var(--admin-text-muted)",
            }}
          >
            Select a message to preview its contents.
          </div>
        )}
      </div>
      )}

      {/* Inspiring Bottom Banner */}
      <div
        className="neumorph-card-sm"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          padding: "14px 22px",
          background: "linear-gradient(90deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MessageSquare size={18} color="var(--admin-accent)" />
          <span style={{ fontSize: "0.85rem", color: "var(--admin-text-secondary)" }}>
            "Great opportunities often start with a single message."
          </span>
        </div>
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--admin-accent)" }}>
          Clear Communication & Prompt Collaboration ✨
        </span>
      </div>
    </div>
  );
};

export default MessagesInbox;
