import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { todoAdded, todoDeleted, todoToggled } from '@/entities/todo';
import {
  filterChanged,
  selectFilteredTodos,
  selectFilterStatus,
  type FilterStatus,
} from '@/features/filter-todos';

// Facade hook: the widget's single seam to the store. Swapping state
// managers means rewriting this file only — components stay on props.
export const useTodoWidget = () => {
  const dispatch = useAppDispatch();
  const visibleTodos = useAppSelector(selectFilteredTodos);
  const filterStatus = useAppSelector(selectFilterStatus);

  const addTodo = (text: string) => dispatch(todoAdded(text));
  const toggleTodo = (id: string) => dispatch(todoToggled(id));
  const deleteTodo = (id: string) => dispatch(todoDeleted(id));
  const setFilter = (status: FilterStatus) => dispatch(filterChanged(status));

  return { visibleTodos, filterStatus, addTodo, toggleTodo, deleteTodo, setFilter };
};
