import { useState, useEffect } from "react";
import { Check, X, CheckCircle, XCircle, Clock, ChevronDown, Pencil } from "lucide-react";
import GameControlButton from "./GameControlButton";
import { difficultyColors } from "../utils/colors";
import {
  getSubmissions,
  acceptSubmission,
  declineSubmission,
  updateSubmission,
  getPublishedPuzzles,
  updatePublishedPuzzle,
  invalidatePuzzleCache,
} from "../utils/supabasePuzzleUtils";
import type { Submission, DailyPuzzle, Category } from "../types/game";
import { cn } from "@/utils/classNameUtils";

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Žuta — Jednostavno",
  2: "Zelena — Srednje",
  3: "Plava — Teško",
  4: "Ljubičasta — Vrlo teško",
};

type Tab = "pending" | "reviewed" | "published";

type EditDraft = {
  date: string;
  categories: { name: string; words: string[]; difficulty: number }[];
};

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

  const [publishedPuzzles, setPublishedPuzzles] = useState<DailyPuzzle[]>([]);
  const [publishedLoading, setPublishedLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getSubmissions().then((data) => {
      setSubmissions(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (tab !== "published") return;
    setPublishedLoading(true);
    getPublishedPuzzles().then((data) => {
      setPublishedPuzzles(data);
      setPublishedLoading(false);
    });
  }, [tab]);

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

  const startEdit = (
    id: string,
    date: string,
    categories: { name: string; words: string[]; difficulty: number }[],
  ) => {
    setEditingId(id);
    setEditDraft({
      date,
      categories: [...categories]
        .sort((a, b) => a.difficulty - b.difficulty)
        .map((c) => ({ ...c, words: [...c.words] })),
    });
    setEditErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const toggleExpanded = (id: string) => {
    if (editingId === id) cancelEdit();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateDraftCategoryName = (catIndex: number, value: string) => {
    setEditDraft((prev) => {
      if (!prev) return prev;
      const categories = prev.categories.map((c, i) =>
        i === catIndex ? { ...c, name: value } : c,
      );
      return { ...prev, categories };
    });
  };

  const updateDraftDifficulty = (catIndex: number, newDifficulty: number) => {
    setEditDraft((prev) => {
      if (!prev) return prev;
      const oldDifficulty = prev.categories[catIndex].difficulty;
      if (oldDifficulty === newDifficulty) return prev;
      const categories = prev.categories
        .map((c, i) => {
          if (i === catIndex) return { ...c, difficulty: newDifficulty };
          if (c.difficulty === newDifficulty) return { ...c, difficulty: oldDifficulty };
          return c;
        })
        .sort((a, b) => a.difficulty - b.difficulty);
      return { ...prev, categories };
    });
  };

  const updateDraftWord = (catIndex: number, wordIndex: number, value: string) => {
    setEditDraft((prev) => {
      if (!prev) return prev;
      const categories = prev.categories.map((c, i) => {
        if (i !== catIndex) return c;
        const words = [...c.words];
        words[wordIndex] = value;
        return { ...c, words };
      });
      return { ...prev, categories };
    });
  };

  const validateDraft = (draft: EditDraft): string | null => {
    if (!draft.date.trim()) return "Datum je obavezan.";
    for (const cat of draft.categories) {
      if (!cat.name.trim()) return "Naziv kategorije je obavezan.";
      for (const word of cat.words) {
        if (!word.trim()) return "Sve riječi moraju biti popunjene.";
      }
    }
    const allWords = draft.categories.flatMap((c) =>
      c.words.map((w) => w.trim().toLowerCase()),
    );
    if (new Set(allWords).size !== allWords.length)
      return "Sve riječi moraju biti jedinstvene.";
    return null;
  };

  const handleSaveSubmissionEdit = async (id: string) => {
    if (!editDraft) return;
    const err = validateDraft(editDraft);
    if (err) {
      setEditErrors((prev) => ({ ...prev, [id]: err }));
      return;
    }
    setEditSaving(true);
    setEditErrors((prev) => ({ ...prev, [id]: "" }));
    const { error } = await updateSubmission(id, {
      proposed_date: editDraft.date,
      categories: editDraft.categories,
    });
    setEditSaving(false);
    if (error) {
      setEditErrors((prev) => ({ ...prev, [id]: error }));
      return;
    }
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, proposed_date: editDraft.date, categories: editDraft.categories }
          : s,
      ),
    );
    setEditingId(null);
    setEditDraft(null);
  };

  const handleSavePublishedEdit = async (id: string, oldDate: string) => {
    if (!editDraft) return;
    const err = validateDraft(editDraft);
    if (err) {
      setEditErrors((prev) => ({ ...prev, [id]: err }));
      return;
    }
    setEditSaving(true);
    setEditErrors((prev) => ({ ...prev, [id]: "" }));
    const puzzle = publishedPuzzles.find((p) => p.id === id);
    const { error } = await updatePublishedPuzzle(id, {
      date: editDraft.date,
      authors: puzzle?.authors ?? [],
      categories: editDraft.categories,
    });
    setEditSaving(false);
    if (error) {
      setEditErrors((prev) => ({ ...prev, [id]: error }));
      return;
    }
    invalidatePuzzleCache(oldDate);
    if (editDraft.date !== oldDate) invalidatePuzzleCache(editDraft.date);
    setPublishedPuzzles((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, date: editDraft.date, categories: editDraft.categories as Category[] }
          : p,
      ),
    );
    setEditingId(null);
    setEditDraft(null);
  };

  const renderEditForm = (id: string, onSave: () => void) => (
    <div className="p-4 border-t border-header-border flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-app-text opacity-60 uppercase tracking-wide">
          Datum
        </label>
        <input
          type="date"
          className="bg-tile-bg border border-header-border rounded-xl px-3 py-2 text-app-text text-sm outline-none focus:border-tile-selected transition-colors"
          value={editDraft?.date ?? ""}
          onChange={(e) =>
            setEditDraft((prev) =>
              prev ? { ...prev, date: e.target.value } : prev,
            )
          }
        />
      </div>

      {editDraft?.categories.map((cat, catIndex) => (
        <div
          key={catIndex}
          className="rounded-xl overflow-hidden border border-header-border"
        >
          <div
            className={cn(
              "px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-solved-text",
              difficultyColors[cat.difficulty],
            )}
          >
            <select
              className="w-full bg-transparent border-none outline-none cursor-pointer font-extrabold uppercase tracking-widest text-solved-text text-xs py-0.5"
              value={cat.difficulty}
              onChange={(e) => updateDraftDifficulty(catIndex, Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((d) => (
                <option key={d} value={d} className="bg-header-bg text-app-text normal-case tracking-normal font-normal">
                  {DIFFICULTY_LABELS[d]}
                </option>
              ))}
            </select>
          </div>
          <div className="px-3 py-2 flex flex-col gap-2">
            <input
              className="w-full bg-tile-bg border border-header-border rounded-lg px-3 py-1.5 text-app-text text-sm outline-none focus:border-tile-selected transition-colors"
              placeholder="Naziv kategorije"
              value={cat.name}
              onChange={(e) => updateDraftCategoryName(catIndex, e.target.value)}
            />
            <div className="grid grid-cols-2 gap-1.5">
              {cat.words.map((word, wordIndex) => (
                <input
                  key={wordIndex}
                  className="bg-tile-bg border border-header-border rounded-lg px-3 py-1.5 text-app-text text-sm outline-none focus:border-tile-selected transition-colors"
                  placeholder={`Riječ ${wordIndex + 1}`}
                  value={word}
                  onChange={(e) =>
                    updateDraftWord(catIndex, wordIndex, e.target.value)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      {editErrors[id] && (
        <p className="text-red-400 text-xs">{editErrors[id]}</p>
      )}

      <div className="flex gap-2 justify-end">
        <GameControlButton variant="default" onClick={cancelEdit} disabled={editSaving}>
          Odustani
        </GameControlButton>
        <GameControlButton variant="primary" onClick={onSave} disabled={editSaving}>
          <span className="flex items-center gap-1.5">
            <Check size={14} />
            {editSaving ? "Spremanje..." : "Spremi"}
          </span>
        </GameControlButton>
      </div>
    </div>
  );

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
          <button
            onClick={() => setTab("published")}
            className={cn(
              "px-4 py-2 text-sm font-semibold border-b-2 transition-colors -mb-px",
              tab === "published"
                ? "border-app-text text-app-text"
                : "border-transparent text-app-text opacity-50 hover:opacity-80",
            )}
          >
            Objavljeno
          </button>
        </div>

        {/* Published tab */}
        {tab === "published" ? (
          publishedLoading ? (
            <div className="flex justify-center py-16">
              <Clock size={32} className="text-app-text opacity-30 animate-pulse" />
            </div>
          ) : publishedPuzzles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <p className="text-app-text opacity-40 text-sm">
                Nema objavljenih zagonetki.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {publishedPuzzles.map((puzzle) => {
                const isExpanded = expandedIds.has(puzzle.id);
                const isEditing = editingId === puzzle.id;

                return (
                  <div
                    key={puzzle.id}
                    className="border border-header-border rounded-2xl overflow-hidden"
                  >
                    <button
                      className="w-full px-5 py-4 flex flex-wrap gap-3 items-start justify-between bg-tile-bg cursor-pointer border-none text-left"
                      onClick={() => toggleExpanded(puzzle.id)}
                    >
                      <div>
                        <p className="text-app-text font-bold text-lg leading-tight">
                          {puzzle.date}
                        </p>
                        {puzzle.authors && puzzle.authors.length > 0 && (
                          <p className="text-app-text opacity-60 text-sm mt-0.5">
                            {puzzle.authors.map((a) => a.name).join(", ")}
                          </p>
                        )}
                      </div>
                      <ChevronDown
                        size={16}
                        className={cn(
                          "text-app-text opacity-50 mt-1 transition-transform duration-200",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>

                    {isExpanded && (
                      <>
                        {isEditing ? (
                          renderEditForm(puzzle.id, () =>
                            handleSavePublishedEdit(puzzle.id, puzzle.date),
                          )
                        ) : (
                          <>
                            <div className="p-4 grid grid-cols-2 gap-3 sm:grid-cols-1 border-t border-header-border">
                              {[...puzzle.categories]
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
                            <div className="px-4 pb-4 flex justify-end">
                              <GameControlButton
                                variant="default"
                                onClick={() =>
                                  startEdit(
                                    puzzle.id,
                                    puzzle.date,
                                    puzzle.categories,
                                  )
                                }
                              >
                                <span className="flex items-center gap-1.5">
                                  <Pencil size={14} />
                                  Uredi
                                </span>
                              </GameControlButton>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : /* Pending / Reviewed tabs */
        loading ? (
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
              const isEditing = editingId === submission.id;

              return (
                <div
                  key={submission.id}
                  className="border border-header-border rounded-2xl overflow-hidden"
                >
                  {/* Card header */}
                  <button
                    className="w-full px-5 py-4 flex flex-wrap gap-3 items-start justify-between bg-tile-bg cursor-pointer border-none text-left"
                    onClick={() => toggleExpanded(submission.id)}
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
                      {isEditing ? (
                        renderEditForm(submission.id, () =>
                          handleSaveSubmissionEdit(submission.id),
                        )
                      ) : (
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
                                          {isActing
                                            ? "Odbijanje..."
                                            : "Potvrdi odbijanje"}
                                        </span>
                                      </GameControlButton>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-2 justify-end">
                                    <GameControlButton
                                      variant="default"
                                      onClick={() =>
                                        startEdit(
                                          submission.id,
                                          submission.proposed_date,
                                          submission.categories,
                                        )
                                      }
                                      disabled={isActing}
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <Pencil size={14} />
                                        Uredi
                                      </span>
                                    </GameControlButton>
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
                                    <CheckCircle
                                      size={16}
                                      className="text-difficulty-2 shrink-0"
                                    />
                                    <span className="text-sm text-app-text opacity-70">
                                      Prihvaćeno{" "}
                                      {formatDate(submission.reviewed_at!)}
                                    </span>
                                  </>
                                ) : (
                                  <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-center gap-2">
                                      <XCircle
                                        size={16}
                                        className="text-red-400 shrink-0"
                                      />
                                      <span className="text-sm text-app-text opacity-70">
                                        Odbijeno{" "}
                                        {formatDate(submission.reviewed_at!)}
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
