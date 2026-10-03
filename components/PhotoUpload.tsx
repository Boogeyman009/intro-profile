"use client";

import { useCallback, useRef, useState } from "react";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PhotoUpload({
  photo,
  name,
  onPhotoChange,
  variant = "full",
  fill = false,
}: {
  photo?: string;
  name: string;
  onPhotoChange: (photo: string) => void;
  variant?: "full" | "compact";
  fill?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(Date.now());

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);

      const formData = new FormData();
      formData.append("photo", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (res.ok) {
          const url = data.photo.split("?")[0];
          onPhotoChange(url);
          setVersion(Date.now());
        } else {
          setError(data.error || "Upload failed.");
        }
      } catch {
        setError("Upload failed. Please try again.");
      }

      setUploading(false);
    },
    [onPhotoChange]
  );

  async function handleRemove() {
    if (!photo) return;
    setError("");
    setRemoving(true);

    try {
      const res = await fetch("/api/upload", { method: "DELETE" });
      if (res.ok) {
        onPhotoChange("");
        setVersion(Date.now());
      } else {
        const data = await res.json();
        setError(data.error || "Could not remove photo.");
      }
    } catch {
      setError("Could not remove photo.");
    }

    setRemoving(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  const busy = uploading || removing;
  const previewSrc = photo ? `${photo}?v=${version}` : "";

  if (variant === "compact") {
    return (
      <div className={`photo-compact ${fill ? "photo-compact--fill" : ""}`}>
        <div
          className={`photo-compact-preview ${busy ? "photo-compact-preview--busy" : ""}`}
          onClick={() => !busy && inputRef.current?.click()}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt={name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="photo-compact-initials">{getInitials(name)}</span>
          )}
          <div className="photo-compact-overlay">
            {uploading ? "Uploading..." : removing ? "Removing..." : photo ? "Change" : "Add photo"}
          </div>
        </div>

        <input ref={inputRef} type="file" accept={ACCEPT} hidden onChange={handleInputChange} disabled={busy} />

        {!fill && photo && (
          <button className="photo-remove-link" onClick={handleRemove} disabled={busy}>
            Remove
          </button>
        )}

        {error && <p className="photo-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="photo-uploader">
      <div
        className={`photo-dropzone ${dragging ? "photo-dropzone--dragging" : ""} ${busy ? "photo-dropzone--busy" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !busy && inputRef.current?.click()}
      >
        <div className="photo-dropzone-preview">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewSrc} alt={name} />
          ) : (
            <span className="photo-dropzone-initials">{getInitials(name)}</span>
          )}
        </div>

        <div className="photo-dropzone-info">
          <p className="photo-dropzone-title">
            {uploading ? "Uploading..." : removing ? "Removing..." : photo ? "Update profile photo" : "Add profile photo"}
          </p>
          <p className="photo-dropzone-hint">Drag & drop or click to browse · JPEG, PNG, WebP, GIF · Max 5MB</p>
        </div>
      </div>

      <input ref={inputRef} type="file" accept={ACCEPT} hidden onChange={handleInputChange} disabled={busy} />

      <div className="photo-actions">
        <button className="btn btn-secondary" onClick={() => inputRef.current?.click()} disabled={busy}>
          {photo ? "Choose New Photo" : "Choose Photo"}
        </button>
        {photo && (
          <button className="btn btn-danger" onClick={handleRemove} disabled={busy}>
            Remove Photo
          </button>
        )}
      </div>

      {error && <p className="photo-error">{error}</p>}
    </div>
  );
}
