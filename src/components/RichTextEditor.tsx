'use client'

import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TextStyle from '@tiptap/extension-text-style'
import clsx from 'clsx'

interface Props {
  value: string
  onChange: (value: string) => void
}

const FontSizeTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize || null,
        renderHTML: attributes => {
          if (!attributes.fontSize) {
            return {}
          }
          return {
            style: `font-size: ${attributes.fontSize}`
          }
        }
      }
    }
  }
})

const RichTextEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4]
        }
      }),
      FontSizeTextStyle,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank'
        }
      }),
      Table.configure({
        resizable: true,
        lastColumnResizable: true
      }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'prose max-w-none text-gray-800 focus:outline-none min-h-[280px] px-4 py-3'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  if (!editor) {
    return (
      <div className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-500">
        Loading editor...
      </div>
    )
  }

  const buttonBase =
    'px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-purple-400 hover:text-purple-600 transition flex items-center gap-1'

  const isActive = (action: () => boolean) =>
    action() ? 'border-purple-500 text-purple-600 shadow-sm' : ''

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2">
        <select
          onChange={(e) => {
            const value = e.target.value
            if (value === '1rem') {
              editor.chain().focus().unsetMark('textStyle').run()
            } else {
              editor.chain().focus().setMark('textStyle', { fontSize: value }).run()
            }
          }}
          value={editor.getAttributes('textStyle').fontSize || '1rem'}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="0.875rem">Small</option>
          <option value="1rem">Normal</option>
          <option value="1.125rem">Medium</option>
          <option value="1.25rem">Large</option>
          <option value="1.5rem">X-Large</option>
        </select>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={clsx(buttonBase, isActive(() => editor.isActive('bold')))}
        >
          <span className="font-semibold">B</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={clsx(buttonBase, isActive(() => editor.isActive('italic')))}
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={clsx(buttonBase, isActive(() => editor.isActive('heading', { level: 2 })))}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={clsx(buttonBase, isActive(() => editor.isActive('heading', { level: 3 })))}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={clsx(buttonBase, isActive(() => editor.isActive('bulletList')))}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={clsx(buttonBase, isActive(() => editor.isActive('orderedList')))}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setLink({ href: prompt('Enter URL') || '' }).run()}
          className={buttonBase}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={clsx(buttonBase, isActive(() => editor.isActive('blockquote')))}
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          className={buttonBase}
        >
          Table
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={buttonBase}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={buttonBase}
        >
          Redo
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default RichTextEditor

