import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainPage } from "./pages";

import { startWorker } from "./mocks";

import "./App.css";

// start the mock server

if (import.meta.env.MODE === "development") {
  startWorker();
}

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainPage />
    </QueryClientProvider>
  );
}

export default App;
