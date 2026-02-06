// Future API integration point
export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    puzzles: string;
    completion: string;
  };
}

export class GameApiService {
  constructor(_config: ApiConfig) {
    // Config will be used when API is implemented
  }

  async fetchPuzzle(_date: string) {
    throw new Error('API not implemented');
  }

  async submitCompletion(_data: unknown) {
    throw new Error('API not implemented');
  }
}
