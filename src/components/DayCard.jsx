import './DayCard.css'

function DayCard({ day, meals }) {
    const totalCost = meals.reduce((sum, meal) => sum + meal.price, 0)
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)

    return (
        <div className="day-card">
            <div>
                <h3>{day}</h3>
                <div className="day-budget">₱{totalCost}</div>
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
            </div>
            <div className="day-total">
                <span>Total: ₱{totalCost}</span>
                <span>{totalCalories} cal</span>
            </div>
        </div>
    )
}

export default DayCard