// src/app/chat-gpt/chat-gpt.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatGptService {

  constructor(private http: HttpClient) { }

  // Método para enviar prompt para o backend
sendPrompt(prompt: string, selectedAI: string): Observable<any> {
  const url = 'http://localhost:3000/api/prompt';
  return this.http.post<any>(url, { prompt, ai: selectedAI });
}
}
