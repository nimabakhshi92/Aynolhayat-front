import {
  CircularProgress
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  useGetNarrationIndividual
} from "../api/hooks/allHooks";
import { useParams } from "react-router-dom";
import { SingleNarration } from "./NarrationWarehouseLT";


export const NarrationDetail = ({ }) => {
  const { narrationId } = useParams();
  const { user } = useSelector((store) => store.user);
  const params = new URLSearchParams(window.location.search);
  const personal = params.get('personal')
  const { data: narration, isLoading } = useGetNarrationIndividual(narrationId,
    !personal ? undefined : user
  );

  return (
    <div className="">
      <div className=" mx-4 ">
        {(isLoading) && (
          <CircularProgress
            className="absolute top-1/2 sm:left-1/3 left-[44%]  "
            color="success"
          />
        )}
        {!isLoading &&
          narration && (
            <SingleNarration
              narration={narration}
              showSummary={false}
              personal={personal}
            />
          )
        }
      </div>
    </div>
  );
};
