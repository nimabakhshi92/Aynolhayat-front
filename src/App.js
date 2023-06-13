import {useState} from "react";

import Login from "./components/user-entrance/login";
import SingUp from "./components/user-entrance/sing-up";
import Header from "./components/header";
import Modal from "./components/ui/modal";
import ShowTraditionsPage from "./pages/show-traditions";

function App() {
    return (
        <>
            <Header/>
            <ShowTraditionsPage />
        </>
    );
}

export default App;
