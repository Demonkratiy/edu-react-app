# Redux setup (RTK)

Поднятие Redux Toolkit в проекте: store, типизированные хуки, Provider и первый slice. Это инфраструктурный шаг — компоненты к store ещё не подключены (это следующий шаг главы).

> Теория Flux, словарь терминов (store, action, dispatch, reducer, selector) и почему именно Redux — в [state-management.md](./state-management.md). Здесь — практика.

## Что поставили

```bash
npm install @reduxjs/toolkit react-redux
```

- **`@reduxjs/toolkit` (RTK)** — официальный, рекомендованный способ писать Redux. Убирает исторический boilerplate «vanilla Redux»: `createSlice` генерирует actions и reducer'ы, внутри встроен **Immer** (пишешь «мутирующий» код — получаешь иммутабельное обновление), `configureStore` настраивает DevTools и middleware из коробки.
- **`react-redux`** — связка Redux ↔ React: компонент `<Provider>` и хуки `useSelector` / `useDispatch`.

## Store

`app/store.ts`:

```ts
import { configureStore } from '@reduxjs/toolkit';
import { todoReducer } from '@/entities/todo';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

- **`configureStore`** — обёртка над `createStore`. Принимает объект `reducer`, где каждый ключ — это слой state. Здесь `todos` → `state.todos`. Под капотом делает `combineReducers`, подключает Redux DevTools и стандартный middleware (`redux-thunk`, проверки на мутации и сериализуемость в dev).
- **`RootState`** — тип **всего** состояния, выведенный **из самого store** через `ReturnType<typeof store.getState>`. Не пишем его руками — добавишь slice в `reducer`, тип обновится сам.
- **`AppDispatch`** — тип функции `dispatch`, тоже выведенный из store. Он «знает» про подключённый middleware (например, умеет ли диспатчить thunk'и).

> Почему типы выводятся из store, а не объявляются вручную: единый источник истины. Конфигурация store определяет форму state — типы просто следуют за ней. Руками = два места которые рассинхронизируются.

## Типизированные хуки

`app/hooks.ts`:

```ts
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

Зачем оборачивать стандартные хуки:

- **`useAppSelector`** — это `useSelector`, который уже знает тип `RootState`. В `(state) => state.todos.items` параметр `state` автоматически типизирован, без ручной аннотации в каждом компоненте.
- **`useAppDispatch`** — `useDispatch` знающий `AppDispatch`. Важно для TypeScript + thunk'ов: обычный `useDispatch` не знает про middleware и будет ругаться на async-экшены.

`.withTypes<...>()` — идиома react-redux 9 для создания пред-типизированных версий. Раньше писали `useSelector: TypedUseSelectorHook<RootState>` вручную — `.withTypes` это заменило.

**Правило:** в компонентах импортируем `useAppSelector` / `useAppDispatch`, а не голые `useSelector` / `useDispatch`.

## Provider

`app/main.tsx` — оборачиваем дерево в `<Provider>`:

```tsx
import { Provider } from 'react-redux';
import { store } from './store';
import { HomePage } from '@/pages/home';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HomePage />
    </Provider>
  </StrictMode>,
);
```

`<Provider>` кладёт `store` в React Context, и любой компонент ниже получает к нему доступ через хуки — без prop drilling. Это и есть тот механизм, ради которого мы берём библиотеку: store доступен отовсюду, а не «пробрасывается сверху».

## Первый slice

`entities/todo/model/todoSlice.ts`:

```ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from './types';

interface TodosState {
  items: Todo[];
}

const initialState: TodosState = { items: [] };

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded: {
      reducer(state, action: PayloadAction<Todo>) {
        state.items.push(action.payload);
      },
      prepare(text: string) {
        return { payload: { id: crypto.randomUUID(), text, completed: false } satisfies Todo };
      },
    },
    todoToggled(state, action: PayloadAction<string>) {
      const todo = state.items.find((item) => item.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    todoDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { todoAdded, todoToggled, todoDeleted } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;
```

Что здесь происходит:

- **`createSlice`** генерирует из одного объекта: reducer, action creators и их `type`-строки. `name: 'todos'` → actions получают type вида `'todos/todoAdded'`.
- **`state.items.push(...)` — это НЕ мутация.** Внутри `createSlice` работает **Immer**: ты пишешь привычный мутирующий код, Immer перехватывает и производит настоящую иммутабельную копию. Снаружи slice остаётся immutable (как требует Flux), внутри — читаемый код без `...spread`.
- **`PayloadAction<T>`** — тип action'а с типизированным `payload`.
- **`prepare`** — колбэк который формирует payload до того как он попадёт в reducer. Здесь генерируем `id` внутри slice, чтобы компонент диспатчил просто `todoAdded(text)` и не знал как делаются id. Reducer и prepare — две части одного action creator.
- Экспортируем **actions** (их будут диспатчить компоненты) и **reducer** (его подключает store).

> Глубже про action, payload, Immer и почему `todoAdded` лежит в entity, а не в feature — в [redux-concepts.md](./redux-concepts.md).

## Где что лежит (FSD)

| Что                                 | Где                                | Почему                                                                                           |
| ----------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| `store`, `RootState`, `AppDispatch` | `app/store.ts`                     | store композирует **все** слайсы → зависит от верхних слоёв → обязан быть на самом верху (`app`) |
| `useAppSelector`, `useAppDispatch`  | `app/hooks.ts`                     | типизированы от store, лежат рядом с ним                                                         |
| `todoReducer`, actions              | `entities/todo/model/todoSlice.ts` | state сущности `Todo` принадлежит её слайсу                                                      |
| `<Provider>`                        | `app/main.tsx`                     | инициализация приложения — слой `app`                                                            |

### Напряжение FSD ↔ Redux и наш компромисс

Тут есть конфликт, который стоит понимать:

- **store** зависит от всех слайсов → должен быть **наверху** (`app`).
- **хуки** нужны компонентам **снизу** (`features`, `widgets`, `pages`).

А строгое правило FSD запрещает нижним слоям импортировать `app` (импорт «вверх»). Противоречие.

**Наш выбор:** держим store и хуки в `app/`, и разрешаем любому слою импортировать **именно** `@/app/store` и `@/app/hooks` — одно задокументированное исключение в линтере границ ([eslint.config.js](../eslint.config.js), правило `1c`). Store — это объективно cross-cutting синглтон, и так делают многие FSD+Redux проекты.

**Более «чистая» альтернатива** (на будущее): хуки в `shared/lib/store`, типы `RootState`/`AppDispatch` пробрасываются туда через TypeScript declaration merging, а слайсы подключаются в store через reducer injection (`combineSlices().inject(...)`). Это убирает импорт «вверх» полностью, но тащит заметно больше TS-машинерии. Для первого захода в Redux это лишний шум — вернёмся к этому в главе про trade-offs.

## Как видеть всю картину стора (статически)

В Zustand/MobX часто есть **один файл стора**, где видно все поля и действия сразу. Redux намеренно **распределяет** state по слайсам — цена модульности. «Один файл со всем» теряется, но увидеть всю картину без запуска сервера всё равно можно — просто через другие точки входа:

| Хочешь увидеть…                            | Смотри сюда                                                                       |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| Какие домены вообще есть в сторе           | `app/store.ts` → объект `reducer` (это оглавление: ключ → `state.<ключ>`)         |
| Полную форму всего стора                   | тип `RootState` (наведи курсор в IDE — покажет дерево, собранное из всех слайсов) |
| Всё состояние + все действия одного домена | его `*Slice.ts` (вот тут «один файл», но на домен, а не на всё)                   |
| Что домен отдаёт наружу                    | его `index.ts` (public API: actions, селекторы, типы)                             |
| Поток actions в рантайме                   | Redux DevTools (уже с запущенным приложением)                                     |

Ментальная модель: в Zustand читаешь **один файл сверху вниз**; в Redux — **`store.ts` (карта доменов) + слайсы (главы)**. Практический приём: открыл `store.ts`, увидел домены, `Go to Definition` на reducer'е прыгает прямо в слайс. Навигация по доменам вместо скролла одного гигантского файла.

> Это честный trade-off: Redux проигрывает в «обзорности с одного взгляда», выигрывает в модульности. В главе сравнения перепишем тот же стор на Zustand и почувствуем разницу вживую.

## Connected vs presentational: где подключать стор

Не каждый компонент должен ходить в стор. Граница по FSD:

| Слой                                 | Роль                       | Стор?                             |
| ------------------------------------ | -------------------------- | --------------------------------- |
| `shared/ui` (Button, Input)          | переиспользуемые примитивы | **нет** — только props            |
| `entities` (TodoItem)                | презентация сущности       | **нет** — только props            |
| `features` (AddTodoForm, TodoFilter) | взаимодействия             | **да** — хуки                     |
| `widgets` (TodoList)                 | композиция                 | **да** — хуки                     |
| `pages` (HomePage)                   | сборка                     | обычно да, либо просто композиция |

**Принцип:** `shared/ui` и `entities` — **презентационные** (тупые). Их легко переиспользовать и сторить в изоляции. `features`/`widgets` — **connected** (клей приложения). `TodoItem` остаётся тупым: виджет `TodoList` владеет диспатчем и передаёт ему `onToggle`/`onDelete` колбэками, чтобы сущность оставалась гибкой.

**Trade-off:** подключив компоненты, мы убрали prop drilling (`HomePage` схлопнулся до композиции) — но связали компоненты со стором: их сложнее переиспользовать и тестировать/сторить в изоляции.

**Сигнал:** если тащить Redux в Storybook стало больно — вероятно, подключаешь стор **слишком низко**. Держи переиспользуемые примитивы презентационными.

> В бигтехе так и делают: connected — `features`/`widgets`/`pages`; переиспользуемый UI-kit и entity-представления остаются на props. Строгий «container/presentational» split после хуков стал необязательным, но правило «reusable = dumb» осталось универсальным.

## Storybook для connected-компонентов

Как только компонент вызывает `useAppSelector`/`useAppDispatch`, его stories упадут вне `<Provider>`. Решение (см. [preview.tsx](../.storybook/preview.tsx)):

1. **Фабрика `setupStore`** (в [store.ts](../src/app/store.ts)) — свежий изолированный стор на каждую story, чтобы они не делили состояние.
2. **Глобальный Provider-декоратор** оборачивает **каждую** story: `<Provider store={setupStore(...)}>`. Цена платится один раз здесь.
3. **`parameters.preloadedState`** — story засевает стор нужным состоянием:
   ```tsx
   export const ActiveSelected: Story = {
     parameters: { preloadedState: { filter: { status: 'active' } } },
   };
   ```
   Состояние connected-компонента задаётся через **стор**, а не через `args` (пропсов-то нет).

**Реальный стор, не mock.** Современная рекомендация Redux — тестировать/сторить с настоящим стором и реальными редьюсерами (через `setupStore`), а не с фейковым `redux-mock-store` (он устарел).

> `play`-функции (story-as-test) и как они гоняются в CI — в [storybook.md](./storybook.md). Здесь только Redux-часть: как дать connected-компоненту стор.

## Что дальше

Готово: `todos` и `filter` — в своих слайсах, `visibleTodos` — мемоизированный селектор, prop drilling убран, `HomePage` — чистая композиция. Стор — единственный источник истины, компоненты `features`/`widgets` подключены к нему напрямую.

Дальше по главе: честный разбор **trade-offs** (что улучшилось, что усложнилось по сравнению с `useState`), затем сравнение того же домена на **Zustand** и **MobX**.

## См. также

- [State management (обзор и дерево решений)](./state-management.md) — теория Flux и зачем Redux
- [Feature-Sliced Design](./fsd-architecture.md) — слои, слайсы, public API
- [Immutable state in React](./immutable-state.md) — почему reducer'ы возвращают новый объект (и что Immer прячет)
- [Redux Toolkit: Quick Start](https://redux-toolkit.js.org/tutorials/quick-start)
- [Redux Style Guide](https://redux.js.org/style-guide/)
