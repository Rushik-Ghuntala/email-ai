import React from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill/dist/quill.snow.css'

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  toolbarId: string
}

const CustomToolbar: React.FC<{ toolbarId: string }> = ({ toolbarId }) => {
  const isSubject = toolbarId === 'toolbar-subject'

  return (
    <div className='ql-toolbar ql-snow flex items-center space-x-1 border-0 border-b border-gray-200 px-4 py-2'>
      {/* Font Family Dropdown */}
      <select className='ql-font focus:outline-none'>
        <option value='sans-serif'>Sans Serif</option>
        <option value='serif'>Serif</option>
        <option value='monospace'>Monospace</option>
      </select>

      <div className='mx-2 h-5 border-l border-gray-300' />

      {/* Size/Style Dropdown */}
      <select className='ql-size focus:outline-none'>
        <option value='normal'>Normal</option>
        <option value='small'>Small</option>
        <option value='large'>Large</option>
        <option value='huge'>Huge</option>
      </select>

      <div className='mx-2 h-5 border-l border-gray-300' />

      {/* Basic Text Formatting */}
      <button className='ql-bold focus:outline-none' />
      <button className='ql-italic focus:outline-none' />
      <button className='ql-underline focus:outline-none' />

      {/* Additional options only for body toolbar */}
      {!isSubject && (
        <>
          <button className='ql-strike focus:outline-none' />

          <div className='mx-2 h-5 border-l border-gray-300' />

          {/* Text Size Controls */}
          {/* <button className='ql-script focus:outline-none' value='super' />
          <button className='ql-script focus:outline-none' value='sub' />

          <div className='mx-2 h-5 border-l border-gray-300' /> */}

          {/* Text Color Control */}
          <select className='ql-color focus:outline-none'></select>
          <div className='mx-2 h-5 border-l border-gray-300' />

          {/* Text Alignment Buttons */}
          <button
            className='ql-align'
            value=''
            title='Align Left'
          />
          <button
            className='ql-align'
            value='center'
            title='Align Center'
          />
          <button
            className='ql-align'
            value='right'
            title='Align Right'
          />

          <div className='mx-2 h-5 border-l border-gray-300' />

          {/* Lists */}
          <button
            className='ql-list focus:outline-none'
            value='ordered'
          />
          <button
            className='ql-list focus:outline-none'
            value='bullet'
          />
          {/* <button className='ql-indent focus:outline-none' value='-1' />
          <button className='ql-indent focus:outline-none' value='+1' /> */}

          <div className='mx-2 h-5 border-l border-gray-300' />

          {/* Insert Options */}
          <button className='ql-link focus:outline-none' />
          <button className='ql-image focus:outline-none' />
        </>
      )}
    </div>
  )
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  toolbarId,
}) => {
  const isSubject = toolbarId === 'toolbar-subject'

  const modules = {
    toolbar: {
      container: `#${toolbarId}`,
      handlers: {
        // Disable handlers for subject toolbar if needed
        image: isSubject ? false : undefined,
        link: isSubject ? false : undefined,
      },
    },
  }

  const customStyles = `
    .ql-toolbar.ql-snow {
      font-family: inherit;
    }
    .ql-toolbar.ql-snow .ql-picker {
      height: 24px;
    }
    .ql-toolbar.ql-snow .ql-picker-label {
      border: none;
      padding: 0 4px;
    }
    .ql-toolbar.ql-snow button {
      height: 24px;
      width: 24px;
      padding: 2px;
    }
    .ql-toolbar.ql-snow button:hover {
      color: #000;
    }
    .ql-toolbar.ql-snow .ql-picker-label:hover {
      color: #000;
    }
    .ql-container.ql-snow {
      border: none;
      font-family: inherit;
    }
  `

  return (
    <div className='text-editor rounded-lg border border-gray-200'>
      <style>{customStyles}</style>
      <div id={toolbarId}>
        <CustomToolbar toolbarId={toolbarId} />
      </div>
      <ReactQuill
        theme='snow'
        value={value}
        onChange={onChange}
        modules={modules}
        className='editor !border-0'
      />
    </div>
  )
}

export default TextEditor
