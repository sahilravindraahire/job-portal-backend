import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Remote",
];

function JobFilterBar({ filters, onChange, onReset }) {
  const [local, setLocal] = useState(filters);

  const handleChange = (field, value) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(local);
  };

  const handleReset = () => {
    setLocal({
      keyword: "",
      location: "",
      jobType: "",
      minSalary: "",
      maxSalary: "",
      experienceLevel: "",
    });
    onReset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-line bg-paper p-4 sm:p-5 flex flex-col gap-4"
    >
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            id="keyword"
            placeholder="Search job title, skill, or keyword"
            value={local.keyword}
            onChange={(e) => handleChange("keyword", e.target.value)}
          />
        </div>
        <Button type="submit" className="shrink-0">
          <FiSearch size={16} />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <Input
          id="location"
          placeholder="Location"
          value={local.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
        <Input
          as="select"
          id="jobType"
          value={local.jobType}
          onChange={(e) => handleChange("jobType", e.target.value)}
        >
          <option value="">Job type</option>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Input>
        <Input
          id="experienceLevel"
          type="number"
          min="0"
          placeholder="Max exp (yrs)"
          value={local.experienceLevel}
          onChange={(e) => handleChange("experienceLevel", e.target.value)}
        />
        <Input
          id="minSalary"
          type="number"
          min="0"
          placeholder="Min salary"
          value={local.minSalary}
          onChange={(e) => handleChange("minSalary", e.target.value)}
        />
        <Input
          id="maxSalary"
          type="number"
          min="0"
          placeholder="Max salary"
          value={local.maxSalary}
          onChange={(e) => handleChange("maxSalary", e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 stamp text-gray-mid hover:text-ink cursor-pointer"
        >
          <FiX size={14} /> Clear filters
        </button>
        <Button type="submit" variant="outline" size="sm">
          Apply filters
        </Button>
      </div>
    </form>
  );
}

export default JobFilterBar;
