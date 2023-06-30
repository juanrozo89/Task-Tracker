import { useContext } from "react";
import { UserContext } from "../Contexts";

const useExistingCategories = () => {
  const { user } = useContext(UserContext)!;
  let categories: Array<string> = [];
  for (let task of user!.tasks) {
    if (!categories.includes(task.category)) {
      categories.push(task.category);
    }
  }
  return categories;
};

export default useExistingCategories;
