const isCurrentMonth = (date) => {
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const isPreviousMonth = (date) => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return (
    date.getMonth() === lastMonth.getMonth() &&
    date.getFullYear() === lastMonth.getFullYear()
  );
};

module.exports = { isCurrentMonth, isPreviousMonth };
