import { createScopedUseRegle, type ExtendedRulesDeclarationsOverrides, type useCollectScopeFn, type useScopedRegleFn } from '@regle/core';

const scoped = createScopedUseRegle();

export const useScopedRegle: useScopedRegleFn<Partial<ExtendedRulesDeclarationsOverrides>, any, false> = scoped.useScopedRegle;
export const useCollectScope: useCollectScopeFn<false> = scoped.useCollectScope;
