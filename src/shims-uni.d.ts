export {}

declare global {
  interface Uni {
    $emit(event: string, ...args: unknown[]): void
    $on(event: string, callback: (...args: unknown[]) => void): void
    $once(event: string, callback: (...args: unknown[]) => void): void
    $off(event?: string, callback?: (...args: unknown[]) => void): void
  }
}
