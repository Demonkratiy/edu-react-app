# Сравнение: Redux vs Zustand vs MobX

Один и тот же todo-домен на трёх популярных state-менеджерах. Цель — прочувствовать разницу подходов, **не** реализуя каждый в проекте. Redux (RTK) мы построили по-настоящему (см. [redux-setup.md](./redux-setup.md)); Zustand и MobX здесь показаны иллюстративными сниппетами.

> Высокоуровневый ландшафт и дерево решений — в [state-management.md](./state-management.md). Здесь — код-левел контраст на знакомом домене.

## Redux (RTK) — что мы построили

Разнесено по ролям: slice (state + reducers через Immer), actions, селекторы, store, Provider, типизированные хуки.

```ts
// entities/todo/model/todoSlice.ts
const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [] as Todo[] },
  reducers: {
    todoAdded: {
      reducer: (s, a: PayloadAction<Todo>) => void s.items.push(a.payload), // Immer
      prepare: (text: string) => ({ payload: { id: crypto.randomUUID(), text, completed: false } }),
    },
    todoToggled: (s, a: PayloadAction<string>) => {
      const t = s.items.find((x) => x.id === a.payload);
      if (t) t.completed = !t.completed;
    },
  },
});
```

```tsx
// компонент
const items = useAppSelector(selectTodos);
const dispatch = useAppDispatch();
dispatch(todoAdded('Buy milk'));
```

**Профиль:** явные именованные actions → полная трассируемость и time-travel; store через `<Provider>`; иммутабельность обязательна (Immer прячет boilerplate); больше всего церемонии.

## Zustand — «useState, доступный отовсюду»

Весь стор — один `create()`: state и «экшены» (просто функции) вместе. Нет Provider, нет отдельных reducer'ов/action-объектов. Хук **сам** и есть стор.

```ts
import { create } from 'zustand';

interface TodoState {
  items: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  items: [],
  addTodo: (text) =>
    set((s) => ({ items: [...s.items, { id: crypto.randomUUID(), text, completed: false }] })),
  toggleTodo: (id) =>
    set((s) => ({
      items: s.items.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),
  deleteTodo: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}));
```

```tsx
// компонент — селектор прямо в хуке, без Provider
const items = useTodoStore((s) => s.items);
const addTodo = useTodoStore((s) => s.addTodo);
addTodo('Buy milk');
```

**Профиль:** минимум boilerplate; нет Provider; селекторы встроены в хук; иммутабельность **вручную** (spread) или через immer-middleware; нет action-объектов → трассируемость ниже (DevTools есть через middleware). Отлично для малых/средних приложений.

## MobX — реактивные observable

Совсем другая парадигма: объявляешь observable-объект, **мутируешь его напрямую**, а компоненты-`observer` перерисовываются автоматически при изменении того, что читают. Никаких actions/reducers/селекторов-функций.

```ts
import { makeAutoObservable } from 'mobx';

class TodoStore {
  items: Todo[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addTodo(text: string) {
    this.items.push({ id: crypto.randomUUID(), text, completed: false }); // НАСТОЯЩАЯ мутация
  }

  toggleTodo(id: string) {
    const t = this.items.find((x) => x.id === id);
    if (t) t.completed = !t.completed;
  }

  // производное состояние — computed-геттер (кэшируется автоматически)
  get activeCount() {
    return this.items.filter((t) => !t.completed).length;
  }
}

export const todoStore = new TodoStore();
```

```tsx
import { observer } from 'mobx-react-lite';

const TodoList = observer(() => (
  <ul>
    {todoStore.items.map((t) => (
      <li key={t.id}>{t.text}</li>
    ))}
  </ul>
));
```

**Профиль:** мутируешь напрямую (иммутабельность **не** нужна); `computed`-геттеры = derived state (как селекторы, но авто-кэш и авто-подписка); компоненты оборачиваются в `observer`. Меняет «явный лог что произошло» на эргономику. Часто в enterprise / Angular-style командах.

## Ключевые отличия

|                         | **Redux (RTK)**               | **Zustand**            | **MobX**                           |
| ----------------------- | ----------------------------- | ---------------------- | ---------------------------------- |
| Парадигма               | Flux (явные actions)          | Flux-lite              | реактивные observable              |
| Определение стора       | slices + `configureStore`     | один `create()`        | класс + `makeAutoObservable`       |
| Provider                | **да**                        | нет                    | нет                                |
| Обновление              | `dispatch(action)` → reducer  | `set((s) => …)`        | **мутируешь** `this.x = …`         |
| Чтение в компоненте     | `useSelector(selector)`       | `useStore(selector)`   | доступ к observable + `observer()` |
| Derived state           | селекторы / `createSelector`  | селектор-функция       | `computed`-геттеры (авто)          |
| Иммутабельность         | обязательна (Immer)           | вручную (или immer-mw) | **не нужна** (мутации)             |
| Трассируемость / лог    | высокая (именованные actions) | низкая                 | низкая                             |
| DevTools                | отличные                      | хорошие (middleware)   | хорошие                            |
| Async                   | thunks / RTK Query            | async-функции в сторе  | actions / flows                    |
| Boilerplate             | больше всего                  | минимум                | мало                               |
| Сдвиг ментальной модели | средний                       | маленький              | большой                            |

## Когда что

- **Redux (RTK)** — большие приложения; нужны предсказуемость, time-travel, middleware, единый строгий поток; командный стандарт; максимум вакансий. Цена — церемония.
- **Zustand** — малые/средние; хочется «глобального useState» без Provider и boilerplate. Нет тяжёлого async-инструментария RTK Query.
- **MobX** — предпочитаешь реактивную/ООП-модель и эргономику мутаций; не нужен явный журнал действий. Другая ментальная модель — закладывай время на переучивание.

## Мысль на вынос

Все три решают одну задачу — сквозной shared state — но с разной **философией**: Redux делает поток **явным** (ценой церемонии), Zustand — **минимальным**, MobX — **реактивным** (ценой другой модели мышления). Изучив Redux как самый эксплицитный, остальные читаются быстро: узнаёшь тот же паттерн в более компактной форме.

## См. также

- [State management (обзор и дерево решений)](./state-management.md)
- [Redux setup (RTK)](./redux-setup.md) — что мы построили по-настоящему
- [Redux/RTK: разбор понятий](./redux-concepts.md) — actions, payload, Immer, селекторы
