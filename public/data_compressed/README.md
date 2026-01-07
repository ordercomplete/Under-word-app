# Конвертовані JSON файли

## Статистика конвертації
- Загальна кількість файлів: 42
- Файлів словників Strong: 0
- Файлів оригіналів: 0
- Файлів перекладів: 0
- Файлів з помилками: 0
- Загальний розмір до: 0.11 MB
- Загальний розмір після: 0.10 MB
- Економія: 6.4%

## Формати файлів

### 1. Переклади та оригінали
```json
{
  "_meta": {
    "converter": "under-word-converter-v2",
    "version": 2,
    "converted": "2024-01-01T12:00:00.000Z",
    "info": {
      "translation": "lxx",
      "type": "original",
      "book": "GEN",
      "chapter": "1",
      "language": "greek",
      "name": "LXX",
      "hasStrongs": true,
      "hasMorphology": true,
      "hasLemma": true,
      "originalPath": "originals/lxx/OldT/GEN/gen1_lxx.json"
    }
  },
  "verses": [
    {
      "v": 1,
      "ws": [
        { "w": "Ἐν", "s": "G1722", "l": "ἐν", "m": "PREP" }
      ]
    }
  ]
}
```

### 2. Словники Strong (БЕЗ метаданих)
```json
{
  "G746": {
    "s": "G746",
    "w": "ἀρχή",
    "t": "archē",
    "tr": "початок, принцип",
    "m": "іменник, жіночий рід, однина",
    "mn": ["початок, принцип"]
  }
}
```

### 3. Core файли
```json
{
  "lxx": {
    "ot": [
      {
        "g": "П'ятикнижжя",
        "b": [
          { "c": "GEN", "n": "Буття", "ch": 50 }
        ]
      }
    ]
  }
}
```

## Використані скорочення
| Повний ключ | Скорочений | Приклад |
|-------------|------------|---------|
| word | w | "Ἐν" |
| strong | s | "G1722" |
| verse | v | 1 |
| words | ws | масив слів |
| lemma | l | "ἐν" |
| morph | m | "PREP" |
| translit | t | "archē" |
| translation | tr | "початок" |
| morphology | m | "іменник..." |
| definition | def | "початок, принцип" |
| meanings | mn | ["початок", "принцип"] |
| hebrew_equiv | he | "H7225" |
| usages | u | ["Бут. 1:1"] |
| grammar | g | "іменник..." |

## Примітки
- Оригінальні файли збережено в: `public/data_backup`
- Словники Strong НЕ містять метадані
- Для перевірки: `node scripts/verifyConversion.js`

## Дата конвертації
2025-12-31T09:00:39.630Z
