import React, { useState } from 'react'

function HabitForm() {
    const [name, setName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO
    }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <input
        type="text"
        placeholder="Enter habit name"
        label="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
      />
      <button
        type="submit"
        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors"
      >
        + Add Habit
      </button>
    </form>
  )
}

export default HabitForm