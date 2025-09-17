// frontend/src/app/chat-gpt/chat-gpt.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatGptService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  sendPrompt(prompt: string, selectedAI: string): Observable<any> {
    console.log('📡 Enviando prompt ao backend...');
    return this.http.post(`${this.apiUrl}/prompt`, { prompt, selectedAI }, { withCredentials: true });
  }
}
