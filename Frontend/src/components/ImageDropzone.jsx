import React, { useMemo, useRef, useState } from 'react';

export default function ImageDropzone({ label = 'Foto', value, file, onFileChange }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const preview = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return value || '';
  }, [file, value]);

  const setSelectedFile = selectedFile => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen.');
      return;
    }
    setError('');
    onFileChange(selectedFile);
  };

  const handleDrop = event => {
    event.preventDefault();
    setIsDragging(false);
    setSelectedFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <button
        type="button"
        className={`image-dropzone ${isDragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={event => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="" />
        ) : (
          <span>Arrastra una imagen o haz click para seleccionar</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif,.avif,image/*"
        hidden
        onChange={event => setSelectedFile(event.target.files?.[0])}
      />
      {error && <span className="image-dropzone-error">{error}</span>}
    </div>
  );
}
