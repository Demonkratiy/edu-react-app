import type { Preview } from '@storybook/react-vite';
import { useState } from 'react';
import { Provider } from 'react-redux';
import '../src/app/index.css';
import { setupStore } from '../src/app/store';

const preview: Preview = {
  // Every story runs inside a fresh, isolated Redux store, so connected
  // components (those using useAppSelector/useAppDispatch) work and stories
  // don't share state. A story can preload slice state via
  // `parameters.preloadedState` to show a specific situation.
  decorators: [
    (Story, context) => {
      const [store] = useState(() => setupStore(context.parameters.preloadedState));
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
