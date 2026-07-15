import type { ValidationRule, ValidationRuleSet } from '../rules';

export function toNamedRules(ruleSet: ValidationRuleSet): Record<string, ValidationRule> {
    if (!Array.isArray(ruleSet)) {
        return ruleSet as Record<string, ValidationRule>;
    }

    return Object.fromEntries(ruleSet.map(rule => {
        const type = (rule as {type?: string}).type;

        if (!type) {
            throw new Error('Validation rule without a name was passed to a validation field. Use named() to give it one.');
        }

        return [type, rule];
    }));
}

export function named<TRule extends ValidationRule>(name: string, rule: TRule): TRule {
    return Object.assign(rule, {type: name});
}
