"use client"

import { useState } from "react"
import { Menu, X, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-end gap-6 px-6 py-2 text-sm text-muted-foreground border-b border-border/50">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>診療時間: 9:00〜18:00</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>03-1234-5678</span>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-lg">A</span>
            </div>
            <div>
              <span className="text-xl font-semibold text-foreground tracking-tight">Aクリニック</span>
              <p className="text-xs text-muted-foreground">A CLINIC</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              診療案内
            </a>
            <a href="#about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              当院について
            </a>
            <a href="#access" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              アクセス
            </a>
            <a href="#reservation">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
                ご予約
              </Button>
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="メニューを開く"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-border bg-card">
            <div className="flex flex-col px-6 py-4 gap-4">
              <a href="#services" className="text-sm font-medium text-foreground/80 py-2" onClick={() => setIsMenuOpen(false)}>
                診療案内
              </a>
              <a href="#about" className="text-sm font-medium text-foreground/80 py-2" onClick={() => setIsMenuOpen(false)}>
                当院について
              </a>
              <a href="#access" className="text-sm font-medium text-foreground/80 py-2" onClick={() => setIsMenuOpen(false)}>
                アクセス
              </a>
              <a href="#reservation" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  ご予約
                </Button>
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>診療時間: 9:00〜18:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>03-1234-5678</span>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
