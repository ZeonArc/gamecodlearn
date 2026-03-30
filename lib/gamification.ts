export type UserStats = {
  xp: number
  level: number
  streak: number
  problemsSolved: number
  rank: string
}

export const getMockUserStats = (): UserStats => ({
  xp: 1250,
  level: 5,
  streak: 7,
  problemsSolved: 42,
  rank: "Code Ninja",
})

export const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1
