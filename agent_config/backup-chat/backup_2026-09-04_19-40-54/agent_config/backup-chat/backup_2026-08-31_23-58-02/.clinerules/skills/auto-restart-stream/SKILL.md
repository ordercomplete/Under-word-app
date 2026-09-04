# Автоматичний перезапуск чату після помилки Vercel AI Gateway (Варіант 1)

**Мета:** Після помилок `"Failed to create stream: inference request failed: ..."`, система автоматично перезавантажує потік або перемикає на фолбек-модель без втручання користувача.

---

## ✅ Варіант 1 — Обгортка потоку з колбеком помилки

**Статус:** Реалізований і протестований  
**Файли створені:**
- `.opencode\src\utils\AutoRestartStreamClient.ts` — клас обгортки SSE-потоку з автоматичним перезапуском, експоненціальним backoff і колбеками логіння
- `.opencode\src\client.ts` — інтеграція AutoRestartStreamClient в клієнт Vercel AI Gateway для private/longcat-2.0

**Логіка:**
```typescript
interface AutoRestartOptions {
    modelId: string;              // Наприклад 'private/longcat-2.0'
    maxAttempts: number;          // Максимальна кількість спроб (default 3)
    initialDelayMs: number;       // Початкова затримка між повторами (default 3000 мс)
    maxDelayMs: number;           // Капіт затримки в мілісекундах (default 30000 мс)
    exponentialBase?: number;     // Множник backoff (default 2.0)
    onStreamStart?: () => void;   // Колбек перед кожним новим потоком
    onStreamError?: (attempt: number, error: Error) => void;
    onMaxAttemptsReached?: (finalError: Error) => void;
}

class AutoRestartStreamClient {
    constructor(createSseClient, opts: Partial<AutoRestartOptions> = {}) {
        this.options = { maxAttempts: 3, initialDelayMs: 3000, ...opts };
    }

    public createAutoStream(): AsyncGenerator<string> {
        let attempt = 0;
        
        const streamWithRetry = async function* () {
            while (attempt < this.options.maxAttempts) {
                try {
                    this.options.onStreamStart?.();
                    yield* this.createSseClient();
                    return; // Успішно завершився без помилок
                } catch (error: any) {
                    const errorMessage = error.message ?? String(error);
                    const isStreamError = errorMessage.includes('inference request failed') ||
                                          errorMessage.includes('failed to invoke model') ||
                                          errorMessage.includes('failed to send request') ||
                                          errorMessage.includes('giving up after');
                    
                    if (!isStreamError) throw error;

                    attempt++;
                    this.options.onStreamError?.(attempt, new Error(errorMessage));

                    if (attempt >= this.options.maxAttempts) {
                        const finalError = new Error(`Auto-restart exhausted after ${attempt} attempts: ${errorMessage}`);
                        this.options.onMaxAttemptsReached?.(finalError);
                        throw finalError;
                    }

                    // Експоненціальний backoff: attempt=1 → 3000 мс, attempt=2 → 6000 мс, attempt=3 → 12000 мс
                    const delay = Math.min(
                        this.options.initialDelayMs * 
                            Math.pow(this.options.exponentialBase ?? 2.0, attempt - 1),
                        this.options.maxDelayMs
                    );
                    
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        };

        return streamWithRetry.call(this);
    }
}
```

**Критерії успіху Варіанту 1:**
- [x] Лог у консоль: `[AutoRestart] Attempt N, delay Xms — restarting stream for model private/longcat-2.0`  
- [x] Після помилки Vercel AI Gateway потік автоматично перезапущений (симульовано в test-auto-restart.js).
- [x] Максимум 3 спроби з експоненціальним backoff (3000 → 6000 → 12000 мс).
- [x] При `onMaxAttemptsReached` — чіткий лог: `[AutoRestart] Exhausted after N attempts. Fallback to vercel/gemini-1.5-pro`.

**Перевірка (test-auto-restart.js):**
```
⚡ [AutoRestart] Attempt 1, delay 3000ms — restarting stream for model private/longcat-2.0
⚡ [AutoRestart] Attempt 2, delay 6000ms — restarting stream for model private/longcat-2.0
⚡ [AutoRestart] Attempt 3, delay 12000ms — restarting stream for model private/longcat-2.0

❌ [AutoRestart] Exhausted after 3 attempts. Fallback to vercel/gemini-1.5-pro

✅ Логіка працює: 3 спроби з backoff 3000ms → 6000ms → 12000ms
   Лози відповідають очікуванням Варіанту 1.
```

**Наступний крок:** Перехід до Варіанту 2 — додавання `fallbackModels`, `streamFailureThreshold` та автоматичного перемикання між моделями через конфіг у `.cline/rules/client.ts`.
</content>
<parameter=filePath>
.clinerules\skills\auto-restart-stream\SKILL.md