import React, { useEffect, useState } from "react";
import "./admin.css";
import Spinner from "../Spinner"; // ✅ Import spinner

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedUser, setEditedUser] = useState({ email: "", userType: "" });
  const [loading, setLoading] = useState(true); // ✅ Spinner state

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();
      setUsers(data);
      setLoading(false); // ✅ Stop spinner
    } catch (err) {
      console.error("Error fetching users:", err);
      setLoading(false); // ✅ Stop spinner even on error
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${email}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.msg);
        fetchUsers();
      } else {
        alert(data.msg || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong");
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditedUser({ ...users[index] });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedUser({ email: "", userType: "" });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${users[editingIndex].email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });

      const data = await res.json();
      if (res.ok) {
        alert("User updated");
        setEditingIndex(null);
        fetchUsers();
      } else {
        alert(data.msg || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong");
    }
  };

  if (loading) return <Spinner />; // ✅ Show spinner while loading

  return (
    <div className="admin-users-container">
      <div className="admin-users-card">
        <h2>Manage Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Institution</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={index}>
                  <td>{u.name}</td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editedUser.email}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, email: e.target.value })
                        }
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td>{u.institution}</td>
                  <td>
                    {editingIndex === index ? (
                      <select
                        value={editedUser.userType}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, userType: e.target.value })
                        }
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="researcher">Researcher</option>
                      </select>
                    ) : (
                      u.userType
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <>
                        <button className="small-btn green" onClick={handleUpdate}>
                          ✅ Save
                        </button>
                        <button className="small-btn red" onClick={cancelEdit}>
                          ✖ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="small-btn blue" onClick={() => startEdit(index)}>
                          ✏ Edit
                        </button>
                        <button className="small-btn red" onClick={() => handleDelete(u.email)}>
                          🗑 Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
