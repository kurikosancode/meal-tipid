import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        paddingTop: 24,
        paddingBottom: 24,
        paddingHorizontal: 24,
        backgroundColor: '#f8fafc'
    },
    hero: {
        backgroundColor: '#22c55e',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginBottom: 10
    },
    header: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#ffffff',
        marginBottom: 2
    },
    title: {
        fontSize: 20,
        fontWeight: 700,
        color: '#ffffff',
        marginBottom: 4
    },
    subtitle: {
        fontSize: 10,
        color: '#dcfce7'
    },
    summaryGrid: {
        marginTop: 8,
        gap: 3
    },
    summaryText: {
        fontSize: 10,
        color: '#2d3748'
    },
    dayCard: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#ffffff'
    },
    dayAccent: {
        height: 3,
        backgroundColor: '#22c55e',
        borderRadius: 6,
        marginBottom: 6
    },
    dayTitle: {
        fontSize: 12.5,
        fontWeight: 700,
        color: '#2d3748',
        marginBottom: 6
    },
    mealRow: {
        marginBottom: 6,
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    mealType: {
        fontSize: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: 600,
        color: '#718096',
        marginBottom: 0
    },
    mealName: {
        fontSize: 11.5,
        fontWeight: 700,
        color: '#2d3748',
        marginBottom: 3,
        marginTop: 4
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0
    },
    mealPrice: {
        fontSize: 11,
        fontWeight: 700,
        color: '#22c55e'
    },
    mealMeta: {
        fontSize: 8.5,
        color: '#718096',
        marginBottom: 0
    },
    mealComponents: {
        fontSize: 8,
        color: '#718096',
        marginBottom: 6,
        lineHeight: 1.3
    },
    dayTotals: {
        marginTop: 5,
        paddingTop: 6,
        fontSize: 9,
        color: '#2d3748',
        fontWeight: 700
    }
})

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

function MealPlanPdfDocument({ plan, budget, preferences, goals, generatedAt }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.hero} wrap={false}>
                    <Text style={styles.title}>MealTipid</Text>
                    <Text style={styles.subtitle}>Smart Meal Planning for Filipinos</Text>
                </View>

                <View style={styles.header} wrap={false}>
                    <Text style={styles.summaryText}>Generated on {generatedAt}</Text>
                    <View style={styles.summaryGrid}>
                        <Text style={styles.summaryText}>Budget: PHP {budget}</Text>
                        <Text style={styles.summaryText}>Preferences: {formatPreferences(preferences)}</Text>
                        <Text style={styles.summaryText}>
                            Goals: {safeNumber(goals?.calories)} Calories, {safeNumber(goals?.protein)}g Protein, {safeNumber(goals?.fat)}g Fat, {safeNumber(goals?.carbs)}g Carbs
                        </Text>
                    </View>
                </View>

                {plan.map((dayPlan, dayIndex) => {
                    const meals = dayPlan?.meals || []
                    const totals = computeDayTotals(meals)

                    return (
                        <View key={`${dayPlan?.day || 'Day'}-${dayIndex}`} style={styles.dayCard} wrap={false}>

                            <Text style={styles.dayTitle}>{dayPlan?.day || `Day ${dayIndex + 1}`}</Text>
                            <View style={styles.dayAccent} />
                            {meals.map((meal, mealIndex) => (
                                <View key={`${meal?.type || 'Meal'}-${mealIndex}`} style={styles.mealRow}>
                                    <View style={styles.mealHeader}>
                                        <View>
                                            <Text style={styles.mealType}>{meal?.type || 'Meal'}</Text>
                                            <Text style={styles.mealName}>{meal?.name || '-'}</Text>
                                        </View>
                                        <Text style={styles.mealPrice}>PHP {safeNumber(meal?.price).toFixed(2)}</Text>
                                    </View>
                                    {meal?.components && (
                                        <Text style={styles.mealComponents}>{meal?.components}</Text>
                                    )}
                                    <Text style={styles.mealMeta}>
                                        {safeNumber(meal?.calories)} Calories • {safeNumber(meal?.protein)}g Protein • {safeNumber(meal?.fat)}g Fat • {safeNumber(meal?.carbs)}g Carbs
                                    </Text>
                                </View>
                            ))}

                            <Text style={styles.dayTotals}>
                                Day Total: PHP {totals.price.toFixed(2)} • {totals.calories} Calories • {totals.protein}g Protein • {totals.fat}g Fat • {totals.carbs}g Carbs
                            </Text>
                        </View>
                    )
                })}
            </Page>
        </Document>
    )
}

export async function generateMealPlanPdfBlob({ plan, budget, preferences, goals }) {
    const generatedAt = new Date().toLocaleString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const blob = await pdf(
        <MealPlanPdfDocument
            plan={plan || []}
            budget={budget}
            preferences={preferences}
            goals={goals}
            generatedAt={generatedAt}
        />
    ).toBlob()

    return blob
}
