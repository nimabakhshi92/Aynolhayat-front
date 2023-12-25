import { Stack } from "@mui/material";
import Button from "./ui/buttons/primary-button";
import { useNavigate } from "react-router-dom";

export const HeaderLT = () => {
  const navigate = useNavigate();
  return (
    <header
      className="p-3 px-12 bg-white h-15 fixed w-full top-0 right-0"
      style={{
        zIndex: 98,
        // background:
        //   "radial-gradient(circle, rgba(65,222,59,0.7) 0%, rgba(0,171,0,0.7) 50%, rgba(52,217,47,0.7) 100%)",
        // color: "white",
        // backdropFilter: "blur(5px)",
        // backdropFilter: 'drop-shadow(4px 4px 10px green)'        // boxShadow: "10px",
      }}
    >
      <Stack
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
      >
        <h1> عین الحیاه</h1>
        {/* <div className="w-9 h-9 flex justify-center items-center rounded-[50%] bg-[green]">
          N
              </div> */}
        {/* <Button
          onClickHandler={() => navigate("/login")}
          variant="secondary"
          style={{
            border: "1px solid #aaa",
            padding: "2px",
            borderRadius: "6px",
          }}
        >
          ورود / ثبت نام
        </Button> */}
        {/* <span
          style={{
            border: "1px solid #aaa",
            padding: "2px",
            borderRadius: "6px",
          }}
        >
          ورود / ثبت نام
        </span> */}
      </Stack>
    </header>
  );
};
