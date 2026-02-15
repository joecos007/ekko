'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Quote, Code, Heading as HeadingIcon, Strikethrough } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from './separator'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
    className?: string
}

const ToolbarButton = ({
    isActive,
    onClick,
    children
}: {
    isActive: boolean
    onClick: () => void
    children: React.ReactNode
}) => (
    <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={cn(
            "h-8 w-8 p-0 hover:bg-white/10 hover:text-white transition-colors",
            isActive ? "bg-white/10 text-white" : "text-neutral-400"
        )}
    >
        {children}
    </Button>
)

const Toolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null

    return (
        <div className="border-b border-white/10 p-1 flex flex-wrap gap-1 bg-black/20">
            <ToolbarButton
                isActive={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                isActive={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                isActive={editor.isActive('strike')}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="h-4 w-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="h-6 bg-white/10 mx-1 self-center" />

            <ToolbarButton
                isActive={editor.isActive('heading', { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <HeadingIcon className="h-4 w-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="h-6 bg-white/10 mx-1 self-center" />

            <ToolbarButton
                isActive={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                isActive={editor.isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="h-6 bg-white/10 mx-1 self-center" />

            <ToolbarButton
                isActive={editor.isActive('blockquote')}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                isActive={editor.isActive('codeBlock')}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
                <Code className="h-4 w-4" />
            </ToolbarButton>
        </div>
    )
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Write something...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-neutral-500 before:float-left before:pointer-events-none h-0',
            }),
        ],
        content,
        // Update handling for controlled input
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm prose-invert max-w-none min-h-[150px] p-4 focus:outline-none text-neutral-200',
            },
        },
    })

    // Sync content if changed externally (optional, but good for resetting form)
    // useEffect(() => {
    //     if (editor && content !== editor.getHTML()) {
    //         editor.commands.setContent(content)
    //     }
    // }, [content, editor])

    return (
        <div className={cn("border border-white/10 rounded-lg overflow-hidden bg-black/20 focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all", className)}>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
