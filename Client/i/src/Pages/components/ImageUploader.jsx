import { useRef, useState } from "react";
import { ImageIcon } from "./Icons";
import "./ImageUploader.css";

export function ImageUploader({ onImagesUpload }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
  const CLOUDINARY_UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset";

  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        caption: "",
      };
    } catch (error) {
      setUploadError(`Failed to upload ${file.name}`);
      throw error;
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadError("");

    try {
      const uploadedImages = await Promise.all(
        files.map((file) => uploadToCloudinary(file)),
      );
      onImagesUpload(uploadedImages);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <button
        type="button"
        className="image-upload-btn"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        title="Upload images"
      >
        <ImageIcon />
        {uploading ? "Uploading..." : "Images"}
      </button>

      {uploadError && <div className="upload-error">{uploadError}</div>}
    </div>
  );
}
