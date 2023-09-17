import classes from "./sort-traditions.module.css";
import Dropdown from "../../ui/dropdown";
import Tag from "../../ui/tag";

export default function SortTraditions({ tags }) {
  //   const dropdown = [
  //     { id: 1, title: "پربازدیدترین" },
  //     { id: 2, title: "پرتکرارترین" },
  //     { id: 3, title: "قدیمی ترین" },
  //   ];

  return (
    <div className={classes.container}>
      {/* <div className={classes.sort_container}>
                    <p>مرتب سازی :</p>
                    <Dropdown items={dropdown} />
                </div> */}
      <div className={classes.tags_container}>
        {tags?.map((tag) => {
          <Tag tag={tag} />;
        })}
        <span className={classes.delete}>حذف همه</span>
      </div>
    </div>
  );
}
