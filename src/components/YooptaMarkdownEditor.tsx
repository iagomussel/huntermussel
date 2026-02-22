import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import YooptaEditor, {
  Blocks,
  Elements,
  Marks,
  createYooptaEditor,
} from "@yoopta/editor";
import { WORD_PLUGINS } from "./word-example/plugins";
import { WORD_MARKS } from "./word-example/marks";
import { SelectionBox } from "@yoopta/ui/selection-box";
import { BlockDndContext, SortableBlock } from "@yoopta/ui/block-dnd";
import { withMentions } from "@yoopta/mention";
import { withEmoji } from "@yoopta/emoji";
import { applyTheme, EmojiDropdown, MentionDropdown } from "@yoopta/themes-shadcn";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Copy,
  FileIcon,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Indent,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  MoveDown,
  MoveUp,
  Quote,
  Redo2,
  Strikethrough,
  Table,
  Trash2,
  Underline,
  Undo2,
  Video,
} from "lucide-react";

const STORAGE_KEY = "yoopta-word-example";

const EDITOR_STYLES = {
  width: "100%",
  paddingBottom: 100,
};

const INITIAL_VALUE = {
  "block-1": {
    id: "block-1",
    type: "HeadingOne",
    value: [
      {
        id: "heading-1",
        type: "heading-one",
        children: [{ text: "How to build a great software house from scratch" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 0, depth: 0 },
  },
};

function MiniWordToolbar({ editor }: { editor: ReturnType<typeof createYooptaEditor> }) {
  const getCurrentBlock = useCallback(() => {
    try {
      return Blocks.getBlock(editor, { at: editor.path.current });
    } catch {
      return null;
    }
  }, [editor]);

  const toggleHeading = (level: 1 | 2 | 3) => {
    const type = level === 1 ? "HeadingOne" : level === 2 ? "HeadingTwo" : "HeadingThree";
    Blocks.toggleBlock(editor, type, { focus: true });
  };

  const setAlign = (align: "left" | "center" | "right") => {
    const block = getCurrentBlock();
    if (!block) return;
    editor.updateBlock(block.id, {
      meta: { ...block.meta, align },
    });
  };

  const moveBlock = (direction: "up" | "down") => {
    const block = getCurrentBlock();
    if (!block) return;
    const count = Object.keys(editor.getEditorValue()).length;
    if (direction === "up" && block.meta.order > 0) {
      Blocks.moveBlock(editor, block.id, block.meta.order - 1);
    }
    if (direction === "down" && block.meta.order < count - 1) {
      Blocks.moveBlock(editor, block.id, block.meta.order + 2);
    }
  };

  const iconBtn = (onClick: () => void, title: string, icon: React.ReactNode) => (
    <button type="button" className="word-icon-btn" onClick={onClick} title={title}>
      {icon}
    </button>
  );

  return (
    <div className="word-toolbar-wrap">
      <div className="word-menu-row">
        <button type="button" className="word-menu-btn">File</button>
        <button type="button" className="word-menu-btn">Edit</button>
        <button type="button" className="word-menu-btn">Insert</button>
        <button type="button" className="word-menu-btn">Format</button>
      </div>

      <div className="word-tools-row">
        {iconBtn(() => editor.undo(), "Undo", <Undo2 size={16} />)}
        {iconBtn(() => editor.redo(), "Redo", <Redo2 size={16} />)}

        <div className="word-divider" />

        <button type="button" className="word-select-btn" onClick={() => Blocks.insertBlock(editor, "Paragraph", { focus: true })}>
          Paragraph <ChevronDown size={14} />
        </button>

        <div className="word-divider" />

        {iconBtn(() => Marks.toggle(editor, { type: "bold" }), "Bold", <Bold size={16} />)}
        {iconBtn(() => Marks.toggle(editor, { type: "italic" }), "Italic", <Italic size={16} />)}
        {iconBtn(() => Marks.toggle(editor, { type: "underline" }), "Underline", <Underline size={16} />)}
        {iconBtn(() => Marks.toggle(editor, { type: "strike" }), "Strike", <Strikethrough size={16} />)}
        {iconBtn(() => Marks.toggle(editor, { type: "code" }), "Code", <Code size={16} />)}

        <div className="word-divider" />

        {iconBtn(() => setAlign("left"), "Align Left", <AlignLeft size={16} />)}
        {iconBtn(() => setAlign("center"), "Align Center", <AlignCenter size={16} />)}
        {iconBtn(() => setAlign("right"), "Align Right", <AlignRight size={16} />)}

        <div className="word-divider" />

        {iconBtn(() => Blocks.increaseBlockDepth(editor, {}), "Indent", <Indent size={16} />)}
        {iconBtn(() => Blocks.decreaseBlockDepth(editor, {}), "Outdent", <Indent size={16} style={{ transform: "scaleX(-1)" }} />)}
        {iconBtn(() => Blocks.toggleBlock(editor, "BulletedList", { focus: true }), "Bulleted List", <List size={16} />)}
        {iconBtn(() => Blocks.toggleBlock(editor, "NumberedList", { focus: true }), "Numbered List", <ListOrdered size={16} />)}
        {iconBtn(() => Blocks.toggleBlock(editor, "TodoList", { focus: true }), "Todo List", <ListChecks size={16} />)}
        {iconBtn(() => Blocks.toggleBlock(editor, "Blockquote", { focus: true }), "Quote", <Quote size={16} />)}
        {iconBtn(() => toggleHeading(1), "Heading 1", <Heading1 size={16} />)}
        {iconBtn(() => toggleHeading(2), "Heading 2", <Heading2 size={16} />)}
        {iconBtn(() => toggleHeading(3), "Heading 3", <Heading3 size={16} />)}
        {iconBtn(() => Blocks.insertBlock(editor, "Table", { focus: true }), "Table", <Table size={16} />)}
        {iconBtn(() => Blocks.insertBlock(editor, "Image", { focus: true }), "Image", <Image size={16} />)}
        {iconBtn(() => Blocks.insertBlock(editor, "Video", { focus: true }), "Video", <Video size={16} />)}
        {iconBtn(() => Blocks.insertBlock(editor, "File", { focus: true }), "File", <FileIcon size={16} />)}
        {iconBtn(() => Blocks.insertBlock(editor, "Divider", { focus: true }), "Divider", <Minus size={16} />)}
        {iconBtn(() => Elements.insertElement(editor, {
          blockId: getCurrentBlock()?.id || "",
          type: "link",
          props: { url: "https://yoopta.dev", target: "_blank", nodeType: "inline" },
        }), "Link", <Link2 size={16} />)}
        {iconBtn(() => moveBlock("up"), "Move Block Up", <MoveUp size={16} />)}
        {iconBtn(() => moveBlock("down"), "Move Block Down", <MoveDown size={16} />)}
        {iconBtn(() => Blocks.duplicateBlock(editor, { focus: true }), "Duplicate Block", <Copy size={16} />)}
        {iconBtn(() => Blocks.deleteBlock(editor, { focusTarget: "previous" }), "Delete Block", <Trash2 size={16} />)}
      </div>
    </div>
  );
}

export default function YooptaMarkdownEditor() {
  const containerBoxRef = useRef<HTMLDivElement>(null);

  const editor = useMemo(() => {
    return withEmoji(
      withMentions(
        createYooptaEditor({
          plugins: applyTheme(WORD_PLUGINS) as never,
          marks: WORD_MARKS,
        }),
      ),
    );
  }, []);

  const onChange = (value: unknown) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {}
  };

  useEffect(() => {
    const localStorageValue = localStorage.getItem(STORAGE_KEY);
    const data = localStorageValue ? JSON.parse(localStorageValue) : INITIAL_VALUE;
    editor.setEditorValue(data);
  }, [editor]);

  const renderBlock = useCallback(({ children, blockId }: { children: ReactNode; blockId: string }) => {
    return <SortableBlock id={blockId}>{children}</SortableBlock>;
  }, []);

  return (
    <div className="word-root">
      <MiniWordToolbar editor={editor} />

      <div className="word-editor-bg">
        <div className="word-editor-shell">
          <div ref={containerBoxRef} className="word-paper">
            <div className="word-paper-inner">
              <BlockDndContext editor={editor}>
                <YooptaEditor
                  editor={editor}
                  style={EDITOR_STYLES}
                  onChange={onChange}
                  renderBlock={renderBlock}
                  placeholder="Type / to open menu, or start typing..."
                >
                  <SelectionBox selectionBoxElement={containerBoxRef} />
                  <MentionDropdown />
                  <EmojiDropdown />
                </YooptaEditor>
              </BlockDndContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
