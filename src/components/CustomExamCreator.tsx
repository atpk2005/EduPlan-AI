import React, { useState } from "react";
import { X, Plus, BookOpen, AlertCircle, Calendar, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../api";

interface CustomExamCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CustomExamCreator: React.FC<CustomExamCreatorProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSubject = () => {
    if (subjectInput.trim()) {
      if (!subjects.includes(subjectInput.trim())) {
        setSubjects([...subjects, subjectInput.trim()]);
      }
      setSubjectInput("");
    }
  };

  const handleRemoveSubject = (idx: number) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  const handleAddTopic = () => {
    if (topicInput.trim()) {
      if (!topics.includes(topicInput.trim())) {
        setTopics([...topics, topicInput.trim()]);
      }
      setTopicInput("");
    }
  };

  const handleRemoveTopic = (idx: number) => {
    setTopics(topics.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) {
      setError("Exam Name is strictly required.");
      return;
    }
    if (subjects.length === 0) {
      setError("Please add at least one subject to structure your exam preparation.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await api.post("/custom-exams", {
        examName: examName.trim(),
        examDate: examDate || "45 Days",
        subjects,
        topics
      });

      setExamName("");
      setExamDate("");
      setSubjects([]);
      setTopics([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to formulate exam preparation schedule. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="exam-creator-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          id="exam-creator-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Subtle decoration element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-amber-500/30 bg-amber-500/10 rounded-lg text-amber-400">
                <BookOpen className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-sans text-slate-100 tracking-tight">Create Custom Exam Prep</h3>
                <p className="text-xs font-mono text-slate-400">Engage accelerated revision and simulated testing roadmaps</p>
              </div>
            </div>
            <button
              id="close-exam-creator-btn"
              onClick={onClose}
              className="p-1.5 transition rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="p-3.5 border border-red-500/30 bg-red-500/10 rounded-xl text-xs font-mono text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-amber-500/25 border-t-amber-400 rounded-full animate-spin" />
                  <Sparkles className="w-8 h-8 text-amber-400 absolute animate-pulse" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h4 className="text-lg font-bold font-sans text-slate-100">Consulting AI Exam Committee...</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Gemini is currently mapping your prep timeline, compiling high weightage benchmarks, and projecting recommended study times per day!
                  </p>
                  <p className="text-xs font-mono text-amber-500/80 animate-pulse">Calculating syllabus coverage milestones...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Exam Name */}
                <div className="space-y-2">
                  <label htmlFor="exam-name-field" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                    Exam Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    id="exam-name-field"
                    type="text"
                    required
                    placeholder="e.g. AWS Certified Developer Associate, AP Environmental Science, Term 1 Finals"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-800 bg-slate-950/80 rounded-xl text-slate-250 placeholder-slate-500 text-sm focus:outline-hidden focus:border-amber-500 transition font-sans"
                  />
                </div>

                {/* Exam Date */}
                <div className="space-y-2">
                  <label htmlFor="exam-date-field" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                    Exam Target Date
                  </label>
                  <div className="relative">
                    <input
                      id="exam-date-field"
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-250 text-sm focus:outline-hidden focus:border-amber-400 transition font-mono"
                    />
                    <Calendar className="w-4 h-4 text-slate-450 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Subjects inputs */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold font-sans text-slate-100">Subjects to Revise</h4>
                      <p className="text-xs text-slate-405">Enter subjects relevant to this exam board</p>
                    </div>
                    <span className="text-xs font-mono text-amber-400/95 bg-amber-500/5 px-2.5 py-1 border border-amber-500/10 rounded-full">
                      {subjects.length} subjects registered
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      id="subject-input-box"
                      type="text"
                      placeholder="e.g. System Security, Advanced Routing, DynamoDB Design"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubject())}
                      className="flex-1 px-4 py-2 border border-slate-800 bg-slate-950/80 rounded-xl text-slate-250 placeholder-slate-500 text-xs focus:outline-hidden focus:border-amber-550 transition font-sans"
                    />
                    <button
                      id="add-subject-btn"
                      type="button"
                      onClick={handleAddSubject}
                      className="px-4 bg-slate-800 hover:bg-slate-750 text-slate-205 border border-slate-700 transition rounded-xl text-xs font-mono flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>

                  {/* Registered subject cards list */}
                  {subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2.5 bg-slate-1050/30 rounded-xl border border-slate-850/50">
                      {subjects.map((sub, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300"
                        >
                          <span className="truncate">{sub}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(i)}
                            className="text-slate-500 hover:text-red-400 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Focus Topics checklist */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold font-sans text-slate-100">High Weightage Focus Topics</h4>
                      <p className="text-xs text-slate-400">Chapters or areas needing intensive, error-free drill rehearsals</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                      {topics.length} topics logged
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      id="exam-topic-input-box"
                      type="text"
                      placeholder="e.g. Asynchronous execution boundaries, IAM policies, Key management KMS"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTopic())}
                      className="flex-1 px-4 py-2 border border-slate-800 bg-slate-950/80 rounded-xl text-slate-250 placeholder-slate-500 text-xs focus:outline-hidden focus:border-amber-500 transition font-sans"
                    />
                    <button
                      id="add-exam-topic-btn"
                      type="button"
                      onClick={handleAddTopic}
                      className="px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition rounded-xl text-xs font-mono flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>

                  {topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2.5 bg-slate-1050/30 rounded-xl border border-slate-850/50 max-h-[120px] overflow-y-auto">
                      {topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-350"
                        >
                          <span className="truncate max-w-[150px]">{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTopic(idx)}
                            className="text-slate-500 hover:text-red-400 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Actions Footer */}
            {!isLoading && (
              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-6">
                <button
                  id="cancel-exam-creation-btn"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-850 transition rounded-xl text-xs font-mono text-slate-300"
                >
                  Cancel
                </button>
                <button
                  id="submit-exam-prep-btn"
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 transition rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
                >
                  <Sparkles className="w-4 h-4 animate-spin" /> Map Exam Strategy
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
