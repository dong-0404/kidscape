import ReactQuill from 'react-quill-new'

// Toolbar: formatting only (no image button — cover image is uploaded separately,
// and embedding base64 images would bloat the stored HTML).
const MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    ['clean'],
  ],
}

const FORMATS = ['header', 'bold', 'italic', 'underline', 'list', 'blockquote', 'link']

// Controlled WYSIWYG editor. `value`/`onChange` deal in HTML strings.
export default function RichTextEditor({ value, onChange }) {
  return (
    <div className="admin-editor">
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={MODULES} formats={FORMATS} />
    </div>
  )
}
