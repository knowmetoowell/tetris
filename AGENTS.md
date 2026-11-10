# Project instructions

## Prompt and result history

- Keep `WORKFLOW.md` as the chronological record of user task prompts and their outcomes for this project.
- For each project task, append an entry after finishing the work and before the final response. Preserve the original user prompt exactly, including spelling, punctuation, Markdown, and code. Include follow-up prompts and user choices that affect the task, in order.
- Summarize the result concisely, including the outcome, changed files, and verification performed (or state that no verification was run).
- Keep earlier entries unchanged. Do not invent or reconstruct missing wording; mark it as unavailable if the exact prompt is not present in the conversation.
- Do not record system or developer instructions, platform boilerplate, tool output, or hidden reasoning. Do not persist credentials or secret tokens; redact those values as `[REDACTED]` if they appear in a prompt.
- Use the current date for entries. Apply this rule when working in this project while this file is present.

## 테스트 및 Git 병합 규칙

- 모든 수정은 관련 유닛 테스트를 실행한다. 유닛 테스트가 모두 통과한 경우에만 수정 사항을 최종 반영한다. 테스트가 하나라도 실패하면 해당 수정 사항을 반영하지 말고 원상복구한다.
- 변경 동작을 검증할 관련 유닛 테스트가 없으면 테스트를 추가하거나 보완한 뒤 실행한다.
- `git rebase`와 `git pull --rebase`를 사용하지 않는다. 브랜치 통합에는 `git merge`를 사용한다.
