import BudgetStep from '../components/steps/BudgetStep'
import PreferencesStep from '../components/steps/PreferencesStep'
import PreferredFoodsStep from '../components/steps/PreferredFoodsStep'
import GoalsStep from '../components/steps/GoalsStep'

export const WIZARD_STEPS = [
  {
    id: 1,
    title: 'Set Your Weekly Budget',
    component: BudgetStep
  },
  {
    id: 2,
    title: 'Select Food Preferences',
    component: PreferencesStep
  },
  {
    id: 3,
    title: 'Add Preferred Foods',
    component: PreferredFoodsStep
  },
  {
    id: 4,
    title: 'Nutrition Goals',
    component: GoalsStep
  }
]
