import React, { useState } from "react";
import { Sparkles, X, Plus, Trash2, Calendar, Target, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../api";

interface CustomSubjectCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CustomSubjectCreator: React.FC<CustomSubjectCreatorProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [targetDate, setTargetDate] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFieldTopic = () => {
    if (topicInput.trim()) {
      if (!topics.includes(topicInput.trim())) {
        setTopics([...topics, topicInput.trim()]);
      }
      setTopicInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFieldTopic();
    }
  };

  const handleRemoveTopic = (indexToRemove: number) => {
    setTopics(topics.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setError("Please provide a name for your custom subject.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call premium backend API containing real Gemini learning roadmaps 
      await api.post("/custom-subjects", {
        subjectName: subjectName.trim(),
        description: description.trim(),
        difficulty,
        targetDate: targetDate || "30 Days",
        initialTopics: topics
      });

      // Reset state and close
      setSubjectName("");
      setDescription("");
      setDifficulty("Intermediate");
      setTargetDate("");
      setTopics([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to formulate custom study plan. Please verify server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="subject-creator-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          id="subject-creator-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Sparkles Floating Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-emerald-500/30 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-sans text-slate-100 tracking-tight">Create Custom Subject</h3>
                <p className="text-xs font-mono text-slate-400">Unlock custom learning paths with AI roadmapping</p>
              </div>
            </div>
            <button
              id="close-subject-creator-btn"
              onClick={onClose}
              className="p-1.5 transition rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="p-3.5 border border-red-500/30 bg-red-500/10 rounded-xl text-xs font-mono text-red-400">
                ⚠️ {error}
              </div>
            )}

            {/* Loading Cover State */}
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-emerald-500/25 border-t-emerald-400 rounded-full animate-spin" />
                  <Sparkles className="w-8 h-8 text-emerald-400 absolute animate-pulse" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h4 className="text-lg font-bold font-sans text-slate-100 animate-pulse">Consulting AI Academic Advisor...</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Gemini is currently analyzing your syllabus parameters to engineer week-by-week checkpoints, revision targets, and estimate your required learning dedication.
                  </p>
                  <p className="text-xs font-mono text-emerald-500/80">Formatting roadmap matrix...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Subject Name Input */}
                <div className="space-y-2">
                  <label htmlFor="subject-name-field" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                    Subject Name <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    id="subject-name-field"
                    type="text"
                    required
                    placeholder="e.g. Web Development, UPSC Indian Polity, Stock Market Trading"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-800 bg-slate-950/80 rounded-xl text-slate-250 placeholder-slate-500 text-sm focus:outline-hidden focus:border-emerald-500 transition font-sans"
                  />
                </div>

                {/* Description input */}
                <div className="space-y-2">
                  <label htmlFor="subject-desc-field" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                    Syllabus Target or Description
                  </label>
                  <textarea
                    id="subject-desc-field"
                    rows={2}
                    placeholder="Describe what you want to achieve or copy your core textbook syllabus paragraphs here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-800 bg-slate-950/80 rounded-xl text-slate-250 placeholder-slate-500 text-sm focus:outline-hidden focus:border-emerald-500 transition font-sans resize-none"
                  />
                </div>

                {/* Difficulty & Target Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                      Difficulty Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Beginner", "Intermediate", "Advanced"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          className={`py-2 px-3 text-xs font-mono rounded-xl border transition ${
                            difficulty === level
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold"
                              : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject-date-field" className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                      Target Completion Date
                    </label>
                    <div className="relative">
                      <input
                        id="subject-date-field"
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-250 text-sm focus:outline-hidden focus:border-emerald-500 transition font-mono"
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Topics Setup Section */}
                <div className="space-y-4 border-t border-slate-800 pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold font-sans text-slate-100 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-emerald-400" />
                        Specific Core Topics
                      </h4>
                      <p className="text-xs text-slate-400">Add key syllabus chapters manually or let AI generate them</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-500/80 bg-emerald-500/5 px-2.5 py-1 border border-emerald-500/10 rounded-full">
                      {topics.length} topics declared
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      id="topic-manual-add"
                      type="text"
                      placeholder="e.g. Hooks and Context, Backpropagation algorithms"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1 px-4 py-2 border border-slate-800 bg-slate-950/80 rounded-xl text-slate-250 placeholder-slate-500 text-xs focus:outline-hidden focus:border-emerald-500 transition font-sans"
                    />
                    <button
                      id="topic-add-confirm-btn"
                      type="button"
                      onClick={handleAddFieldTopic}
                      className="px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition rounded-xl text-xs font-mono flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>

                  {/* Added Topics Pills list */}
                  {topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-950/40 rounded-xl border border-slate-850/60 max-h-[140px] overflow-y-auto">
                      {topics.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-350"
                        >
                          <span className="font-sans truncate max-w-[200px]">{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTopic(idx)}
                            className="text-slate-500 hover:text-red-400 p-0.5 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {topics.length === 0 && (
                    <div className="p-3 border border-dashed border-slate-800 bg-slate-950/10 rounded-xl text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-emerald-500/40" />
                      No topics added yet. Leaving this empty lets AI auto-generate the complete syllabus core for you!
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Footer Form Controls */}
            {!isLoading && (
              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-6">
                <button
                  id="cancel-subject-creator-btn"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-850 transition rounded-xl text-xs font-mono text-slate-300"
                >
                  Cancel
                </button>
                <button
                  id="submit-subject-creator-btn"
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
                >
                  <Sparkles className="w-4 h-4" /> Formulate Learning Plan
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
