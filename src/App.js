import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import Login from "./components/user-entrance/login";
import SingUp from "./components/user-entrance/sing-up";
import Modal from "./components/ui/modal";
import NarrationSummaries from "./pages/NarrationSummaries";
import { store } from "./store";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { SharedLayout, SharedLayoutLT } from "./pages/SharedLayout";
import { QueryClient, QueryClientProvider } from "react-query";
import { NarrationSave } from "./pages/NarrationSave";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  NarrationWarehouse,
  NarrationWarehouseLT,
} from "./pages/NarrationWarehouse";
import { NarrationEdit } from "./pages/NarrationEdit";
import { NarrationSummariesNew } from "./pages/NarrationSummariesNew";
import { NarrationSummariesNewLT } from "./pages/NarrationSummariesNewLT";
import { NarrationSearch } from "./pages/NarrationSearch";

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
            <Route path=":narrationId" element={<NarrationEdit />}></Route>
            <Route path="save narration/" element={<NarrationEdit />}></Route>
            <Route
              path="save narration/:narrationId"
              element={<NarrationEdit />}
            ></Route>
            <Route
              path="search/:narrationId"
              element={<NarrationEdit />}
            ></Route>

            <Route
              path="edit narration/:narrationId"
              element={<NarrationEdit />}
            ></Route>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SharedLayoutLT />
                </ProtectedRoute>
              }
            >
              {/* <Route path="s/" element={<NarrationSummariesNewLT />}></Route> */}
              {/* <Route index element={<NarrationWarehouse />}></Route> */}
              <Route index element={<NarrationWarehouseLT />}></Route>
              <Route path="saved/" element={<div>saved</div>}></Route>
              <Route path="search/" element={<NarrationSearch />}></Route>
              {/* <Route path="summary" element={<NarrationSummariesNew />}></Route> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <ToastContainer />
    </Provider>
  );
}

export default App;
