import { useState } from "react";
import { NEW_CATEGORY } from "../constants";
import useExistingCategories from "../hooks/useExistingCategories";
import DOMPurify from "dompurify";

const SelectCategory: React.FC<{
  _id: string;
  changeCategory: AnyFunction;
}> = ({ _id, changeCategory }) => {
  const categories = useExistingCategories();
  const [showNewCategoryInput, setShowNewCategoryInput] =
    useState<boolean>(true);

  const selectCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCat = event.target.value;
    if (selectedCat == NEW_CATEGORY) {
      setShowNewCategoryInput(true);
    } else {
      setShowNewCategoryInput(false);
      changeCategory(selectedCat);
    }
  };

  return (
    <>
      <select
        id={_id}
        onChange={selectCategory}
        className={showNewCategoryInput ? "inactive-input" : ""}
      >
        <option className="italic new-category-option" value={NEW_CATEGORY}>
          {" "}
          - New category -{" "}
        </option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {showNewCategoryInput && (
        <input
          id="catgeory-input"
          type="text"
          name="category"
          onChange={(e) => changeCategory(DOMPurify.sanitize(e.target.value))}
          required
        />
      )}
    </>
  );
};

export default SelectCategory;
