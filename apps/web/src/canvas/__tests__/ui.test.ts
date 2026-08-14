import test from 'node:test';
import assert from 'node:assert/strict';
import { formatRelativeTime } from '../../components/BoardCard.js';

test('formatRelativeTime formats timestamps cleanly and deterministically', () => {
  const now = new Date();

  // Just now (< 60s)
  const justNow = new Date(now.getTime() - 15 * 1000).toISOString();
  assert.equal(formatRelativeTime(justNow), 'Just now');

  // 12m ago
  const twelveMinAgo = new Date(now.getTime() - 12 * 60 * 1000).toISOString();
  assert.equal(formatRelativeTime(twelveMinAgo), '12m ago');

  // 4h ago
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString();
  assert.equal(formatRelativeTime(fourHoursAgo), '4h ago');

  // Yesterday (1 day ago)
  const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString();
  assert.equal(formatRelativeTime(yesterday), 'Yesterday');

  // 5d ago
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
  assert.equal(formatRelativeTime(fiveDaysAgo), '5d ago');

  // Invalid date fallback
  assert.equal(formatRelativeTime('invalid-date'), 'Recently');
  assert.equal(formatRelativeTime(''), 'Recently');
});
