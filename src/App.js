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
import { NarrationSave } from "./pages/NarrationSave";
import "react-toastify/dist/ReactToastify.css";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NarrationWarehouse } from "./pages/NarrationWarehouse";
import { NarrationEdit } from "./pages/NarrationEdit";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // cacheTime: 1000000000, // about 3 hours
      cacheTime: 0, //
      retry: false,
    },
  },
});

function App() {
  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  }
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
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
              <Route index element={<NarrationWarehouse />}></Route>
              <Route path="save narration" element={<NarrationSave />}></Route>
              <Route
                path="edit narration/:narrationId"
                element={<NarrationEdit />}
              ></Route>
              <Route path="summary" element={<NarrationSummaries />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <ToastContainer />
    </Provider>
  );
}

export default App;
