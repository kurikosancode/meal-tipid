import { useState } from 'react'
import { WIZARD_STEPS } from '../config/wizardSteps'

export function useWizardNavigation() {
  const [currentStepId, setCurrentStepId] = useState(WIZARD_STEPS[0]?.id ?? 1)

  const firstStepId = WIZARD_STEPS[0]?.id ?? 1
  const lastStepId = WIZARD_STEPS[WIZARD_STEPS.length - 1]?.id ?? firstStepId
  const lastInputStepId = [...WIZARD_STEPS].reverse().find((step) => step.component)?.id ?? firstStepId
  const currentStepIndex = WIZARD_STEPS.findIndex((step) => step.id === currentStepId)
  const currentStepConfig = WIZARD_STEPS.find((step) => step.id === currentStepId)
  const CurrentStepComponent = currentStepConfig?.component

  const handleNext = () => {
    if (currentStepIndex >= 0 && currentStepIndex < WIZARD_STEPS.length - 1) {
      setCurrentStepId(WIZARD_STEPS[currentStepIndex + 1].id)
      return true
    }

    return false
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepId(WIZARD_STEPS[currentStepIndex - 1].id)
    }
  }

  const resetToFirstStep = () => {
    setCurrentStepId(firstStepId)
  }

  return {
    currentStepId,
    currentStepIndex,
    currentStepConfig,
    CurrentStepComponent,
    firstStepId,
    lastStepId,
    lastInputStepId,
    handleNext,
    handleBack,
    resetToFirstStep
  }
}
