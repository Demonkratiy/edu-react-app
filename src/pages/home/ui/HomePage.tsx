import { TodoWidget } from '@/widgets/todo';

function HomePage() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <main className='mx-auto flex max-w-md flex-col gap-4 p-4'>
        <TodoWidget />
      </main>
    </div>
  );
}

export { HomePage };
