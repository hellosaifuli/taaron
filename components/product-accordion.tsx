'use client'

import { useState, useRef, useEffect } from 'react'

interface AccordionItem {
  title: string
  content: string
}

export default function ProductAccordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="border-t border-[#E5DFD6]">
      {items.map((item, idx) => (
        <AccordionRow
          key={item.title}
          item={item}
          isOpen={open === idx}
          onToggle={() => setOpen(open === idx ? null : idx)}
        />
      ))}
    </div>
  )
}

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
}) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  return (
    <div className="border-b border-[#E5DFD6]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-[11px] font-medium uppercase tracking-widest text-[#111111]">
          {item.title}
        </span>
        <svg
          className={`h-4 w-4 flex-shrink-0 text-[#9E9690] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <div
        style={{ height, overflow: 'hidden', transition: 'height 350ms cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div ref={bodyRef} className="pb-5">
          <p className="text-sm leading-relaxed text-[#5C5652]">{item.content}</p>
        </div>
      </div>
    </div>
  )
}
