# Конвертовані JSON файли

## Статистика конвертації
- Загальна кількість файлів: 44
- Файлів словників Strong: 18
- Файлів оригіналів: 3
- Файлів перекладів: 9
- Порожніх файлів: 1
- Файлів з помилками: 0
- Загальний розмір до: 0.09 MB
- Загальний розмір після: 0.09 MB
- Економія: 2.1%

## Метадані в файлах
Кожен конвертований файл містить метадані в полі `_meta`:
```json
{
  "_meta": {
    "converter": "under-word-converter",
    "version": 2,
    "converted": "2024-01-01T12:00:00.000Z",
    "info": {
      "translation": "lxx",
      "type": "original",
      "book": "GEN",
      "chapter": "1",
      "language": "greek",
      "name": "Septuagint (LXX)",
      "hasStrongs": true,
      "hasMorphology": true,
      "hasLemma": true,
      "originalPath": "originals/lxx/OldT/GEN/gen1_lxx.json"
    }
  },
  "verses": [...]
}
```

## Формат віршів після конвертації
```json
[
  {
    "v": 1,
    "ws": [
      { "w": "Ἐν", "s": "G1722", "l": "ἐν", "m": "PREP" },
      { "w": "ἀρχῇ", "s": "G746", "l": "ἀρχή", "m": "N-DSF" }
    ]
  }
]
```

## Використані скорочення
| Повний ключ | Скорочений |
|-------------|------------|
| word | w |
| strong | s |
| verse | v |
| words | ws |
| lemma | l |
| morph | m |
| code | c |
| name | n |
| chapters | ch |
| group | g |
| books | b |
| OldT | ot |
| NewT | nt |
| translation | tr |

## Дата конвертації
2025-12-09T20:33:45.595Z

## Примітки
- Оригінальні файли збережено в `public/data_backup`
- Порожні файли помічаються `"isEmpty": true` в метаданих
- Для перевірки: `node scripts/verifyConversion.js`
