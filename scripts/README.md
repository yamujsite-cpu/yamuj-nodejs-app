# Data migrations

## Publish-state migration

Run this once against the intended MongoDB deployment after deploying the
`isPublished` schema change and before relying on public content filters:

```bash
npm run migrate:publish-state
```

The script updates only Project and Blog documents where `isPublished` is
absent, setting it to `true`. It never changes documents that already have an
explicit publishing state, so it is safe to run again if a deployment retry is
needed. Confirm that the environment points at the intended database before
running it.
