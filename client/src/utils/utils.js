// client/src/utils/utils.js

export const isHabitDue = (habit, date) => {
  if (!habit || !habit.freq) return false;
  const mode = (habit.freq.mode || "").toLowerCase();

  switch (mode) {
    case "daily":
      return true;
    case "weekly":
    case "custom":
      // Note: date.getDay() => 0 is Sunday, 1 is Monday, ... 6 is Saturday
      return Array.isArray(habit.freq.days) && habit.freq.days.includes(date.getDay());
    default:
      return false;
  }
};

export const formatDate = (input) => {
  // Accepts Date or ISO-like string, returns YYYY-MM-DD
  if (!input) return null;
  if (typeof input === "string") {
    // if a full ISO string or 'YYYY-MM-DD' passed
    return input.split("T")[0];
  }
  if (input instanceof Date) {
    return input.toISOString().split("T")[0];
  }
  try {
    const d = new Date(input);
    return d.toISOString().split("T")[0];
  } catch {
    return null;
  }
};

/**
 * Check if all prerequisites for `habit` are fulfilled on `date`.
 * By default this checks same-day completions (A completed the same date as B's date).
 * @param {object} habit - habit to check (may have .prerequisites: [ids])
 * @param {Array} habits - array of all habit objects
 * @param {Date} date - Date object
 * @returns {boolean}
 */
export const isPrerequisitesMet = (habit, habits, date) => {
  if (!habit || !Array.isArray(habit.prerequisites) || habit.prerequisites.length === 0) return true;
  const dateStr = formatDate(date);
  for (const pid of habit.prerequisites) {
    const phab = habits.find(h => h.id === pid);
    if (!phab) return false; // prereq missing => treat as unmet
    if (!Array.isArray(phab.progress) || !phab.progress.includes(dateStr)) {
      return false;
    }
  }
  return true;
};

/**
 * Detects whether adding `candidatePrereqs` to node `candidateId` would create a cycle
 * in a graph where edges go from habit -> prerequisites (i.e., dependency edges).
 * @param {number|string} candidateId
 * @param {Array<number|string>} candidatePrereqs
 * @param {Array} habits
 * @returns {boolean} true if a cycle would exist
 */
export const detectCycle = (candidateId, candidatePrereqs = [], habits = []) => {
  // Build adjacency list: node -> [prereqIds]
  const adj = {};
  habits.forEach(h => {
    adj[h.id] = Array.isArray(h.prerequisites) ? [...h.prerequisites] : [];
  });
  // Overwrite or create candidate node edges as proposed
  adj[candidateId] = Array.isArray(candidatePrereqs) ? [...candidatePrereqs] : [];

  const visited = new Set();
  const recStack = new Set();

  const dfs = (node) => {
    if (!adj[node]) return false;
    if (!visited.has(node)) {
      visited.add(node);
      recStack.add(node);

      for (const neigh of adj[node]) {
        if (!visited.has(neigh) && dfs(neigh)) return true;
        else if (recStack.has(neigh)) return true;
      }

      recStack.delete(node);
    }
    return false;
  };

  // Check all nodes for cycle
  for (const n of Object.keys(adj)) {
    if (!visited.has(n) && dfs(n)) return true;
  }
  return false;
};

/**
 * Compute completion rate over the last `daysBack` days.
 * Counts only dates where the habit is due and prerequisites are met.
 */
export const computeCompletionRate = (habit, habits, daysBack = 30) => {
  if (!habit) return { eligible: 0, completed: 0, rate: 0 };

  const today = new Date();
  let eligible = 0;
  let completed = 0;

  for (let i = 0; i < daysBack; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);

    // is the habit scheduled/due this day?
    if (!isHabitDue(habit, d)) continue;

    // is it eligible (prereqs met for that date)?
    if (!isPrerequisitesMet(habit, habits, d)) continue;

    eligible++;
    if (Array.isArray(habit.progress) && habit.progress.includes(dateStr)) {
      completed++;
    }
  }

  const rate = eligible === 0 ? 0 : (completed / eligible);
  return { eligible, completed, rate };
};

/**
 * Get weekly series (percentage completed per week) for the last `weeks` weeks.
 * Returns an array oldest->newest of weekly completion percentages.
 */
export const computeWeeklySeries = (habit, habits, weeks = 4) => {
  const today = new Date();
  const oneWeek = 7;
  const series = [];

  for (let w = 0; w < weeks; w++) {
    let eligible = 0;
    let completed = 0;
    for (let d = 0; d < oneWeek; d++) {
      const dayOffset = w * oneWeek + d;
      const date = new Date(today);
      date.setDate(today.getDate() - dayOffset);
      const dateStr = formatDate(date);

      if (!isHabitDue(habit, date)) continue;
      if (!isPrerequisitesMet(habit, habits, date)) continue;

      eligible++;
      if (Array.isArray(habit.progress) && habit.progress.includes(dateStr)) completed++;
    }
    const pct = eligible === 0 ? 0 : (completed / eligible);
    // record from newest to oldest; we'll reverse at the end so series go oldest->newest
    series.push(pct);
  }

  return series.reverse(); // oldest -> newest
};
