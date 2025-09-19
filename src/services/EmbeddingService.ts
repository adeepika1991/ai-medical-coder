export class EmbeddingService {
  private embedUrl: string;

  constructor(embedUrl: string = process.env.EMBEDDING_SERVICE_URL!) {
    this.embedUrl = embedUrl;
  }

  async getEmbedding(text: string): Promise<number[]> {
    const res = await fetch(this.embedUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error('Embedding failed');

    const { embedding } = await res.json();
    return embedding;
  }
}
