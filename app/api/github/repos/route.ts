import { NextResponse } from "next/server"
import { fetchUserRepos } from "@/lib/github/client"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 })
  }

  try {
    const repos = await fetchUserRepos(username)
    return NextResponse.json({
      success: true,
      repos: repos.map((r) => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        html_url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        updated_at: r.updated_at,
        topics: r.topics || [],
      })),
    })
  } catch (error) {
    console.error("GitHub repos error:", error)
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 })
  }
}
