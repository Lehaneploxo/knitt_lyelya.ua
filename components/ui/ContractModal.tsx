'use client'

import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { contractContent } from '@/data/contractContent'

interface ContractModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  onDecline: () => void
}

export default function ContractModal({
  isOpen,
  onClose,
  onAccept,
  onDecline,
}: ContractModalProps) {
  const { t, language } = useLanguage()

  if (!isOpen) return null

  const content = contractContent[language]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-heading font-semibold">
            {t('contract.title')}
          </h2>
          <button
            onClick={onDecline}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {content}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t bg-gray-50">
          <button
            onClick={onDecline}
            className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            {t('contract.decline')}
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-3 px-6 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            {t('contract.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
