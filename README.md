# Картографическое веб-приложение

Веб-приложение для отображения картографических данных с использованием React и OpenLayers.

## Технические требования

- Node.js версии 18.0 или выше
- npm или yarn

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone <URL-репозитория>
cd <название-папки-проекта>
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Запуск в режиме разработки

```bash
npm run dev
```
Приложение будет доступно по адресу: `http://localhost:5173`

## Примечание
Для просмотра 3д отображения на панораме необходимо находиться в ветке `dev-new-panorama-view`.


### 4. Сборка для production

```bash
npm run build
```

Собранные файлы будут находиться в папке `dist`.

### 5. Просмотр собранной версии

```bash
npm run preview
```

## Структура проекта

```
public/
src/
├── components/
│   ├── Map/
│   │   ├── features/
│   │   │   ├── CrossroadsLayer.jsx
│   │   │   ├── RoadsLayer.jsx
│   │   │   └── SemaphoresLayer.jsx
│   │   ├── hooks/
│   │   │   ├── useLayersLoad.js
│   │   │   ├── useMapEvents.js
│   │   │   ├── useMapExtent.js
│   │   │   └── useVectorLayer.js
│   │   ├── layers/
│   │   │   └── VectorLayers.jsx
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   ├── interactions.js
│   │   │   └── styles.js
│   │   ├── MapComponent.css
│   │   └── MapComponent.jsx
│   ├── PanoramaModal/
│   │   ├── hooks/
│   │   │   └── usePanorama.js
│   │   ├── PanoramaModal.css
│   │   └── PanoramaModal.jsx
│   ├── PropertiesPanel/
│   │   ├── PropertiesPanel.css
│   │   └── PropertiesPanel.jsx
│   └── Tooltip/
│       ├── Tooltip.css
│       └── Tooltip.jsx
├── data/
│   ├── index.js
│   ├── line.json
│   ├── panorama.jpg
│   ├── road_cros.json
│   └── semaphores.json
├── App.css
├── App.jsx
└── main.jsx
```

## Основные возможности

- Отображение векторных слоев (дороги, перекрестки, светофоры)
- Интерактивное взаимодействие с объектами на карте
- Панель свойств объектов с информацией о типе объекта
- Просмотр панорамных изображений при двойном клике
- Всплывающие подсказки с координатами
- Адаптивный дизайн

## Используемые технологии

- React 18
- OpenLayers 9
- Three.js (для панорамных просмотров)
- Vite (сборка)
- CSS3

## Скрипты

- `npm run dev` - запуск сервера разработки
- `npm run build` - сборка проекта
- `npm run preview` - предпросмотр собранной версии
- `dev-new-panorama-view` - версия с 3д объектами на панораме
  
## Взаимодействие с картой

- **Наведение курсора** - отображение подсказки с координатами
- **Клик** - открытие панели свойств объекта
- **Двойной клик** - открытие панорамного просмотра
- **Закрытие панели** - клик на кнопку "×" в правом верхнем углу
