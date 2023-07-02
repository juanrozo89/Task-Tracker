import { useState } from "react";
import { NEW_CATEGORY } from "../constants";
import useExistingCategories from "../hooks/useExistingCategories";

const SelectCategory: React.FC<{
  _id: string;
  changeCategory: AnyFunction;
}> = ({ _id, changeCategory }) => {
  const categories = useExistingCategories();
  const [newCategory, setNewCategory] = useState<boolean>(true);

  const selectCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCat = event.target.value;
    if (selectedCat == NEW_CATEGORY) {
      setNewCategory(true);
    } else {
      setNewCategory(false);
      changeCategory(selectedCat);
    }
  };

  return (
    <>
      <select
        id={_id}
        onChange={selectCategory}
        className={newCategory ? "inactive-input" : ""}
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
      {newCategory && (
        <input
          id="catgeory-input"
          type="text"
          name="category"
          onChange={(e) => changeCategory(e.target.value)}
          required
        />
      )}
    </>
  );
};

export default SelectCategory;
