import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMessages, deleteMessage } from "../api/adminApi";
import { Mail, Trash2, Calendar, User, CheckCircle, AlertCircle } from "lucide-react";

const MessagesInbox = () => {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["adminMessages"],
    queryFn: fetchMessages,
  });

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

  return (
    <div className="content-container">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 6 }}>Visitor Messages Inbox</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Inquiries and collaboration requests submitted by visitors through your portfolio contact form.
        </p>
      </div>

      {notice && (
        <div
          style={{
            padding: "14px 20px",
            borderRadius: "var(--radius-sm)",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: notice.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: notice.type === "success" ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid rgba(239, 68, 68, 0.35)",
            color: notice.type === "success" ? "#6ee7b7" : "#fca5a5",
          }}
        >
          {notice.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notice.text}</span>
        </div>
      )}

      {isLoading ? (
        <div style={{ color: "var(--text-muted)", padding: 40, textAlign: "center" }}>Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: 60 }}>
          <Mail size={48} color="var(--text-muted)" style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: 8 }}>Inbox is Empty</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Messages sent via the Contact page on your portfolio will show up right here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((msg) => (
            <div key={msg._id} className="glass-card" style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <User size={18} color="var(--accent-primary)" />
                    <span style={{ fontSize: "1.05rem", fontWeight: 700 }}>{msg.senderName}</span>
                  </div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {msg.subject || "No Subject"}
                  </h4>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <Calendar size={14} />
                    <span>{new Date(msg.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this message?")) {
                        deleteMutation.mutate(msg._id);
                      }
                    }}
                    className="btn btn-danger btn-sm"
                    title="Delete message"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, background: "rgba(10, 12, 20, 0.4)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesInbox;
