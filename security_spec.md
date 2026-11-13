# Firestore Security Specification

## 1. Data Invariants
- Every document in `/submissions/{submissionId}` MUST belong to a verified signed-in student (`studentUid == request.auth.uid`) and use a valid ID (`^[a-zA-Z0-9_-]+$`, length `<= 128`).
- A student can ONLY read (`get`, `list`), create, update, or delete their own submissions (`resource.data.studentUid == request.auth.uid`), and CANNOT set or modify `teacherScore`, `teacherFeedback`, or `reviewedAt` or hijack `studentUid` / `createdAt`.
- Only a verified Teacher/Admin (`isAdmin()`, bootstrapped via `tth.tranhuyen@gmail.com` with `email_verified == true` or `/admins/{uid}`) can `list`/`get` all student submissions and update `teacherScore`, `teacherFeedback`, `reviewedAt`, `updatedAt`.
- String fields are strictly size-bounded (`audioDataUrl <= 850000`, `studentText <= 2000`, `teacherFeedback <= 2000`, `studentName <= 100`) to prevent Denial-of-Wallet and 1MB Firestore document limit errors.
- Timestamps `createdAt` and `updatedAt` MUST match `request.time`.

## 2. Adversarial Payloads (Dirty Dozen)
1. Unauthenticated `create` to `/submissions/sub1` -> `PERMISSION_DENIED`
2. Unverified email (`email_verified: false`) `create` to `/submissions/sub1` -> `PERMISSION_DENIED`
3. Spoofed `studentUid` (`studentUid: "other-uid"`) on `create` -> `PERMISSION_DENIED`
4. Ghost field injection (`isVerified: true`) on `create` -> `PERMISSION_DENIED`
5. Oversized `audioDataUrl` (`> 850000` chars) -> `PERMISSION_DENIED`
6. Invalid `submissionId` containing invalid chars or `> 128` chars -> `PERMISSION_DENIED`
7. Student trying to self-assign `teacherScore: 10` during `create` -> `PERMISSION_DENIED`
8. Student trying to `update` `teacherScore` or `teacherFeedback` on their own submission -> `PERMISSION_DENIED`
9. Student A trying to `get` or `list` Student B's submission -> `PERMISSION_DENIED`
10. Student trying to mutate `studentUid` or `createdAt` on `update` -> `PERMISSION_DENIED`
11. Unverified-email user spoofing admin email `tth.tranhuyen@gmail.com` (`email_verified: false`) -> `PERMISSION_DENIED`
12. Non-admin trying to write `/admins/{uid}` -> `PERMISSION_DENIED`
