import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Your backend server URL

const App = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    // Fetch initial projects
    socket.emit("getProjects");
    socket.on("projects", (data) => setProjects(data));

    // Listen for real-time updates
    socket.on("projectAdded", (project) => {
      setProjects((prev) => [...prev, project]);
      setUpdates((prev) => [...prev, `New project added: ${project.name}`]);
    });

    socket.on("projectUpdated", (updatedProject) => {
      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === updatedProject._id ? updatedProject : proj
        )
      );
      setUpdates((prev) => [
        ...prev,
        `Project updated: ${updatedProject.name}`,
      ]);
    });

    return () => {
      socket.off("projects");
      socket.off("projectAdded");
      socket.off("projectUpdated");
    };
  }, []);

  const addProject = () => {
    if (newProject.trim()) {
      socket.emit("addProject", { name: newProject });
      setNewProject("");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Real-Time Collaboration Tool</h1>
      <div>
        <h2>Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <strong>{project.name}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Add New Project</h3>
        <input
          type="text"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="Enter project name"
        />
        <button onClick={addProject}>Add</button>
      </div>

      <div>
        <h3>Real-Time Updates</h3>
        <ul>
          {updates.map((update, index) => (
            <li key={index}>{update}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

