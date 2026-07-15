import type { FormRuleDeclaration } from '@regle/core';
import { alpha as _alpha, alphaNum as _alphaNum, and as _and, between as _between, decimal as _decimal, email as _email, integer as _integer, ipv4Address as _ipv4Address, macAddress as _macAddress, maxLength as _maxLength, maxValue as _maxValue, minLength as _minLength, minValue as _minValue, not as _not, numeric as _numeric, or as _or, required as _required, requiredIf as _requiredIf, requiredUnless as _requiredUnless, sameAs as _sameAs, url as _url } from '@regle/rules';
import { afterDate, beforeDate, betweenDates, bsn, postalCode } from './custom';
import localize from './localize';

export type ValidationRule = FormRuleDeclaration<any, any[]>;
export type ValidationRuleSet = readonly ValidationRule[] | Readonly<Record<string, ValidationRule>>;

export const alpha: typeof _alpha = localize(_alpha, 'alpha');
export const alphaNum: typeof _alphaNum = localize(_alphaNum, 'alphaNum');
export const between: typeof _between = localize(_between, 'between');
export const decimal: typeof _decimal = localize(_decimal, 'decimal');
export const email: typeof _email = localize(_email, 'email');
export const integer: typeof _integer = localize(_integer, 'integer');
export const ipAddress: typeof _ipv4Address = localize(_ipv4Address, 'ipAddress');
export const macAddress: typeof _macAddress = localize(_macAddress, 'macAddress');
export const maxLength: typeof _maxLength = localize(_maxLength, 'maxLength');
export const maxValue: typeof _maxValue = localize(_maxValue, 'maxValue');
export const minLength: typeof _minLength = localize(_minLength, 'minLength');
export const minValue: typeof _minValue = localize(_minValue, 'minValue');
export const numeric: typeof _numeric = localize(_numeric, 'numeric');
export const required: typeof _required = localize(_required, 'required');
export const requiredIf: typeof _requiredIf = localize(_requiredIf, 'requiredIf');
export const requiredUnless: typeof _requiredUnless = localize(_requiredUnless, 'requiredUnless');
export const sameAs: typeof _sameAs = localize(_sameAs, 'sameAs');
export const url: typeof _url = localize(_url, 'url');

export const and: typeof _and = ((...args: Parameters<typeof _and>) => localize(_and(...args), 'and')) as typeof _and;
export const not: typeof _not = ((...args: Parameters<typeof _not>) => localize(_not(...args), 'not')) as typeof _not;
export const or: typeof _or = ((...args: Parameters<typeof _or>) => localize(_or(...args), 'or')) as typeof _or;

export { afterDate, beforeDate, betweenDates, bsn, postalCode };

export interface ValidationRules {
    readonly afterDate: typeof afterDate;
    readonly alpha: typeof alpha;
    readonly alphaNum: typeof alphaNum;
    readonly and: typeof and;
    readonly beforeDate: typeof beforeDate;
    readonly between: typeof between;
    readonly betweenDates: typeof betweenDates;
    readonly bsn: typeof bsn;
    readonly decimal: typeof decimal;
    readonly email: typeof email;
    readonly integer: typeof integer;
    readonly ipAddress: typeof ipAddress;
    readonly macAddress: typeof macAddress;
    readonly maxLength: typeof maxLength;
    readonly maxValue: typeof maxValue;
    readonly minLength: typeof minLength;
    readonly minValue: typeof minValue;
    readonly not: typeof not;
    readonly numeric: typeof numeric;
    readonly or: typeof or;
    readonly postalCode: typeof postalCode;
    readonly required: typeof required;
    readonly requiredIf: typeof requiredIf;
    readonly requiredUnless: typeof requiredUnless;
    readonly sameAs: typeof sameAs;
    readonly url: typeof url;
}

export const rules: ValidationRules = {
    afterDate,
    alpha,
    alphaNum,
    and,
    beforeDate,
    between,
    betweenDates,
    bsn,
    decimal,
    email,
    integer,
    ipAddress,
    macAddress,
    maxLength,
    maxValue,
    minLength,
    minValue,
    not,
    numeric,
    or,
    postalCode,
    required,
    requiredIf,
    requiredUnless,
    sameAs,
    url
};
