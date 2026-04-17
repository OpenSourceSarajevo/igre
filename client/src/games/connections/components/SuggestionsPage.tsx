import { useState, useEffect } from "react";
import { Check, X, CheckCircle, XCircle, Clock, ChevronDown } from "lucide-react";
import GameControlButton from "./GameControlButton";
import { difficultyColors } from "../utils/colors";
import {
  getSubmissions,
  acceptSubmission,
  declineSubmission,
} from "../utils/supabasePuzzleUtils";
import type { Submission } from "../types/game";
import { cn } from "@/utils/classNameUtils";

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Žuta — Jednostavno",
  2: "Zelena — Srednje",
  3: "Plava — Teško",
  4: "Ljubičasta — Vrlo teško",
};

type Tab = "pending" | "reviewed";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("bs-BA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function SuggestionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pending");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getSubmissions().then((data) => {
      setSubmissions(data);
      setLoading(false);
    });
  }, []);

  const pending = submissions.filter((s) => s.reviewed_at === null);
  const reviewed = submissions.filter((s) => s.reviewed_at !== null);

  const handleAccept = async (submission: Submission) => {
    setActionLoading(submission.id);
    setErrors((prev) => ({ ...prev, [submission.id]: "" }));
    const { error } = await acceptSubmission(submission);
    setActionLoading(null);
    if (error) {
      setErrors((prev) => ({ ...prev, [submission.id]: error }));
      return;
    }
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submission.id
          ? { ...s, reviewed_at: new Date().toISOString() }
          : s,
      ),
    );
  };

  const handleDeclineConfirm = async (id: string) => {
    if (!rejectionNotes.trim()) return;
    setActionLoading(id);
    setErrors((prev) => ({ ...prev, [id]: "" }));
    const { error } = await declineSubmission(id, rejectionNotes.trim());
    setActionLoading(null);
    if (error) {
      setErrors((prev) => ({ ...prev, [id]: error }));
      return;
    }
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              reviewed_at: new Date().toISOString(),
              rejection_notes: rejectionNotes.trim(),
            }
          : s,
      ),
    );
    setDecliningId(null);
    setRejectionNotes("");
  };

  const activeList = tab === "pending" ? pending : reviewed;

  return (
    <div className="flex flex-col min-h-full">
      <div className="mx-auto px-4 w-full max-w-[720px] py-8">
        <header className="flex flex-col items-center mb-8 text-center">
          <h1 className="font-inherit text-[2.5rem] font-extrabold m-0 text-app-text tracking-[-0.04em] leading-[1.1] sm:text-[1.8rem]">
            Prijedlozi
          </h1>
          <p className="font-inherit mt-3 font-normal text-app-text opacity-70 text-sm">
            Pregledaj i odobri prijedloge konekcija.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-header-border">
          <button
            onClick={() => setTab("pending")}
            className={cn(
              "px-4 py-2 text-sm font-semibold border-b-2 transition-colors -mb-px",
              tab === "pending"
                ? "border-app-text text-app-text"
                : "border-transparent text-app-text opacity-50 hover:opacity-80",
            )}
          >
            Na čekanju
            {pending.length > 0 && (
              <span className="ml-2 bg-app-text text-app-bg text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pending.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("reviewed")}
            className={cn(
              "px-4 py-2 text-sm font-semibold border-b-2 transition-colors -mb-px",
              tab === "reviewed"
                ? "border-app-text text-app-text"
                : "border-transparent text-app-text opacity-50 hover:opacity-80",
            )}
          >
            Pregledani
            {reviewed.length > 0 && (
              <span className="ml-2 bg-tile-bg text-app-text text-xs font-bold px-1.5 py-0.5 rounded-full border border-header-border">
                {reviewed.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Clock size={32} className="text-app-text opacity-30 animate-pulse" />
          </div>
        ) : activeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <p className="text-app-text opacity-40 text-sm">
              {tab === "pending"
                ? "Nema prijedloga na čekanju."
                : "Nema pregledanih prijedloga."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {activeList.map((submission) => {
              const isAccepted =
                submission.reviewed_at !== null &&
                submission.rejection_notes === null;
              const isDeclining = decliningId === submission.id;
              const isActing = actionLoading === submission.id;
              const isExpanded = expandedIds.has(submission.id);

              const toggleExpanded = () =>
                setExpandedIds((prev) => {
                  const next = new Set(prev);
                  next.has(submission.id) ? next.delete(submission.id) : next.add(submission.id);
                  return next;
                });

              return (
                <div
                  key={submission.id}
                  className="border border-header-border rounded-2xl overflow-hidden"
                >
                  {/* Card header */}
                  <button
                    className="w-full px-5 py-4 flex flex-wrap gap-3 items-start justify-between bg-tile-bg cursor-pointer border-none text-left"
                    onClick={toggleExpanded}
                  >
                    <div>
                      <p className="text-app-text font-bold text-lg leading-tight">
                        {submission.proposed_date}
                      </p>
                      {submission.authors.length > 0 && (
                        <p className="text-app-text opacity-60 text-sm mt-0.5">
                          {submission.authors.map((a) => a.name).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-app-text opacity-50">
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {formatDate(submission.submitted_at)}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <>
                  {/* Categories */}
                  <div className="p-4 grid grid-cols-2 gap-3 sm:grid-cols-1 border-t border-header-border">
                    {[...submission.categories]
                      .sort((a, b) => a.difficulty - b.difficulty)
                      .map((cat, i) => (
                        <div
                          key={i}
                          className="rounded-xl overflow-hidden border border-header-border"
                        >
                          <div
                            className={cn(
                              "px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-solved-text",
                              difficultyColors[cat.difficulty],
                            )}
                          >
                            {DIFFICULTY_LABELS[cat.difficulty]}
                          </div>
                          <div className="px-3 py-2">
                            <p className="text-app-text font-semibold text-sm mb-1.5">
                              {cat.name}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {cat.words.map((word, j) => (
                                <span
                                  key={j}
                                  className="text-xs bg-tile-bg text-app-text px-2 py-0.5 rounded-lg border border-header-border"
                                >
                                  {word}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4">
                    {/* Error */}
                    {errors[submission.id] && (
                      <p className="text-red-400 text-xs mb-3">
                        {errors[submission.id]}
                      </p>
                    )}

                    {tab === "pending" && (
                      <>
                        {isDeclining ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              className="w-full bg-tile-bg border border-header-border rounded-xl px-3 py-2 text-app-text text-sm outline-none focus:border-tile-selected transition-colors resize-none"
                              rows={3}
                              placeholder="Razlog odbijanja (obavezno)..."
                              value={rejectionNotes}
                              onChange={(e) =>
                                setRejectionNotes(e.target.value)
                              }
                            />
                            <div className="flex gap-2 justify-end">
                              <GameControlButton
                                variant="default"
                                onClick={() => {
                                  setDecliningId(null);
                                  setRejectionNotes("");
                                }}
                                disabled={isActing}
                              >
                                Odustani
                              </GameControlButton>
                              <GameControlButton
                                variant="primary"
                                onClick={() =>
                                  handleDeclineConfirm(submission.id)
                                }
                                disabled={
                                  isActing || !rejectionNotes.trim()
                                }
                              >
                                <span className="flex items-center gap-1.5">
                                  <X size={14} />
                                  {isActing ? "Odbijanje..." : "Potvrdi odbijanje"}
                                </span>
                              </GameControlButton>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-end">
                            <GameControlButton
                              variant="default"
                              onClick={() => {
                                setDecliningId(submission.id);
                                setRejectionNotes("");
                              }}
                              disabled={isActing}
                            >
                              <span className="flex items-center gap-1.5">
                                <X size={14} />
                                Odbij
                              </span>
                            </GameControlButton>
                            <GameControlButton
                              variant="primary"
                              onClick={() => handleAccept(submission)}
                              disabled={isActing}
                            >
                              <span className="flex items-center gap-1.5">
                                <Check size={14} />
                                {isActing ? "Prihvatanje..." : "Prihvati"}
                              </span>
                            </GameControlButton>
                          </div>
                        )}
                      </>
                    )}

                    {tab === "reviewed" && (
                      <div className="flex items-center gap-2 pt-1">
                        {isAccepted ? (
                          <>
                            <CheckCircle size={16} className="text-difficulty-2 shrink-0" />
                            <span className="text-sm text-app-text opacity-70">
                              Prihvaćeno {formatDate(submission.reviewed_at!)}
                            </span>
                          </>
                        ) : (
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-2">
                              <XCircle size={16} className="text-red-400 shrink-0" />
                              <span className="text-sm text-app-text opacity-70">
                                Odbijeno {formatDate(submission.reviewed_at!)}
                              </span>
                            </div>
                            {submission.rejection_notes && (
                              <p className="text-xs text-app-text opacity-50 ml-6 italic">
                                {submission.rejection_notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
