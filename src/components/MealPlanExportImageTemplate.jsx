import { forwardRef } from 'react'
import './MealPlanExportImageTemplate.css'

const safeNumber = (value) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

const formatPreferences = (preferences = {}) => {
    const selected = Object.entries(preferences)
        .filter(([key, val]) => key !== 'noRestrictions' && Boolean(val))
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))

    return selected.length > 0 ? selected.join(', ') : 'None'
}

const computeDayTotals = (meals = []) => {
    return meals.reduce((acc, meal) => {
        acc.price += safeNumber(meal.price)
        acc.calories += safeNumber(meal.calories)
        acc.protein += safeNumber(meal.protein)
        acc.fat += safeNumber(meal.fat)
        acc.carbs += safeNumber(meal.carbs)
        return acc
    }, { price: 0, calories: 0, protein: 0, fat: 0, carbs: 0 })
}

const MealPlanExportImageTemplate = forwardRef(function MealPlanExportImageTemplate(
    { plan = [], budget, preferences, goals, generatedAt },
    ref
) {
    return (
        <div className="png-export-root" ref={ref}>
            <div className="png-export-hero">
                <h1>MealTipid</h1>
                <p>Smart Meal Planning for Filipinos</p>
            </div>

            <div className="png-export-summary-card">
                <p>Generated on {generatedAt}</p>
                <p>Budget: PHP {budget}</p>
                <p>Preferences: {formatPreferences(preferences)}</p>
                <p>
                    Goals: {safeNumber(goals?.calories)} Calories, {safeNumber(goals?.protein)}g Protein, {safeNumber(goals?.fat)}g Fat, {safeNumber(goals?.carbs)}g Carbs
                </p>
            </div>

            {plan.map((dayPlan, dayIndex) => {
                const meals = dayPlan?.meals || []
                const totals = computeDayTotals(meals)

                return (
                    <section className="png-export-day-card" key={`${dayPlan?.day || 'Day'}-${dayIndex}`}>
                        <h2>{dayPlan?.day || `Day ${dayIndex + 1}`}</h2>
                        <div className="png-export-day-accent" />

                        <div className="png-export-meals-grid">
                            {meals.map((meal, mealIndex) => (
                                <article className="png-export-meal-card" key={`${meal?.type || 'Meal'}-${mealIndex}`}>
                                    <div className="png-export-meal-header">
                                        <div>
                                            <div className="png-export-meal-type">{meal?.type || 'Meal'}</div>
                                            <div className="png-export-meal-name">{meal?.name || '-'}</div>
                                        </div>
                                        <div className="png-export-meal-price">PHP {safeNumber(meal?.price).toFixed(2)}</div>
                                    </div>

                                    {meal?.components && (
                                        <div className="png-export-components">{meal.components}</div>
                                    )}

                                    <div className="png-export-macros">
                                        {safeNumber(meal?.calories)} Calories • {safeNumber(meal?.protein)}g Protein • {safeNumber(meal?.fat)}g Fat • {safeNumber(meal?.carbs)}g Carbs
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="png-export-day-total">
                            Day Total: PHP {totals.price.toFixed(2)} • {totals.calories} Calories • {totals.protein}g Protein • {totals.fat}g Fat • {totals.carbs}g Carbs
                        </div>
                    </section>
                )
            })}
        </div>
    )
})

export default MealPlanExportImageTemplate
