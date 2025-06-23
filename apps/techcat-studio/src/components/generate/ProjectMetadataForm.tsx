"use client";

import { useState } from "react";

const ProjectMetadataForm = () => {
  const [overview, setOverview] = useState("");
  const [intendedUsers, setIntendedUsers] = useState("");
  const [techStack, setTechStack] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");

  const metadata = {
    overview,
    intendedUsers,
    techStack,
    successCriteria,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="overview" className="font-medium">
          Project Overview
        </label>
        <textarea
          id="overview"
          className="rounded-md border px-3 py-2"
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="intendedUsers" className="font-medium">
          Intended Users
        </label>
        <textarea
          id="intendedUsers"
          className="rounded-md border px-3 py-2"
          value={intendedUsers}
          onChange={(e) => setIntendedUsers(e.target.value)}
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
      <div className="flex flex-col gap-1">
        <label htmlFor="successCriteria" className="font-medium">
          Success Criteria
        </label>
        <textarea
          id="successCriteria"
          className="rounded-md border px-3 py-2"
          value={successCriteria}
          onChange={(e) => setSuccessCriteria(e.target.value)}
        />
      </div>
      <pre className="rounded-md bg-gray-100 p-3 text-sm dark:bg-zinc-800">
        {JSON.stringify(metadata, null, 2)}
      </pre>
    </div>
  );
};

export default ProjectMetadataForm;
