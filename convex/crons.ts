import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Check every hour for leads that need follow-up emails
crons.interval(
  "process-email-followups",
  { hours: 1 },
  internal.emailSequence.processFollowUps,
);

// Check every hour for filter leads that need follow-up emails
crons.interval(
  "process-filter-followups",
  { hours: 1 },
  internal.filterEmailSequence.processFilterFollowUps,
);

export default crons;
