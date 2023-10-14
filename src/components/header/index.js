import { useState } from "react";

import LinksAndLogo from "./links-and-logo";
import ProfileAndSearch from "./profile-and-search";
import Modal from "../ui/modal";

import classes from "./header.module.css";
import Links from "./links-and-logo/links";

export default function Header() {
  const [isModal, setIsModal] = useState(false);

  function onShowModalHandler() {
    setIsModal((prevState) => !prevState);
  }

  return (
    <header className={classes.container}>
      <LinksAndLogo menuClickHandler={onShowModalHandler} />
      <ProfileAndSearch />
      {/* {isModal && (
        <Modal onCloseHandler={onShowModalHandler}>
          <Links onModal={isModal} />
        </Modal>
      )} */}
    </header>
  );
}
