"use client";
import { useState, useEffect } from "react";

import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
import { StorageService } from "@/services/storage.service";
import TextProcessingService from "@/services/text-processing.service";
import EmojiSlider from "../components/EmojiSlider";
import { getEmojiForDegree } from "@/utils/emoji-degree";
import { Clipboard, X, History, Clock, FileText, Sparkles, RotateCcw } from "lucide-react";

interface HistoryEntry {
  input: string;
  versions: string[];
  timestamp: number;
}

export default function Reformulation() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [versions, setVersions] = useState(1);
  const [reformulationDegree, setReformulationDegree] = useState(2);
  const [currentVersion, setCurrentVersion] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [textProcessor] = useState(() => new TextProcessingService());
  const [usedReformulationDegree, setUsedReformulationDegree] = useState(2);

  // Charger l'historique au démarrage
  useEffect(() => {
    const savedHistory = StorageService.loadHistory();
    setHistory(savedHistory);
  }, []);

  // Sauvegarder l'historique à chaque modification
  useEffect(() => {
    StorageService.saveHistory(history);
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults([]);
    setCurrentVersion(0);
    // Enregistrer le degré utilisé pour cette reformulation
    setUsedReformulationDegree(reformulationDegree);

    try {
      const newResults: string[] = [];

      for (let i = 1; i <= versions; i++) {
        setCurrentVersion(i);
        const result = await textProcessor.rephraseSentenceStream(
          inputText,
          newResults,
          reformulationDegree
        );

        if (!result) {
          throw new Error("Erreur lors de la reformulation");
        }

        newResults.push(result);
        setResults((prev) => [...prev, result]);

        if (i < versions) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      // Ajouter à l'historique
      setHistory((prev) => [
        {
          input: inputText,
          versions: newResults,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-20 bg-gradient-to-b">
      <div className="w-full space-y-8 mt-10 max-w-2xl">
        <h1 className="text-4xl font-bold text-center bg-clip-text text-gray-700">
          Que veux-tu reformuler ?
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slideIn"
        >
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-32 p-4 rounded-xl border border-gray-200 bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-20"
                placeholder="Entrez votre texte ici..."
              />
              <div className="absolute right-2 top-0 pb-4 flex flex-col justify-between h-full py-2">
                {inputText && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputText("");
                      setResults([]);
                      setCurrentVersion(0);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                    title="Effacer"
                  >
                    <X size={18} />
                  </button>
                )}
                <div className="flex-grow" />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await readText();
                      if (text) setInputText(text);
                    } catch (error) {
                      console.error("Erreur lors de la lecture du presse-papiers:", error);
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                  title="Coller"
                >
                  <Clipboard size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Emoji Slider pour le degré de reformulation */}
          <div className="">
            <EmojiSlider
              value={reformulationDegree}
              onChange={(value) => {
                // Mise à jour de la valeur uniquement pour la session en cours
                setReformulationDegree(value);
              }}
            />
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl">
            <label htmlFor="versions" className="text-sm font-medium pl-0.5 flex justify-between">
              <span>Nombre de versions</span>
              <span className="text-indigo-600 font-semibold">{versions}</span>
            </label>
            <div className="space-y-4">
              <input
                type="range"
                id="versions"
                min="1"
                max="5"
                value={versions}
                step="1"
                onChange={(e) => setVersions(Number(e.target.value))}
                className="z-10 h-2 w-full appearance-none bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full focus:outline-none
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:active:scale-110
                    [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-indigo-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:active:scale-110"
              />
              <div className="flex w-full justify-between px-0.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex flex-col items-center gap-1">
                    <span
                      className={`text-xs font-medium transition-colors ${
                        num <= versions
                          ? num === versions
                            ? "text-purple-600 font-bold"
                            : "text-indigo-600"
                          : "text-gray-400"
                      }`}
                    >
                      {num}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-full rounded-xl border border-solid border-transparent transition-all flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white gap-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed h-11 px-5"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {currentVersion > 0 && (
                    <span>
                      Version {currentVersion}/{versions}
                    </span>
                  )}
                </div>
              ) : (
                "Reformuler"
              )}
            </button>
          </div>
        </form>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                onClick={() => handleCopy(result, index)}
                className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md cursor-pointer transition-all relative animate-slideIn"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-indigo-600">Version {index + 1}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="text-indigo-600">
                      {getEmojiForDegree(usedReformulationDegree)}
                    </span>
                    <span>
                      {usedReformulationDegree === 1
                        ? "Légère"
                        : usedReformulationDegree === 2
                        ? "Simple"
                        : "Complète"}
                    </span>
                  </span>
                </h2>
                <p className="text-sm">{result}</p>
                {copiedIndex === index && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-md text-xs animate-fadeIn">
                    Copié !
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Historique */}
        {history.length > 0 && (
          <div className="space-y-6 pt-8 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <History size={24} className="text-indigo-600" />
              Historique
            </h2>
            {history.map((entry, historyIndex) => (
              <div
                key={entry.timestamp}
                className="space-y-4 p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all"
              >
                {/* En-tête avec date et bouton réutiliser */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {StorageService.formatDate(entry.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={() => setInputText(entry.input)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw size={14} />
                    Réutiliser
                  </button>
                </div>

                {/* Section du texte original */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-gray-600" />
                    Texte original
                  </h3>
                  <p className="text-sm text-gray-700">{entry.input}</p>
                </div>

                {/* Section des versions reformulées */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800 flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-600" />
                    Versions reformulées
                  </h3>
                  <div className="space-y-2">
                    {entry.versions.map((version, versionIndex) => (
                      <div
                        key={versionIndex}
                        onClick={() => handleCopy(version, historyIndex * 100 + versionIndex)}
                        className="p-3 rounded-lg bg-white border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50 cursor-pointer transition-all relative group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-indigo-600">
                            Version {versionIndex + 1}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{version}</p>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Clipboard size={14} className="text-gray-400" />
                        </div>
                        {copiedIndex === historyIndex * 100 + versionIndex && (
                          <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-md text-xs animate-fadeIn">
                            Copié !
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
