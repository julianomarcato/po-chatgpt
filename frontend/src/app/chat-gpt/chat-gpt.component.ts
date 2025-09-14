// src/app/chat-gpt/chat-gpt.component.ts
import { Component, OnInit } from '@angular/core';
import { ChatGptService } from './chat-gpt.service';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.css']
})
export class ChatGptComponent implements OnInit {

  prompt: string = '';
  resposta: string = '';
  selectedAI: string = 'GPT'; // AI padrão
  availableAIs: string[] = ['GPT', 'DeepSeek', 'Gemini'];

  constructor(private chatService: ChatGptService) { }

  ngOnInit(): void {
    // Aqui você pode carregar configs iniciais se precisar
  }

  enviarPrompt(): void {
    if (!this.prompt) return;

    this.chatService.sendPrompt(this.prompt, this.selectedAI).subscribe({
      next: (res: any) => {
        this.resposta = res.resposta;
      },
      error: (err: any) => console.error('Erro ao enviar prompt', err)
    });
  }
}
