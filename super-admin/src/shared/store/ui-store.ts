import { create } from 'zustand'

type UiState = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
}

export const useUiStore = create<UiState>(set => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set(state => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
}))
