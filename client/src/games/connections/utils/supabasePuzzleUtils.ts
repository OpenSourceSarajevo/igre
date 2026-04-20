import { supabase } from '@/lib/supabase'
import type { DailyPuzzle, Submission } from '../types/game'

const cache = new Map<string, DailyPuzzle>()

export async function getPuzzleByDateFromSupabase(date: string): Promise<DailyPuzzle | null> {
  if (cache.has(date)) return cache.get(date)!

  const { data, error } = await supabase
    .from('connection_puzzles')
    .select('*')
    .eq('date', date)
    .maybeSingle()

  if (error || !data) return null

  const puzzle: DailyPuzzle = {
    id: data.id,
    date: data.date,
    authors: data.authors,
    categories: data.categories,
  }
  cache.set(date, puzzle)
  return puzzle
}

export async function getAllPublishedDatesFromSupabase(): Promise<string[]> {
  const { data, error } = await supabase
    .from('connection_puzzles')
    .select('date')
    .order('date', { ascending: false })

  if (error || !data) return []
  return data.map((row: { date: string }) => row.date)
}

export async function getSubmissions(): Promise<Submission[]> {
  const { data, error } = await supabase
    .from('connection_puzzle_submissions')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error || !data) return []
  return data as Submission[]
}

export async function acceptSubmission(submission: Submission): Promise<{ error: string | null }> {
  const { error: insertError } = await supabase
    .from('connection_puzzles')
    .insert({
      date: submission.proposed_date,
      authors: submission.authors,
      categories: submission.categories,
    })

  if (insertError) return { error: insertError.message }

  const { error: updateError } = await supabase
    .from('connection_puzzle_submissions')
    .update({ reviewed_at: new Date().toISOString() })
    .eq('id', submission.id)

  return { error: updateError?.message ?? null }
}

export async function declineSubmission(id: string, rejectionNotes: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('connection_puzzle_submissions')
    .update({
      reviewed_at: new Date().toISOString(),
      rejection_notes: rejectionNotes,
    })
    .eq('id', id)

  return { error: error?.message ?? null }
}

export async function submitPuzzle(params: {
  authors: { name: string }[]
  categories: { name: string; words: string[]; difficulty: number }[]
  proposedDate: string
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('connection_puzzle_submissions').insert({
    proposed_date: params.proposedDate,
    authors: params.authors,
    categories: params.categories,
  })

  return { error: error?.message ?? null }
}

export async function updateSubmission(id: string, data: {
  proposed_date: string
  categories: { name: string; words: string[]; difficulty: number }[]
}): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('connection_puzzle_submissions')
    .update(data)
    .eq('id', id)
  return { error: error?.message ?? null }
}

export async function getPublishedPuzzles(limit = 5, offset = 0): Promise<DailyPuzzle[]> {
  const { data, error } = await supabase
    .from('connection_puzzles')
    .select('*')
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error || !data) return []
  return data as DailyPuzzle[]
}

export async function updatePublishedPuzzle(id: string, data: {
  date: string
  authors: { name: string }[]
  categories: { name: string; words: string[]; difficulty: number }[]
}): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('connection_puzzles')
    .update(data)
    .eq('id', id)
  return { error: error?.message ?? null }
}

export function invalidatePuzzleCache(date: string) {
  cache.delete(date)
}
