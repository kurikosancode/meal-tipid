import './GoalsStep.css'

function GoalsStep({ goals, setGoals }) {
    return (
        <div className="step-content">
            <div className="nutrition-goals">
                <div className="goal-item">
                    <label htmlFor="calories">Daily Calories</label>
                    <input
                        id="calories"
                        type="number"
                        value={goals.calories}
                        onChange={(e) => setGoals({ ...goals, calories: e.target.value })}
                    />
                </div>
                <div className="goal-item">
                    <label htmlFor="protein">Protein (g)</label>
                    <input
                        id="protein"
                        type="number"
                        value={goals.protein}
                        onChange={(e) => setGoals({ ...goals, protein: e.target.value })}
                    />
                </div>
                <div className="goal-item">
                    <label htmlFor="carbs">Carbs (g)</label>
                    <input
                        id="carbs"
                        type="number"
                        value={goals.carbs}
                        onChange={(e) => setGoals({ ...goals, carbs: e.target.value })}
                    />
                </div>
                <div className="goal-item">
                    <label htmlFor="fat">Fat (g)</label>
                    <input
                        id="fat"
                        type="number"
                        value={goals.fat}
                        onChange={(e) => setGoals({ ...goals, fat: e.target.value })}
                    />
                </div>
            </div>
        </div>
    )
}

export default GoalsStep
