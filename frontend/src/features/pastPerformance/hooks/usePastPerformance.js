import { useState, useEffect } from "react";
import { getCurrentUserId } from "../../../utils/auth";
import { pastPerformanceService } from "../services/pastPerformanceAPI";

const API_BASE = "http://localhost:8000/past-performance";

export const usePastPerformance = () => {
  const currentUserId = getCurrentUserId();
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    bestSubject: { name: "N/A", score: 0 },
    worstSubject: { name: "N/A", score: 0 },
    avgStudyHours: 0,
    avgMockTest: 0
  });
  const [editingSubject, setEditingSubject] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [desiredGrade, setDesiredGrade] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [availableGrades] = useState(["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"]);

  // Load subjects and performance data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!currentUserId) {
        console.log("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        // Load subjects with performance data
        const subjectsData = await pastPerformanceService.loadSubjectsWithPerformance();
        
        if (subjectsData.success) {
          const transformedSubjects = subjectsData.subjects.map(subject => ({
            id: subject.id,
            name: subject.name,
            target: "A",
            test1: subject.performance?.test1 || null,
            test2: subject.performance?.test2 || null,
            assignment: subject.performance?.assignment || null,
            mockTest: subject.performance?.mock_test || null,
            totalStudyHours: subject.performance?.total_study_hours || null
          }));
          
          const subjectsWithData = transformedSubjects.filter(subject => 
            subject.test1 !== null || 
            subject.test2 !== null || 
            subject.assignment !== null || 
            subject.mockTest !== null ||
            subject.totalStudyHours !== null
          );
          
          setSubjects(subjectsWithData);
        } else {
          console.error("Failed to load subjects:", subjectsData.error);
        }

        // Load performance summary
        const summaryResponse = await pastPerformanceService.getPerformanceSummary();
        if (summaryResponse.success) {
          setSummaryData({
            bestSubject: summaryResponse.best_subject,
            worstSubject: summaryResponse.worst_subject,
            avgStudyHours: summaryResponse.avg_study_hours,
            avgMockTest: summaryResponse.avg_mock_test
          });
        } else {
          console.error("Failed to load summary:", summaryResponse.error);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUserId]);

  // Refresh performance summary after any update operations
  const refreshSummaryData = async () => {
    try {
      const summaryResponse = await pastPerformanceService.getPerformanceSummary();
      if (summaryResponse.success) {
        setSummaryData({
          bestSubject: summaryResponse.best_subject,
          worstSubject: summaryResponse.worst_subject,
          avgStudyHours: summaryResponse.avg_study_hours,
          avgMockTest: summaryResponse.avg_mock_test
        });
      }
    } catch (error) {
      console.error("Error refreshing summary data:", error);
    }
  };

  const predictGradeProbability = async (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    if (!subject.test1 && !subject.test2 && !subject.assignment && !subject.mockTest && !subject.totalStudyHours) {
      alert("No performance data available for prediction. Please add some scores first.");
      return;
    }

    setSelectedSubject(subject);
    setShowPredictionModal(true);
    setPredictionResult(null);
  };

  const submitPrediction = async () => {
    if (!desiredGrade) {
      alert("Please select a desired grade");
      return;
    }

    if (!currentUserId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const data = await pastPerformanceService.predictGradeProbability(selectedSubject.name, desiredGrade);
      
      if (data.success) {
        setPredictionResult(data);
      } else {
        console.error("Prediction failed:", data.error);
        alert(`Failed to predict probability: ${data.error}`);
      }
    } catch (error) {
      console.error("Error predicting probability:", error);
      alert("Error occurred while predicting probability. Please try again.");
    }
  };

  const addSubject = async () => {
    const trimmedName = newSubjectName.trim();

    if(!trimmedName){
      alert("Subject name cannot be empty");
      return;
    }

    if(trimmedName.length>20){
      alert("Subject name must be 20 characters or less");
      return;
    }

    if (!currentUserId) {
        console.error("User not authenticated");
        return;
    }

    try {
      const data = await pastPerformanceService.createSubject(trimmedName);
      
      if (data.success) {
        const newSubject = {
          id: data.data.subject_id,
          name: trimmedName,
          target: "A",
          test1: null,
          test2: null,
          assignment: null,
          mockTest: null
        };
          
        setSubjects([...subjects, newSubject]);
        setNewSubjectName('');
        setShowAddForm(false);

        await refreshSummaryData();
      } else {
        console.error("Failed to create performance record:", data.error);
      }
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  const saveEdit = async () => {

    if (!currentUserId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const requestBody = {
        test1: editingSubject.test1,
        test2: editingSubject.test2,
        assignment: editingSubject.assignment,
        mock_test: editingSubject.mockTest,
        total_study_hours: editingSubject.totalStudyHours,
      };
  
      const data = await pastPerformanceService.updatePerformance(editingSubject.name, requestBody);
      
      if (data.success) {
        setSubjects(subjects.map(subject => 
          subject.id === editingSubject.id ? editingSubject : subject
        ));
        setEditingSubject(null);
        
        await refreshSummaryData();
      } else {
        console.error("Failed to update performance record:", data.error);
      }
    } catch (error) {
      console.error("Error updating performance record:", error);
    }
  };

  const deleteSubject = async (id) => {
    if (!currentUserId) {
      console.error("User not authenticated");
      return;
    }

    const subjectToDelete = subjects.find(subject => subject.id === id);
    if (!subjectToDelete) return;

    if (!window.confirm(`Are you sure you want to clear all performance data for ${subjectToDelete.name}? The subject will remain but all scores will be reset.`)) {
      return;
    }

    try {
      const data = await pastPerformanceService.deletePerformance(subjectToDelete.name);
      
      if (data.success) {
      // Remove the subject completely from the list
      setSubjects(subjects.filter(subject => subject.id !== id));
      console.log("Subject and performance data deleted successfully!");
      
      await refreshSummaryData();
      } else {
        console.error("Failed to delete performance record:", data.error);
      }
    } catch (error) {
      console.error("Error deleting performance record:", error);
    }
  };

  const startEditing = (subject) => {
    setEditingSubject({ ...subject });
  };

  const handleMarkChange = (field, value) => {
    setEditingSubject({
      ...editingSubject,
      [field]: value === '' ? null : parseFloat(value)
    });
  };

  const cancelEdit = () => {
    setEditingSubject(null);
  };

  return {
    subjects,
    loading,
    summaryData,
    editingSubject,
    newSubjectName,
    setNewSubjectName,
    showAddForm,
    setShowAddForm,
    showPredictionModal,
    setShowPredictionModal,
    selectedSubject,
    desiredGrade,
    setDesiredGrade,
    predictionResult,
    setPredictionResult,
    availableGrades,
    predictGradeProbability,
    submitPrediction,
    addSubject,
    saveEdit,
    deleteSubject,
    startEditing,
    handleMarkChange,
    cancelEdit,
    currentUserId
  };
};