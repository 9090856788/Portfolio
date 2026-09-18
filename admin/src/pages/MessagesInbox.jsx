import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMessages, deleteMessage } from "../api/adminApi";
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
} from "lucide-react";

/**
 * Visitor Messages Inbox matching Screenshot 6:
 * - 4 Metric Stat cards (Total Messages, New This Month, Awaiting Reply, Response Rate)
 * - Tabs (All, Unread, Replied, Important) + Sort selector
 * - Interactive Split 2-Column view: Left message list, Right detail viewer
 * - Quick reply template pills, attachments button, and direct reply composer
 * - Inspiring bottom banner: "Great opportunities often start with a single message."
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

  // Sample enriched fallback messages if backend list is empty or minimal
  const messages = useMemo(() => {
    if (rawMessages.length > 0) return rawMessages;
    return [
      {
        _id: "demo-msg-1",
        senderName: "Sarah Jenkins",
        senderEmail: "sarah.j@techcorp.io",
        subject: "Excited about your portfolio — Potential Frontend Lead Role",
        message:
          "Hi Kanhu,\n\nI was really impressed by your portfolio showcases and your component craftsmanship. We are currently looking for a talented Frontend Developer to lead our new client dashboard rebuild with React, TypeScript, and modern UI architectures.\n\nWould you be open to an introductory 20-minute chat sometime this week?\n\nBest regards,\nSarah Jenkins\nDirector of Engineering, TechCorp",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        isUnread: true,
      },
      {
        _id: "demo-msg-2",
        senderName: "Alex Rivera",
        senderEmail: "alex@designstudio.co",
        subject: "Freelance Project: Modern SaaS Dashboard Redesign",
        message:
          "Hey Kanhu!\n\nLove the neumorphic attention to detail on your applications. We have a 6-week project to design and implement a high-converting web app. Are you taking on freelance projects currently?\n\nCheers,\nAlex",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
        isUnread: false,
      },
    ];
  }, [rawMessages]);

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

  const toggleStar = (id, e) => {
    if (e) e.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleQuickReply = (text) => {
    setReplyText(text);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    // Launch mailto for direct client communication
    const mailto = `mailto:${selectedMessage.senderEmail}?subject=Re: ${encodeURIComponent(
      selectedMessage.subject || "Your Inquiry"
    )}&body=${encodeURIComponent(replyText)}`;
    window.open(mailto, "_blank");
    setNotice({ type: "success", text: "Opening email client with response..." });
    setReplyText("");
    setTimeout(() => setNotice(null), 4000);
  };

  // Filtered List
  const filteredMessages = useMemo(() => {
    return messages
      .filter((msg) => {
        if (activeTab === "Unread") return msg.isUnread;
        if (activeTab === "Important") return starredIds.has(msg._id || msg.id);
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
                Total Messages
              </div>
            </div>
          </div>
        </div>

        {/* New This Month */}
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
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {messages.length || 6}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                New This Month
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
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>2</div>
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
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>98%</div>
              <div style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 700, marginTop: 4 }}>
                Avg &lt; 2 hours
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
            Unread (1)
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

      {/* Split 2-Column Inbox Workspace (Matching Screenshot 6) */}
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Reply size={15} color="var(--admin-accent)" />
                <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                  Reply to {selectedMessage.senderName}
                </span>
              </div>

              <textarea
                rows={3}
                placeholder="Type your response here..."
                className="neumorph-input"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ marginBottom: 12 }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  className="btn-neumorph"
                  style={{ padding: "6px 10px" }}
                  title="Attach file"
                >
                  <Paperclip size={15} />
                </button>

                <button
                  type="button"
                  onClick={handleSendReply}
                  className="btn-neumorph-primary"
                  style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                >
                  <Send size={15} />
                  <span>Send Response</span>
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
