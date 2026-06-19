interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type FilterStatus = 'all' | 'active' | 'completed';

export type { FilterStatus, Todo };
