import { useAppDispatch } from '@/app/hooks';
import { todoAdded } from '@/entities/todo';
import { Button, Input } from '@/shared/ui';
import { useState, type SubmitEvent } from 'react';

export const AddTodoForm = () => {
  const [text, setText] = useState('');

  const dispatch = useAppDispatch();

  const addTodo = (text: string) => dispatch(todoAdded(text));
  const trimmedText = text.trim();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trimmedText === '') return;
    addTodo(trimmedText);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className='flex w-full max-w-md items-start gap-2'>
      <Input
        className='flex-1'
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Add a new todo task'
      />
      <Button type='submit' disabled={trimmedText === ''}>
        Add
      </Button>
    </form>
  );
};
