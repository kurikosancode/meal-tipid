import './DayCard.css'
import { useState } from 'react'

function DayCard({ day, meals, onUpdateMeal, isEditable = false }) {
    const [editMode, setEditMode] = useState(false)

    const totalCost = meals.reduce((sum, meal) => sum + (parseFloat(meal.price) || 0), 0)
    const totalProtein = meals.reduce((sum, meal) => sum + (parseFloat(meal.protein) || 0), 0)
    const totalFat = meals.reduce((sum, meal) => sum + (parseFloat(meal.fat) || 0), 0)
    const totalCalories = meals.reduce((sum, meal) => sum + (parseFloat(meal.calories) || 0), 0)
    const totalCarbs = meals.reduce((sum, meal) => sum + (parseFloat(meal.carbs) || 0), 0)

    const handleMealChange = (index, field, value) => {
        const numericFields = ['price', 'calories', 'protein', 'fat', 'carbs']
        const updatedMeal = {
            ...meals[index],
            [field]: numericFields.includes(field) ? parseFloat(value) || 0 : value
        }
        onUpdateMeal(index, updatedMeal)
    }

    return (
        <div className={`day-card ${editMode ? 'editing' : ''}`}>
            <div>
                <div className="day-card-header">
                    <h3>{day}</h3>
                    {isEditable && (
                        <button
                            type="button"
                            className={`btn-edit-day ${editMode ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation()
                                setEditMode(!editMode)
                            }}
                            title={editMode ? 'Done editing' : 'Edit meals'}
                        >
                            {editMode ? '✓' : '⚙️'}
                        </button>
                    )}
                </div>
                <div className="day-budget">₱{totalCost.toFixed(0)}</div>
                <div className="meals">
                    {meals.map((meal, index) => (
                        <div
                            key={index}
                            className={`meal ${meal.type.toLowerCase()}`}
                        >
                            {editMode && isEditable ? (
                                <div className="meal-edit-form">
                                    <div className="meal-type-label">{meal.type}</div>
                                    <div className="edit-group full-row">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={meal.name}
                                            onChange={(e) => handleMealChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="edit-group">
                                        <label>Price (₱)</label>
                                        <input
                                            type="number"
                                            value={meal.price}
                                            onChange={(e) => handleMealChange(index, 'price', e.target.value)}
                                        />
                                    </div>
                                    <div className="edit-group">
                                        <label>Calories</label>
                                        <input
                                            type="number"
                                            value={meal.calories}
                                            onChange={(e) => handleMealChange(index, 'calories', e.target.value)}
                                        />
                                    </div>
                                    <div className="macro-row">
                                        <div className="edit-group">
                                            <label>Protein</label>
                                            <input
                                                type="number"
                                                value={meal.protein || ''}
                                                onChange={(e) => handleMealChange(index, 'protein', e.target.value)}
                                            />
                                        </div>
                                        <div className="edit-group">
                                            <label>Fat</label>
                                            <input
                                                type="number"
                                                value={meal.fat || ''}
                                                onChange={(e) => handleMealChange(index, 'fat', e.target.value)}
                                            />
                                        </div>
                                        <div className="edit-group">
                                            <label>Carbs</label>
                                            <input
                                                type="number"
                                                value={meal.carbs || ''}
                                                onChange={(e) => handleMealChange(index, 'carbs', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="edit-group full-row">
                                        <label>Ingredients</label>
                                        <textarea
                                            value={meal.components || ''}
                                            onChange={(e) => handleMealChange(index, 'components', e.target.value)}
                                            rows="1"
                                            placeholder="Separate ingredients with commas"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="meal-header">
                                        <div>
                                            <h4>{meal.type}</h4>
                                            <p>{meal.name}</p>
                                        </div>
                                        <span className="meal-price">₱{meal.price}</span>
                                    </div>
                                    {meal.components && <div className="components">{meal.components.split(',').map((ing, i) => <div key={i}>{ing.trim()}</div>)}</div>}
                                    <small className="meal-macros">
                                        {meal.calories ?? '-'} Cal • {meal.protein ?? '-'}g Protein • {meal.fat ?? '-'}g Fat • {meal.carbs ?? '-'}g Carbs
                                    </small>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="day-total">
                <div className="macro-item">
                    <span className="macro-text">Protein: {Math.round(totalProtein)}g</span>
                </div>
                <div className="macro-item">
                    <span className="macro-text">Fat: {Math.round(totalFat)}g</span>
                </div>
                <div className="macro-item">
                    <span className="macro-text">Calories: {Math.round(totalCalories)}</span>
                </div>
                <div className="macro-item">
                    <span className="macro-text">Carbs: {Math.round(totalCarbs)}g</span>
                </div>
            </div>
        </div>
    )
}

export default DayCard