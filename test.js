// Get the current year
const currentYear = new Date().getFullYear();

// Generate an array with a 16-year span starting from the current year
const years = Array.from({ length: 17 }, (_, index) =>
  (currentYear - index).toString()
);

console.log(years);
