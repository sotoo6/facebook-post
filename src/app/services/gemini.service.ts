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

    const promptText = `
Genera exactamente 3 comentarios realistas de Facebook sobre: ${tags.join(', ')}.

Reglas:
- Devuelve solo 3 líneas.
- Cada línea debe contener únicamente un comentario.
- Sin introducción.
- Sin explicación.
- Sin comillas.
- Sin numeración.
- Sin corchetes.
- Sin JSON.
- No escribas frases como "Aquí tienes".
- Comentarios breves, naturales y variados.
`;

    const body = { contents: [{ parts: [{ text: promptText }] }] };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      const comentarios = textResponse
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line !== '')
        .filter((line: string) => !line.startsWith('['))
        .filter((line: string) => !line.startsWith(']'))
        .filter((line: string) => !line.startsWith('{'))
        .filter((line: string) => !line.startsWith('}'))
        .filter((line: string) => !line.includes('"author"'))
        .filter((line: string) => !line.includes('"text"'))
        .filter((line: string) => !line.includes('"avatar"'))
        .filter((line: string) => !line.toLowerCase().includes('aquí tienes'))
        .filter((line: string) => !line.toLowerCase().includes('comentarios realistas'))
        .slice(0, 3);

      if (comentarios.length < 3) {
        return ['¡Qué buen post! 🔥', 'Me encanta', 'Increíble'];
      }

      return comentarios;

    } catch (error) {
      console.error("Error con Gemini:", error);
      return ["¡Qué buen post! 🔥", "Me encanta", "Increíble"];
    }
  }
}
