import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file

const App = () => {
  const [entries, setEntries] = useState([]);
  const [currentId, setCurrentId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAddEntryFields, setShowAddEntryFields] = useState(false);
  const [updatePasswordId, setUpdatePasswordId] = useState(null);
  const [updatedPassword, setUpdatedPassword] = useState('');

  // Load stored entries from localStorage on component mount
  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('passwordNotepadEntries')) || [];
    setEntries(storedEntries);
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('passwordNotepadEntries', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = () => {
    if (!currentId || !currentPassword) return;

    const newEntry = { id: currentId, password: currentPassword, updatedDate: new Date() };
    setEntries([...entries, newEntry]);

    // Clear input fields
    setCurrentId('');
    setCurrentPassword('');

    // Hide the input fields after adding an entry
    setShowAddEntryFields(false);
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
  };

  const handleUpdatePassword = (id) => {
    setUpdatePasswordId(id);
  };

  const handleCancelUpdatePassword = () => {
    setUpdatePasswordId(null);
    setUpdatedPassword('');
  };

  const handleSubmitUpdatePassword = () => {
    const updatedEntries = entries.map((entry) =>
      entry.id === updatePasswordId ? { ...entry, password: updatedPassword, updatedDate: new Date() } : entry
    );

    setEntries(updatedEntries);

    // Clear update password state
    setUpdatePasswordId(null);
    setUpdatedPassword('');
  };

  return (
    <div className="app-container">
      <div>
        <ul className="entry-list">
          {entries.map((entry) => (
            <li key={entry.id} className="entry-item">
              <span>{entry.id}</span>
              <button className="copy-button" onClick={() => handleCopyPassword(entry.password)}>
                Copy Password
              </button>
              <button className="copy-button" onClick={() => handleCopyId(entry.id)}>
                Copy ID
              </button>
              {!updatePasswordId && (
                <button className="update-button" onClick={() => handleUpdatePassword(entry.id)}>
                  Update Password
                </button>
              )}
              {updatePasswordId === entry.id && (
                <div className="update-password-box">
                  <span className="update-password-label">Update Password for ID: {updatePasswordId}</span>
                  <label>
                    New Password:
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={updatedPassword}
                      onChange={(e) => setUpdatedPassword(e.target.value)}
                    />
                    <button className="show-hide-button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'} Password
                    </button>
                  </label>
                  <div>
                    <button className="cancel-button" onClick={handleCancelUpdatePassword}>
                      Cancel
                    </button>{' '}
                    <button className="update-button" onClick={handleSubmitUpdatePassword}>
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="add-entry-section">
        <button className="add-entry-button" onClick={() => setShowAddEntryFields(true)}>
          Add Entry
        </button>
        {showAddEntryFields && (
          <div className="add-entry-fields">
            <label>
              Login ID:
              <input type="text" value={currentId} onChange={(e) => setCurrentId(e.target.value)} />
            </label>
            <br />
            <label>
              Password:
              <input
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button className="show-hide-button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'} Password
              </button>
            </label>
            <br />
            <button className="save-entry-button" onClick={handleAddEntry}>
              Save Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
