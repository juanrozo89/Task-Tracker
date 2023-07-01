export const getFormattedCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedCurrentDate = `${year}-${month}-${day}`;
  return formattedCurrentDate;
};

export const formatDateForDisplay = (date: Date) => {
  const dateStringAsDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
    hour: "numeric" as const,
    minute: "numeric" as const,
  };

  const formattedDate = dateStringAsDate.toLocaleDateString("en-US", options);
  return formattedDate;
};
