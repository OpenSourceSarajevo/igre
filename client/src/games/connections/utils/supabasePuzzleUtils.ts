import { supabase } from '@/lib/supabase'
import type { DailyPuzzle } from '../types/game'

const cache = new Map<string, DailyPuzzle>()

export async function getPuzzleByDateFromSupabase(date: string): Promise<DailyPuzzle | null> {
  if (cache.has(date)) return cache.get(date)!

  const { data, error } = await supabase
    .from('connection_puzzles')
    .select('*')
    .eq('date', date)
    .single()

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

export async function submitPuzzle(params: {
  authors: { name: string }[]
  categories: { name: string; words: string[]; difficulty: number }[]
  proposedDate: string
  userId: string
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('connection_puzzle_submissions').insert({
    submitted_by: params.userId,
    proposed_date: params.proposedDate,
    authors: params.authors,
    categories: params.categories,
  })

  return { error: error?.message ?? null }
}
