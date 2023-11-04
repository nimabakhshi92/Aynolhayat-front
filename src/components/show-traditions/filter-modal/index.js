import { useDispatch, useSelector } from "react-redux";
import { useGetSummaryTree } from "../../../api/hooks/allHooks";
import { SummaryTree } from "../../NarrationSummaries/SummaryTree";
import { SurahSummaryTree } from "../../NarrationSummaries/SurahSummaryTree";
import Button from "../../ui/buttons/primary-button";

import classes from "./filter-modal.module.css";
import { Fragment, useState, useEffect } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import {
  setSection,
  setSelectedNode,
} from "../../../features/summaryTree/summaryTreeSlice";

export default function FilterModal({ className, data, style }) {
  const { section, selectedNode } = useSelector((store) => store.summaryTree);
  const dispatch = useDispatch();
  return (
    <section className={className} style={style}>
      <div className={classes.button_container}>
        <Button
          onClickHandler={() => {
            dispatch(setSection({ section: "narration" }));
          }}
          variant={section === "narration" ? "primary" : "secondary"}
        >
          روایات
        </Button>
        <Button
          onClickHandler={() => dispatch(setSection({ section: "verse" }))}
          variant={section === "verse" ? "primary" : "secondary"}
        >
          آیات
        </Button>
        <Button
          onClickHandler={() => dispatch(setSection({ section: "surah" }))}
          variant={section === "surah" ? "primary" : "secondary"}
        >
          سوره ها
        </Button>
      </div>
      {section === "surah" ? (
        <SurahSummaryTree
          section={section}
          selectedNode={selectedNode}
          data={data || []}
        />
      ) : (
        <SummaryTree
          selectedNode={selectedNode}
          section={section}
          data={data || []}
        />
      )}
    </section>
  );
}
