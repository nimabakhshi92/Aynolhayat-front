import classes from "../show-traditions/filter-modal/filter-modal.module.css";
import { Fragment, useState, useEffect } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setSelectedNode } from "../../features/summaryTree/summaryTreeSlice";

// import "./styles.css";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../ui/input";
export function SummaryTree({ data, section }) {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredNodes, setFilteredNodes] = useState([]);

  let c = data.map((level1, index1) => {
    return {
      value: index1 + "l1" + level1.alphabet,
      label: level1.alphabet,
      children: level1.subjects?.map((level2, index2) => {
        return {
          value: index1 + "l1" + index2 + "l2" + level2.title,
          label: level2.title,
          children: level2.sub_subjects?.map((level3, index3) => {
            return {
              value:
                index1 + "l1" + index2 + "l2" + index3 + "l3" + level3.title,
              label: level3.title,
              children: level2.subjects_3?.map((level4, index4) => {
                return {
                  value:
                    index1 +
                    "l1" +
                    index2 +
                    "l2" +
                    index3 +
                    "l3" +
                    index4 +
                    "l4" +
                    level4.title,
                  label: level4.title,
                  children: level4.subjects_4?.map((level5, index5) => {
                    return {
                      value:
                        index1 +
                        "l1" +
                        index2 +
                        "l2" +
                        index3 +
                        "l3" +
                        index4 +
                        "l4" +
                        index5 +
                        "l5" +
                        level5.title,
                      label: level5.title,
                    };
                  }),
                };
              }),
            };
          }),
        };
      }),
    };
  });

  useEffect(() => {
    if (!filterText) {
      setFilteredNodes(c);
      return;
    }
    setFilteredNodes(c.reduce(filterNodes, []));
  }, [filterText, data]);
  const [clicked, setClicked] = useState({});
  const onClick = (value) => {
    setClicked(value);
  };

  const positionEndIdx = (value) => {
    if (!value) return;
    console.log(value);
    let idx;
    idx = value?.indexOf("l4");
    if (idx > -1) return idx + 2;
    idx = value?.indexOf("l3");
    if (idx > -1) return idx + 2;
    idx = value?.indexOf("l2");
    if (idx > -1) return idx + 2;
    idx = value?.indexOf("l1");
    if (idx > -1) return idx + 2;
    return 0;
  };

  const extractPosition = (value) => {
    return value?.slice(0, positionEndIdx(value));
  };
  useEffect(() => {
    const clickedValue = clicked.value;
    console.log(expanded);
    const newExpanded = expanded.filter((e) =>
      extractPosition(clickedValue).includes(extractPosition(e))
    );
    setExpanded(newExpanded);
  }, [clicked]);

  const filterNodes = (filtered, node) => {
    const children = (node.children || []).reduce(filterNodes, []);

    if (
      node.label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) >
        -1 ||
      children.length
    ) {
      filtered.push({ ...node, children });
    }

    return filtered;
  };
  return (
    <div className={classes.alphabet}>
      <p className={classes.alphabet_title}>فهرست مطالب</p>
      <div>
        <Input
          className="w-full mb-2"
          style={{ height: "48px" }}
          type="search"
          placeholder="جستجو در فهرست"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <CheckboxTree
          nodes={filteredNodes}
          checked={checked}
          expanded={expanded}
          expandOnClick
          onCheck={(checkedData) => {
            setChecked(checkedData);
          }}
          onClick={onClick}
          onExpand={(expandedData) => {
            setExpanded(expandedData);
          }}
          // icons={{
          //   check: (
          //     <FontAwesomeIcon
          //       className="rct-icon rct-icon-check"
          //       icon="check-square"
          //     />
          //   ),
          //   uncheck: (
          //     <FontAwesomeIcon
          //       className="rct-icon rct-icon-uncheck"
          //       icon={["fas", "square"]}
          //     />
          //   ),
          //   halfCheck: (
          //     <FontAwesomeIcon
          //       className="rct-icon rct-icon-half-check"
          //       icon="check-square"
          //     />
          //   ),
          //   expandClose: (
          //     <FontAwesomeIcon
          //       className="rct-icon rct-icon-expand-close"
          //       icon="chevron-right"
          //     />
          //   ),
          //   expandOpen: (
          //     <FontAwesomeIcon
          //       className="rct-icon rct-icon-expand-open"
          //       icon="chevron-down"
          //     />
          //   ),
          //   expandAll: (
          //     <FontAwesomeIcon
          //       className="rct-icon rct-icon-expand-all"
          //       icon="plus-square"
          //     />
          //   ),
          //   collapseAll: (
          //     <FontAwesomeIcon
          //       className="rct-icon rct-icon-collapse-all"
          //       icon="minus-square"
          //     />
          //   ),
          //   parentClose: (
          //     <FontAwesomeIcon
          //       className="rct-icon rct-icon-parent-close"
          //       icon="folder"
          //     />
          //   ),
          //   parentOpen: (
          //     <FontAwesomeIcon
          //       className="rct-icon rct-icon-parent-open"
          //       icon="folder-open"
          //     />
          //   ),
          //   leaf: (
          //     <FontAwesomeIcon
          //       className="rct-icon rct-icon-leaf-close"
          //       icon="file"
          //     />
          //   ),
          // }}
        />
      </div>
    </div>
  );
}

export const SummaryTreeOld = ({ data, section, selectedNode }) => {
  const [subjectVisibility, setSubjectVisibility] = useState([]);
  const dispatch = useDispatch();

  function toggleVisibility(index, alphabet) {
    setSubjectVisibility((prevVisibility) => {
      const updatedVisibility = [...prevVisibility];
      updatedVisibility[index] = !updatedVisibility[index];
      return updatedVisibility;
    });
    dispatch(
      setSelectedNode({ node: { ...selectedNode, [section]: alphabet } })
    );
  }

  return (
    <div className={classes.alphabet}>
      <p className={classes.alphabet_title}>فهرست مطالب</p>
      {data.map((item, index) => (
        <Fragment key={index}>
          <div
            className={`${classes.alphabet_container} ${
              selectedNode[section] !== item.alphabet
                ? ""
                : classes.alphabet_open
            }`}
            onClick={() => toggleVisibility(index, item.alphabet)}
          >
            <p>{item.alphabet}</p>
            <MdOutlineArrowForwardIos
              className={`${classes.arrow} ${
                selectedNode[section] !== item.alphabet ? "" : classes.arrow__up
              }`}
            />
          </div>
          <div
            className={`${
              selectedNode[section] !== item.alphabet
                ? classes.subject_container__hidden
                : classes.subject_container__visible
            }`}
          >
            {item.subjects.map((sub, subIndex) => (
              <p key={subIndex} className={classes.subject}>
                {sub.title}
              </p>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
