import {
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

import sizes from '@/components/icons/heroIconSizes.module.css'

export function GuaranteeHeroIcon({ name, className }) {
  const cn = [sizes.size40, className].filter(Boolean).join(' ')
  switch (name) {
    case 'repeat':
      return <ArrowPathIcon className={cn} aria-hidden />
    case 'money':
      return <BanknotesIcon className={cn} aria-hidden />
    case 'check':
      return <CheckCircleIcon className={cn} aria-hidden />
    case 'contract':
      return <ClipboardDocumentCheckIcon className={cn} aria-hidden />
    default:
      return <SparklesIcon className={cn} aria-hidden />
  }
}
