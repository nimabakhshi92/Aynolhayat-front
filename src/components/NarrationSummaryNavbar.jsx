import { Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { setSection } from "../features/summaryTree/summaryTreeSlice";

const NavbarItem = ({ title, selected, ...props }) => {
  return (
    <span
      className="cursor-pointer mt-0 px-12 py-1 hover:border-0 hover:border-b-4  hover:border-[#0bab64]"
      style={{
        borderBottom: selected ? "4px solid var(--primary-color)" : "",
      }}
      {...props}
    >
      {title}
    </span>
  );
};

export const NarrationSummaryNavbar = ({ className }) => {
  const dispatch = useDispatch();
  const { section, selectedNode } = useSelector((store) => store.summaryTree);
  return (
    <div
      className="fixed pt-4 right-24 left-8 "
      style={{
        // backgroundColor: "var(--blue-100)",
        zIndex: 98,
        backgroundColor: "#f7fafc10",
        backdropFilter: "blur(15px)",

        // boxShadow: "1px 1px 3px gray ",
      }}
    >
      <Stack
        gap="16px"
        className={`${className} h-12 border-solid border-0 border-b-4 border-[#ced6e0] 
         `}
        flexDirection="row"
        alignItems="center"
        style={{
          fontSize: "20px",
        }}
      >
        <NavbarItem
          onClick={() => {
            dispatch(setSection({ section: "narration" }));
          }}
          title="احادیث موضوعی"
          selected={section === "narration"}
        />
        <NavbarItem
          onClick={() => {
            dispatch(setSection({ section: "surah" }));
          }}
          title="تفسیر"
          selected={section === "surah"}
        />

        <NavbarItem
          onClick={() => {
            dispatch(setSection({ section: "verse" }));
          }}
          title="تفسیر موضوعی"
          selected={section === "verse"}
        />
      </Stack>
    </div>
  );
};
