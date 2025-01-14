interface HistoryEntry {
  input: string;
  versions: string[];
  timestamp: number;
  reformulationDegree?: number;
}

export class StorageService {
  private static readonly HISTORY_KEY = "reformulation_history";
  private static readonly PREFERENCES_KEY = "reformulation_preferences";

  static formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  }

  static saveHistory(history: HistoryEntry[]): void {
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  }

  static loadHistory(): HistoryEntry[] {
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      return [];
    }
  }

  static savePreferences(preferences: { reformulationDegree: number }): void {
    try {
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des préférences:", error);
    }
  }

  static loadPreferences(): { reformulationDegree: number } {
    try {
      const stored = localStorage.getItem(this.PREFERENCES_KEY);
      return stored ? JSON.parse(stored) : { reformulationDegree: 2 };
    } catch (error) {
      console.error("Erreur lors du chargement des préférences:", error);
      return { reformulationDegree: 2 };
    }
  }
}
