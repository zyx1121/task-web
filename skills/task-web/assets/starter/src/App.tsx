import { TaskShell } from "@/components/task-shell"
import { TaskThemeToggle } from "@/components/task-theme"
import config from "@/task.config.json"

export default function App() {
  const lang = config.lang === "zh-TW" ? "zh-TW" : "en"
  return (
    <TaskShell title={config.title} description={config.description} lang={lang} actions={<TaskThemeToggle lang={lang} />}>
      <section aria-label={lang === "zh-TW" ? "工作區" : "Workspace"}>
        {/* Replace this empty workspace with the requested task. */}
      </section>
    </TaskShell>
  )
}
