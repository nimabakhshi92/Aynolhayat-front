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
}) {
  const [matchedSuggesttions, setMatchedSuggestions] = useState(suggestions);
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const matchSearch = () => {
    if (!reference?.current) return suggestions;
    const searchTerm = reference.current?.value;
    if (!searchTerm) return suggestions;
    return suggestions.filter((item) => item.includes(searchTerm));
  };

  const suggestionsExist = matchedSuggesttions?.length > 0;
  const onMenuClick = (item) => {
    reference.current.value = item;
    if (onChange) onChange();
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
        onBlur={() => {
          setTimeout(() => setOpenSuggestions(false), 100);
        }}
        onChange={() => {
          setMatchedSuggestions(matchSearch());
          if (onChange) onChange();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === "NumpadEnter")
            onPressEnter();
        }}
      />
      {openSuggestions && suggestionsExist && (
        <ul className={classes.menu}>
          {matchedSuggesttions?.map((item, index) => (
            <li key={index} onClick={(e) => onMenuClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
