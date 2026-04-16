import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import GameControlButton from "./GameControlButton";
import { difficultyColors } from "../utils/colors";
import { cn } from "@/utils/classNameUtils";
import { submitPuzzle } from "../utils/supabasePuzzleUtils";

type Difficulty = 1 | 2 | 3 | 4;

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 1, label: "Žuta — Jednostavno" },
  { value: 2, label: "Zelena — Srednje" },
  { value: 3, label: "Plava — Teško" },
  { value: 4, label: "Ljubičasta — Vrlo teško" },
];

type CategoryState = {
  name: string;
  words: [string, string, string, string];
  difficulty: Difficulty;
};

type Errors = Record<string, string>;

const emptyCategory = (difficulty: Difficulty): CategoryState => ({
  name: "",
  words: ["", "", "", ""],
  difficulty,
});

const inputBase =
  "bg-tile-bg border border-header-border rounded-xl px-3 py-2 text-app-text text-sm outline-none focus:border-tile-selected transition-colors w-full";

export function CreatePuzzle() {
  const [authorName, setAuthorName] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [categories, setCategories] = useState<CategoryState[]>(
    DIFFICULTIES.map((d) => emptyCategory(d.value)),
  );
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateCategoryName = (i: number, value: string) =>
    setCategories((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, name: value } : c)),
    );

  const updateWord = (catIdx: number, wordIdx: number, value: string) =>
    setCategories((prev) =>
      prev.map((c, i) => {
        if (i !== catIdx) return c;
        const words = [...c.words] as [string, string, string, string];
        words[wordIdx] = value;
        return { ...c, words };
      }),
    );

  const validate = (): Errors => {
    const e: Errors = {};
    if (!authorName.trim()) e.author = "Ime autora je obavezno.";
    if (!date) e.date = "Datum je obavezan.";
    categories.forEach((cat, i) => {
      if (!cat.name.trim()) e[`name-${i}`] = "Naziv je obavezan.";
      cat.words.forEach((w, j) => {
        if (!w.trim()) e[`word-${i}-${j}`] = "Obavezno";
      });
    });
    return e;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    const { error } = await submitPuzzle({
      authors: [{ name: authorName.trim() }],
      proposedDate: date,
      categories: categories.map((c) => ({
        name: c.name.trim(),
        words: c.words.map((w) => w.trim()),
        difficulty: c.difficulty,
      })),
    });

    setSubmitting(false);

    if (error) {
      setSubmitError(error);
      return;
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setAuthorName("");
    setDate(new Date().toISOString().slice(0, 10));
    setCategories(DIFFICULTIES.map((d) => emptyCategory(d.value)));
    setErrors({});
    setSubmitted(false);
    setSubmitError(null);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <Send size={48} className="text-app-text opacity-50" />
        <h2 className="text-[1.8rem] font-bold text-app-text">
          Konekcije poslane!
        </h2>
        <p className="text-app-text opacity-60 max-w-sm leading-relaxed">
          Vaš prijedlog za <strong>{date}</strong> je uspješno poslan na pregled.
        </p>
        <GameControlButton variant="primary" onClick={handleReset}>
          Kreiraj nove konekcije
        </GameControlButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="mx-auto px-4 w-full max-w-[600px] py-8">
        <header className="flex flex-col items-center mb-8 text-center">
          <h1 className="font-inherit text-[2.5rem] font-extrabold m-0 text-app-text tracking-[-0.04em] leading-[1.1] sm:text-[1.8rem]">
            Kreiraj Konekcije
          </h1>
          <p className="font-inherit mt-3 font-normal text-app-text opacity-70 text-sm sm:text-base">
            4 kategorije × 4 riječi. Prijedlog se šalje na pregled.
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Author + Date */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-xs font-semibold text-app-text opacity-70 uppercase tracking-wide">
                Autor
              </label>
              <input
                className={cn(inputBase, errors.author && "border-red-400")}
                type="text"
                placeholder="Vaše ime"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
              {errors.author && (
                <span className="text-red-400 text-xs">{errors.author}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-app-text opacity-70 uppercase tracking-wide">
                Datum
              </label>
              <input
                className={cn(inputBase, errors.date && "border-red-400")}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {errors.date && (
                <span className="text-red-400 text-xs">{errors.date}</span>
              )}
            </div>
          </div>

          {/* Categories */}
          {categories.map((cat, i) => {
            const diff = DIFFICULTIES[i];
            return (
              <div
                key={diff.value}
                className="border border-header-border rounded-2xl overflow-hidden"
              >
                <div
                  className={cn(
                    "px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-solved-text",
                    difficultyColors[diff.value],
                  )}
                >
                  {diff.label}
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-app-text opacity-70 uppercase tracking-wide">
                      Naziv kategorije
                    </label>
                    <input
                      className={cn(
                        inputBase,
                        errors[`name-${i}`] && "border-red-400",
                      )}
                      type="text"
                      placeholder="npr. Voće, Sportovi..."
                      value={cat.name}
                      onChange={(e) => updateCategoryName(i, e.target.value)}
                    />
                    {errors[`name-${i}`] && (
                      <span className="text-red-400 text-xs">
                        {errors[`name-${i}`]}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-app-text opacity-70 uppercase tracking-wide">
                      4 Riječi
                    </label>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-2">
                      {cat.words.map((word, j) => (
                        <div key={j} className="flex flex-col gap-0.5">
                          <input
                            className={cn(
                              inputBase,
                              errors[`word-${i}-${j}`] && "border-red-400",
                            )}
                            type="text"
                            placeholder={`Riječ ${j + 1}`}
                            value={word}
                            onChange={(e) => updateWord(i, j, e.target.value)}
                          />
                          {errors[`word-${i}-${j}`] && (
                            <span className="text-red-400 text-[10px]">
                              {errors[`word-${i}-${j}`]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {submitError && (
            <p className="text-red-400 text-sm text-center">{submitError}</p>
          )}

          <div className="flex justify-center mt-2">
            <GameControlButton variant="primary" type="submit" disabled={submitting}>
              <span className="flex items-center gap-2">
                <Send size={15} />
                {submitting ? "Slanje..." : "Pošalji prijedlog"}
              </span>
            </GameControlButton>
          </div>
        </form>
      </div>
    </div>
  );
}
