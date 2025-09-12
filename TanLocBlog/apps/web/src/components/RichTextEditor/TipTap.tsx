// src/Tiptap.tsx
// "use client"
import { useEditor, EditorContent } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import Heading from '@tiptap/extension-heading'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list'
import Blockquote from '@tiptap/extension-blockquote'
import TextAlign from '@tiptap/extension-text-align'
import { BsTypeH1 } from 'react-icons/bs';
import { FaBold } from 'react-icons/fa';
import { FaItalic } from 'react-icons/fa';
import { FaStrikethrough } from 'react-icons/fa';
import { FaUnderline } from 'react-icons/fa';
import { FaHighlighter } from 'react-icons/fa';
import { BsTypeH2 } from 'react-icons/bs';
import { RiListOrdered } from 'react-icons/ri';
import { RiListUnordered } from 'react-icons/ri';
import { TbBlockquote } from 'react-icons/tb';
import { FaAlignCenter } from 'react-icons/fa';
import { FaAlignJustify } from 'react-icons/fa';
import { FaAlignLeft } from 'react-icons/fa';
import { FaAlignRight } from 'react-icons/fa';
import { CharacterCount } from '@tiptap/extensions'
import "./TipTap.css"
export default function TipTap({ value, onChange }: { value: string; onChange: (content: string) => void }) {
      const [wordCount, setWordCount] = useState(0);
  const editor = useEditor({
    extensions: [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        Strike,
        Underline,
        Heading.configure({
            levels: [1, 2, 3],
        }),
        Highlight.configure({ multicolor: true }),
        BulletList, 
        OrderedList, 
        ListItem,
        Blockquote,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        CharacterCount,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
        immediatelyRender: false, 
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value]);
    if (!editor) return null;
    const isAlignActive = (align: string) =>
    editor.isActive('paragraph', { textAlign: align }) ||
    editor.isActive('heading', { textAlign: align });

  return (
    <div className="border rounded bg-white mb-5 dark:bg-gray-800 dark:text-white">
        <div className="post-tool flex flex-wrap border-b bg-white-50 dark:bg-gray-700">
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${editor.isActive("bold") ? " text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
            >
            <FaBold/>
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${editor.isActive("italic") ? " text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
            >
            <FaItalic/>
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${editor.isActive("strike") ? " text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
            >
            <FaStrikethrough/>
            </button>
            <button
            type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`${editor.isActive('underline') ? 'text-blue-600' : ''} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
            >
                <FaUnderline/>
            </button>
            <button
            type="button"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={`${editor.isActive('highlight') ? 'text-blue-600' : ''} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
            >
                <FaHighlighter/>
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`${editor.isActive("heading", { level: 1 }) ? "text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
            >
            <BsTypeH1/>
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${editor.isActive("heading", { level: 2 }) ? " text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
            >
            <BsTypeH2/>
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${editor.isActive('bulletList') ? 'text-blue-600' : ''} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
            >
                <RiListUnordered/>
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${editor.isActive('orderedList') ? 'text-blue-600' : ''} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
            >
                <RiListOrdered/>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`${editor.isActive("blockquote") ? "text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
            >
                <TbBlockquote/>
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`${isAlignActive('left') ? "text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 rounded transition-colors`}
            >
            <FaAlignLeft/>
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`${isAlignActive('center') ? "text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 rounded transition-colors`}
            >
            <FaAlignCenter/>
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`${isAlignActive('right') ? "text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 rounded transition-colors`}
            >
            <FaAlignRight/>
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`${isAlignActive('justify') ? "text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 rounded transition-colors`}
            >
            <FaAlignJustify/>
            </button>
        </div>
        <EditorContent editor={editor} className="min-h-30 px-3 focus:outline-none py-2" />
      <div className="flex justify-end gap-6 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        <span>
          Characters: {editor?.storage.characterCount.characters() ?? 0}
        </span>
      </div>
    </div>
  );
}
