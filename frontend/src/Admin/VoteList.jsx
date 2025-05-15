import React, { useEffect, useState } from "react";
import "./VoteList.css";
import { useNavigate } from "react-router-dom";

const VoteList = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [editingPollId, setEditingPollId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    duration:"",
    address: "",
    options: [],
  });
  const [filterProvince, setFilterProvince] = useState("");

  const nepaliProvinces = [
    "Koshi Province",
    "Madhesh Province",
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province",
  ];

  const fetchPolls = async () => {
    try {
      const res = await fetch("http://localhost:3333/polls", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setPolls(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleEditClick = (poll) => {
    setEditingPollId(poll._id);
    setEditForm({
      title: poll.title || "",
      description: poll.description || "",
      duration: poll.duration || 1,
      address: poll.address || "",
      options: poll.options.map((opt) => ({
        name: opt.name || "",
        imageUrl: opt.imageUrl || "",
        votes: opt.votes || 0,
        voters: opt.voters || [],
      })),
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) || 1 : value,
    }));
  };

  const handleOptionChange = (index, field, value) => {
    const updated = [...editForm.options];
    updated[index][field] = value;
    setEditForm((prev) => ({ ...prev, options: updated }));
  };

  const addOption = () => {
    setEditForm((prev) => ({
      ...prev,
      options: [...prev.options, { name: "", imageUrl: "", votes: 0, voters: [] }],
    }));
  };

  const removeOption = (index) => {
    const updated = [...editForm.options];
    updated.splice(index, 1);
    setEditForm((prev) => ({ ...prev, options: updated }));
  };

  const saveEdit = async () => {
    try {
      const updatedPoll = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        duration: editForm.duration,
        address: editForm.address,
        options: editForm.options.map((opt) => ({
          name: opt.name.trim(),
          imageUrl: opt.imageUrl || "",
          votes: opt.votes || 0,
          voters: opt.voters || [],
        })),
      };

      const res = await fetch(`http://localhost:3333/polls/${editingPollId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedPoll),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Update failed");
      }

      alert("Poll updated successfully!");
      setEditingPollId(null);
      fetchPolls();
    } catch (err) {
      console.error("Save error:", err);
      alert(`Failed to update poll: ${err.message}`);
    }
  };

  const deletePoll = async (id) => {
    if (!window.confirm("Are you sure you want to delete this poll?")) return;
    try {
      await fetch(`http://localhost:3333/polls/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPolls();
    } catch (err) {
      alert("Failed to delete poll");
      console.error(err);
    }
  };

  const manuallyClosePoll = async (id) => {
    try {
      await fetch(`http://localhost:3333/polls/${id}/close`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPolls();
    } catch (err) {
      alert("Failed to close poll");
      console.error(err);
    }
  };
  const publishPoll = async (id) => {
  try {
    const res = await fetch(`http://localhost:3333/polls/${id}/publish`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to publish");

    alert("Poll published successfully!");
    fetchPolls(); // Refresh the list
  } catch (err) {
    alert("Error publishing result.");
    console.error(err);
  }
};


  const calculateTotalVotes = (options) =>
    options.reduce((sum, opt) => sum + opt.votes, 0);

  const filteredPolls = filterProvince
    ? polls.filter((poll) => poll.address === filterProvince)
    : polls;

  return (
    
    <div className="vote-container">
      {/* 🔙 Back Button */}
      <button
        className="back-button"
        onClick={() => navigate("/admin")}
       
      >
        ← Back to Dashboard
      </button>

      <h2 className="vote-heading">All Created Polls</h2>

      <div className="filter-bar">
        <select
          value={filterProvince}
          onChange={(e) => setFilterProvince(e.target.value)}
          className="filter-select"
        >
          <option value="">All Provinces</option>
          {nepaliProvinces.map((prov, idx) => (
            <option key={idx} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {filteredPolls.length === 0 ? (
        <p className="coming-soon">No polls found for selected province.</p>
      ) : (
        <div className="poll-list">
          {filteredPolls.map((poll) => {
            const totalVotes = calculateTotalVotes(poll.options);
            return (
              <div className="poll-card" key={poll._id}>
                {editingPollId === poll._id && poll.status?.toLowerCase() === "active" ? (
                  <>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="edit-input"
                      placeholder="Poll title"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="edit-textarea"
                      placeholder="Poll description"
                    />
                    <input
                      type="number"
                      name="duration"
                      value={editForm.duration}
                      onChange={handleEditChange}
                      className="edit-input"
                      placeholder="Poll duration (hrs)"
                    />
                    <select
                      name="address"
                      value={editForm.address}
                      onChange={handleEditChange}
                      className="edit-input"
                      required
                    >
                      <option value="">Select Province</option>
                      {nepaliProvinces.map((prov, idx) => (
                        <option key={idx} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>

                    <div className="edit-options">
                      {editForm.options.map((opt, idx) => (
                        <div key={idx} className="edit-option">
                          <input
                            type="text"
                            value={opt.name}
                            onChange={(e) => handleOptionChange(idx, "name", e.target.value)}
                            className="edit-input"
                            placeholder={`Option ${idx + 1}`}
                          />
                          <input
                            type="text"
                            value={opt.imageUrl}
                            onChange={(e) => handleOptionChange(idx, "imageUrl", e.target.value)}
                            className="edit-input"
                            placeholder="Image URL"
                          />
                          {opt.imageUrl && (
                            <img
                              src={opt.imageUrl}
                              alt={`Option ${idx + 1}`}
                              className="option-image"
                            />
                          )}
                          <button onClick={() => removeOption(idx)} className="remove-btn">
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      ))}
                      <button onClick={addOption} className="action-btn save-btn">
                        <i className="fa fa-plus"></i> Add Option
                      </button>
                    </div>

                    <div className="poll-actions">
                      <button onClick={saveEdit} className="action-btn save-btn">
                        <i className="fa fa-floppy-disk"></i> Save
                      </button>
                      <button onClick={() => setEditingPollId(null)} className="action-btn cancel-btn">
                        <i className="fa fa-times"></i> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="poll-title">{poll.title}</h3>

                    <p className="poll-desc">{poll.description}</p>
                    <div className="poll-meta">
                      <span>Created: {new Date(poll.createdAt).toLocaleString()}</span>
                      <span>Duration: {poll.duration} hrs</span>
                      <span className={`poll-status ${poll.status?.toLowerCase()}`}>
                        {poll.status}
                      </span>
                    </div>

                    <ul className="poll-options">
                      {poll.options.map((opt, index) => {
                        const percentage = totalVotes
                          ? Math.round((opt.votes / totalVotes) * 100)
                          : 0;
                        return (
                          <li key={index} className="poll-option">
                            {opt.imageUrl && (
                              <img
                                src={opt.imageUrl}
                                alt={`Option ${index + 1}`}
                                className="option-thumbnail"
                              />
                            )}
                            <span>{opt.name}</span>
                            <div className="poll-bar">
                              <div className="poll-bar-fill" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="poll-percent">{percentage}%</span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="poll-actions">
                      {poll.status?.toLowerCase() === "active" && (
                        <>
                          <button onClick={() => handleEditClick(poll)} className="action-btn edit-btn">
                            <i className="fa fa-pen-to-square"></i> Edit
                          </button>
                          <button onClick={() => manuallyClosePoll(poll._id)} className="action-btn close-btn">
                            <i className="fa fa-ban"></i> Close
                          </button>
                        </>
                      )}
                      <button onClick={() => deletePoll(poll._id)} id="delete-btn">
                        <i className="fa fa-trash"></i> Delete
                      </button>
                      {poll.status?.toLowerCase() === "inactive" && !poll.isPublished && (
                      <button
                        onClick={() => publishPoll(poll._id)}
                        className="action-btn publish-btn"
                      >
                        <i className="fa fa-check-circle"></i> Publish Result
                      </button>
                    )}

                    {poll.isPublished && (
                      <span className="published-label"> Result Published</span>
                    )}


                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VoteList;
