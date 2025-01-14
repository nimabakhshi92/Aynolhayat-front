import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { ThemeProvider } from "@mui/material";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/user-entrance/login";
import SingUp from "./components/user-entrance/sing-up";
import { Bookmarks } from "./pages/Bookmarks";
import { NarrationEdit } from "./pages/NarrationEdit";
import { NarrationSearch } from "./pages/NarrationSearch";
import {
  NarrationWarehouseLT
} from "./pages/NarrationWarehouseLT";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { SharedLayoutLT } from "./pages/SharedLayout";
import { store } from "./store";
import { theme } from "./styles/theme";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  PersistQueryClientProvider
} from "@tanstack/react-query-persist-client";
import { Transfer } from "./pages/Transfer";
import { Download } from "./pages/Download";
import { NarrationDetail } from "./pages/NarrationDetail";
import NoInternetAlarm from "./components/general/NoInternetDetector";
import WeakInternetDetector from "./components/general/WeakInternetDetector";

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
          <NoInternetAlarm />
          <WeakInternetDetector />

          {/* <QueryClientProvider client={queryClient}> */}
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="login" element={<Login />}></Route>
              <Route path="signup" element={<SingUp />}></Route>
              <Route path=":narrationId" element={<NarrationEdit />}></Route>
              <Route path="save narration/" element={<NarrationEdit saveNarration={true} />}></Route>
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
                element={<NarrationEdit myNarrations={true} />}
              ></Route>
              <Route
                path="narration-detail/:narrationId"
                element={<NarrationDetail />}
              ></Route>
              <Route
                path="shared-narrations/:sharedNarrationId"
                element={<NarrationEdit checkOnly={true} />}
              ></Route>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <SharedLayoutLT />
                  </ProtectedRoute>
                }
              >
                <Route index element={<NarrationWarehouseLT />}></Route>
                <Route
                  path="my-narrations/"
                  element={<NarrationWarehouseLT personal={true} />}
                ></Route>
                <Route path="saved/" element={<Bookmarks />}></Route>
                <Route path="search/" element={<NarrationSearch />}></Route>
                <Route path="transfer/" element={<Transfer />}></Route>
                <Route path="download/" element={<Download />}></Route>
                <Route path="download2/" element={<Download test={true} />}></Route>
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
