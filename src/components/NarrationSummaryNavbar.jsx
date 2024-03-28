import { Stack, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { setSection } from "../features/summaryTree/summaryTreeSlice";

const NavbarItem = ({ title, selected, ...props }) => {
  return (
    <span
      className="cursor-pointer mt-0 sm:px-12 py-1 hover:border-0 hover:border-b-4  hover:border-[#0bab64] "
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
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { section, selectedNode } = useSelector((store) => store.summaryTree);
  return (
    <div
      className="fixed w-full sm:w-[unset] pt-4 right-0 sm:right-24 sm:left-8 "
      style={{
        zIndex: 98,
        backgroundColor: "#f7fafc10",
        backdropFilter: "blur(15px)",
      }}
    >
      <Stack
        gap="16px"
        className={`${className} sm:px-0 px-2 sm:justify-start justify-between h-10 sm:h-12 border-solid border-0 border-b-4 border-[#ced6e0] 
         `}
        flexDirection="row"
        alignItems="center"
        style={{
          fontSize: isSmallScreen ? "16px" : "20px",
        }}
      >
        <NavbarItem
          onClick={() => {
            dispatch(setSection({ section: "bank" }));
          }}
          title="مخزن"
          selected={section === "bank"}
        />
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
