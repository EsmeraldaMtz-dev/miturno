# File: `.github/workflows/build.yml`

GitHub Actions CI pipeline — automatically compiles services on every push to `main`.

## Current Version Summary

A `changes` job detects which service folders were modified, then only the affected services are built. Uses Maven dependency caching for faster builds.

## Change History

### V2 (current) — Reliable path detection with `dorny/paths-filter`

**What changed:** Removed the `paths` filter from the `on.push` trigger and the `if: contains(...)` conditions from each job. Replaced them with a dedicated `changes` job that uses `dorny/paths-filter@v2` to detect which folders had modifications. Each build job now depends on `changes` via `needs:` and only runs if its output is `'true'`.

**Why:** The previous V1 approach had two problems:

1. The `paths` filter in `on.push` prevented the entire workflow from running if you only changed `README.md` or `docker-compose.yml` — but it also meant you couldn't see the workflow in the Actions tab at all for those pushes.
2. The `if: contains(github.event.commits[0].modified, 'service-name')` condition only checked the **first commit** in a push. If you pushed multiple commits and the service change was in the second commit, the build would be skipped incorrectly.

`dorny/paths-filter` properly analyzes **all changed files** across all commits in a push, and works correctly with both `push` and `pull_request` events.

**Tools involved:**

- **`dorny/paths-filter@v2`** — a GitHub Action that compares file paths between the base and head of a push or PR. You define named filters with glob patterns, and it outputs boolean values (`'true'`/`'false'`) for each filter. It runs once, and other jobs read its outputs to decide whether to run.

- **`needs:` keyword** — declares that a job depends on another job. `needs: changes` means "wait for the `changes` job to finish before deciding whether to run." Without `needs`, all jobs would run in parallel and couldn't read each other's outputs.

- **`outputs:` on a job** — allows a job to export values that other jobs can read. The `changes` job outputs three booleans (one per service), and each build job checks its corresponding output.

**How the flow works:**

```
Push to main
    │
    ▼
┌─────────────────────────────┐
│  changes job                 │
│  dorny/paths-filter          │
│  ───────────────────────     │
│  appointment-service: true   │
│  qr-service: false           │
│  notification-service: false │
└─────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│  build-appointment: RUNS      │  ← output was 'true'
│  build-qr: SKIPPED            │  ← output was 'false'
│  build-notification: SKIPPED  │
└──────────────────────────────┘
```

**The actual YAML structure:**

```yaml
jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      appointment-service: ${{ steps.filter.outputs.appointment-service }}
      qr-service: ${{ steps.filter.outputs.qr-service }}
      notification-service: ${{ steps.filter.outputs.notification-service }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            appointment-service:
              - 'appointment-service/**'
            qr-service:
              - 'qr-service/**'
            notification-service:
              - 'notification-service/**'

  build-appointment-service:
    needs: changes
    if: ${{ needs.changes.outputs.appointment-service == 'true' }}
    # ... build steps
```

Key detail: the `id: filter` on the `dorny/paths-filter` step is what lets the `outputs` section reference `steps.filter.outputs.*`. Without that `id`, the job wouldn't know which step's outputs to expose.

---

### V1 — Initial pipeline with Maven caching and manual path filters

**What changed:** Created the pipeline from scratch. Three jobs (one per service), each checking out code, setting up Java 25 with Maven caching, and running `./mvnw clean package -DskipTests`. Added a `paths` filter on the `on.push` trigger and `if: contains(...)` conditions on each job for basic path filtering.

**Why:** To have automated compilation on every push — if the code doesn't compile, the pipeline fails and shows a red ❌ in the repository. This is the most basic form of Continuous Integration. Maven caching was added to avoid re-downloading all dependencies on every run.

**Tools involved:**

- **GitHub Actions** — GitHub's built-in CI/CD platform. Workflows are defined in YAML files inside `.github/workflows/`. Free for public repositories.

- **`actions/checkout@v4`** — official action that clones the repository into the runner VM so the build has access to the code.

- **`actions/setup-java@v4`** — installs a specific Java version on the runner. `distribution: 'temurin'` specifies the Eclipse Temurin JDK (free, production-ready). `cache: 'maven'` tells it to save/restore the `~/.m2/repository` folder between runs using a hash of `pom.xml` as the cache key.

- **`runs-on: ubuntu-latest`** — each job runs on a fresh Ubuntu virtual machine provided by GitHub. This has nothing to do with the developer's local OS (Fedora in this case). GitHub provides these VMs for free on public repos.

- **`./mvnw clean package -DskipTests`** — Maven Wrapper (`mvnw`) ensures the exact Maven version the project expects, so the build doesn't depend on what's installed on the machine. `clean` removes previous build artifacts (`target/` folder), `package` compiles the code and creates the JAR file, `-DskipTests` skips test execution (used when no tests exist yet).

- **`paths` in `on.push`** — told GitHub to only trigger the workflow if files changed in one of the service folders. Problem: if you only changed `README.md`, the workflow wouldn't appear in the Actions tab at all.

- **`if: contains(github.event.commits[0].modified, ...)`** — checked if the first commit's modified files included the service name. Problem: only checked the first commit, not all commits in a multi-commit push.

**Key concepts for interviews:**

- **CI (Continuous Integration)** — automatically validating code on every push to catch errors before they reach production
- **Each job runs in an isolated VM** — they don't share filesystem state, which is why each one needs its own `checkout` and `setup-java`
- **Maven Wrapper** — the project ships its own Maven, so builds are reproducible regardless of the environment
- **Cache invalidation** — Maven cache key is based on `pom.xml` hash; when dependencies change, the cache is rebuilt automatically