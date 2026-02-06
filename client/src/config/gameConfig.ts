export interface GameConfig {
  name: string; // Display name: "Konekcije"
  slug: string; // URL/storage slug: "konekcije"
  description: string; // Game description
  storagePrefix: string; // localStorage prefix (keep for backward compat)
}

const gameConfigs: Record<string, GameConfig> = {
  konekcije: {
    name: "Konekcije",
    slug: "konekcije",
    description: "Pronađi četiri grupe od po četiri povezane riječi",
    storagePrefix: "konekcije_",
  },
};

const activeGameSlug = "konekcije";
export const currentGame: GameConfig = gameConfigs[activeGameSlug];
