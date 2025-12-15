import React, { useMemo, useState } from "react";

/*
Expected habit structure:
{
  id: number | string,
  name: string,
  completedDates: ["2025-12-01", "2025-12-02"],
  totalDays: number,
  currentStreak: number
}
*/

const HabitComparison = ({ habits }) => {
  const [selectedHabits, setSelectedHabits] = useState([]);

  // toggle habit selection
  const toggleHabit = (habitId) => {
    setSelectedHabits((prev) =>
      prev.includes(habitId)
        ? prev.filter((id) => id !== habitId)
        : [...prev, habitId]
    );
  };

  // compute metrics (auto updates when habits change)
  const comparisonData = useMemo(() => {
    return habits
      .filter((h) => selectedHabits.includes(h.id))
      .map((habit) => {
        const completionRate =
          habit.totalDays === 0
            ? 0
            : Math.round(
                (habit.completedDates.length / habit.totalDays) * 100
              );

        const consistency =
          habit.completedDates.length >= habit.totalDays * 0.8
            ? "High"
            : habit.completedDates.length >= habit.totalDays * 0.5
            ? "Medium"
            : "Low";

        return {
          ...habit,
          completionRate,
          consistency,
        };
      });
  }, [habits, selectedHabits]);

  return (
    <div className="habit-comparison">
      <h2>Compare Habits</h2>

      {/* Habit Selection */}
      <div className="habit-selection">
        {habits.map((habit) => (
          <label key={habit.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedHabits.includes(habit.id)}
              onChange={() => toggleHabit(habit.id)}
            />
            {habit.name}
          </label>
        ))}
      </div>

      {/* Comparison Table */}
      {comparisonData.length > 0 && (
        <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Habit</th>
              <th>Completion Rate</th>
              <th>Current Streak</th>
              <th>Consistency</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((habit) => (
              <tr key={habit.id}>
                <td>{habit.name}</td>
                <td>{habit.completionRate}%</td>
                <td>{habit.currentStreak} days</td>
                <td>{habit.consistency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HabitComparison;
