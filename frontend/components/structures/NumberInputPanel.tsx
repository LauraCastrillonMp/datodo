interface NumberInputPanelProps {
  inputValue: string
  setInputValue: (v: string) => void
  searchValue: string
  setSearchValue: (v: string) => void
  isAnimating: boolean
  onValueEnter?: () => void
  onSearchEnter?: () => void
}

export function NumberInputPanel({ inputValue, setInputValue, searchValue, setSearchValue, isAnimating, onValueEnter, onSearchEnter }: NumberInputPanelProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full mx-auto">
      <input
        type="number"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Valor"
        className="flex-1 min-w-0 px-3 py-2 border rounded-md bg-background border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isAnimating}
        aria-label="Valor"
        onKeyDown={e => e.key === 'Enter' && onValueEnter && onValueEnter()}
      />
      <input
        type="number"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        placeholder="Buscar"
        className="flex-1 min-w-0 px-3 py-2 border rounded-md bg-background border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isAnimating}
        aria-label="Buscar"
        onKeyDown={e => e.key === 'Enter' && onSearchEnter && onSearchEnter()}
      />
    </div>
  )
} 