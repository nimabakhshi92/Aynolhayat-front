import classes from "../show-traditions/filter-modal/filter-modal.module.css";
import { Fragment, useState, useEffect } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedNode,
  setTreeIsOpen,
  toggleTreeIsOpen,
} from "../../features/summaryTree/summaryTreeSlice";

import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import Input from "../ui/input";
import { extractTreeIndex } from "../../utils/manipulation";
import { TreeItem } from "./SummaryTree";

export function SurahSummaryTree({ data, section, selectedNode }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [clicked, setClicked] = useState({});
  const [c, setC] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  useEffect(() => {
    let newc = data.map((level1, index1) => {
      return {
        value: index1 + "l1" + level1.surah_no,
        label: level1.surah_no + "-" + level1.surah_name,
        children: level1.verses?.map((level2, index2) => {
          return {
            value:
              index1 +
              "l1" +
              index2 +
              "l2" +
              level2.verse_no +
              "-" +
              level2.verse_content,
            label: level2.verse_no + "-" + level2.verse_content,
            children: level2.sub_subjects?.map((level3, index3) => {
              return {
                value:
                  index1 + "l1" + index2 + "l2" + index3 + "l3" + level3.title,
                label: level3.title,
                className:
                  index1 +
                    "l1" +
                    index2 +
                    "l2" +
                    index3 +
                    "l3" +
                    level3.title ===
                  clicked.value
                    ? "b-red"
                    : null,
              };
            }),
          };
        }),
      };
    });
    setC(newc);
  }, [data, clicked]);

  useEffect(() => {
    if (!filterText) {
      setFilteredNodes(c);
      return;
    }
    setFilteredNodes(c.reduce(filterNodes, []));
  }, [filterText, c]);
  const onClick = (value) => {
    setClicked(value);
    dispatch(
      setSelectedNode({ node: { ...selectedNode, [section]: value.value } })
    );
  };
  const positionEndIdx = (value) => {
    if (!value) return;
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
      {/* <p className={classes.alphabet_title}>فهرست مطالب</p> */}
      <div>
        <Input
          className="w-full my-2"
          style={{
            height: "48px",
          }}
          type="search"
          placeholder="جستجو در فهرست"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <CheckboxTree
          style={{
            overflow: "scroll",
          }}
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
        />
      </div>
    </div>
  );
}

export const SurahSummaryTreeOld = ({ data, section, selectedNode }) => {
  const [subjectVisibility, setSubjectVisibility] = useState([]);
  const dispatch = useDispatch();

  function toggleVisibility(index, surahNo) {
    setSubjectVisibility((prevVisibility) => {
      const updatedVisibility = [...prevVisibility];
      updatedVisibility[index] = !updatedVisibility[index];
      return updatedVisibility;
    });
    dispatch(
      setSelectedNode({ node: { ...selectedNode, [section]: surahNo } })
    );
  }

  return (
    <div className={classes.alphabet}>
      <p className={classes.alphabet_title}>فهرست مطالب</p>
      {data?.map((item, index) => (
        <Fragment key={index}>
          <div
            className={`${classes.alphabet_container} ${
              selectedNode[section] !== item.surah_no
                ? ""
                : classes.alphabet_open
            }`}
            onClick={() => toggleVisibility(index, item.surah_no)}
          >
            <p>
              {item.surah_no}- {item.surah_name}
            </p>
            <MdOutlineArrowForwardIos
              className={`${classes.arrow} ${
                selectedNode[section] !== item.surah_no ? "" : classes.arrow__up
              }`}
            />
          </div>
          <div
            className={`${
              selectedNode[section] !== item.surah_no
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

export const MySurahSummaryTree = ({ data, section, selectedNode }) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [clicked, setClicked] = useState({});
  const [c, setC] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  useEffect(() => {
    let newc = data.map((level1, index1) => {
      return {
        value: index1 + "l1" + level1.surah_no,
        label: level1.surah_no + "-" + level1.surah_name,
        children: level1.verses?.map((level2, index2) => {
          return {
            value:
              index1 +
              "l1" +
              index2 +
              "l2" +
              level2.verse_no +
              "-" +
              level2.verse_content,
            label: level2.verse_no + "-" + level2.verse_content,
            // children: level2.sub_subjects?.map((level3, index3) => {
            //   return {
            //     value:
            //       index1 + "l1" + index2 + "l2" + index3 + "l3" + level3.title,
            //     label: level3.title,
            //     className:
            //       index1 +
            //         "l1" +
            //         index2 +
            //         "l2" +
            //         index3 +
            //         "l3" +
            //         level3.title ===
            //       clicked.value
            //         ? "b-red"
            //         : null,
            //   };
            // }),
          };
        }),
      };
    });

    setC(newc);
  }, [data, clicked]);

  const positionEndIdx = (value) => {
    if (!value) return;
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

  useEffect(() => {
    if (c?.length > 0 && !selectedNode[section]) {
      dispatch(
        setSelectedNode({
          node: {
            ...selectedNode,
            [section]: c[0].children[0].value,
          },
        })
      );
    }
  }, [c, selectedNode]);

  useEffect(() => {
    if (!filterText) {
      setFilteredNodes(c);
      return;
    }
    setFilteredNodes(c.reduce(filterNodes, []));
  }, [filterText, c]);
  const onClick = (value) => {
    setClicked(value);
    dispatch(
      setSelectedNode({ node: { ...selectedNode, [section]: value.value } })
    );
    dispatch(toggleTreeIsOpen());
  };
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    const clickedValue = clicked.value;
    const filteredExpanded = expanded.filter((e) =>
      extractPosition(clickedValue).includes(extractPosition(e))
    );
    setExpanded(filteredExpanded);
    setFlag(!flag);
  }, [clicked]);

  const isOpen = (value) => {
    if (!value || !selectedNode[section]) return false;
    const valueTreeIndex = extractTreeIndex(value);
    const [lvl1, lvl2, lvl3] = valueTreeIndex;

    const selectedNodeValue = selectedNode[section];
    const nodeTreeIndex = extractTreeIndex(selectedNodeValue);
    const [lvl1Node, lvl2Node, lvl3Node] = nodeTreeIndex;

    if (lvl1 === lvl1Node && lvl2 === undefined && lvl3 === undefined)
      return true;
    if (lvl1 === lvl1Node && lvl2 === lvl2Node && lvl3 === undefined)
      return true;
    if (lvl1 === lvl1Node && lvl2 === lvl2Node && lvl3 === lvl3Node)
      return true;
    return false;
  };
  return (
    <div className={classes.alphabet}>
      <p style={{ fontSize: 18 }}>فهرست موضوعات</p>
      <Input
        className="w-full my-2"
        style={{ height: "48px" }}
        type="search"
        placeholder="جستجو در فهرست"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <ul>
        {filteredNodes?.map((node) => {
          return (
            <TreeItem
              label={node.label}
              level={1}
              open={isOpen(node.value)}
              flag={flag}
            >
              <ul
                style={{
                  fontFamily: "Noto Sans Arabic",
                }}
              >
                {node.children?.map((child) => {
                  return (
                    <TreeItem
                      label={child.label}
                      level={2}
                      open={isOpen(child.value)}
                      flag={flag}
                      onClick={() => onClick(child)}
                      selected={selectedNode[section] === child.value}
                    >
                      {/* <ul>
                        {child?.children?.map((item) => {
                          return (
                            <TreeItem
                              label={item.label}
                              level={3}
                              onClick={() => onClick(item)}
                              open={isOpen(item.value)}
                              flag={flag}
                              selected={selectedNode[section] === item.value}
                            />
                          );
                        })}
                      </ul> */}
                    </TreeItem>
                  );
                })}
              </ul>
            </TreeItem>
          );
        })}
      </ul>
    </div>
  );
};
