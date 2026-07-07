import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Alert from "../features/jobs/jobSlice.js";
import { createJob } from "../features/jobs/jobSlice.js";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Remote",
];

function PostJobPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.job);

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    experienceLevel: "",
    location: "",
    jobType: "Full-time",
    vacencies: "",
  });

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createJob(form));
    if (createJob.fulfilled.match(result)) {
      navigate("/employer/jobs");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl mb-1">Post a new job</h1>
      <p className="text-gray-mid text-sm mb-8">
        This will be visible to all job seekers immediately.
      </p>

      {error && (
        <div className="mb-5">
          <Alert type="error" message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="title"
          label="Job title"
          required
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <Input
          as="textarea"
          id="description"
          label="Description"
          rows={5}
          required
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <Input
          id="requirements"
          label="Requirements (comma separated)"
          placeholder="React, Node.js, 2+ years experience"
          value={form.requirements}
          onChange={(e) => handleChange("requirements", e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="salary"
            label="Salary (₹)"
            type="number"
            required
            value={form.salary}
            onChange={(e) => handleChange("salary", e.target.value)}
          />
          <Input
            id="experienceLevel"
            label="Experience (yrs)"
            type="number"
            required
            value={form.experienceLevel}
            onChange={(e) => handleChange("experienceLevel", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="location"
            label="Location"
            required
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
          <Input
            as="select"
            id="jobType"
            label="Job type"
            value={form.jobType}
            onChange={(e) => handleChange("jobType", e.target.value)}
          >
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Input>
        </div>
        <Input
          id="vacencies"
          label="Number of vacancies"
          type="number"
          required
          value={form.vacencies}
          onChange={(e) => handleChange("vacencies", e.target.value)}
        />
        <Button
          type="submit"
          loading={status === "loading"}
          className="w-full mt-2"
        >
          Publish job
        </Button>
      </form>
    </div>
  );
}

export default PostJobPage;
