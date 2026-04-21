import { create } from 'zustand'
import { supabase } from './supabase'

export const useStore = create((set, get) => ({
  // Chart
  chart: null,
  birthData: null,
  userName: '',
  savedChartId: null,

  // Auth
  user: null,
  loadingAuth: true,

  // Freemium
  chatCount: 0,
  isPremium: false,
  showPaywall: false,

  // UI
  system: 'vedic',
  activeTab: 'chart',

  // Auth actions
  setUser: (user) => set({ user, loadingAuth: false }),
  setLoadingAuth: (v) => set({ loadingAuth: v }),

  // Chart actions
  setChart: (chart, birthData, name, chartId = null) =>
    set({ chart, birthData, userName: name, savedChartId: chartId }),
  setSystem: (system) => set({ system }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Freemium
  incrementChat: () => {
    const { chatCount, isPremium } = get()
    if (isPremium) return true
    if (chatCount >= 3) { set({ showPaywall: true }); return false }
    set({ chatCount: chatCount + 1 })
    return true
  },
  setShowPaywall: (v) => set({ showPaywall: v }),
  setPremium: () => set({ isPremium: true, showPaywall: false }),

  reset: () => set({
    chart: null, birthData: null, userName: '',
    chatCount: 0, savedChartId: null
  }),

  // Init auth listener
  initAuth: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null, loadingAuth: false })
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, loadingAuth: false })
    })
  }
}))
