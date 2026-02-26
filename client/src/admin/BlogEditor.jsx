import { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { storageAPI } from '../utils/api';
import { FaSpinner } from 'react-icons/fa';

export default function BlogEditor({ content, setContent }) {
    const quillRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    // Custom image handler for ReactQuill
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            if (file.size > 2 * 1024 * 1024) {
                alert('Image must be under 2MB.');
                return;
            }

            setUploading(true);
            try {
                const filename = `img_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
                const path = `blog-inline/${filename}`;

                await storageAPI.uploadFile('uploads', path, file);
                const { data: url } = storageAPI.getPublicUrl('uploads', path);

                // Insert into editor
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, 'image', url);
                quill.setSelection(range.index + 1);

            } catch (err) {
                console.error('Upload failed:', err);
                alert('Failed to upload inline image.');
            } finally {
                setUploading(false);
            }
        };
    };

    // Quill formatting modules
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    return (
        <div className="bg-white text-black rounded-lg overflow-hidden relative">
            {uploading && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-black/80 text-neon-green px-4 py-2 rounded-lg font-mono text-sm shadow-xl">
                        <FaSpinner className="animate-spin" /> Uploading Image...
                    </div>
                </div>
            )}
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-[400px] pb-10" // Extra padding to accommodate Quill toolbar
                placeholder="Write your amazing rich-text blog post here..."
            />
        </div>
    );
}
