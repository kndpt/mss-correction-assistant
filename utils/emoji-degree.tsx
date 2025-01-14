import { Feather, Sparkles, Zap } from "lucide-react";

export const getEmojiForDegreeV2 = (degree: number) => {
  switch (degree) {
    case 1:
      return <Feather className="w-4 h-4 inline" />;
    case 2:
      return <Sparkles className="w-4 h-4 inline" />;
    case 3:
      return <Zap className="w-4 h-4 inline" />;
    default:
      return <Sparkles className="w-4 h-4 inline" />;
  }
};

export const getEmojiForDegree = (degree: number) => {
  switch (degree) {
    case 1:
      return "🪶";
    case 2:
      return "✨";
    case 3:
      return "⚡";
    default:
      return "✨";
  }
};
