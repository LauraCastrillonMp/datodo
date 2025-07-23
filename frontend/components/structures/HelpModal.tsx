import { ReactNode } from 'react'

interface HelpModalProps {
  show: boolean
  onClose: () => void
}

export function HelpModal({ show, onClose }: HelpModalProps) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-80 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="font-semibold text-lg mb-2">Atajos de Teclado</div>
        <div className="space-y-2">
          <div><kbd className="bg-gray-700 px-1 rounded">Enter</kbd> - Agregar/Buscar</div>
          <div><kbd className="bg-gray-700 px-1 rounded">Delete</kbd> - Eliminar</div>
          <div><kbd className="bg-gray-700 px-1 rounded">Esc</kbd> - Limpiar paso</div>
          <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+R</kbd> - Reiniciar</div>
        </div>
      </div>
    </div>
  )
} 