import { withMessage } from '@regle/rules';
import { translate } from '../config';
import mapParams from './messages';

export default function <TRule>(rule: TRule, type: string): TRule {
    return withMessage(rule as never, (metadata: {$params?: readonly unknown[]}) => translate(`validator.${type}`, mapParams(type, metadata.$params ?? []))) as TRule;
}
