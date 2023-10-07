import Input from "../ui/input";
import classes from "../ui/dropdown/dropdown.module.css";
import { useState } from "react";

export default function InputWithSuggestion({
  style,
  placeholder,
  reference,
  className,
  suggestions,
  onPressEnter,
  onChange,
  value,
  onBlur,
}) {
  const [matchedSuggesttions, setMatchedSuggestions] = useState(suggestions);
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const matchSearch = (e) => {
    // console.log(e.target.value);
    // console.log(
    //   suggestions.filter((item) => {
    //     return item?.includes(e.target.value);
    //   })
    // );
    if (!reference)
      return suggestions?.filter((item) => {
        return item?.includes(value);
      });

    if (!reference?.current) return suggestions;
    const searchTerm = reference.current?.value;
    if (!searchTerm) return suggestions;
    return suggestions.filter((item) => item?.includes(searchTerm));
  };

  const suggestionsExist = matchedSuggesttions?.length > 0;
  const onMenuClick = (item) => {
    if (reference) reference.current.value = item;
    if (reference && onChange) onChange();
    if (!reference && onChange) {
      onChange({ target: { value: item } });
      onPressEnter({ target: { value: item } });
    }
  };
  return (
    <div className="relative">
      <Input
        value={value}
        style={style}
        reference={reference}
        className={className}
        type="text"
        placeholder={placeholder}
        onClick={() => setOpenSuggestions(true)}
        onBlur={(e) => {
          setTimeout(() => setOpenSuggestions(false), 100);
          if (onBlur) onBlur(e);
        }}
        onChange={(e) => {
          setMatchedSuggestions(matchSearch(e));
          if (onChange) onChange(e);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === "NumpadEnter") {
            if (reference) onPressEnter();
            else {
              onPressEnter(event);
            }
          }
        }}
      />
      {openSuggestions && suggestionsExist && (
        <ul className={classes.menu}>
          {matchSearch()?.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                onMenuClick(item);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
