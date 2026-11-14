# Firestore Security Specification (Open Classroom Mode)

## 1. Data Invariants
- Every document in `/submissions/{submissionId}` MUST use a valid ID (`^[a-zA-Z0-9_-]+$`, length `<= 128`) equal to `studentUid + "_" + questionId`.
- Document payloads MUST conform strictly to `isValidSubmission(data)` with strict field allowlists (`hasAll` / `hasOnly`) and string length caps (`audioDataUrl <= 850000`, `studentText <= 2000`, `teacherFeedback <= 2000`, `studentName <= 100`).
- `createdAt` and `updatedAt` MUST match `request.time`; `studentUid`, `questionId`, and `createdAt` are immutable on `update`.
- `create` operations CANNOT pre-populate `teacherScore`, `teacherFeedback`, or `reviewedAt`.
- `update` operations are partitioned into student content updates vs teacher review updates using `affectedKeys().hasOnly(...)`.
- Note: Because the user explicitly requested removing Google login so students and teachers do not have to sign in, `/submissions` operates in open classroom mode (no `request.auth` gate). Rules should be reviewed and tightened (e.g., re-enabling Auth or teacher passkeys) before broad public deployment.

## 2. Adversarial Payloads (Dirty Dozen)
1. Ghost field injection (`isVerified: true`) on `create` -> `PERMISSION_DENIED`
2. Oversized `audioDataUrl` (`> 850000` chars) -> `PERMISSION_DENIED`
3. Invalid `submissionId` containing invalid chars or `> 128` chars -> `PERMISSION_DENIED`
4. Mismatched `submissionId` vs `studentUid + "_" + questionId` on `create` -> `PERMISSION_DENIED`
5. Self-assigning `teacherScore: 10` during `create` -> `PERMISSION_DENIED`
6. Mutating `studentUid`, `questionId`, or `createdAt` on `update` -> `PERMISSION_DENIED`
7. Forging `createdAt` or `updatedAt` != `request.time` -> `PERMISSION_DENIED`
8. Out-of-range `scenarioId` (`0` or `99`) -> `PERMISSION_DENIED`
9. Out-of-range `teacherScore` (`-1` or `15`) -> `PERMISSION_DENIED`
10. Mixing student audio modification with `teacherScore` in the same `update` -> `PERMISSION_DENIED`
11. Writing to `/test/connection` -> `PERMISSION_DENIED`
12. Writing to any unknown collection `/other/doc` -> `PERMISSION_DENIED`
