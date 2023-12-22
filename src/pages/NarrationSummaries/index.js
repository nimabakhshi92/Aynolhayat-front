import { useState } from "react";
import { useGetSummaryTree } from "../../api/hooks/allHooks";
import ShowTraditions from "../../components/show-traditions";
import Traditions from "../../components/show-traditions/traditions";
import { extractTreeIndex } from "../../utils/manipulation";
import { useSelector } from "react-redux";

export default function NarrationSummaries() {
  return <ShowTraditions />;
}

export function NarrationSummariesLT() {
  const [isModal, setIsModal] = useState(false);
  const { section, selectedNode } = useSelector((store) => store.summaryTree);

  function onShowModalHandler() {
    setIsModal((prevState) => !prevState);
  }
  function filterData(data) {
    data = data || [];
    const subSection = section !== "surah" ? "subjects" : "verses";
    const node = selectedNode[section];
    const treeIndex = extractTreeIndex(node);

    if (!node) return data.length > 0 ? data[0][subSection] : [];
    const [lvl1, lvl2, lvl3, lvl4, lvl5] = treeIndex;

    const filteredData = data
      .filter((_item1, index1) => index1 === lvl1 || lvl1 === undefined)
      .map((item1) => {
        if (lvl2 === undefined) return item1;
        const filteredItem1Subjects = item1[subSection]
          .filter((_item2, index2) => index2 === lvl2)
          .map((item2) => {
            if (lvl3 === undefined) return item2;
            const filteredSubSubjects = item2.sub_subjects
              .filter((_item3, index3) => index3 === lvl3)
              .map((item3) => {
                if (lvl4 === undefined) return item3;
                return item3;
              });
            return { ...item2, sub_subjects: filteredSubSubjects };
          });

        return { ...item1, [subSection]: filteredItem1Subjects };
      });
    if (filteredData?.length > 0) return filteredData[0][subSection];
    return [];
  }
  const { data, isLoading } = useGetSummaryTree(section);

  return (
    <div className="p-4 pt-25 grid gap-6 grid-cols-[1fr]">
      {/* <SortTraditions /> */}
      <Traditions section={section} data={filterData(data)} className="" />
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
