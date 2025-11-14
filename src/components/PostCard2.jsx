import React, { useState } from 'react';

export default function PostCard2({
  id,
  title,
  body,
  showBody,
  highlight,
  disabled,
  onSave,
  onDelete,
  onToggleDisable,
  onAddAfter,
}) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editBody, setEditBody] = useState(body);
  const [adding, setAdding] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addBody, setAddBody] = useState('');

  const save = () => {
    onSave && onSave(id, { title: editTitle, body: editBody });
    setEditing(false);
  };

  const remove = () => {
    if (window.confirm('Delete this post?')) onDelete && onDelete(id);
  };

  const toggleDisable = () => {
    onToggleDisable && onToggleDisable(id);
  };

  const submitAdd = (e) => {
    e.preventDefault();
    if (!addTitle && !addBody) return;
    onAddAfter && onAddAfter(id, { title: addTitle, body: addBody });
    setAddTitle('');
    setAddBody('');
    setAdding(false);
  };

  return (
    <article
      className={
        'card' +
        (highlight ? ' highlight' : '') +
        (disabled ? ' disabled-card' : '')
      }
    >
      <div className="card-header">
        {editing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        ) : (
          <h3 className="card-title">{title}</h3>
        )}
        {/* {body && body.length > 120 && <span className="badge">Long</span>} */}
      </div>

      {editing ? (
        <textarea
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
          rows={4}
        />
      ) : showBody ? (
        <p className="card-body">{body}</p>
      ) : (
        <p className="card-body muted">(body hidden)</p>
      )}

      <div className="card-actions">
        {disabled ? (
          <button className="page-button" onClick={toggleDisable}>
            Enable
          </button>
        ) : editing ? (
          <>
            <button className="page-button" onClick={save}>
              Save
            </button>
            <button
              className="page-button"
              onClick={() => {
                setEditing(false);
                setEditTitle(title);
                setEditBody(body);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="page-button"
              onClick={() => {
                setEditing(true);
                setEditTitle(title);
                setEditBody(body);
              }}
              disabled={disabled}
            >
              Edit
            </button>
            <button
              className="page-button"
              onClick={remove}
              disabled={disabled}
            >
              Delete
            </button>
            <button className="page-button" onClick={toggleDisable}>
              {disabled ? 'Enable' : 'Disable'}
            </button>
            <button
              className="page-button"
              onClick={() => setAdding((s) => !s)}
              disabled={disabled}
            >
              {adding ? 'Close' : 'Add after'}
            </button>
          </>
        )}
      </div>

      {adding && (
        <form onSubmit={submitAdd} className="card-add-form">
          <input
            placeholder="Title"
            value={addTitle}
            onChange={(e) => setAddTitle(e.target.value)}
          />
          <textarea
            placeholder="Body"
            value={addBody}
            onChange={(e) => setAddBody(e.target.value)}
            rows={3}
          />
          <div className="card-actions">
            <button type="submit" className="page-button">
              Add
            </button>
            <button
              type="button"
              className="page-button"
              onClick={() => {
                setAdding(false);
                setAddTitle('');
                setAddBody('');
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <footer className="card-footer">Post ID: {id}</footer>
    </article>
  );
}
