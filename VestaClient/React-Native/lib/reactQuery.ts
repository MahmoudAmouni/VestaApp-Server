import { AppState, AppStateStatus } from "react-native";
import { focusManager, QueryClient } from "@tanstack/react-query";


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000, 
      gcTime: 5 * 60_000, 
      refetchOnReconnect: true,
      refetchOnMount: false, 
      refetchOnWindowFocus: false, 
    },
  },
});


export function setupReactQueryFocus() {
  const onAppStateChange = (status: AppStateStatus) => {
    focusManager.setFocused(status === "active");
  };

  const sub = AppState.addEventListener("change", onAppStateChange);

  focusManager.setFocused(AppState.currentState === "active");

  return () => sub.remove();
}
