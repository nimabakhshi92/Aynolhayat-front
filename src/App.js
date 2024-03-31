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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NarrationSave } from "./pages/NarrationSave";
import "react-toastify/dist/ReactToastify.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
import { ThemeProvider } from "@mui/material";
import { theme } from "./styles/theme";
import { Bookmarks } from "./pages/Bookmarks";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  PersistQueryClientProvider,
  persistQueryClient,
} from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 600000000, // about a week
      // cacheTime: 0, //
      retry: false,
      gcTime: 600000000,
      staleTime: 1800000, // 30 Minutes
      buster: "busteer",
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
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
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistQueryClientProvider
          client={queryClient}
          // queryClient={queryClient}
          persistOptions={{ persister }}
        >
          {/* <QueryClientProvider client={queryClient}> */}
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
                path="my-narrations/:narrationId"
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
                <Route
                  path="my-narrations/"
                  element={<NarrationWarehouseLT personal={true} />}
                ></Route>
                <Route path="saved/" element={<Bookmarks />}></Route>
                <Route path="search/" element={<NarrationSearch />}></Route>
                {/* <Route path="summary" element={<NarrationSummariesNew />}></Route> */}
              </Route>
            </Routes>
          </BrowserRouter>
          {/* </QueryClientProvider> */}
          <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
        <ToastContainer />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
