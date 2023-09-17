import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import Login from "./components/user-entrance/login";
import SingUp from "./components/user-entrance/sing-up";
import Modal from "./components/ui/modal";
import NarrationSummaries from "./pages/NarrationSummaries";
import { store } from "./store";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { SharedLayout } from "./pages/SharedLayout";
import { QueryClient, QueryClientProvider } from "react-query";

import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 1000000000, // about 3 hours
      // cacheTime: 0, //
      retry: false,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />}></Route>
            <Route path="signup" element={<SingUp />}></Route>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SharedLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<NarrationSummaries />}></Route>
              {/* <Route path="contact" element={<Page1></Page1>}></Route> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <ToastContainer />
    </Provider>
  );
}

export default App;
