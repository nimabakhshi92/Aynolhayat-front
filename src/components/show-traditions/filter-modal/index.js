import { useDispatch, useSelector } from "react-redux";
import {
  MySummaryTree
} from "../../NarrationSummaries/SummaryTree";
import {
  MySurahSummaryTree
} from "../../NarrationSummaries/SurahSummaryTree";


export function FilterModalLT({ className, data, style }) {
  const { section, selectedNode } = useSelector((store) => store.summaryTree);
  const dispatch = useDispatch();
  return (
    <section className={className} style={style}>
      {section === "surah" ? (
        <MySurahSummaryTree
          section={section}
          selectedNode={selectedNode}
          data={data || []}
        />
      ) : (
        // <SummaryTree
        //   selectedNode={selectedNode}
        //   section={section}
        //   data={data || []}
        // />
        <MySummaryTree
          selectedNode={selectedNode}
          section={section}
          data={data || []}
        />
      )}
    </section>
  );
}
