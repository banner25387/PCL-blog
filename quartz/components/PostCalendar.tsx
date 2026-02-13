import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"

type Options = {
  title: string
}

const defaultOptions: Options = {
  title: "行事曆",
}

function ymdFromFrontmatterDate(value: unknown): string | null {
  if (value == null) return null
  const s = String(value)
  const m = s.match(/^\d{4}-\d{2}-\d{2}/)
  return m ? m[0] : null
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const PostCalendar: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
    const postsByDay: Record<string, { title: string; url: string }[]> = {}

    for (const f of allFiles) {
      const fm = f.frontmatter ?? {}
      const day = ymdFromFrontmatterDate((fm as any).date)
      if (!day) continue

      const title = (fm as any).title ?? f.slug ?? day
      const fromSlug = (fileData.slug ?? "index") as any
      const toSlug = (f.slug ?? "") as any
      const url = resolveRelative(fromSlug, toSlug)

      ;(postsByDay[day] ??= []).push({ title, url })
    }

    // 穩定排序，避免每次 build 順序跳動
    for (const day of Object.keys(postsByDay)) {
      postsByDay[day].sort((a, b) => a.title.localeCompare(b.title))
    }

    // 避免 < 被當成 HTML
    const json = JSON.stringify(postsByDay).replace(/</g, "\\u003c")

    return (
      <div class={`post-calendar ${displayClass ?? ""}`} data-posts={json}>
        <h3>{opts.title}</h3>

        <div class="pc-controls">
          <button type="button" class="pc-prev" aria-label="prev month">‹</button>
          <span class="pc-label" />
          <button type="button" class="pc-next" aria-label="next month">›</button>
        </div>

        <div class="pc-weekdays">
          {"日一二三四五六".split("").map((d) => (
            <div class="pc-weekday">{d}</div>
          ))}
        </div>

        <div class="pc-grid" />
        <div class="pc-list" />
      </div>
    )
  }

  PostCalendar.css = `
.post-calendar .pc-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 6px 0 8px;
}

.post-calendar .pc-controls button {
  padding: 2px 8px;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
}

.post-calendar .pc-label {
  font-size: 0.95em;
  color: var(--darkgray);
}

.post-calendar .pc-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 4px;
  font-size: 0.85em;
  color: var(--darkgray);
}

.post-calendar .pc-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.post-calendar .pc-day {
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
  user-select: none;
}

.post-calendar .pc-day.is-empty {
  border: none;
}

.post-calendar .pc-day.has-post {
  cursor: pointer;
  font-weight: 600;
}

.post-calendar .pc-list {
  margin-top: 10px;
  font-size: 0.95em;
}

.post-calendar .pc-list .pc-list-title {
  color: var(--darkgray);
  margin-bottom: 6px;
}

.post-calendar .pc-list ul {
  margin: 0;
  padding-left: 16px;
}
`

  PostCalendar.afterDOMLoaded = `
(function () {
  function pad2(n) { return String(n).padStart(2, "0") }
  function ymd(y, m0, d) { return y + "-" + pad2(m0 + 1) + "-" + pad2(d) }

  function initCalendar() {
    var root = document.querySelector(".post-calendar[data-posts]")
    if (!root) return

    var postsByDay = {}
    try { postsByDay = JSON.parse(root.dataset.posts || "{}") } catch (_) {}

    var grid = root.querySelector(".pc-grid")
    var label = root.querySelector(".pc-label")
    var prevBtn = root.querySelector(".pc-prev")
    var nextBtn = root.querySelector(".pc-next")
    var list = root.querySelector(".pc-list")

    if (!grid || !label || !prevBtn || !nextBtn || !list) return

    var now = new Date()
    var year = now.getFullYear()
    var month0 = now.getMonth()

    function renderList(dayKey) {
      var items = postsByDay[dayKey] || []
      if (!items.length) {
        list.innerHTML = ""
        return
      }
      var html = '<div class="pc-list-title">' + dayKey + "</div><ul>"
      for (var i = 0; i < items.length; i++) {
        var it = items[i]
        html += '<li><a href="' + it.url + '">' + it.title + "</a></li>"
      }
      html += "</ul>"
      list.innerHTML = html
    }

    function render() {
      label.textContent = year + "-" + pad2(month0 + 1)
      grid.innerHTML = ""
      list.innerHTML = ""

      var first = new Date(year, month0, 1)
      var startDow = first.getDay() // 0=Sun
      var daysInMonth = new Date(year, month0 + 1, 0).getDate()

      for (var i = 0; i < startDow; i++) {
        var empty = document.createElement("div")
        empty.className = "pc-day is-empty"
        grid.appendChild(empty)
      }

      for (var d = 1; d <= daysInMonth; d++) {
        var key = ymd(year, month0, d)
        var cell = document.createElement("div")
        var has = postsByDay[key] && postsByDay[key].length
        cell.className = "pc-day" + (has ? " has-post" : "")
        cell.textContent = String(d)
        if (has) cell.dataset.date = key
        grid.appendChild(cell)
      }
    }

    prevBtn.onclick = function () {
      month0--
      if (month0 < 0) { month0 = 11; year-- }
      render()
    }

    nextBtn.onclick = function () {
      month0++
      if (month0 > 11) { month0 = 0; year++ }
      render()
    }

    grid.onclick = function (e) {
      var t = e.target
      if (!t) return
      var cell = t.closest ? t.closest("[data-date]") : null
      if (!cell) return
      renderList(cell.dataset.date)
    }

    render()
  }

  // 第一次載入
  initCalendar()

  // SPA 導航時也要重跑一次（Quartz 的 SPA 會觸發 nav 事件）
  window.addEventListener("nav", initCalendar)
})()
`
  return PostCalendar
}) satisfies QuartzComponentConstructor
