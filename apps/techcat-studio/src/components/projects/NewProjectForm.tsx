"use client";

import { useState } from "react";

const NewProjectForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!name.trim()) {
      setError("Project Name is required");
      return;
    }
    const data = { name, description, techStack };
    console.log("New Project Data:", data);
    setMessage("Project created!");
    setName("");
    setDescription("");
    setTechStack("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="font-medium">
          Project Name
        </label>
        <input
          id="name"
          type="text"
          className="rounded-md border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="font-medium">
          Description
        </label>
        <textarea
          id="description"
          className="rounded-md border px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="techStack" className="font-medium">
          Tech Stack
        </label>
        <input
          id="techStack"
          type="text"
          className="rounded-md border px-3 py-2"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Create Project
      </button>
    </form>
  );
};

export default NewProjectForm;

