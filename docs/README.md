# MiTurno Documentation

This folder contains architecture documentation, change logs, and design decisions for MiTurno project.

## Contents

### [Architecture Overview](./architecture.md)

High-level system design: what each service does, how they communicate, and why the project is structured this way.

### [Change Logs](./changelog/)

Every significant configuration or infrastructure change is documented here — what was modified, why, and what tools are involved. If you want to understand how the project setup evolved, start here.


## How to Add a New Change Log

Use this template when documenting a config or infrastructure change:

```markdown
# File: `filename.ext`

## Current Version Summary
One-line description of what this file does now.

## Change History

### [Date] — Change title
**What changed:** Describe the modification.
**Why:** The problem this solves.
**Tools/concepts involved:** List any new tools, actions, or patterns used.
**How it works:** Brief technical explanation.
```

## How to Add a New ADR

Copy this template into `decisions/NNN-title.md`:

```markdown
# ADR-NNN: Title

**Date:** YYYY-MM-DD
**Status:** Accepted | Superseded | Deprecated

## Context
What problem or question prompted this decision?

## Decision
What was decided and why?

## Consequences
What are the trade-offs? What does this enable or prevent?
```