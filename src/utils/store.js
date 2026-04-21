import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // User chart data
  chart: null,
  birthData: null,
  userName: '',

  // Auth / freemium
  user: null,
  chatCount: 0,
  isPremium: false,
  showPaywall: false,

  // UI
  system: 'vedic', // 'vedic' | 'western'
  activeTab: 'chart',

  // Actions
  setChart: (chart, birthData, name) => set({ chart, birthData, userName: name }),
  setSystem: (system) => set({ system }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  incrementChat: () => {
    const { chatCount, isPremium } = get()
    if (isPremium) return true
    if (chatCount >= 3) { set({ showPaywall: true }); return false }
    set({ chatCount: chatCount + 1 })
    return true
  },
  setShowPaywall: (v) => set({ showPaywall: v }),
  setPremium: () => set({ isPremium: true, showPaywall: false }),

  reset: () => set({ chart: null, birthData: null, userName: '', chatCount: 0 }),
}))
