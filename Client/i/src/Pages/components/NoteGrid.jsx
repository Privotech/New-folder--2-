import "./NoteGrid.css";
import NoteCard from "./NoteCard";

export default function NoteGrid({
  notes,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  editingId,
  editFormData,
  onSaveEdit,
  onCancelEdit,
}) {
  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter((note) => note.isPinned);
  const regularNotes = notes.filter((note) => !note.isPinned);

  return (
    <div className="note-grid-container">
      {pinnedNotes.length > 0 && (
        <>
          <h3 className="section-title">Pinned</h3>
          <div className="note-grid">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
                onToggleArchive={onToggleArchive}
                isEditing={editingId === note._id}
                editFormData={editFormData}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
              />
            ))}
          </div>
        </>
      )}

      {regularNotes.length > 0 && (
        <>
          {pinnedNotes.length > 0 && <h3 className="section-title">Others</h3>}
          <div className="note-grid">
            {regularNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
                onToggleArchive={onToggleArchive}
                isEditing={editingId === note._id}
                editFormData={editFormData}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
