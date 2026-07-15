import { createRule, type Maybe, type RegleRuleDefinition, type RegleRuleWithParamsDefinition } from '@regle/core';
import { isFilled } from '@regle/rules';
import type { DateTime } from 'luxon';
import { translate } from '../config';

export const afterDate: RegleRuleWithParamsDefinition<'afterDate', DateTime, [reference: Maybe<DateTime>]> = createRule({
    type: 'afterDate',
    validator: (value: Maybe<DateTime>, reference: Maybe<DateTime>) => {
        if (!isFilled(value) || !reference) {
            return true;
        }

        return value.toMillis() > reference.toMillis();
    },
    message: () => translate('validator.afterDate')
});

export const beforeDate: RegleRuleWithParamsDefinition<'beforeDate', DateTime, [reference: Maybe<DateTime>]> = createRule({
    type: 'beforeDate',
    validator: (value: Maybe<DateTime>, reference: Maybe<DateTime>) => {
        if (!isFilled(value) || !reference) {
            return true;
        }

        return value.toMillis() < reference.toMillis();
    },
    message: () => translate('validator.beforeDate')
});

export const betweenDates: RegleRuleWithParamsDefinition<'betweenDates', DateTime, [from: Maybe<DateTime>, to: Maybe<DateTime>]> = createRule({
    type: 'betweenDates',
    validator: (value: Maybe<DateTime>, from: Maybe<DateTime>, to: Maybe<DateTime>) => {
        if (!isFilled(value)) {
            return true;
        }

        const millis = value.toMillis();

        if (from && millis < from.toMillis()) {
            return false;
        }

        return !(to && millis > to.toMillis());
    },
    message: ({$params: [from, to]}) => translate('validator.betweenDates', {from, to})
});

export const bsn: RegleRuleDefinition<'bsn', string> = createRule({
    type: 'bsn',
    validator: (value: Maybe<string>) => !isFilled(value) || /^\d{8,9}$/.test(value),
    message: () => translate('validator.bsn')
});

export const postalCode: RegleRuleDefinition<'postalCode', string> = createRule({
    type: 'postalCode',
    validator: (value: Maybe<string>) => !isFilled(value) || /^[0-9]{4}\s?[a-zA-Z]{2}$/.test(value),
    message: () => translate('validator.postalCode')
});
