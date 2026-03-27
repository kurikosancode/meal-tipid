import { useMemo, useState } from 'react'
import './PreferredFoodsStep.css'
import CUSTOM_FOODS from '../../config/customFoods.json'

const FALLBACK_FOODS = CUSTOM_FOODS

function PreferredFoodsStep({ preferredFoods, setPreferredFoods }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [searchError, setSearchError] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const filteredFallback = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) {
            return FALLBACK_FOODS
        }

        return FALLBACK_FOODS.filter((food) => food.toLowerCase().includes(normalized))
    }, [query])

    const addPreferredFood = (foodName) => {
        const normalizedName = foodName.trim()
        if (!normalizedName) {
            return
        }

        const alreadyAdded = preferredFoods.some(
            (food) => food.toLowerCase() === normalizedName.toLowerCase()
        )

        if (!alreadyAdded) {
            setPreferredFoods([...preferredFoods, normalizedName])
        }

        setQuery('')
        setIsDropdownOpen(false)
    }

    const removePreferredFood = (foodName) => {
        setPreferredFoods(preferredFoods.filter((food) => food !== foodName))
    }

    const displayResults = results.length > 0 ? results : filteredFallback

    const handleInputChange = async (event) => {
        const value = event.target.value
        setQuery(value)

        if (!value.trim()) {
            setResults([])
            setSearchError('')
            setIsDropdownOpen(false)
            return
        }

        setIsDropdownOpen(true)

        if (value.trim().length >= 2) {
            setSearching(true)
            setSearchError('')
            try {
                const response = await fetch(`/api/search-foods?q=${encodeURIComponent(value.trim())}`)
                if (!response.ok) {
                    throw new Error('Search request failed')
                }
                const data = await response.json()
                setResults(Array.isArray(data.foods) ? data.foods : [])
            } catch (error) {
                console.error('Food search failed:', error)
                setSearchError('Could not reach food search API. Showing local suggestions instead.')
                setResults([])
            } finally {
                setSearching(false)
            }
        } else {
            setResults([])
            setSearching(false)
            setSearchError('')
        }
    }

    const handleManualAdd = () => {
        addPreferredFood(query)
    }

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleManualAdd()
        }

        if (event.key === 'Escape') {
            setIsDropdownOpen(false)
        }
    }

    return (
        <div className="step-content">
            <label htmlFor="preferred-food-search">Preferred Foods</label>

            <div className="preferred-foods-search-wrap">
                <div className="preferred-foods-search-row">
                    <span className="preferred-foods-search-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                            <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </span>
                    <input
                        id="preferred-food-search"
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="Search or type a food..."
                    />
                </div>

                {isDropdownOpen && query.trim() ? (
                    <div className="preferred-foods-dropdown" role="listbox">
                        {searching ? <div className="preferred-food-empty">Searching...</div> : null}
                        {!searching && displayResults.slice(0, 8).map((food) => {
                            const isAdded = preferredFoods.some((item) => item.toLowerCase() === food.toLowerCase())
                            return (
                                <button
                                    key={food}
                                    type="button"
                                    className={`preferred-food-option ${isAdded ? 'selected' : ''}`}
                                    onClick={() => addPreferredFood(food)}
                                >
                                    <span>{food}</span>
                                    <strong>{isAdded ? 'Added' : 'Add'}</strong>
                                </button>
                            )
                        })}
                        {!searching && displayResults.length === 0 ? (
                            <div className="preferred-food-empty">No matches found.</div>
                        ) : null}
                    </div>
                ) : null}
            </div>

            {searchError ? <p className="help-text preferred-foods-error">{searchError}</p> : null}

            <p className="help-text">Search and add meals you want to see more often in your generated plan.</p>

            {preferredFoods.length > 0 ? (
                <div className="preferred-foods-selected">
                    <p className="help-text">Selected foods:</p>
                    <div className="selected-food-list">
                        {preferredFoods.map((food) => (
                            <button
                                key={food}
                                type="button"
                                className="selected-food-item"
                                onClick={() => removePreferredFood(food)}
                                title="Remove food"
                            >
                                {food}
                                <span>x</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default PreferredFoodsStep