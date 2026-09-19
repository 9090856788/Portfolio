import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Printer,
  FileDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { ResumeDocument } from "./ResumeTemplates";

export default function ResumeLivePreview({
  resume,
  onDownloadPdf,
  onOpenTemplates,
  onOpenAtsCheck,
}) {
  const [zoom, setZoom] = useState(0.68); // Good fit for 3-column desktop layout
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const zoomLevels = [0.45, 0.6, 0.68, 0.8, 1.0, 1.25];

  const handleZoomChange = (delta) => {
    setZoom((prev) => {
      const next = Number((prev + delta).toFixed(2));
      return Math.min(Math.max(next, 0.4), 1.5);
    });
  };

  const handleFitWidth = () => {
    if (containerRef.current) {
      const availableWidth = containerRef.current.clientWidth - 48;
      // 210mm in pixels at 96 DPI is approx 794px
      const targetZoom = Number((availableWidth / 794).toFixed(2));
      setZoom(Math.min(Math.max(targetZoom, 0.45), 1.1));
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={containerRef}
      className={`neumorph-card ${isFullscreen ? "fullscreen-preview-modal" : ""}`}
      style={
        isFullscreen
          ? {
              position: "fixed",
              inset: 20,
              zIndex: 9999,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              background: "var(--admin-bg)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            }
          : {
              padding: "20px 24px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }
      }
    >
      {/* Top Preview Controls Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          paddingBottom: 14,
          borderBottom: "var(--admin-border)",
        }}
      >
        {/* Zoom Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => handleZoomChange(-0.1)}
            className="btn-neumorph"
            style={{ padding: "6px 8px" }}
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>

          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "var(--admin-text-primary)",
              minWidth: 46,
              textAlign: "center",
            }}
          >
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => handleZoomChange(0.1)}
            className="btn-neumorph"
            style={{ padding: "6px 8px" }}
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>

          <button
            onClick={handleFitWidth}
            className="btn-neumorph"
            style={{ padding: "6px 10px", fontSize: "0.78rem", fontWeight: 600 }}
            title="Fit to Container Width"
          >
            Fit Width
          </button>

          <button
            onClick={() => setZoom(1.0)}
            className="btn-neumorph"
            style={{ padding: "6px 10px", fontSize: "0.78rem", fontWeight: 600 }}
            title="100% Exact Print Scale"
          >
            100%
          </button>
        </div>

        {/* Page navigation & Fullscreen */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--admin-text-muted)",
              padding: "4px 8px",
              borderRadius: 8,
              background: "var(--admin-inset-bg)",
            }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                background: "none",
                border: "none",
                color: currentPage === 1 ? "rgba(148,163,184,0.3)" : "var(--admin-text-primary)",
                cursor: currentPage === 1 ? "default" : "pointer",
                padding: 0,
                display: "flex",
              }}
            >
              <ChevronLeft size={15} />
            </button>
            <span>Page 1 of 1</span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={true}
              style={{
                background: "none",
                border: "none",
                color: "rgba(148,163,184,0.3)",
                cursor: "default",
                padding: 0,
                display: "flex",
              }}
            >
              <ChevronRight size={15} />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="btn-neumorph"
            style={{ padding: "6px 9px" }}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {/* Quick PDF button */}
          <button
            onClick={onDownloadPdf}
            className="btn-neumorph-primary"
            style={{ padding: "6px 12px", fontSize: "0.8rem", gap: 5 }}
            title="Download PDF or Print"
          >
            <FileDown size={14} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Viewport Canvas */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "24px 12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "var(--admin-inset-bg)",
          borderRadius: 14,
          marginTop: 14,
          boxShadow: "var(--admin-inset-shadow-sm)",
        }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease",
            marginBottom: "40px",
          }}
        >
          <ResumeDocument resume={resume} />
        </div>
      </div>
    </div>
  );
}
