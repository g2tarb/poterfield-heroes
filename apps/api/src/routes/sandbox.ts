import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function isDockerAvailable(): Promise<boolean> {
  try {
    await execAsync("docker version", { timeout: 3_000 });
    return true;
  } catch {
    return false;
  }
}

function runInDocker(
  args: string[],
  stdin: string,
  timeoutMs: number,
): Promise<{ stdout: string; stderr: string; exitCode: number; timedOut: boolean }> {
  return new Promise((resolve) => {
    const child = spawn("docker", args);
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    child.stdout.on("data", (d: Buffer) => { stdout += d.toString().slice(0, 8192); });
    child.stderr.on("data", (d: Buffer) => { stderr += d.toString().slice(0, 4096); });

    child.stdin.write(stdin);
    child.stdin.end();

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode: code ?? 1, timedOut });
    });
  });
}

const DOCKER_FLAGS = [
  "--rm",
  "--network", "none",
  "--memory", "128m",
  "--cpus", "0.5",
  "--pids-limit", "64",
  "-i",
];

const sandboxRoutes: FastifyPluginAsync = async (app) => {
  const a = app.withTypeProvider<ZodTypeProvider>();

  a.post(
    "/sandbox/run",
    {
      preHandler: [app.authenticate],
      schema: {
        body: z.object({
          language: z.enum(["bash", "c"]),
          code: z.string().min(1).max(20_000),
        }),
      },
    },
    async ({ body }) => {
      const available = await isDockerAvailable();
      if (!available) {
        return { ok: false, available: false };
      }

      const { language, code } = body;
      const TIMEOUT_MS = 15_000;

      if (language === "bash") {
        const result = await runInDocker(
          ["run", ...DOCKER_FLAGS, "bash:5", "bash"],
          code,
          TIMEOUT_MS,
        );
        if (result.timedOut) {
          return { ok: false, error: "Timeout (15s) — programme trop lent ou boucle infinie." };
        }
        const output = result.stdout + (result.stderr ? `\n${result.stderr}` : "");
        return { ok: result.exitCode === 0, output };
      }

      // C : le conteneur reçoit le source via stdin, compile et exécute
      const compileAndRun =
        "cat > /tmp/prog.c && gcc -o /tmp/prog /tmp/prog.c && /tmp/prog";
      const result = await runInDocker(
        ["run", ...DOCKER_FLAGS, "gcc:14-bookworm", "sh", "-c", compileAndRun],
        code,
        TIMEOUT_MS,
      );
      if (result.timedOut) {
        return { ok: false, error: "Timeout (15s) — compilation ou exécution trop lente." };
      }
      const output = result.stdout + (result.stderr ? `\n${result.stderr}` : "");
      return { ok: result.exitCode === 0, output };
    },
  );
};

export default sandboxRoutes;
