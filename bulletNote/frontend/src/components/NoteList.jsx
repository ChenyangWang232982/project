import { useState, useEffect } from 'react';
import api from '../utils/axios';

const NoteList = () => {
  // state management
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  // form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [editingId, setEditingId] = useState(null); // ID setter

  // 1. get all notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await api.get('/notes');
      setNotes(data);
    } catch (err) {
      console.error('Failure to get notes', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. handle updating
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. create notes
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      const newNote = await api.post('/notes', formData);
      setNotes(prev => [newNote, ...prev]); // put note at the front
      resetForm(); // reset
    } catch (err) {
      console.error('Failure to create note: ', err);
    }
  };

  // 4. edit note
  const handleEditNote = (note) => {
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category
    });
    setEditingId(note.id);
  };

  // 5. submite
  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !editingId) return;

    try {
      const updatedNote = await api.put(`/notes/${editingId}`, formData);
      // update notes
      setNotes(prev => prev.map(note => note.id === editingId ? updatedNote : note));
      resetForm(); // reset
    } catch (err) {
      console.error('Failure to update note: ', err);
    }
  };

  // 6. Delete note
  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(note => note.id !== id)); 
    } catch (err) {
      console.error('Failure to delete note', err);
    }
  };

  // 7. resetForm
  const resetForm = () => {
    setFormData({ title: '', content: '', category: '' });
    setEditingId(null);
  };

  // Get note when page loaded
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>🔹 Bullet Note </h1>

      {/* form */}
      <form onSubmit={editingId ? handleUpdateNote : handleCreateNote} style={formStyle}>
        <h3 style={formTitleStyle}>
          {editingId ? 'Edit notes' : 'Create a new note'}
        </h3>
        <div style={formGroupStyle}>
          <label style={labelStyle}>title：</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Input the title of the note"
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Content：</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Input the content of the note"
            style={textareaStyle}
            rows={5}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Category：</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Input category（optional）"
            style={inputStyle}
          />
        </div>
        <div style={buttonGroupStyle}>
          <button type="submit" style={submitBtnStyle}>
            {editingId ? 'Update notes' : 'Add a note'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={cancelBtnStyle}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {/* Note list */}
      <div style={notesListStyle}>
        <h2 style={listTitleStyle}>My notes</h2>
        {loading ? (
          <p style={loadingStyle}>Loading ...</p>
        ) : notes.length === 0 ? (
          <p style={emptyStyle}>No notes</p>
        ) : (
          notes.map(note => (
            <div key={note.id} style={noteCardStyle}>
              <div style={noteHeaderStyle}>
                <h3 style={noteTitleStyle}>{note.title}</h3>
                <span style={noteCategoryStyle}>{note.category}</span>
              </div>
              <p style={noteContentStyle}>{note.content}</p>
              <div style={noteMetaStyle}>
                <span style={noteTimeStyle}>
                  {new Date(note.createdAt).toLocaleString()}
                </span>
                <div style={noteBtnGroupStyle}>
                  <button onClick={() => handleEditNote(note)} style={editBtnStyle}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteNote(note.id)} style={deleteBtnStyle}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// style
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: 'Arial, sans-serif'
};
const titleStyle = {
  textAlign: 'center',
  color: '#2c3e50',
  marginBottom: '30px'
};
const formStyle = {
  background: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '30px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};
const formTitleStyle = {
  margin: '0 0 20px 0',
  color: '#34495e'
};
const formGroupStyle = {
  marginBottom: '15px'
};
const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#34495e'
};
const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  boxSizing: 'border-box'
};
const textareaStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  boxSizing: 'border-box',
  resize: 'vertical'
};
const buttonGroupStyle = {
  display: 'flex',
  gap: '10px'
};
const submitBtnStyle = {
  padding: '8px 16px',
  background: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};
const cancelBtnStyle = {
  padding: '8px 16px',
  background: '#95a5a6',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};
const notesListStyle = {
  marginTop: '20px'
};
const listTitleStyle = {
  color: '#2c3e50',
  borderBottom: '2px solid #eee',
  paddingBottom: '10px'
};
const loadingStyle = {
  textAlign: 'center',
  color: '#7f8c8d',
  padding: '20px'
};
const emptyStyle = {
  textAlign: 'center',
  color: '#7f8c8d',
  padding: '20px',
  background: '#f8f9fa',
  borderRadius: '8px'
};
const noteCardStyle = {
  background: 'white',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '15px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};
const noteHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};
const noteTitleStyle = {
  margin: 0,
  color: '#2c3e50'
};
const noteCategoryStyle = {
  background: '#e74c3c',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px'
};
const noteContentStyle = {
  color: '#34495e',
  lineHeight: '1.6',
  marginBottom: '15px'
};
const noteMetaStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #eee',
  paddingTop: '10px'
};
const noteTimeStyle = {
  fontSize: '12px',
  color: '#7f8c8d'
};
const noteBtnGroupStyle = {
  display: 'flex',
  gap: '8px'
};
const editBtnStyle = {
  padding: '4px 8px',
  background: '#2ecc71',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};
const deleteBtnStyle = {
  padding: '4px 8px',
  background: '#e74c3c',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

export default NoteList;