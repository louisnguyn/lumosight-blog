// src/Tiptap.tsx
// "use client"
import { useEditor, EditorContent } from "@tiptap/react";
import { supabase } from '../../db/supabaseClient';
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
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import Link from '@tiptap/extension-link'
import { BubbleMenu } from '@tiptap/react/menus'
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
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { BiImageAdd } from 'react-icons/bi';
import { CgSpinner } from 'react-icons/cg';
import { MdFormatColorText } from 'react-icons/md';
import { 
  MdTableChart, 
  MdDeleteOutline,
  MdAdd,
  MdRemove,
  MdLink
} from 'react-icons/md';
import "./TipTap.css"
export default function TipTap({ value, onChange , placeholder = "" }: { value: string; onChange: (content: string) => void;placeholder?: string }) {
      // const [wordCount, setWordCount] = useState(0);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTableControls, setShowTableControls] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showBubbleColorPicker, setShowBubbleColorPicker] = useState(false);
  
  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#FFFFFF',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981',
    '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
    '#D946EF', '#EC4899', '#F43F5E'
  ];


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
        TextStyle,
        Color.configure({ types: [TextStyle.name] }),
        CharacterCount,
        Placeholder.configure({ placeholder }),
        Image,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableCell,
        TableHeader,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-600 underline hover:text-blue-800',
          },
        }),
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

  // Close color picker and table controls when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showColorPicker && !(event.target as Element).closest('.color-picker-container')) {
        setShowColorPicker(false);
      }
      if (showTableControls && !(event.target as Element).closest('.table-controls-container')) {
        setShowTableControls(false);
      }
      if (showLinkModal && !(event.target as Element).closest('.link-modal-container')) {
        setShowLinkModal(false);
      }
      if (showBubbleColorPicker && !(event.target as Element).closest('.bubble-color-picker-container')) {
        setShowBubbleColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker, showTableControls, showLinkModal, showBubbleColorPicker]);

  // Handle image deletion from storage when images are removed from editor
  useEffect(() => {
    if (!editor) return;

    let previousImages: string[] = [];
    
    // Store initial images
    editor.state.doc.descendants((node: any) => {
      if (node.type.name === 'image' && node.attrs.src) {
        previousImages.push(node.attrs.src);
      }
    });

    const handleUpdate = () => {
      const currentImages: string[] = [];
      
      // Collect current images
      editor.state.doc.descendants((node: any) => {
        if (node.type.name === 'image' && node.attrs.src) {
          currentImages.push(node.attrs.src);
        }
      });
      
      // Find images that were removed
      const removedImages = previousImages.filter(img => !currentImages.includes(img));
      
      // Delete removed images from storage
      removedImages.forEach(imageUrl => {
        if (!imageUrl.startsWith('blob:')) {
          deleteImageFromBucket(imageUrl);
        }
      });
      
      // Update previous images for next comparison
      previousImages = currentImages;
    };

    // Listen to editor updates
    editor.on('update', handleUpdate);
    
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor]);

  // Handle link modal opening
  const handleOpenLinkModal = () => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    
    if (editor.isActive('link')) {
      // Editing existing link
      const linkAttributes = editor.getAttributes('link');
      setLinkUrl(linkAttributes.href || '');
      setLinkText(selectedText);
    } else {
      // Creating new link
      setLinkUrl('');
      setLinkText(selectedText); // Pre-fill with selected text if any
    }
    
    setShowLinkModal(true);
  };

  // Handle link creation/update
  const handleLinkSubmit = () => {
    if (!editor) return;
    
    if (linkUrl.trim()) {
      if (editor.isActive('link')) {
        // Update existing link - both URL and text
        const { from, to } = editor.state.selection;
        
        if (linkText.trim()) {
          // Replace the entire link with new text and URL
          editor.chain().focus().deleteRange({ from, to }).insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
        } else {
          // Just update the URL, keep existing text
          editor.chain().focus().updateAttributes('link', { href: linkUrl }).run();
        }
      } else {
        // Create new link with custom text
        if (linkText.trim()) {
          // Insert new text with link
          editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
        } else {
          // Use selected text or create link with URL as text
          const { from, to } = editor.state.selection;
          const selectedText = editor.state.doc.textBetween(from, to, ' ');
          if (selectedText.trim()) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
          } else {
            // Insert URL as both text and link
            editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkUrl}</a>`).run();
          }
        }
      }
    }
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  // Handle link removal
  const handleLinkRemove = () => {
    if (!editor) return;
    
    editor.chain().focus().unsetLink().run();
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };
    if (!editor) return null;
    const isAlignActive = (align: string) =>
    editor.isActive('paragraph', { textAlign: align }) ||
    editor.isActive('heading', { textAlign: align });
  const deleteImageFromBucket = async (imageUrl: string) => {
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/').filter(part => part !== '');
      let bucketName = '';
      let filePath = '';
      
      if (pathParts.includes('image_upload')) {
        const bucketIndex = pathParts.indexOf('image_upload');
        bucketName = pathParts[bucketIndex];
        filePath = pathParts.slice(bucketIndex + 1).join('/');
      } else {
        bucketName = pathParts[pathParts.length - 2] || 'image_upload';
        filePath = pathParts[pathParts.length - 1] || '';
      }
      
      if (bucketName === 'image_upload' && filePath) {
        const { error } = await supabase.storage
          .from('image_upload')
          .remove([filePath]);
        
        if (error) {
          console.error('Error deleting image from bucket:', error);
        }
      }
    } catch (error) {
      console.error('Error parsing image URL for deletion:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setImageUploadLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `content_${Date.now()}.${fileExt}`;
    const filePath = `content/${fileName}`;
    const { error } = await supabase.storage
      .from("image_upload")
      .upload(filePath, file, { upsert: true });
    if (error) {
      setImageUploadLoading(false);
      return;
    }
    const { data } = supabase.storage
      .from("image_upload")
      .getPublicUrl(filePath);
    const imageUrl = data?.publicUrl;
    setTimeout(() => {
      if (imageUrl) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
      setImageUploadLoading(false);
    }, 2000);
  };

  return (
    <div className="border rounded bg-white mb-5 dark:bg-gray-800 dark:text-white">
        <div className="post-tool flex flex-wrap border-b bg-white-50 dark:bg-gray-700 p-2">
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
            <div className="h-6 bg-gray-300 dark:bg-gray-600"></div>
            <div className="relative color-picker-container">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className={`${editor.isActive('textStyle', { color: editor.getAttributes('textStyle').color }) ? "text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
                title="Text Color"
              >
                <MdFormatColorText className="text-xl" />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 z-50 color-palette">
                  <div className="grid grid-cols-7 gap-2 w-56">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          editor.chain().focus().setColor(color).run();
                          setShowColorPicker(false);
                        }}
                        className="w-8 h-8 rounded color-swatch"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <input
                      type="color"
                      onChange={(e) => {
                        editor.chain().focus().setColor(e.target.value).run();
                        setShowColorPicker(false);
                      }}
                      className="w-full h-8 rounded border border-gray-200 dark:border-gray-600 cursor-pointer"
                      title="Custom Color"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().unsetColor().run();
                        setShowColorPicker(false);
                      }}
                      className="w-full mt-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Remove Color"
                    >
                      Remove Color
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className=" h-6 bg-gray-300 dark:bg-gray-600"></div>
            <button
              type="button"
              onClick={handleOpenLinkModal}
              className={`${editor.isActive('link') ? "text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
              title={editor.isActive('link') ? "Edit Link" : "Add Link"}
            >
              <MdLink className="text-xl" />
            </button>
            <div className=" h-6 bg-gray-300 dark:bg-gray-600"></div>
            <div className="relative table-controls-container">
              <button
                type="button"
                onClick={() => setShowTableControls(!showTableControls)}
                className={`${editor.isActive('table') ? "text-blue-600" : ""} hover:bg-gray-200 dark:hover:bg-gray-900 p-2 hover:rounded dark:hover:rounded transition-colors`}
                title="Table Controls"
              >
                <MdTableChart className="text-xl" />
              </button>
              {showTableControls && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 z-50 table-controls">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Insert Table</div>
                    <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3].map((rows) => (
                        [1, 2, 3].map((cols) => (
                          <button
                            key={`${rows}-${cols}`}
                            type="button"
                            onClick={() => {
                              editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
                              setShowTableControls(false);
                            }}
                            className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded hover:bg-blue-100 dark:hover:bg-blue-900 table-grid-button flex items-center justify-center text-xs"
                            title={`${rows}×${cols} table`}
                          >
                            {rows}×{cols}
                          </button>
                        ))
                      ))}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Table Actions</div>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            editor.chain().focus().addRowBefore().run();
                            setShowTableControls(false);
                          }}
                          disabled={!editor.isActive('table')}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 table-action-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                          title="Add Row Above"
                        >
                          <MdAdd className="text-sm" />
                          Row ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            editor.chain().focus().addRowAfter().run();
                            setShowTableControls(false);
                          }}
                          disabled={!editor.isActive('table')}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 table-action-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                          title="Add Row Below"
                        >
                          <MdAdd className="text-sm" />
                          Row ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            editor.chain().focus().addColumnBefore().run();
                            setShowTableControls(false);
                          }}
                          disabled={!editor.isActive('table')}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 table-action-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                          title="Add Column Left"
                        >
                          <MdAdd className="text-sm" />
                          Col ←
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            editor.chain().focus().addColumnAfter().run();
                            setShowTableControls(false);
                          }}
                          disabled={!editor.isActive('table')}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 table-action-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                          title="Add Column Right"
                        >
                          <MdAdd className="text-sm" />
                          Col →
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            editor.chain().focus().deleteRow().run();
                            setShowTableControls(false);
                          }}
                          disabled={!editor.isActive('table')}
                          className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 table-action-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                          title="Delete Row"
                        >
                          <MdRemove className="text-sm" />
                          Del Row
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            editor.chain().focus().deleteColumn().run();
                            setShowTableControls(false);
                          }}
                          disabled={!editor.isActive('table')}
                          className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 table-action-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                          title="Delete Column"
                        >
                          <MdRemove className="text-sm" />
                          Del Col
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            editor.chain().focus().deleteTable().run();
                            setShowTableControls(false);
                          }}
                          disabled={!editor.isActive('table')}
                          className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 table-action-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 col-span-2"
                          title="Delete Table"
                        >
                          <MdDeleteOutline className="text-sm" />
                          Delete Table
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
        <label className="p-2 hover:bg-gray-200 dark:hover:bg-gray-900 hover:rounded dark:hover:rounded transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
            disabled={imageUploadLoading}
          />
          {imageUploadLoading ? (
            <CgSpinner className="text-2xl animate-spin text-blue-600" />
          ) : (
            <BiImageAdd className="text-2xl" />
          )}
        </label>
        </div>
        <EditorContent editor={editor} className="min-h-30 px-3 focus:outline-none py-2" />
        
        {/* Official Bubble Menu with positioning options */}
        {editor && (
          <BubbleMenu 
            editor={editor}
            className="bubble-menu"
          >
            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`${editor.isActive("bold") ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"} p-2 rounded transition-colors`}
                title="Bold"
              >
                <FaBold className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`${editor.isActive("italic") ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"} p-2 rounded transition-colors`}
                title="Italic"
              >
                <FaItalic className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`${editor.isActive("strike") ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"} p-2 rounded transition-colors`}
                title="Strikethrough"
              >
                <FaStrikethrough className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`${editor.isActive('underline') ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"} p-2 rounded transition-colors`}
                title="Underline"
              >
                <FaUnderline className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={`${editor.isActive('highlight') ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"} p-2 rounded transition-colors`}
                title="Highlight"
              >
                <FaHighlighter className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              
              <div className="relative bubble-color-picker-container">
                <button
                  type="button"
                  onClick={() => setShowBubbleColorPicker(!showBubbleColorPicker)}
                  className={`${editor.isActive('textStyle', { color: editor.getAttributes('textStyle').color }) ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"} p-2 rounded transition-colors`}
                  title="Text Color"
                >
                  <MdFormatColorText className="w-4 h-4" />
                </button>
                {showBubbleColorPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 z-50 bubble-color-palette">
                    <div className="grid grid-cols-7 gap-1 w-48">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            editor.chain().focus().setColor(color).run();
                            setShowBubbleColorPicker(false);
                          }}
                          className="w-6 h-6 rounded color-swatch"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <input
                        type="color"
                        onChange={(e) => {
                          editor.chain().focus().setColor(e.target.value).run();
                          setShowBubbleColorPicker(false);
                        }}
                        className="w-full h-6 rounded border border-gray-200 dark:border-gray-600 cursor-pointer"
                        title="Custom Color"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          editor.chain().focus().unsetColor().run();
                          setShowBubbleColorPicker(false);
                        }}
                        className="w-full mt-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Remove Color"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`${editor.isActive("heading", { level: 1 }) ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"} p-2 rounded transition-colors`}
                title="Heading 1"
              >
                <BsTypeH1 className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`${editor.isActive("heading", { level: 2 }) ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"} p-2 rounded transition-colors`}
                title="Heading 2"
              >
                <BsTypeH2 className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              
              <button
                type="button"
                onClick={handleOpenLinkModal}
                className={`${editor.isActive('link') ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"} p-2 rounded transition-colors`}
                title={editor.isActive('link') ? "Edit Link" : "Add Link"}
              >
                <MdLink className="w-4 h-4" />
              </button>
            </div>
          </BubbleMenu>
        )}
        
      <div className="flex justify-end gap-6 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        <span>
          Characters: {editor?.storage.characterCount.characters() ?? 0}
        </span>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="link-modal-container bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editor.isActive('link') ? 'Edit Link' : 'Add Link'}
              </h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link Text <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder={editor.isActive('link') ? "Edit link text" : "Enter custom text for the link"}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {editor.isActive('link') 
                    ? "Edit the link text or leave empty to keep current text" 
                    : "Leave empty to use selected text or URL as link text"
                  }
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              {editor.isActive('link') && (
                <button
                  onClick={handleLinkRemove}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  Remove Link
                </button>
              )}
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkSubmit}
                disabled={!linkUrl.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                {editor.isActive('link') ? 'Update Link' : 'Add Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
