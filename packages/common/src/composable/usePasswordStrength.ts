import { computed, type ComputedRef, type Ref, unref } from 'vue';

type PasswordRuleType =
    | 'lowercase'
    | 'uppercase'
    | 'number'
    | 'symbol';

type PasswordStrengthType =
    | 'too_weak'
    | 'weak'
    | 'medium'
    | 'strong';

type Result = {
    readonly length: number;
    readonly rules: PasswordRuleType[];
    readonly strength: PasswordStrengthType;
};

type PasswordRule = {
    readonly regex: RegExp;
    readonly type: PasswordRuleType;
};

type PasswordStrength = {
    readonly index: number;
    readonly type: PasswordStrengthType;
    readonly minimumDiversity: number;
    readonly minimumLength: number;
};

const strengths: PasswordStrength[] = [
    {index: 0, type: 'too_weak', minimumDiversity: 0, minimumLength: 0},
    {index: 1, type: 'weak', minimumDiversity: 2, minimumLength: 6},
    {index: 2, type: 'medium', minimumDiversity: 3, minimumLength: 8},
    {index: 3, type: 'strong', minimumDiversity: 4, minimumLength: 10}
] as const;

const rules: PasswordRule[] = [
    {regex: new RegExp('[a-z]'), type: 'lowercase'},
    {regex: new RegExp('[A-Z]'), type: 'uppercase'},
    {regex: new RegExp('[0-9]'), type: 'number'},
    {regex: new RegExp('[!"#\$%&\'\(\)\*\+,-\./:;<=>\?@\[\\\\\\]\^_`\{|\}~]'), type: 'symbol'}
];

export default function (passwordRef: Ref<string>): ComputedRef<Result | null> {
    return computed<Result | null>(() => {
        const password = unref(passwordRef);

        if (password.length === 0) {
            return null;
        }

        const foundRules = rules
            .filter(r => r.regex.test(password))
            .map(r => r.type);

        return {
            length: password.length,
            strength: strengths
                .sort((a, b) => b.index - a.index)
                .find(s => foundRules.length >= s.minimumDiversity && password.length >= s.minimumLength)!.type,
            rules: foundRules
        } satisfies Result;
    });
}
