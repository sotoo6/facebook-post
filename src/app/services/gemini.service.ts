import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  // Ahora usamos las variables del environment
  private readonly apiKey = environment.apiKey;
  private readonly baseUrl = environment.geminiUrl;

  async generarComentarios(tags: string[]): Promise<string[]> {
    // Construimos la URL usando el environment
    const url = `${this.baseUrl}?key=${this.apiKey}`;

    const promptText = `Actúa como usuarios de Facebook. Genera 3 comentarios realistas sobre: ${tags.join(', ')}`;
    const body = { contents: [{ parts: [{ text: promptText }] }] };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      return textResponse.split('\n').filter((line: string) => line.trim() !== '');
    } catch (error) {
      console.error("Error con Gemini:", error);
      return ["¡Qué buen post! 🔥", "Me encanta", "Increíble"];
    }
  }
}
