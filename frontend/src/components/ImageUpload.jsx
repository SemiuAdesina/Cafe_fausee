import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage, FiLoader } from 'react-icons/fi';
import '../styles/ImageUpload.css';

const ImageUpload = ({ 
  onUpload, 
  onRemove, 
  currentImage = null,
  accept = "image/*",
  maxSize = 5, // MB
  className = "",
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    setError('');
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return false;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }
    
    return true;
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // You can change this preset
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dnga456vp'}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleFileSelect = async (file) => {
    if (!validateFile(file)) return;
    
    setIsUploading(true);
    setError('');
    
    try {
      const imageUrl = await uploadToCloudinary(file);
      onUpload(imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    onRemove();
    setError('');
  };

  return (
    <div className={`image-upload-container ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        style={{ display: 'none' }}
        disabled={disabled || isUploading}
      />

      {/* Upload Area */}
      {!currentImage ? (
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {isUploading ? (
            <div className="upload-loading">
              <FiLoader className="upload-icon spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <FiUpload className="upload-icon" />
              <div className="upload-text">
                <span className="upload-title">Click to upload or drag and drop</span>
                <span className="upload-subtitle">
                  PNG, JPG, GIF up to {maxSize}MB
                </span>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="image-preview">
          <img src={currentImage} alt="Preview" className="preview-image" />
          <div className="image-overlay">
            <button
              className="remove-image-btn"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              title="Remove image"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="upload-error">
          <FiX />
          {error}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 