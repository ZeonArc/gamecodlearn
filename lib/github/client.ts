const GITHUB_API = "https://api.github.com"

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  default_branch: string
}

export interface GitHubFile {
  name: string
  path: string
  type: "file" | "dir"
  size: number
  download_url: string | null
}

/**
 * Fetch public repositories for a GitHub user
 */
export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=20&type=owner`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 300 },
    }
  )
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

/**
 * Fetch repository file tree (root level)
 */
export async function fetchRepoContents(owner: string, repo: string, path = ""): Promise<GitHubFile[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
    }
  )
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

/**
 * Fetch raw file content (text files only, max 100KB)
 */
export async function fetchFileContent(owner: string, repo: string, path: string): Promise<string> {
  const res = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`,
    { next: { revalidate: 60 } }
  )
  if (!res.ok) return ""
  const text = await res.text()
  return text.slice(0, 100_000) // Cap at 100KB to avoid huge payloads
}

/**
 * Build a summary of a repo for AI analysis — fetches key files
 */
export async function buildRepoSummary(owner: string, repo: string): Promise<string> {
  const files = await fetchRepoContents(owner, repo)

  // Identify key files to analyze
  const keyFiles = ["README.md", "package.json", "requirements.txt", "Cargo.toml", "go.mod", "pom.xml"]
  const codeExts = [".ts", ".tsx", ".js", ".jsx", ".py", ".java", ".go", ".rs", ".cpp", ".c"]

  let summary = `Repository: ${owner}/${repo}\n\nFile structure:\n`
  for (const f of files) {
    summary += `  ${f.type === "dir" ? "📁" : "📄"} ${f.name}\n`
  }

  // Fetch key config/readme files
  for (const f of files) {
    if (keyFiles.includes(f.name)) {
      const content = await fetchFileContent(owner, repo, f.path)
      if (content) {
        summary += `\n--- ${f.name} ---\n${content.slice(0, 3000)}\n`
      }
    }
  }

  // Fetch up to 3 source code files for analysis
  const sourceFiles = files.filter(
    (f) => f.type === "file" && codeExts.some((ext) => f.name.endsWith(ext))
  )
  for (const f of sourceFiles.slice(0, 3)) {
    const content = await fetchFileContent(owner, repo, f.path)
    if (content) {
      summary += `\n--- ${f.name} (source) ---\n${content.slice(0, 2000)}\n`
    }
  }

  return summary
}
