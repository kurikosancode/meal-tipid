import './DayCard.css'

function DayCard({ day, dailyBudget, meals, calorieGoal }) {
    const totalCost = meals.reduce((sum, meal) => sum + meal.price, 0)
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)

    return (
        <div className="day-card">
            <h3>{day}</h3>
            <div className="day-budget">₱{dailyBudget}</div>
            <div className="meals">
                {meals.map((meal, index) => (
                    <div key={index} className={`meal ${meal.type.toLowerCase()}`}>
                        <h4>{meal.type}</h4>
                        <p>{meal.name}</p>
                        {meal.ingredients && <div className="ingredients">{meal.ingredients.split('\n').map((ing, i) => <div key={i}>{ing}</div>)}</div>}
                        <small>₱{meal.price} • {meal.calories} cal</small>
                    </div>
                ))}
            </div>
            <div className="day-total">
                <span>Total: ₱{totalCost}</span>
                <span>{calorieGoal} cal</span>
            </div>
        </div>
    )
}

export default DayCard