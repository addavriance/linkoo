# Bug Report: перезапись профиля при повторном входе через OAuth

| Поле | Значение |
|---|---|
| **ID** | BUG-001 |
| **Severity** | High — тихая потеря данных, пользователь не получает никакого уведомления |
| **Компонент** | Auth → OAuth callback (backend) |
| **Автор** | — |
| **Дата** | 2026-02-05 |
| **Статус** | Open |

---

## Краткое описание

При каждом входе через OAuth провайдер (Google, VK, Discord, GitHub, MAX) поля `profile.name` и `profile.avatar` существующего аккаунта **безоговорочно перезаписываются** данными провайдера. Любые изменения, сделанные пользователем через страницу профиля (смена имени, загрузка аватарки), молча теряются при следующем логине.

---

## Окружение

| Слой | Файл | Ключевое место |
|---|---|---|
| Backend — контроллер | `src/controllers/auth.controller.ts` | функция `handleOAuthCallback`, блок `if (user)` |
| Backend — модель | `src/models/User.ts` | `IUserProfile.name`, `IUserProfile.avatar` |
| Frontend — профиль | `src/pages/ProfilePage.tsx` | `handleSaveProfile`, `handleAvatarSelect` |
| Frontend — api | `src/lib/api.ts` | `updateProfile`, `uploadAvatar` |

---

## Предусловия

1. Существует аккаунт, созданный через любой OAuth провайдер.
2. Пользователь вошёл в профиль и успешно изменил имя и/или загрузил аватарку через `POST /api/users/me/avatar` или `PATCH /api/users/me`.
3. Изменения подтверждены: `GET /api/auth/me` возвращает новые значения `profile.name` и `profile.avatar`.

---

## Шаги воспроизведения

1. Войти в приложение через Google (или любой другой провайдер).
2. Перейти на `/profile`.
3. Изменить имя на произвольное значение, отличное от имени в аккаунте Google. Нажать «Сохранить».
4. Загрузить аватарку через кнопку на профиле (файл уходит на `POST /api/users/me/avatar`).
5. Убедиться, что профиль показывает новые имя и аватарку (опционально подтвердить через `GET /api/auth/me`).
6. Выйти из аккаунта.
7. Войти повторно через тот же провайдер (Google).
8. Перейти на `/profile` или проверить ответ `GET /api/auth/me`.

---

## Ожидаемый результат

Имя и аватарка сохраняются такими же, как были установлены на шагах 3–4. OAuth-вход обновляет только метаданные сессии (`lastLoginAt`), но не затрагивает поля профиля, которые пользователь изменил явно.

---

## Фактический результат

- `profile.name` возвращается к значению из OAuth провайдера (имя из аккаунта Google и т.п.).
- `profile.avatar` возвращается к аватарке провайдера; загруженный файл остаётся лежать в `uploads/avatars/`, но больше никуда не ссылается.

---

## Анализ корневой причины

Виновник — функция `handleOAuthCallback` в `src/controllers/auth.controller.ts`:

```typescript
if (user) {
    // ...
    user.profile.name = userData.name;       // ← всегда, безусловно

    if (userData.avatar) {
        user.profile.avatar = userData.avatar; // ← почти всегда: Google, GitHub, Discord
                                               //    всегда возвращают avatar
    }
    user.lastLoginAt = new Date();
    await user.save();
}
```

При повторном входе существующий юзер найден по `{provider, providerId}`. Блок обновления не проверяет, были ли поля изменены пользователем, и просто присваивает значения из `userData` (которые получены от провайдера).

Для аватарки есть дополнительный эффект: загруженный файл (`uploads/avatars/{userId}-{timestamp}.ext`) оказывается «осиротевшим» — его путь больше не хранится в `profile.avatar`, но сам файл не удаляется.

---

## Тест-кейсы

### TC-001 — Имя перезаписывается при re-login

| Шаг | Действие | Проверка |
|---|---|---|
| 1 | Войти через Google. Имя в Google: `«Иван Петров»`. | `GET /api/auth/me` → `profile.name === "Иван Петров"` |
| 2 | `PATCH /api/users/me` с `{ profile: { name: "Иваныч" } }`. | `GET /api/auth/me` → `profile.name === "Иваныч"` |
| 3 | Выйти (`POST /api/auth/logout`). | — |
| 4 | Войти через Google повторно. | `GET /api/auth/me` → `profile.name === ?` |
| **Ожидание** | `profile.name === "Иваныч"` | |
| **Факт** | `profile.name === "Иван Петров"` — имя из Google | **FAIL** |

---

### TC-002 — Загруженная аватарка перезаписывается при re-login

| Шаг | Действие | Проверка |
|---|---|---|
| 1 | Войти через Google. Аватарка: URL от Google (`https://...googleusercontent...`). | `GET /api/auth/me` → `profile.avatar` содержит `googleusercontent` |
| 2 | `POST /api/users/me/avatar` с файлом `photo.jpg`. | `GET /api/auth/me` → `profile.avatar === "http://localhost:3001/uploads/avatars/{userId}-{ts}.jpg"` |
| 3 | Выйти. | — |
| 4 | Войти через Google повторно. | `GET /api/auth/me` → `profile.avatar === ?` |
| **Ожидание** | `profile.avatar` содержит `/uploads/avatars/` | |
| **Факт** | `profile.avatar` содержит `googleusercontent` — аватарка из Google | **FAIL** |

---

### TC-003 — Осиротевший файл аватарки после re-login

| Шаг | Действие | Проверка |
|---|---|---|
| 1–4 | Повторить TC-002 полностью. | — |
| 5 | Проверить содержимое `uploads/avatars/` на диске сервера. | Файл `{userId}-{ts}.jpg` из шага 2 **должен быть удалён** |
| **Ожидание** | Файл удалён (или его не было) | |
| **Факт** | Файл остаётся на диске, ссылок на него нет | **FAIL** |

---

### TC-004 — Провайдер без аватарки не затирает локальную

| Шаг | Действие | Проверка |
|---|---|---|
| 1 | Войти через провайдер, который **не** возвращает `avatar` (если таким есть, иначе TC пропускается). | — |
| 2 | Загрузить аватарку через `POST /api/users/me/avatar`. | `profile.avatar` → локальный файл |
| 3 | Выйти, войти повторно. | `GET /api/auth/me` → `profile.avatar === ?` |
| **Ожидание** | Локальная аватарка сохранена (блок `if (userData.avatar)` не выполнялся) | |
| **Факт** | Зависит от провайдера — требует проверки | |

---

## Ссылки на код

- Корень проблемы: `linkoo_backend/src/controllers/auth.controller.ts` → `handleOAuthCallback`
- Загрузка аватарки (что затирается): `linkoo_backend/src/controllers/user.controller.ts` → `uploadAvatar`
- Сохранение имени (что затирается): `linkoo_backend/src/controllers/user.controller.ts` → `updateProfile`
- Удаление старого файла (не срабатывает при re-login): `linkoo_backend/src/controllers/user.controller.ts` → `uploadAvatar`, блок удаления старого файла
