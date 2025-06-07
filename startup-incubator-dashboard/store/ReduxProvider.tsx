'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { useTokenRefresh } from '@/utils/useTokenRefresh';

function TokenRefreshWrapper() {
  
  useTokenRefresh() // Safe because wrapped by PersistGate
  return null
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TokenRefreshWrapper />
        {children}
      </PersistGate>
    </Provider>
  );
}
