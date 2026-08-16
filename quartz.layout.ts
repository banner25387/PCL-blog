import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      // 檔案依日期新→舊（無日期者殿後）；資料夾維持字母序並排在檔案前
      sortFn: (a, b) => {
        if (a.isFolder && b.isFolder) {
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }
        if (a.isFolder !== b.isFolder) {
          return a.isFolder ? -1 : 1
        }
        const dateA = a.data?.date ? new Date(a.data.date).getTime() : 0
        const dateB = b.data?.date ? new Date(b.data.date).getTime() : 0
        return dateB - dateA
      },
    }),
    Component.DesktopOnly(Component.RecentNotes({ title: "📁 Tags", limit: 0, linkToMore: "tags" })),
  ],
  right: [
    Component.ConditionalRender({
      condition: (page) => page.fileData.slug === "index",
      component: Component.RecentNotes({
        title: "New",
        limit: 1,
        showTags: true,
        filter: (f) => (f.filePath ? !f.filePath.endsWith("index.md") : true),
      }),
    }),
    Component.ConditionalRender({
      condition: (page) => page.fileData.slug === "index",
      component: Component.PostCalendar({ title: "Calendar" }),
    }),
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      // 與文章頁 Explorer 同步：檔案依日期新→舊、資料夾字母序在前
      sortFn: (a, b) => {
        if (a.isFolder && b.isFolder) {
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }
        if (a.isFolder !== b.isFolder) {
          return a.isFolder ? -1 : 1
        }
        const dateA = a.data?.date ? new Date(a.data.date).getTime() : 0
        const dateB = b.data?.date ? new Date(b.data.date).getTime() : 0
        return dateB - dateA
      },
    }),
  ],
  right: [],
}
