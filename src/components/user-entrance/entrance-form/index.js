import { useTranslation } from "react-i18next";
import classes from "./entrance-form.module.css";

export default function EntranceForm({ children }) {
  const { t } = useTranslation();

  return (
    <form className={classes.form_container}>
      <h1>عین الحیاة</h1>
      {children}
    </form>
  );
}
