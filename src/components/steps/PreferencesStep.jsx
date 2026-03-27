function PreferencesStep({ preferences, setPreferences }) {
    return (
        <div className="step-content">
            <label>Food Preferences</label>
            <div className="preferences-list">
                <button
                    type="button"
                    className={`preference-item ${preferences.vegan ? 'selected' : ''}`}
                    onClick={() => setPreferences({ ...preferences, vegan: !preferences.vegan, noRestrictions: false })}
                >
                    <span className="checkmark">{preferences.vegan ? '✓' : ''}</span>
                    <label>Vegan</label>
                </button>
                <button
                    type="button"
                    className={`preference-item ${preferences.vegetarian ? 'selected' : ''}`}
                    onClick={() => setPreferences({ ...preferences, vegetarian: !preferences.vegetarian, noRestrictions: false })}
                >
                    <span className="checkmark">{preferences.vegetarian ? '✓' : ''}</span>
                    <label>Vegetarian</label>
                </button>
                <button
                    type="button"
                    className={`preference-item ${preferences.halal ? 'selected' : ''}`}
                    onClick={() => setPreferences({ ...preferences, halal: !preferences.halal, noRestrictions: false })}
                >
                    <span className="checkmark">{preferences.halal ? '✓' : ''}</span>
                    <label>Halal</label>
                </button>
                <button
                    type="button"
                    className={`preference-item ${preferences.pescatarian ? 'selected' : ''}`}
                    onClick={() => setPreferences({ ...preferences, pescatarian: !preferences.pescatarian, noRestrictions: false })}
                >
                    <span className="checkmark">{preferences.pescatarian ? '✓' : ''}</span>
                    <label>Pescatarian</label>
                </button>
                <button
                    type="button"
                    className={`preference-item ${preferences.noRestrictions ? 'selected' : ''}`}
                    onClick={() => setPreferences({
                        ...preferences,
                        noRestrictions: !preferences.noRestrictions,
                        vegan: false,
                        vegetarian: false,
                        halal: false,
                        pescatarian: false
                    })}
                >
                    <span className="checkmark">{preferences.noRestrictions ? '✓' : ''}</span>
                    <label>No Restrictions</label>
                </button>
            </div>
            <p className="help-text">Select your dietary preferences for meal recommendations</p>
        </div>
    )
}

export default PreferencesStep
