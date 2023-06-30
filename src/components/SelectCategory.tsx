import { useState, useContext, useRef } from "react";
import { UserContext } from "../Contexts";

const SelectCategory = () => {
  const { user } = useContext(UserContext)!;
  const categoryRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState<boolean>(true);
  const NEW_CATEGORY = "new-category";

  let categories: Array<string> = [];
  for (let task of user!.tasks) {
    if (!categories.includes(task.category)) {
      categories.push(task.category);
    }
  }

  const selectCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCat = event.target.value;
    if (selectedCat == NEW_CATEGORY) {
      setNewCategory(true);
    } else {
      setNewCategory(false);
      setCategory(selectedCat);
    }
  };

  return (
    <>
      <select
        onChange={selectCategory}
        className={newCategory ? "inactive-input" : ""}
      >
        <option value={NEW_CATEGORY} className="italic">
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
          id="catgeory"
          type="text"
          name="category"
          ref={categoryRef}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      )}
    </>
  );
};

export default SelectCategory;
