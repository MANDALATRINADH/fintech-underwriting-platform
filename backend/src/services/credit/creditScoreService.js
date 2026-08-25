class CreditScoreService {
    constructor() {
        this.weights = {
            bureauScore: 0.30,
            incomeStability: 0.15,
            employmentStability: 0.15,
            debtToIncome: 0.15,
            repaymentHistory: 0.15,
            digitalBehavior: 0.10
        };
    }

    calculateScore(data) {
        let score = 0;
        let factors = [];
        let recommendations = [];

        // 1. Bureau Score
        if (data.bureauScore) {
            const bureauWeight = this.normalizeBureauScore(data.bureauScore);
            score += bureauWeight * this.weights.bureauScore;
            const impact = bureauWeight > 50 ? 'positive' : 'negative';
            factors.push({
                factor: 'Credit Bureau Score',
                value: data.bureauScore,
                impact: impact,
                weight: this.weights.bureauScore
            });
            if (impact === 'negative') {
                recommendations.push('Work on improving your credit score by paying bills on time');
            }
        }

        // 2. Income Stability
        if (data.incomeStability) {
            const incomeWeight = this.normalizeIncomeStability(data.incomeStability);
            score += incomeWeight * this.weights.incomeStability;
            const impact = incomeWeight > 50 ? 'positive' : 'negative';
            factors.push({
                factor: 'Income Stability',
                value: data.incomeStability,
                impact: impact,
                weight: this.weights.incomeStability
            });
            if (impact === 'negative') {
                recommendations.push('Build a more consistent income history');
            }
        }

        // 3. Employment Stability
        if (data.employmentStability) {
            const empWeight = this.normalizeEmploymentStability(data.employmentStability);
            score += empWeight * this.weights.employmentStability;
            const impact = empWeight > 50 ? 'positive' : 'negative';
            factors.push({
                factor: 'Employment Stability',
                value: data.employmentStability,
                impact: impact,
                weight: this.weights.employmentStability
            });
            if (impact === 'negative') {
                recommendations.push('Maintain stable employment for better evaluation');
            }
        }

        // 4. Debt to Income Ratio
        if (data.debtToIncome) {
            const dtiWeight = this.normalizeDebtToIncome(data.debtToIncome);
            score += dtiWeight * this.weights.debtToIncome;
            const impact = dtiWeight > 50 ? 'positive' : 'negative';
            factors.push({
                factor: 'Debt to Income Ratio',
                value: data.debtToIncome,
                impact: impact,
                weight: this.weights.debtToIncome
            });
            if (impact === 'negative') {
                recommendations.push('Consider reducing existing debt obligations');
            }
        }

        // 5. Repayment History
        if (data.repaymentHistory) {
            const repWeight = this.normalizeRepaymentHistory(data.repaymentHistory);
            score += repWeight * this.weights.repaymentHistory;
            const impact = repWeight > 50 ? 'positive' : 'negative';
            factors.push({
                factor: 'Repayment History',
                value: data.repaymentHistory,
                impact: impact,
                weight: this.weights.repaymentHistory
            });
            if (impact === 'negative') {
                recommendations.push('Maintain timely payments on existing loans');
            }
        }

        // 6. Digital Behavior
        if (data.digitalBehavior) {
            const digWeight = this.normalizeDigitalBehavior(data.digitalBehavior);
            score += digWeight * this.weights.digitalBehavior;
            const impact = digWeight > 50 ? 'positive' : 'negative';
            factors.push({
                factor: 'Digital Behavior Score',
                value: data.digitalBehavior,
                impact: impact,
                weight: this.weights.digitalBehavior
            });
            if (impact === 'negative') {
                recommendations.push('Maintain consistent digital activity patterns');
            }
        }

        // If no recommendations, add a default positive one
        if (recommendations.length === 0) {
            recommendations.push('Great job! Maintain your current financial discipline');
        }

        return {
            score: Math.round(score),
            factors: factors.sort((a, b) => b.weight - a.weight),
            riskLevel: this.getRiskLevel(score),
            recommendations: recommendations
        };
    }

    normalizeBureauScore(score) {
        return ((score - 300) / 600) * 100;
    }

    normalizeIncomeStability(stability) {
        return (stability / 10) * 100;
    }

    normalizeEmploymentStability(stability) {
        return (stability / 10) * 100;
    }

    normalizeDebtToIncome(dti) {
        return Math.max(0, 100 - (dti * 2.5));
    }

    normalizeRepaymentHistory(history) {
        return (history / 10) * 100;
    }

    normalizeDigitalBehavior(behavior) {
        return (behavior / 10) * 100;
    }

    getRiskLevel(score) {
        if (score >= 75) return 'Low Risk';
        if (score >= 50) return 'Medium Risk';
        if (score >= 30) return 'High Risk';
        return 'Very High Risk';
    }
}

module.exports = new CreditScoreService();
