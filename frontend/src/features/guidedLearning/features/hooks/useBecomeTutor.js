import { useState } from "react";
import { becomeTutorAPI } from '../services/becomeTutorAPI';

export function useBecomeTutor() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subjects: "", // Will be converted to array in API
    experience: "",
    hourlyRate: "",
    teachingMode: [] // Array to store ["Online", "Physical"]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTeachingModeChange = (mode) => {
    setFormData(prev => {
      const currentModes = prev.teachingMode;
      if (currentModes.includes(mode)) {
        // Remove if already selected
        return {
          ...prev,
          teachingMode: currentModes.filter(m => m !== mode)
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          teachingMode: [...currentModes, mode]
        };
      }
    });
  };

  const submitTutor = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }
      if (!formData.subjects.trim()) {
        throw new Error("Subjects are required");
      }
      if (!formData.experience || parseInt(formData.experience) < 0) {
        throw new Error("Valid experience is required");
      }
      if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
        throw new Error("Valid hourly rate is required");
      }
      if (formData.teachingMode.length === 0) {
        throw new Error("Please select at least one teaching mode");
      }

      await becomeTutorAPI.submitTutorApplication(formData);
      
      setSuccess(true);
      // Reset form
      setFormData({
        name: "",
        phone: "",
        subjects: "",
        experience: "",
        hourlyRate: "",
        teachingMode: []
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    success,
    updateField,
    handleTeachingModeChange,
    submitTutor
  };
}