export const initialJobs = [
  {
    id: 1,
    title: "Need a driver for my car",
    category: "Driver",
    location: "Coimbatore",
    date: "Today, 4:00 PM",
    budget: 1200,
    description: "Need an experienced driver for a family trip.",
    payment: "Cash / UPI",
    status: "Open",
  },
  {
    id: 2,
    title: "Kitchen tap leaking",
    category: "Plumber",
    location: "RS Puram",
    date: "Today, 2:00 PM",
    budget: 500,
    description: "Repair a leaking kitchen tap.",
    payment: "Cash",
    status: "Open",
  },
  {
    id: 3,
    title: "Repair electrical switchboard",
    category: "Electrician",
    location: "Peelamedu",
    date: "Tomorrow, 10:00 AM",
    budget: 800,
    description: "Check and repair two faulty switches.",
    payment: "UPI",
    status: "Open",
  },
  {
    id: 4,
    title: "Car mechanic needed",
    category: "Mechanic",
    location: "Gandhipuram",
    date: "Tomorrow, 9:00 AM",
    budget: 1500,
    description: "Inspect a car that is not starting.",
    payment: "Cash / UPI",
    status: "Open",
  },
];

export const categories = [
  "All Services",
  "Driver",
  "Plumber",
  "Electrician",
  "Mechanic",
  "Carpenter",
  "Cleaner",
  "Painter",
  "Other",
];

export const serviceCards = [
  ["🚗", "Driver"],
  ["🚰", "Plumber"],
  ["💡", "Electrician"],
  ["🔧", "Mechanic"],
  ["🪚", "Carpenter"],
  ["🧹", "Cleaner"],
  ["🖌️", "Painter"],
  ["＋", "Other"],
];

export const emptyForm = {
  title: "",
  category: "Driver",
  location: "",
  date: "",
  budget: "",
  description: "",
  payment: "Cash / UPI",
};