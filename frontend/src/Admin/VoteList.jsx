import React, { useEffect, useState } from "react";
import "./VoteList.css";

const VoteList = () => {
  const [polls, setPolls] = useState([]);
  const [editingPollId, setEditingPollId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    duration: "",
    province: "",
    options: []
  });
  const [filterProvince, setFilterProvince] = useState("");

  const nepaliProvinces = [
    "Koshi Province",
    "Madhesh Province",
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province"
  ];

  const fetchPolls = async () => {
    try {
      const res = await fetch("http://localhost:3333/polls", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
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
      title: poll.title,
      description: poll.description,
      duration: poll.duration,
      province: poll.address,
      options: poll.options.map((opt) => ({
        text: opt.name,
        image: opt.image,
        votes: opt.votes,
        voters: opt.voters
      }))
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const updated = [...editForm.options];
    updated[index].text = value;
    setEditForm((prev) => ({ ...prev, options: updated }));
  };

  const handleOptionImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("http://localhost:3333/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        const updated = [...editForm.options];
        updated[index].image = data.imageUrl;
        setEditForm((prev) => ({ ...prev, options: updated }));
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }
  };

  const addOption = () => {
    setEditForm((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", votes: 0, image: "" }],
    }));
  };

  const removeOption = (index) => {
    const updated = [...editForm.options];
    updated.splice(index, 1);
    setEditForm((prev) => ({ ...prev, options: updated }));
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:3333/polls/${editingPollId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          duration: Number(editForm.duration),
          province: editForm.province,
          options: editForm.options,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchPolls();
      setEditingPollId(null);
    } catch (err) {
      alert("Failed to update poll");
      console.error(err);
    }
  };

  const manuallyClosePoll = async (id) => {
    try {
      await fetch(`http://localhost:3333/polls/${id}/close`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      await fetchPolls();
    } catch (err) {
      alert("Failed to close poll");
      console.error(err);
    }
  };

  const deletePoll = async (id) => {
    try {
      await fetch(`http://localhost:3333/polls/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setPolls((prev) => prev.filter((poll) => poll._id !== id));
    } catch (err) {
      alert("Failed to delete poll");
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      deletePoll(id);
    }
  };

  const calculateTotalVotes = (options) =>
    options.reduce((sum, opt) => sum + opt.votes, 0);

  const filteredPolls = filterProvince
    ? polls.filter((poll) => poll.address === filterProvince)
    : polls;

  return (
    <div className="vote-container">
      <h2 className="vote-heading">All Created Polls</h2>

      <div className="filter-bar">
        <select
          value={filterProvince}
          onChange={(e) => setFilterProvince(e.target.value)}
          className="filter-select"
        >
          <option value="">All Provinces</option>
          {nepaliProvinces.map((prov, idx) => (
            <option key={idx} value={prov}>{prov}</option>
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
                      name="province"
                      value={editForm.province}
                      onChange={handleEditChange}
                      className="edit-input"
                      required
                    >
                      <option value="">Select Province</option>
                      {nepaliProvinces.map((prov, idx) => (
                        <option key={idx} value={prov}>{prov}</option>
                      ))}
                    </select>

                    <div className="edit-options">
                      {editForm.options.map((opt, idx) => (
                        <div key={idx} className="edit-option">
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            className="edit-input"
                            placeholder={`Option ${idx + 1}`}
                          />
                          <input
                            type="file"
                            onChange={(e) => handleOptionImageChange(e, idx)}
                            className="edit-input"
                          />
                          {opt.image && (
                            <img src={opt.image} alt={`Option ${idx + 1}`} className="option-image" />
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
                      <span className={`poll-status ${poll.status?.toLowerCase()}`}>{poll.status}</span>
                    </div>
                    <ul className="poll-options">
                      {poll.options.map((opt, index) => {
                        const percentage = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
                        return (
                          <li key={index} className="poll-option">
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
                      <button onClick={() => handleDelete(poll._id)} className="action-btn delete-btn">
                        <i className="fa fa-trash"></i> Delete
                      </button>
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
