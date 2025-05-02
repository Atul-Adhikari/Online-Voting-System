import React, { useEffect, useState } from "react";
import "./UsersList.css";
import defaultUserImage from "../assets/Shashank.jpg";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState("All");

  // ✅ Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3333/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Delete user from backend
  const deleteUserFromAPI = async (id) => {
    try {
      const response = await fetch(`http://localhost:3333/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    const success = await deleteUserFromAPI(id);

    if (success) {
      setUsers((prev) => prev.filter((user) => user._id !== id)); // use _id from MongoDB
    } else {
      alert("Failed to delete user from server.");
    }
  };

  const filteredUsers =
    filteredRole === "All"
      ? users
      : users.filter((user) => user.role.toLowerCase() === filteredRole.toLowerCase());

  return (
    <div className="users-container">
      <h2 className="users-heading">Registered Users</h2>

      <div className="filter-bar">
        <label>Filter by Role: </label>
        <select value={filteredRole} onChange={(e) => setFilteredRole(e.target.value)}>
          <option value="All">All</option>
          <option value="admin">Admin</option>
          <option value="user">Voter</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Role</th>
              <th>Province</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={user.profileImage || defaultUserImage}
                    alt="user"
                    className="user-photo"
                  />
                </td>
                <td>{user.fullName}</td>
                <td className="email">{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.dateOfBirth}</td>
                <td>{user.gender}</td>
                <td>
                  <span className={`role ${user.role.toLowerCase()}`}>{user.role}</span>
                </td>
                <td>{user.address}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="delete-btn"
                    title="Delete User"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
