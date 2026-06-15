import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Activity, 
  CheckSquare,
  Trash2,
  Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../api";

interface CustomTopic {
  id: number;
  customSubjectId: number;
  topicName: string;
  description: string;
  status: "PENDING" | "COMPLETED";
  confidenceLevel: string;
}

interface CustomSubject {
  id: number;
  userId: number;
  subjectName: string;
  description: string;
  difficulty: string;
  targetDate: string;
  createdAt: string;
  topics: CustomTopic[];
  aiAnalysis?: {
    estimatedEffort: string;
    roadmap: { week: string; focus: string }[];
    revisionSchedule: string;
    milestones: string[];
  };
}

interface SubjectRoadmapDrawerProps {
  subject: CustomSubject | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const SubjectRoadmapDrawer: React.FC<SubjectRoadmapDrawerProps> = ({
  subject,
  isOpen,
  onClose,
  onRefresh
}) => {
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDesc, setNewTopicDesc] = useState("");
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subject Editing States
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [editedDiff, setEditedDiff] = useState("");
  const [editedTargetDate, setEditedTargetDate] = useState("");

  const startEditingSubject = () => {
    if (!subject) return;
    setEditedName(subject.subjectName);
    setEditedDesc(subject.description);
    setEditedDiff(subject.difficulty || "Intermediate");
    setEditedTargetDate(subject.targetDate || "");
    setIsEditingSubject(true);
  };

  const handleSaveSubjectEdit = async () => {
    if (!subject) return;
    if (!editedName.trim()) {
      setError("Subject name cannot be empty");
      return;
    }
    try {
      setError(null);
      await api.put(`/custom-subjects/${subject.id}`, {
        subjectName: editedName.trim(),
        description: editedDesc.trim(),
        difficulty: editedDiff,
        targetDate: editedTargetDate
      });
      setIsEditingSubject(false);
      onRefresh();
    } catch (err) {
      console.error("Failed to update subject:", err);
      setError("Failed to update subject attributes.");
    }
  };

  const handleDeleteSubject = async () => {
    if (!subject) return;
    if (!window.confirm(`Are you absolutely sure you want to permanently delete "${subject.subjectName}" and all associated topics/tasks?`)) {
      return;
    }
    try {
      await api.delete(`/custom-subjects/${subject.id}`);
      onClose();
      onRefresh();
    } catch (err) {
      console.error("Failed to delete subject:", err);
      setError("Failed to delete subject from workspace.");
    }
  };

  const handleDeleteTopic = async (topicId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering topic completion toggles
    if (!subject) return;
    if (!window.confirm("Are you sure you want to delete this topic from this curriculum roadmap?")) {
      return;
    }
    try {
      await api.delete(`/custom-subjects/${subject.id}/topics/${topicId}`);
      onRefresh();
    } catch (err) {
      console.error("Failed to delete topic:", err);
    }
  };

  if (!isOpen || !subject) return null;

  const topicsList = subject.topics || [];
  const completedCount = topicsList.filter(t => t.status === "COMPLETED").length;
  const totalCount = topicsList.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 105) / 1.05 : 0; // round safely

  const handleToggleTopic = async (topicId: number) => {
    try {
      // Toggle on server (our PATCH task endpoint propagates to customSubject topics!)
      await api.patch(`/users/tasks/${topicId}`);
      onRefresh(); // Refresh parent dashboard to load updated database values
    } catch (err) {
      console.error("Failed to toggle custom topic status:", err);
    }
  };

  const handleAddTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) {
      setError("Topic name is required");
      return;
    }

    try {
      setIsSubmittingTopic(true);
      setError(null);

      await api.post(`/custom-subjects/${subject.id}/topics`, {
        topicName: newTopicName.trim(),
        description: newTopicDesc.trim()
      });

      setNewTopicName("");
      setNewTopicDesc("");
      setIsAddingTopic(false);
      onRefresh(); // reload parent and state
    } catch (err) {
      console.error("Failed to add custom topic:", err);
      setError("Could not register topic. Please verify server connection.");
    } finally {
      setIsSubmittingTopic(false);
    }
  };

  return (
    <AnimatePresence>
      <div id="roadmap-drawer-overlay" className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex justify-end" onClick={onClose}>
        <motion.div
          id="roadmap-drawer-card"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto flex flex-col p-0 shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/40 sticky top-0 backdrop-blur-md z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/15 border border-emerald-550/10 text-emerald-400 px-2 py-0.5 rounded-full">
                    {subject.difficulty || "Custom Subject"} Mode
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 font-sans tracking-tight mt-1">
                    {isEditingSubject ? "Editing Subject Plan" : subject.subjectName}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {!isEditingSubject && (
                  <>
                    <button
                      onClick={startEditingSubject}
                      className="p-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 rounded-lg transition"
                      title="Edit Subject Metadata"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDeleteSubject}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition"
                      title="Delete Subject Pack"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  id="close-drawer-btn"
                  onClick={onClose}
                  className="p-1.5 hover:bg-slate-800 text-slate-450 hover:text-slate-200 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {error && <p className="text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-550/10 p-2 rounded-lg">⚠️ {error}</p>}

            {/* Editing layout form */}
            {isEditingSubject ? (
              <div className="space-y-3 p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                <div className="space-y-1">
                  <label htmlFor="edit-subj-name" className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Subject Name</label>
                  <input
                    id="edit-subj-name"
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-250 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="edit-subj-desc" className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Description</label>
                  <textarea
                    id="edit-subj-desc"
                    value={editedDesc}
                    onChange={(e) => setEditedDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-250 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="edit-subj-diff" className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Difficulty Level</label>
                    <select
                      id="edit-subj-diff"
                      value={editedDiff}
                      onChange={(e) => setEditedDiff(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-250 focus:outline-hidden"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="edit-subj-target" className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Target Completion Date</label>
                    <input
                      id="edit-subj-target"
                      type="date"
                      value={editedTargetDate ? editedTargetDate.substring(0, 10) : ""}
                      onChange={(e) => setEditedTargetDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-250 focus:outline-hidden"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    onClick={() => setIsEditingSubject(false)}
                    className="px-3 py-1 border border-slate-800 rounded-lg text-slate-400 text-xs hover:bg-slate-855"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSubjectEdit}
                    className="px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-emerald-400"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs leading-relaxed italic bg-slate-950/30 p-3 rounded-xl border border-slate-850/50">
                "{subject.description || "Self-designed target study schedule."}"
              </p>
            )}
          </div>

          <div className="flex-1 p-6 space-y-6">
            {/* Overall Progress Widget */}
            <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Learning Progress</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {completedCount}/{totalCount} Finished ({Math.round(progressPercent)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* AI Insights Block */}
            {subject.aiAnalysis && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  AI Architect Insights
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase">Recommended Effort</span>
                    <span className="text-xs font-bold text-slate-200 mt-1 block h-fit">{subject.aiAnalysis.estimatedEffort || "5-7 hrs/week"}</span>
                  </div>
                  <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase">Target Date</span>
                    <span className="text-xs font-bold text-slate-200 mt-1 block flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      {subject.targetDate ? new Date(subject.targetDate).toLocaleDateString() : "30 Days"}
                    </span>
                  </div>
                </div>

                {/* Revision Schedule */}
                <div className="p-3.5 bg-slate-950/10 border border-emerald-500/10 rounded-xl">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wide block">Active Revision Interval</span>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">{subject.aiAnalysis.revisionSchedule}</p>
                </div>

                {/* Week-by-Week study plan roadmap */}
                <div className="space-y-3.5 border-t border-slate-800 pt-4">
                  <h5 className="text-xs font-bold font-sans text-slate-200">Checkpoint Schedule Roadmap</h5>
                  <div className="space-y-3 bg-slate-950/30 p-2 border border-slate-850/50 rounded-xl">
                    {subject.aiAnalysis.roadmap && subject.aiAnalysis.roadmap.map((week, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-950/50 transition">
                        <span className="text-[11px] font-mono font-bold bg-slate-850 border border-slate-800 px-2 py-0.5 rounded text-emerald-400 select-none">
                          {week.week}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs text-slate-300 font-sans leading-relaxed">{week.focus}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones list */}
                {subject.aiAnalysis.milestones && subject.aiAnalysis.milestones.length > 0 && (
                  <div className="space-y-2 border-t border-slate-800 pt-4">
                    <h5 className="text-xs font-bold font-sans text-slate-205 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-emerald-500" /> Study Path Milestones
                    </h5>
                    <div className="space-y-2 bg-slate-950/15 p-3 border border-slate-850 rounded-2xl">
                      {subject.aiAnalysis.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0 animate-pulse" />
                          <p className="text-xs text-slate-400 leading-relaxed">{milestone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Custom Syllabus Topics list */}
            <div className="space-y-4 border-t border-slate-800 pt-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300">Syllabus Chapters ({topicsList.length})</h4>
                <button
                  id="add-topic-drawer-toggle"
                  onClick={() => setIsAddingTopic(!isAddingTopic)}
                  className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> add topic
                </button>
              </div>

              {/* Add Custom Topic Form inline */}
              <AnimatePresence>
                {isAddingTopic && (
                  <motion.form
                    id="add-topic-inline-form"
                    onSubmit={handleAddTopicSubmit}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3"
                  >
                    <h5 className="text-xs font-bold text-slate-200">Append Dynamic Topic</h5>
                    {error && <p className="text-[10px] font-mono text-red-400">⚠️ {error}</p>}
                    <div className="space-y-1.5">
                      <label htmlFor="topic-name-inline" className="block text-[10px] font-mono text-slate-400">TOPIC CHAPTER *</label>
                      <input
                        id="topic-name-inline"
                        type="text"
                        placeholder="e.g. Backpropagation algorithms"
                        required
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="topic-desc-inline" className="block text-[10px] font-mono text-slate-400">BRIEF ROADMAP CONTEXT</label>
                      <input
                        id="topic-desc-inline"
                        type="text"
                        placeholder="Study loss optimization parameters"
                        value={newTopicDesc}
                        onChange={(e) => setNewTopicDesc(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsAddingTopic(false)}
                        className="px-3 py-1 border border-slate-800 rounded-lg text-slate-400 text-[10px] hover:bg-slate-850"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingTopic}
                        className="px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg text-[10px] font-bold"
                      >
                        {isSubmittingTopic ? "Adding..." : "Add to Roadmap"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Topics visual list */}
              {topicsList.length === 0 ? (
                <div className="p-6 border border-slate-800 border-dashed rounded-xl text-center text-xs text-slate-500">
                  No syllabus chapters in this custom track yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {topicsList.map((topic) => {
                    const isCompleted = topic.status === "COMPLETED";
                    return (
                      <div 
                        key={topic.id}
                        id={`topic-row-${topic.id}`}
                        onClick={() => handleToggleTopic(topic.id)}
                        className="p-3 bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-xl transition flex items-start gap-3 cursor-pointer group hover:bg-slate-950/70"
                      >
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 transition p-0 text-slate-500 group-hover:text-emerald-400"
                          aria-label={isCompleted ? "Mark pending" : "Mark completed"}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 fill-emerald-500/10" />
                          ) : (
                            <Circle className="w-4.5 h-4.5 text-slate-600" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h5 className={`text-xs font-sans font-semibold transition ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                            {topic.topicName}
                          </h5>
                          <p className={`text-[11px] leading-relaxed mt-0.5 ${isCompleted ? 'text-slate-605' : 'text-slate-450'}`}>
                            {topic.description || "Self-guided syllabus chapter module"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteTopic(topic.id, e)}
                          className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm shrink-0"
                          title="Delete topic from curriculum"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
