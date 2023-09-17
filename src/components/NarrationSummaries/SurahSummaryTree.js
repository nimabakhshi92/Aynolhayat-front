import classes from "../show-traditions/filter-modal/filter-modal.module.css";
import { Fragment, useState, useEffect } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedNode } from "../../features/summaryTree/summaryTreeSlice";

export const SurahSummaryTree = ({ data }) => {
  const [subjectVisibility, setSubjectVisibility] = useState([]);
  const dispatch = useDispatch();

  function toggleVisibility(index, surahNo) {
    setSubjectVisibility((prevVisibility) => {
      const updatedVisibility = [...prevVisibility];
      updatedVisibility[index] = !updatedVisibility[index];
      return updatedVisibility;
    });
    dispatch(setSelectedNode({ node: surahNo }));
  }

  return (
    <div className={classes.alphabet}>
      <p className={classes.alphabet_title}>فهرست مطالب</p>
      {data?.map((item, index) => (
        <Fragment key={index}>
          <div
            className={`${classes.alphabet_container} ${
              !subjectVisibility[index] ? "" : classes.alphabet_open
            }`}
            onClick={() => toggleVisibility(index, item.surah_no)}
          >
            <p>
              {item.surah_no}- {item.surah_name}
            </p>
            <MdOutlineArrowForwardIos
              className={`${classes.arrow} ${
                !subjectVisibility[index] ? "" : classes.arrow__up
              }`}
            />
          </div>
          <div
            className={`${
              !subjectVisibility[index]
                ? classes.subject_container__hidden
                : classes.subject_container__visible
            }`}
          >
            {item.verses?.map((verse, subIndex) => (
              <p key={subIndex} className={classes.subject}>
                {verse.verse_no}- {verse.verse_content}
              </p>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
