# Bug Report: MAX Auth streaming не работал на production

| Поле | Значение |
|---|---|
| **ID** | BUG-002 |
| **Severity** | Critical — полная блокировка входа через MAX на production |
| **Компонент** | Auth → MAX OAuth (real-time streaming) |
| **Автор** | — |
| **Дата** | 2026-02-16 |
| **Статус** | Resolved |

---

## Краткое описание

MAX авторизация через QR-код требует real-time двусторонней коммуникации для передачи событий от backend к frontend (получение QR кода, статус сканирования, токен авторизации). На локальной разработке через `localhost:3001` функционал работал корректно, но на production сервере с SSL и многоуровневым nginx streaming полностью не функционировал. Клиент не получал события от сервера, соединение обрывалось с ошибками 404 или 504.

---

## Окружение

| Слой | Файл/Компонент | Ключевое место |
|---|---|---|
| Backend — SSE handler (исходный) | `src/services/MAXAuth.service.ts` | метод `sendSSE`, работа с `Express Response` |
| Backend — WebSocket handler (финальный) | `src/websocket/maxAuth.handler.ts` | `handleMaxAuthConnection`, обработка WebSocket соединений |
| Backend — app | `src/app.ts` | интеграция `express-ws`, регистрация `app.ws('/api/auth/max')` |
| Frontend — API client | `src/lib/api.ts` | метод `startMaxAuth`, переход с fetch SSE на WebSocket |
| Frontend — UI | `src/components/dialogs/MaxAuthDialog.tsx` | обработка событий, отображение QR кода |
| Инфраструктура | `/etc/nginx/sites-available/linkoo` (облако) | конфигурация nginx для WebSocket upgrade |
| Инфраструктура | Docker compose (внутренний nginx) | проксирование на backend:5000 |

---

## Предусловия

1. Приложение развёрнуто на production сервере с двухуровневым nginx:
   - Внешний nginx (облако) — SSL termination, HTTP/2, `listen 443 ssl http2`
   - Внутренний nginx (docker) — проксирование на Express backend
2. Backend использует Express с middleware `compression()` для всех роутов
3. Frontend обращается к API через HTTPS с CloudFlare в цепочке прокси
4. На локальной разработке используется HTTP/1.1 без SSL

---

## Шаги воспроизведения

### Сценарий 1 — SSE через POST (исходная реализация)

1. Открыть диалог авторизации через MAX на production сайте `https://linkoo.dev`
2. Backend получает POST запрос на `/api/auth/max` с `userAgent` в body
3. Backend устанавливает заголовки `Content-Type: text/event-stream`, `Cache-Control: no-cache`
4. Backend вызывает `res.write()` для отправки SSE событий
5. Frontend использует `fetch()` с `response.body.getReader()` для чтения SSE stream

### Сценарий 2 — WebSocket через express-ws (финальная реализация)

1. Открыть диалог авторизации через MAX на production
2. Frontend создаёт WebSocket: `new WebSocket('wss://linkoo.dev/api/auth/max')`
3. При открытии соединения клиент отправляет `{ userAgent: {...} }`
4. Backend получает WebSocket upgrade request
5. Backend обрабатывает через `app.ws('/api/auth/max', handler)`
6. Backend отправляет события через `ws.send(JSON.stringify({ event, data }))`

---

## Ожидаемый результат

1. Соединение успешно устанавливается (SSE или WebSocket)
2. Frontend получает событие `status` с сообщением "Получаем QR-код..."
3. Frontend получает событие `qr` с ссылкой на QR-код MAX
4. QR-код отображается в UI
5. Backend запускает polling статуса каждые 5 секунд
6. При сканировании QR frontend получает событие `success` с токеном
7. Происходит редирект на `/api/auth/max/callback` для завершения OAuth flow

---

## Фактический результат

### Сценарий 1 — SSE (до миграции)

- ❌ В DevTools видно `Content-Type: text/event-stream` и `content-encoding: br` (Brotli)
- ❌ Данные не поступают в браузер, буфер пустой
- ❌ Backend логи показывают успешную отправку: `[MAX Auth] 📡 Отправка SSE клиенту`
- ❌ Соединение зависает или получает 504 Gateway Timeout через ~60 секунд
- ❌ QR-код не отображается, UI показывает "Подключение к серверу..."

### Сценарий 2 — WebSocket (до настройки nginx)

- ❌ Получение `404 Not Found` на `/api/auth/max`
- ❌ В логах nginx: `GET /api/auth/max HTTP/1.1" 404 84`
- ❌ Backend логи показывают: `[App] 🔌 WebSocket route registered: /api/auth/max`
- ❌ WebSocket upgrade не происходит, запрос обрабатывается как обычный HTTP GET

### Сценарий 3 — WebSocket (после настройки nginx, с таймаутом)

- ⚠️ WebSocket соединение устанавливается (HTTP 101 Switching Protocols)
- ⚠️ События `qr` и `status` приходят корректно, QR отображается
- ❌ Через 10 секунд соединение закрывается с кодом 1002
- ❌ В логах: `[MAX Auth Handler] ⏱️ Таймаут ожидания начального сообщения`

---

## Анализ корневой причины

### Проблема 1: SSE + HTTP/2 + Compression = буферизация

#### Причина 1.1 — HTTP/2 несовместим с SSE

SSE (Server-Sent Events) разработан для HTTP/1.1 и использует `chunked transfer encoding`:

```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Transfer-Encoding: chunked

event: status
data: {"message":"Получаем QR..."}

event: qr
data: {"qrLink":"..."}
```

HTTP/2 использует binary framing вместо chunked encoding. Nginx с `listen 443 ssl http2` не гарантирует корректную передачу SSE chunks, особенно через несколько уровней прокси.

#### Причина 1.2 — Compression middleware буферизует SSE

В `src/app.ts`:

```typescript
app.use(compression());  // ← применяется ко всем роутам
```

Express `compression()` middleware буферизует данные для эффективного сжатия. SSE требует немедленной отправки каждого события без буферизации.

Попытка вызвать `res.flush()`:

```typescript
// src/services/MAXAuth.service.ts (старая версия)
private sendSSE(event: string, data: any) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    this.sseResponse.write(payload);
    this.sseResponse.flush?.(); // ❌ flush не существует в Express Response
}
```

`Response.flush()` не является стандартным методом Express. Даже с `compression()` flush не гарантирует отправку.

#### Причина 1.3 — Многоуровневая инфраструктура

```
Browser → Nginx (облако, SSL, HTTP/2, Brotli)
        → Nginx (docker, proxy)
        → Express (compression middleware)
        → Backend handler
```

Каждый уровень добавляет буферизацию. В логах nginx виден заголовок `content-encoding: br` (Brotli), хотя compression для SSE должен быть отключен.

---

### Проблема 2: WebSocket без nginx конфигурации

#### Причина 2.1 — Отсутствие WebSocket upgrade в nginx

Исходный конфиг nginx на облаке:

```nginx
location / {
    proxy_pass http://100.105.255.110:80;
    proxy_set_header Host $host;
    # ❌ Нет proxy_set_header Upgrade
    # ❌ Нет proxy_set_header Connection "upgrade"
}
```

WebSocket требует специальных заголовков для upgrade:

```
GET /api/auth/max HTTP/1.1
Host: linkoo.dev
Upgrade: websocket        ← должен передаться на backend
Connection: Upgrade       ← должен передаться на backend
```

Без этих заголовков nginx обрабатывает запрос как обычный HTTP GET → backend не видит WebSocket upgrade → 404.

#### Причина 2.2 — Неправильная интеграция express-ws

Первая попытка интеграции в `src/routes/auth.routes.ts`:

```typescript
const router = Router() as any;
router.ws('/max', (ws, req) => { ... }); // ❌ Не работает!
```

`express-ws` добавляет метод `.ws()` только к `app`, а не к `Router`. Попытка вызвать `router.ws()` приводит к ошибке во время выполнения:

```
TypeError: router.ws is not a function
```

---

### Проблема 3: Таймаут не очищался после получения сообщения

В `src/websocket/maxAuth.handler.ts` (старая версия):

```typescript
ws.once('message', (data) => {
    // обработка payload...
    const session = new OneMeAuthSession(...);
    session.start();
});

const initTimeout = setTimeout(() => {  // ← создаётся ПОСЛЕ обработчика
    ws.close(1002, 'No initial message received');
}, 10000);
```

Проблема: `setTimeout` создавался после регистрации `ws.once('message')`, но `clearTimeout` вызывался только в `ws.on('close')`. Даже после успешного получения начального сообщения таймаут продолжал отсчитываться → через 10 секунд соединение закрывалось.

---

## Решение

### Часть 1 — Миграция на WebSocket

#### 1.1 — Установка express-ws

```bash
cd linkoo_backend
npm install express-ws @types/express-ws
```

#### 1.2 — Интеграция в app.ts

```typescript
// src/app.ts
import expressWs from 'express-ws';
import { handleMaxAuthConnection } from './websocket/maxAuth.handler';

const { app } = expressWs(express());  // ← создаём app с WebSocket поддержкой

app.ws('/api/auth/max', (ws: any, _req: any) => {
    handleMaxAuthConnection(ws);
});
```

**Важно:** роут регистрируется напрямую в `app`, а не в `Router`.

#### 1.3 — Переписан MAXAuth.service.ts

```typescript
// src/services/MAXAuth.service.ts
export class OneMeAuthSession {
    private maxWs: WebSocket | null = null;     // WebSocket к MAX API
    private clientWs: WebSocket;                 // WebSocket к клиенту

    constructor(
        private sessionId: string,
        private userAgent: UserAgentData,
        clientWs: WebSocket,  // ← вместо Express Response
    ) {
        this.clientWs = clientWs;
        // ...
    }

    private sendToClient(event: string, data: any) {
        if (this.clientWs.readyState === WebSocket.OPEN) {
            this.clientWs.send(JSON.stringify({ event, data }));
        }
    }
}
```

#### 1.4 — Переписан frontend API client

```typescript
// src/lib/api.ts
async startMaxAuth(onEvent: (event: string, data: any) => void): Promise<() => void> {
    const userAgent = { /* ... */ };
    const wsUrl = API_URL.replace(/^http/, 'ws') + '/auth/max';

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        ws.send(JSON.stringify({ userAgent }));  // отправка начального payload
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        onEvent(message.event, message.data);
    };

    ws.onerror = (error) => {
        onEvent('error', { message: 'Ошибка соединения' });
    };

    return () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.close(1000, 'Client closed');
        }
    };
}
```

---

### Часть 2 — Настройка nginx для WebSocket

Добавлен специальный `location` в `/etc/nginx/sites-available/linkoo` на облаке:

```nginx
server {
    listen 443 ssl http2;
    server_name linkoo.dev;

    # SSL конфиг...

    # WebSocket endpoint — ПЕРЕД location /
    location /api/auth/max {
        proxy_pass http://100.105.255.110:80;

        # КРИТИЧНО для WebSocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Стандартные заголовки
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Длинные таймауты для long-lived соединений
        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
    }

    location / {
        # обычная конфигурация для HTTP запросов...
    }
}
```

После изменений:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

**Результат:** WebSocket upgrade корректно передаётся через nginx → backend получает WebSocket соединение → возвращает HTTP 101 Switching Protocols.

---

### Часть 3 — Исправление таймаута

Изменён порядок инициализации в `src/websocket/maxAuth.handler.ts`:

```typescript
export const handleMaxAuthConnection = (ws: WebSocket) => {
    // Таймаут создаётся ДО обработчика
    const initTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.close(1002, 'No initial message received');
        }
    }, 10000);

    ws.once('message', (data) => {
        clearTimeout(initTimeout);  // ← очищается СРАЗУ после получения

        try {
            const payload = JSON.parse(data.toString());
            const session = new OneMeAuthSession(sessionId, userAgent, ws);
            session.start();
        } catch (error) {
            clearTimeout(initTimeout);  // ← очищается и в случае ошибки
            ws.close(1003, 'Invalid initial message');
        }
    });
}
```

---

## Итоговая архитектура

```
Frontend (wss://linkoo.dev/api/auth/max)
    │
    ↓
Nginx (облако, SSL termination, port 443)
    - proxy_http_version 1.1
    - proxy_set_header Upgrade $http_upgrade
    - proxy_set_header Connection "upgrade"
    │
    ↓
Nginx (docker, port 80)
    - proxy_pass http://backend:5000
    │
    ↓
Express + express-ws (backend:5000)
    - app.ws('/api/auth/max', handler)
    │
    ↓
OneMeAuthSession
    - clientWs: WebSocket к frontend
    - maxWs: WebSocket к wss://ws-api.oneme.ru/websocket
```

---

## Ссылки на код

| Файл | Ключевые изменения |
|---|---|
| `linkoo_backend/src/app.ts` | Интеграция `express-ws`, регистрация `app.ws('/api/auth/max')` |
| `linkoo_backend/src/services/MAXAuth.service.ts` | Замена SSE Response на WebSocket, метод `sendToClient` |
| `linkoo_backend/src/websocket/maxAuth.handler.ts` | Обработчик WebSocket соединений, исправление таймаута |
| `linkoo_backend/src/server.ts` | Упрощение (убран ручной upgrade handler) |
| `linkoo/src/lib/api.ts` | Метод `startMaxAuth` переписан на WebSocket |
| `/etc/nginx/sites-available/linkoo` (облако) | Добавлен `location /api/auth/max` с WebSocket поддержкой |

---

## Коммиты

- `feat: integrate WebSocket via express-ws`
- `fix: WebSocket route in app.ts instead of router`
- `fix: clear init timeout immediately after receiving message`
- `debug: add WebSocket route logging`

**Время решения:** ~4 часа
**Протестировано:** На production с реальным MAX OAuth flow
**Статус:** ✅ Полностью работает
