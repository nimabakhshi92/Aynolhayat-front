import classes from "./show-traditions.module.css";
import SortTraditions from "./sort-traditions";
import Traditions from "./traditions";
import Filter from "../ui/filter";
import Modal from "../ui/modal";
import Links from "../header/links-and-logo/links";
import {useState} from "react";
import FilterModal from "./filter-modal";

export default function ShowTraditions() {
    const [isModal, setIsModal] = useState(false)

    function onShowModalHandler() {
        setIsModal(prevState => !prevState)
    }

    return (
        <div className={classes.container}>
            <SortTraditions/>
            <div className={classes.filter_modal}>
                <FilterModal/>
            </div>
            <Traditions/>
            <div onClick={onShowModalHandler} className={classes.filter}>
                <Filter/>
            </div>
            {isModal &&
                <Modal onCloseHandler={onShowModalHandler}>
                    <FilterModal/>
                </Modal>}
        </div>
    )
}
