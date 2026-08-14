import test from 'node:test';
import assert from 'node:assert/strict';
import { formatRelativeTime } from '../../components/BoardCard.js';

test('formatRelativeTime formats timestamps cleanly and deterministically', () => {
  const now = new Date();

  // Just now (< 60s)
  const justNow = new Date(now.getTime() - 10 * 1000).toISOString();
  assert.equal(formatRelativeTime(justNow), 'Just now');

  // 5m ago
  const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
  assert.equal(formatRelativeTime(fiveMinAgo), '5m ago');

  // 2h ago
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
  assert.equal(formatRelativeTime(twoHoursAgo), '2h ago');

  // Yesterday (1 day ago)
  const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString();
  assert.equal(formatRelativeTime(yesterday), 'Yesterday');

  // 3d ago
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
  assert.equal(formatRelativeTime(threeDaysAgo), '3d ago');

  // Invalid date fallback
  assert.equal(formatRelativeTime('invalid-date'), 'Recently');
});
