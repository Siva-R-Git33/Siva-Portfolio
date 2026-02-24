import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { FaBold, FaItalic, FaUnderline, FaHeading, FaCode, FaListUl, FaListOl, FaQuoteRight, FaImage, FaEye, FaEdit, FaSpinner } from 'react-icons/fa';
import { storageAPI } from '../utils/api';

export default function BlogEditor({ content, setContent }) {
    const [view, setView] = useState('split'); // 'edit', 'preview', 'split'
    const [uploading, setUploading] = useState(false);
    const textareaRef = useRef(null);

    const insertText = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }, 0);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be under 2MB.');
            return;
        }

        // Count existing images in markdown `![`
        const imageCount = (content.match(/!\[/g) || []).length;
        if (imageCount >= 2) {
            alert('Maximum 2 inline images allowed per blog post.');
            return;
        }

        setUploading(true);
        try {
            const filename = `img_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const path = `blog-inline/${filename}`;

            await storageAPI.uploadFile('uploads', path, file);
            const { data: url } = storageAPI.getPublicUrl('uploads', path);

            insertText(`\n![${file.name}](${url})\n`);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload image.');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="border border-cyber-border rounded-lg overflow-hidden bg-cyber-black flex flex-col h-[600px]">
            {/* Toolbar */}
            <div className="bg-[#111] border-b border-cyber-border p-2 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-1 items-center">
                    <button type="button" onClick={() => insertText('**', '**')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors" title="Bold">
                        <FaBold />
                    </button>
                    <button type="button" onClick={() => insertText('*', '*')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors" title="Italic">
                        <FaItalic />
                    </button>
                    <button type="button" onClick={() => insertText('<u>', '</u>')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors" title="Underline">
                        <FaUnderline />
                    </button>
                    <div className="w-px h-6 bg-cyber-gray mx-1" />

                    <button type="button" onClick={() => insertText('\n# ')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors font-bold text-xs" title="Heading 1">H1</button>
                    <button type="button" onClick={() => insertText('\n## ')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors font-bold text-xs" title="Heading 2">H2</button>
                    <button type="button" onClick={() => insertText('\n### ')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors font-bold text-xs" title="Heading 3">H3</button>
                    <div className="w-px h-6 bg-cyber-gray mx-1" />

                    <button type="button" onClick={() => insertText('\n- ')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors" title="Bullet List">
                        <FaListUl />
                    </button>
                    <button type="button" onClick={() => insertText('\n1. ')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors" title="Numbered List">
                        <FaListOl />
                    </button>
                    <button type="button" onClick={() => insertText('\n> ')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors" title="Quote">
                        <FaQuoteRight />
                    </button>
                    <div className="w-px h-6 bg-cyber-gray mx-1" />

                    <button type="button" onClick={() => insertText('`', '`')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors" title="Inline Code">
                        <FaCode />
                    </button>
                    <button type="button" onClick={() => insertText('\n```\n', '\n```\n')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors font-mono text-xs font-bold" title="Code Block">
                        {'{ }'}
                    </button>
                    <button type="button" onClick={() => insertText('\n---\n')} className="p-2 text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors font-bold text-xs" title="Divider">
                        ---
                    </button>
                    <div className="w-px h-6 bg-cyber-gray mx-1" />

                    <label className="p-2 text-gray-400 hover:text-neon-green hover:bg-cyber-dark rounded transition-colors cursor-pointer flex items-center gap-2" title="Upload Image (Max 2)">
                        {uploading ? <FaSpinner className="animate-spin text-neon-green" /> : <FaImage />}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                </div>

                <div className="flex bg-cyber-dark p-1 rounded-lg">
                    <button type="button" onClick={() => setView('edit')} className={`px-3 py-1 text-xs rounded ${view === 'edit' ? 'bg-neon-green text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Edit</button>
                    <button type="button" onClick={() => setView('split')} className={`px-3 py-1 text-xs rounded hidden md:block ${view === 'split' ? 'bg-neon-green text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Split</button>
                    <button type="button" onClick={() => setView('preview')} className={`px-3 py-1 text-xs rounded ${view === 'preview' ? 'bg-neon-green text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Preview</button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Text Area */}
                {(view === 'edit' || view === 'split') && (
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your blog post in Markdown..."
                        className={`p-4 bg-cyber-dark text-gray-300 font-mono text-sm resize-none focus:outline-none placeholder-gray-600 ${view === 'split' ? 'w-1/2 border-r border-cyber-border' : 'w-full'}`}
                        spellCheck="false"
                    />
                )}

                {/* Preview Area */}
                {(view === 'preview' || view === 'split') && (
                    <div className={`p-6 overflow-y-auto bg-[#0a0a0f] prose prose-invert prose-green max-w-none ${view === 'split' ? 'w-1/2' : 'w-full'}`}>
                        {content ? (
                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
                        ) : (
                            <div className="text-gray-600 italic h-full flex items-center justify-center">Preview will appear here...</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
