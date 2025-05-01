
let level = 1, xp = 0, strength = 10, endurance = 10;
let totalVolume = parseInt(localStorage.getItem("totalVolume")) || 0;
let workoutCount = parseInt(localStorage.getItem("workoutCount")) || 0;

const stockExercises = [
  "Barbell Bench Press", "Dumbbell Bench Press", "Incline Barbell Press", "Incline Dumbbell Press",
  "Decline Barbell Press", "Decline Dumbbell Press", "Chest Dips", "Pec Deck Machine",
  "Cable Chest Fly", "Low-to-High Cable Fly", "High-to-Low Cable Fly", "Push-ups",
  "Machine Chest Press", "Svend Press", "Plate Press", "Landmine Press", "Dumbbell Pullover",
  "Smith Machine Bench Press", "Incline Machine Press", "Standing Cable Chest Press",
  "Seated Dumbbell Shoulder Press", "Barbell Overhead Press", "Arnold Press", "Military Press",
  "Smith Machine Overhead Press", "Dumbbell Lateral Raise", "Cable Lateral Raise",
  "Machine Lateral Raise", "Barbell Front Raise", "Dumbbell Front Raise", "Plate Front Raise",
  "Cable Front Raise", "Reverse Pec Deck", "Rear Delt Fly (Dumbbells)", "Cable Rear Delt Fly",
  "Face Pull", "Barbell Row", "Dumbbell Row", "T-Bar Row", "Machine Row", "Chest-Supported Row",
  "Lat Pulldown", "Wide-Grip Pull-Up", "Close-Grip Pull-Up", "Chin-Up", "Straight-Arm Pulldown",
  "Seated Cable Row", "Inverted Row", "Deadlift", "Rack Pull", "Barbell Curl", "Dumbbell Curl",
  "Preacher Curl", "Hammer Curl", "Incline Dumbbell Curl", "Concentration Curl", "Cable Curl",
  "EZ Bar Curl", "Spider Curl", "Machine Bicep Curl", "Zottman Curl", "Barbell Skull Crushers",
  "Dumbbell Skull Crushers", "Close-Grip Bench Press", "Overhead Dumbbell Tricep Extension",
  "Cable Rope Tricep Pushdown", "Straight Bar Tricep Pushdown", "Tricep Dips",
  "Machine Tricep Extension", "Single-Arm Cable Tricep Extension", "Dumbbell Kickback",
  "Barbell Back Squat", "Front Squat", "Hack Squat", "Smith Machine Squat",
  "Bulgarian Split Squat", "Goblet Squat", "Leg Press", "Dumbbell Lunge", "Barbell Lunge",
  "Walking Lunge", "Step-Up", "Leg Extension", "Romanian Deadlift", "Barbell Stiff-Leg Deadlift",
  "Dumbbell Stiff-Leg Deadlift", "Good Morning", "Glute Ham Raise", "Lying Leg Curl",
  "Seated Leg Curl", "Standing Calf Raise", "Seated Calf Raise", "Donkey Calf Raise",
  "Cable Crunch", "Hanging Leg Raise", "Decline Sit-Up", "Russian Twist", "Plank",
  "Ab Wheel Rollout", "Bicycle Crunch"
];

function populateExerciseDropdown() {
  const select = document.getElementById("exerciseSelect");
  if (!select) return;

  const custom = JSON.parse(localStorage.getItem("customExercises") || "[]");
  const allExercises = [...new Set([...stockExercises, ...custom])];
  select.innerHTML = "";

  allExercises.forEach(ex => {
    const option = document.createElement("option");
    option.value = ex;
    option.textContent = ex;
    select.appendChild(option);
  });
}

function updateStats() {
  while (xp >= 100) {
    xp -= 100;
    level++;
    strength += 2;
    endurance += 1;
  }

  document.getElementById("level")?.textContent = level;
  document.getElementById("xp")?.textContent = Math.floor(xp);
  document.getElementById("xpMax")?.textContent = 100;
  document.getElementById("strength")?.textContent = strength;
  document.getElementById("endurance")?.textContent = endurance;
  document.getElementById("rankName")?.textContent = getRank(level);
  document.getElementById("xpBar")?.style.setProperty("width", `${(xp / 100) * 100}%`);
  document.getElementById("totalVolume")?.textContent = totalVolume;
  document.getElementById("workoutCount")?.textContent = workoutCount;
}

function getRank(lvl) {
  if (lvl >= 50) return "S";
  if (lvl >= 30) return "A";
  if (lvl >= 20) return "B";
  if (lvl >= 10) return "C";
  return "E";
}

function logWorkout(exercise, sets, reps, weight) {
  const volume = sets * reps * weight;
  xp += volume / 10;
  totalVolume += volume;
  workoutCount++;

  localStorage.setItem("totalVolume", totalVolume);
  localStorage.setItem("workoutCount", workoutCount);

  const entry = document.createElement("div");
  entry.textContent = `${exercise} — ${sets}x${reps} @ ${weight}lbs`;
  document.getElementById("logResults")?.prepend(entry);

  const history = JSON.parse(localStorage.getItem("workoutHistory") || "[]");
  history.push({
    date: new Date().toLocaleString(),
    exercise, sets, reps, weight, volume
  });
  localStorage.setItem("workoutHistory", JSON.stringify(history));

  const prs = JSON.parse(localStorage.getItem("personalRecords") || "{}");
  if (!prs[exercise] || volume > prs[exercise]) {
    prs[exercise] = volume;
    localStorage.setItem("personalRecords", JSON.stringify(prs));
  }

  updateStats();
}

function saveProfile() {
  const name = document.getElementById("username")?.value;
  const age = document.getElementById("age")?.value;
  const weight = document.getElementById("weight")?.value;
  localStorage.setItem("profile", JSON.stringify({ name, age, weight }));
  loadProfile();
}

function loadProfile() {
  const data = JSON.parse(localStorage.getItem("profile"));
  if (!data) return;
  const out = document.getElementById("profileSummary");
  if (out) {
    out.innerHTML = `<p><strong>${data.name}</strong> — Age ${data.age}, Weight: ${data.weight} lbs</p>`;
  }
}

function addCustomExercise() {
  const input = document.getElementById("newExercise");
  const name = input?.value?.trim();
  if (!name) return;
  const list = JSON.parse(localStorage.getItem("customExercises") || "[]");
  list.push(name);
  localStorage.setItem("customExercises", JSON.stringify(list));
  input.value = "";
  populateExerciseDropdown();
}

function updateAccent() {
  const color = document.getElementById("accentColor")?.value;
  if (color) {
    localStorage.setItem("accentColor", color);
    document.documentElement.style.setProperty("--accent", color);
  }
}

function applyTheme() {
  const color = localStorage.getItem("accentColor");
  if (color) {
    document.documentElement.style.setProperty("--accent", color);
    document.getElementById("accentColor")?.value = color;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  populateExerciseDropdown();
  updateStats();
  loadProfile();
  applyTheme();

  const form = document.getElementById("logForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const ex = document.getElementById("exerciseSelect").value;
      const sets = +document.getElementById("sets").value;
      const reps = +document.getElementById("reps").value;
      const weight = +document.getElementById("weight").value;
      logWorkout(ex, sets, reps, weight);
      form.reset();
    });
  }
});
