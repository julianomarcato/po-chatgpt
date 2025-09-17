// frontend/src/app/chat-gpt/chat-gpt.component.ts
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
  loading: boolean = false;
  aviso: string = '';
  selectedAI: string = 'GPT';
  availableAIs: string[] = ['GPT', 'DeepSeek', 'Gemini'];

  constructor(private chatService: ChatGptService) {}

  ngOnInit(): void {
    console.log('💡 ChatGptComponent iniciado');
  }

  enviarPrompt(): void {
    if (!this.prompt) return;

    this.loading = true;
    this.aviso = '';
    this.resposta = '';

    this.chatService.sendPrompt(this.prompt, this.selectedAI).subscribe({
      next: (res: any) => {
        this.resposta = res.resposta;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Erro ao enviar prompt', err);
        this.aviso = err.error?.error || 'Ocorreu um erro ao processar sua solicitação';
        this.loading = false;
      }
    });
  }
}
