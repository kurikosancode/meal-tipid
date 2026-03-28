import './App.css'
import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import DayCard from './components/DayCard'
import { WIZARD_STEPS } from './config/wizardSteps'
import { useWizardForm } from './hooks/useWizardForm'
import { useWizardNavigation } from './hooks/useWizardNavigation'
import { useMealGeneration } from './hooks/useMealGeneration'
import { useDarkMode } from './hooks/useDarkMode'
import { generateMealPlanPdfBlob } from './utils/mealPlanPdfTemplate'
import MealPlanExportImageTemplate from './components/MealPlanExportImageTemplate'

const EXPORT_FORMATS = {
  pdf: 'PDF',
  png: 'PNG',
  csv: 'CSV'
}

function App() {
  const {
    budget,
    setBudget,
    preferences,
    setPreferences,
    preferredFoods,
    setPreferredFoods,
    goals,
    setGoals
  } = useWizardForm()
  const { currentStepId, currentStepIndex, currentStepConfig, CurrentStepComponent, lastInputStepId, handleNext, handleBack, resetToFirstStep } = useWizardNavigation()
  const { mealPlan, loading, error, generateMealPlan, resetMealPlan } = useMealGeneration()
  const { darkMode, handleToggleDarkMode } = useDarkMode()
  const [editableMealPlan, setEditableMealPlan] = useState(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [pngExportData, setPngExportData] = useState(null)
  const mealPlanRef = useRef(null)
  const exportMenuRef = useRef(null)
  const pngExportRef = useRef(null)

  const isPlanView = Boolean(mealPlan)

  useEffect(() => {
    if (mealPlan && !editableMealPlan) {
      setEditableMealPlan(JSON.parse(JSON.stringify(mealPlan)))
    }
  }, [mealPlan])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!showExportMenu) {
        return
      }

      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [showExportMenu])

  const handleUpdateMeal = (dayIndex, mealIndex, updatedMeal) => {
    setEditableMealPlan(prev => {
      const newPlan = [...prev]
      newPlan[dayIndex] = {
        ...newPlan[dayIndex],
        meals: newPlan[dayIndex].meals.map((meal, idx) => idx === mealIndex ? updatedMeal : meal)
      }
      return newPlan
    })
  }

  const handleNextWithGeneration = async () => {
    const movedToNextStep = handleNext()
    if (!movedToNextStep && currentStepId === lastInputStepId) {
      await generateMealPlan(budget, preferences, preferredFoods, goals)
    }
  }

  const handleStartOver = () => {
    resetMealPlan()
    setEditableMealPlan(null)
    resetToFirstStep()
  }

  const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  const getExportDateSuffix = () => new Date().toISOString().split('T')[0]

  const normalizeCsvValue = (value) => {
    const raw = String(value ?? '')
    const escaped = raw.replace(/"/g, '""')
    return `"${escaped}"`
  }

  const exportAsCsv = () => {
    const sourcePlan = editableMealPlan || mealPlan || []
    const rows = [
      ['Day', 'Meal Type', 'Meal Name', 'Price', 'Calories', 'Protein', 'Fat', 'Carbs', 'Components']
    ]

    sourcePlan.forEach((dayPlan) => {
      dayPlan.meals.forEach((meal) => {
        rows.push([
          dayPlan.day,
          meal.type,
          meal.name,
          meal.price,
          meal.calories,
          meal.protein,
          meal.fat,
          meal.carbs,
          meal.components
        ])
      })
    })

    const csvContent = rows
      .map((row) => row.map((cell) => normalizeCsvValue(cell)).join(','))
      .join('\n')

    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(csvBlob, `meal-plan-${getExportDateSuffix()}.csv`)
  }

  const captureElementCanvas = async (element) => {
    if (!element) {
      throw new Error('Export template is not ready.')
    }

    const styles = window.getComputedStyle(element)
    return html2canvas(element, {
      scale: 2,
      backgroundColor: styles.backgroundColor || '#ffffff',
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    })
  }

  const waitForTemplatePaint = () => new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })

  const exportAsPng = async () => {
    const sourcePlan = editableMealPlan || mealPlan || []
    if (!sourcePlan.length) {
      throw new Error('No meal plan available to export.')
    }

    const generatedAt = new Date().toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    setPngExportData({
      plan: sourcePlan,
      budget,
      preferences,
      goals,
      generatedAt
    })

    try {
      await waitForTemplatePaint()
      const canvas = await captureElementCanvas(pngExportRef.current)
      const pngBlob = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to generate PNG file.'))
            return
          }
          resolve(blob)
        }, 'image/png')
      })

      downloadBlob(pngBlob, `meal-plan-${getExportDateSuffix()}.png`)
    } finally {
      setPngExportData(null)
    }
  }

  const exportAsPdf = async () => {
    const sourcePlan = editableMealPlan || mealPlan || []
    if (!sourcePlan.length) {
      throw new Error('No meal plan available to export.')
    }

    const pdfBlob = await generateMealPlanPdfBlob({
      plan: sourcePlan,
      budget,
      preferences,
      goals
    })

    downloadBlob(pdfBlob, `meal-plan-${getExportDateSuffix()}.pdf`)
  }

  const handleExport = async (format) => {
    try {
      setIsExporting(true)
      setShowExportMenu(false)

      if (format === 'csv') {
        exportAsCsv()
        return
      }

      if (format === 'png') {
        await exportAsPng()
        return
      }

      await exportAsPdf()
    } catch (exportError) {
      console.error('Export failed:', exportError)
      window.alert(`Could not export meal plan: ${exportError.message}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>MealTipid</h1>
        <p>Smart Meal Planning for Filipinos</p>
      </header>
      <button className="dark-mode-toggle" onClick={handleToggleDarkMode} title="Toggle dark mode">
        {darkMode ? '☀️' : '🌙'}
      </button>

      <main className="main">
        {!isPlanView ? (
          <div className="setup-wizard">
            <div className="wizard-header">
              <div className="step-indicator">
                {WIZARD_STEPS.map((step, index) => (
                  <span key={step.id} className={index <= currentStepIndex ? 'active' : ''}>{index + 1}</span>
                ))}
              </div>
              <h2>{currentStepConfig?.title}</h2>
            </div>

            <div className="wizard-content">
              {CurrentStepComponent ? (
                <CurrentStepComponent
                  budget={budget}
                  setBudget={setBudget}
                  preferences={preferences}
                  setPreferences={setPreferences}
                  preferredFoods={preferredFoods}
                  setPreferredFoods={setPreferredFoods}
                  goals={goals}
                  setGoals={setGoals}
                />
              ) : null}
            </div>

            <div className="wizard-actions">
              {currentStepIndex > 0 && (
                <button className="btn-secondary" onClick={handleBack}>
                  Back
                </button>
              )}
              <button className="btn-primary" onClick={handleNextWithGeneration} disabled={loading}>
                {loading ? 'Generating...' : currentStepId === lastInputStepId ? 'Generate Plan' : 'Next'}
              </button>
            </div>
          </div>
        ) : (

          <div className="meal-plan" ref={mealPlanRef}>
            <div className="plan-header">
              <h2>Your Weekly Meal Plan</h2>
              <div className="plan-summary">
                <div className="plan-summary-row">
                  <span>Budget: ₱{budget}</span>
                  <span>
                    Preferences: {Object.entries(preferences)
                      .filter(([key, value]) => value && key !== 'noRestrictions')
                      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                      .join(', ') || 'None'}
                  </span>
                </div>
                <div className="plan-summary-row plan-summary-macros">
                  <span>Calories: {goals.calories}</span>
                  <span>Protein: {goals.protein}g</span>
                  <span>Fat: {goals.fat}g</span>
                  <span>Carbs: {goals.carbs}g</span>
                </div>
              </div>
            </div>

            <div className="weekly-grid">
              {mealPlan ? (
                (editableMealPlan || mealPlan).map((dayPlan, dayIndex) => (
                  <DayCard
                    key={dayPlan.day || dayPlan.day}
                    day={dayPlan.day}
                    meals={dayPlan.meals}
                    onUpdateMeal={(mealIndex, updatedMeal) => handleUpdateMeal(dayIndex, mealIndex, updatedMeal)}
                    isEditable={true}
                  />
                ))
              ) : (
                DAYS.map((day) => (
                  <DayCard
                    key={day}
                    day={day}
                    dailyBudget={Math.floor(budget / 7)}
                    meals={SAMPLE_MEALS}
                    calorieGoal={goals.calories}
                  />
                ))
              )}
            </div>
            {error && <div className="plan-error" style={{ color: '#e53e3e', textAlign: 'center', margin: '1rem 0' }}>{error}</div>}

            <div className="plan-actions">
              <button className="btn-secondary" onClick={handleStartOver}>
                Start Over
              </button>
              <div className="export-controls" ref={exportMenuRef}>
                <button className="btn-primary" onClick={() => setShowExportMenu((prev) => !prev)} disabled={isExporting}>
                  {isExporting ? 'Exporting...' : 'Export Plan'}
                </button>
                {showExportMenu && !isExporting && (
                  <div className="export-menu" role="menu" aria-label="Export options">
                    {Object.entries(EXPORT_FORMATS).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className="export-menu-item"
                        onClick={() => handleExport(value)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {pngExportData && (
        <div className="export-staging" aria-hidden="true">
          <MealPlanExportImageTemplate
            ref={pngExportRef}
            plan={pngExportData.plan}
            budget={pngExportData.budget}
            preferences={pngExportData.preferences}
            goals={pngExportData.goals}
            generatedAt={pngExportData.generatedAt}
          />
        </div>
      )}
    </div>
  )
}

export default App;
