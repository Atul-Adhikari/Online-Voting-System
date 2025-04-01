import React, { useEffect, useState } from "react";
import "./UsersList.css";
import defaultUserImage from "../assets/Shashank.jpg";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState("All");

  // Fetch users from API (mocked for now)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // TODO: Replace with your real API
        // const response = await fetch("https://your-api-url.com/users");
        // const data = await response.json();
        const sampleData = [
          {
            id: 1,
            firstName: "Aarav",
            lastName: "Shrestha",
            phone: "9800000001",
            email: "aravsssssssssssssssss@example.com",
            dob: "2000-01-15",
            gender: "Male",
            role: "Voter",
            city: "Koshi ",
            profileImage: "https://via.placeholder.com/40"
          },
          {
            id: 2,
            firstName: "Sita",
            lastName: "Bhandari",
            phone: "9800000002",
            email: "sita.b@example.com",
            dob: "1995-05-10",
            gender: "Female",
            role: "Admin",
            city: "Gandaki",  
            profileImage: "https://via.placeholder.com/40"
          },
          {
            id: 3,
            firstName: "Ravi",
            lastName: "Karki",
            phone: "9800000003",
            email: "ravi.k@example.com",
            dob: "1998-08-22",
            gender: "Male",
            role: "Voter",
            city: "Bagmati",  
            profileImage: defaultUserImage
          }
        ];
        setUsers(sampleData); // replace with setUsers(data)
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Delete user from API (prepared)
  const deleteUserFromAPI = async (id) => {
    try {
      // TODO: Replace with your real API endpoint
      const response = await fetch(`https://your-api-url.com/users/${id}`, {
        method: "DELETE"
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
      setUsers((prev) => prev.filter((user) => user.id !== id));
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
        <select
          value={filteredRole}
          onChange={(e) => setFilteredRole(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Admin">Admin</option>
          <option value="Voter">Voter</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Role</th>
              <th>Province</th> {/* New City Column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={user.profileImage || defaultUserImage}
                    alt="user"
                    className="user-photo"
                  />
                </td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.phone}</td>
                <td className="email">{user.email}</td>
                <td>{user.dob}</td>
                <td>{user.gender}</td>
                <td>
                  <span className={`role ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.city}</td> {/* Display the city here */}
                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
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
