import classes from "./show-traditions.module.css";
import SortTraditions from "./sort-traditions";
import Traditions from "./traditions";
import Filter from "../ui/filter";
import Modal from "../ui/modal";
import Links from "../header/links-and-logo/links";
import { useState } from "react";
import FilterModal from "./filter-modal";
import { useGetSummaryTree } from "../../api/hooks/allHooks";
import { useSelector } from "react-redux";

export default function ShowTraditions() {
  const [isModal, setIsModal] = useState(false);
  const { section, selectedNode } = useSelector((store) => store.summaryTree);

  function onShowModalHandler() {
    setIsModal((prevState) => !prevState);
  }
  function filterData(data) {
    const filteredData = (data || []).filter((item) => {
      if (section === "surah") return item.surah_no === selectedNode;
      if (section !== "surah") return item.alphabet === selectedNode;
    });
    if (filteredData?.length > 0)
      return filteredData[0][section !== "surah" ? "subjects" : "verses"];
    return [];
  }
  const { data, isLoading } = useGetSummaryTree(section);
  return (
    <div className="p-4 grid gap-6 grid-cols-[3fr_7fr]">
      <FilterModal data={data} className="hidden lg:block" />
      {/* <SortTraditions /> */}
      <Traditions data={filterData(data)} className="" />
      {/* <div onClick={onShowModalHandler} className={classes.filter}>
        <Filter />
      </div> */}
      {/* {isModal && (
        <Modal onCloseHandler={onShowModalHandler}>
          <FilterModal />
        </Modal>
      )} */}
    </div>
  );
}
