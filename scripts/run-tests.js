import { execSync } from "child_process"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, "..")

try {
  const output = execSync("npx vitest run 2>&1", {
    encoding: "utf-8",
    timeout: 60000,
    cwd: projectRoot,
  })
  console.log(output)
} catch (error) {
  console.log(error.stdout || "")
  console.log(error.stderr || "")
  console.log("Exit code:", error.status)
}
