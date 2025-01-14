import OpenAI from "openai";

export default class TextProcessingService {
  private openai: OpenAI;
  private ai_model: string;
  private ai_temperature: number;
  private ai_max_tokens: number;
  private ai_top_p: number;
  private ai_frequency_penalty: number;
  private ai_presence_penalty: number;
  private ai_prompt: string;

  public messages: string[] = [];

  private cleaningPatterns: RegExp[] = [
    /^["']|["']$/g, // Guillemets au début et à la fin
    /^Version \d+ :?\s*/i, // "Version X :" au début
    /^\s+|\s+$/g, // Espaces au début et à la fin
    /\n+/g, // Sauts de ligne multiples
  ];

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    this.ai_model = process.env.NEXT_PUBLIC_AI_MODEL ?? "no-model";
    this.ai_temperature = parseFloat(process.env.NEXT_PUBLIC_AI_TEMPERATURE ?? "0.1");
    this.ai_max_tokens = parseInt(process.env.NEXT_PUBLIC_AI_MAX_TOKENS ?? "40");
    this.ai_top_p = parseFloat(process.env.AI_TOP_P ?? "0.7");
    this.ai_frequency_penalty = parseFloat(process.env.NEXT_PUBLIC_AI_FREQUENCY_PENALTY ?? "0.5");
    this.ai_presence_penalty = parseFloat(process.env.NEXT_PUBLIC_AI_PRESENCE_PENALTY ?? "0.2");
    this.ai_prompt = process.env.NEXT_PUBLIC_AI_PROMPT ?? "no-prompt";
  }

  private cleanResponse(text: string): string {
    return this.cleaningPatterns
      .reduce((cleanedText, pattern) => cleanedText.replace(pattern, ""), text)
      .trim();
  }

  private getPromptForDegree(degree: number): string {
    const basePrompt = this.ai_prompt;

    switch (degree) {
      case 1:
        return (
          basePrompt +
          " Fais une reformulation très subtile en ne changeant pas la structure de la phrase. Conserve au maximum le style original."
        );
      case 2:
        return (
          basePrompt +
          " Fais une reformulation simple sans dénaturaliser la patte artistique de l'auteur."
        );
      case 3:
        return (
          basePrompt +
          " Fais une reformulation en changeant la structure et le vocabulaire tout en préservant le sens."
        );
      default:
        return basePrompt;
    }
  }

  public async rephraseSentenceStream(
    sentence: string,
    previousVersions: string[] = [],
    reformulationDegree: number = 2
  ) {
    try {
      let prompt = this.getPromptForDegree(reformulationDegree);

      if (previousVersions.length > 0) {
        prompt += "\nVoici les versions déjà générées :\n";
        previousVersions.forEach((version) => {
          prompt += `${version}\n`;
        });
        prompt +=
          "\nGénère une nouvelle version différente de celles-ci pour la phrase suivante : ";
      }

      const stream = await this.openai.chat.completions.create({
        model: this.ai_model,
        messages: [
          {
            role: "user",
            content: `${prompt}"${sentence}"`,
          },
        ],
        temperature: this.ai_temperature,
        max_tokens: this.ai_max_tokens,
        top_p: this.ai_top_p,
        frequency_penalty: this.ai_frequency_penalty,
        presence_penalty: this.ai_presence_penalty,
        stream: true,
      });

      let currentResponse = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        currentResponse += content;
      }

      return this.cleanResponse(currentResponse);
    } catch (error) {
      console.error("Error processing sentence:", sentence, error);
      throw error;
    }
  }

  /**
   * Extract sentences from text
   * @param text
   * @returns
   */
  private extractSentences(text: string): string[] {
    return text.match(/[^.!?]+\s*[.!?]+/g) ?? [];
  }
}
