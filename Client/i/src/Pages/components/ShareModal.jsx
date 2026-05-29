import { useState } from "react";
import { UserIcon, ShareIcon, CopyIcon } from "./Icons";
import "./ShareModal.css";
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState("viewer");
  const [shareLink, setShareLink] = useState("");
  const [showLinkOption, setShowLinkOption] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (shareEmail.trim()) {
      onShare({
        noteId,
        email: shareEmail,
        role: shareRole,
      });
      setShareEmail("");
      setShareRole("viewer");
    }
  };

  const generateShareLink = () => {
    const link = `${window.location.origin}/shared/${noteId}/${Date.now()}`;
    setShareLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h2>Share Note</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="share-modal-content">
          <div className="share-section">
            <h3>Share with People</h3>
            <div className="share-form">
              <input
                type="email"
                placeholder="Enter email address"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
              <select
                value={shareRole}
                onChange={(e) => setShareRole(e.target.value)}
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
              <button
                className="share-btn"
                onClick={handleShare}
                disabled={!shareEmail.trim()}
              >
                Share
              </button>
            </div>
          </div>

          <div className="share-divider">OR</div>

          <div className="share-section">
            <h3>Share via Link</h3>
            {!shareLink ? (
              <button className="generate-link-btn" onClick={generateShareLink}>
                Generate Share Link
              </button>
            ) : (
              <div className="share-link-container">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="share-link-input"
                />
                <button
                  className={`copy-btn ${copied ? "copied" : ""}`}
                  onClick={copyToClipboard}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>

          <div className="share-section">
            <h3>Visibility</h3>
            <div className="visibility-options">
              <label>
                <input type="radio" name="visibility" defaultChecked />
                <span>Private</span>
              </label>
              <label>
                <input type="radio" name="visibility" />
                <span>Anyone with link</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
