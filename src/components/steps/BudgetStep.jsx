function BudgetStep({ budget, setBudget }) {
    return (
        <div className="step-content">
            <label htmlFor="budget">Weekly Budget (Php)</label>
            <input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="5000"
                min="1000"
                max="50000"
            />
            <p className="help-text">Enter your total weekly food budget in Philippine Pesos</p>
        </div>
    )
}

export default BudgetStep
