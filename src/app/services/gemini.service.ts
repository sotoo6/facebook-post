import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  // Instancia de la IA con clave de acceso
  private genAI = new GoogleGenerativeAI('AIzaSyBcd-kEO1-X9bOV7ONdw_B8pZilv5_n1PM');
  // Seleccionamos el modelo
  private model = this.genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
  // Generar comentarios
  async generarComentarios(tags: string[]): Promise<string[]> {
    // Preparamos el prompt
    const prompt = `Actúa como usuarios reales de Facebook. Genera 3 comentarios de Facebook realistas, cortos y variados (uno entusiasta, uno con un emoji, uno breve) basados en estos temas: ${tags.join(', ')}. No incluyas números ni comillas, solo el texto del comentario por línea.`;

    try {
      // Enviamos el prompt al modelo
      const result = await this.model.generateContent(prompt);

      // Esperamos la respuesta de texto
      const response = await result.response;
      const text = response.text();

      // Limpiamos la respuesta
      return text.split('\n').filter(line => line.trim() !== '');

    } catch (error) {
      console.error("Error al hablar con Gemini", error);
      return [
        "¡Qué buena foto! 🔥",
        "Me encanta ese plan, ¡disfruta!",
        "Increíble, ¡pásalo genial!"
      ];
    }
  }

}
