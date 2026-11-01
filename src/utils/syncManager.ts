import { SyncQueueItem } from '../types';

const SYNC_QUEUE_KEY = 'amz_offline_sync_queue';
const LAST_SYNC_KEY = 'amz_last_sync_timestamp';

export function getSyncQueue(): SyncQueueItem[] {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read sync queue:', err);
    return [];
  }
}

export function addToSyncQueue(action: SyncQueueItem['action'], payload: any): SyncQueueItem {
  const queue = getSyncQueue();
  const newItem: SyncQueueItem = {
    id: 'SYNC-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    action,
    payload,
    timestamp: new Date().toISOString(),
    status: 'pending',
    retryCount: 0
  };
  queue.push(newItem);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  return newItem;
}

export function clearSyncQueue(): void {
  localStorage.removeItem(SYNC_QUEUE_KEY);
}

export function getLastSyncTime(): string {
  return localStorage.getItem(LAST_SYNC_KEY) || new Date().toISOString();
}

export function updateLastSyncTime(): void {
  localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
}

export async function processSyncQueue(
  onProgress?: (syncedItem: SyncQueueItem, remaining: number) => void
): Promise<{ successCount: number; failedCount: number }> {
  const queue = getSyncQueue();
  if (queue.length === 0) {
    updateLastSyncTime();
    return { successCount: 0, failedCount: 0 };
  }

  let successCount = 0;
  let failedCount = 0;
  const remainingQueue: SyncQueueItem[] = [];

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    item.status = 'syncing';
    // Simulate cloud endpoint synchronization latency (200ms per queued event)
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      // Process simulated database sync
      item.status = 'completed';
      successCount++;
      if (onProgress) {
        onProgress(item, queue.length - (i + 1));
      }
    } catch (err) {
      item.retryCount += 1;
      item.status = item.retryCount > 3 ? 'failed' : 'pending';
      failedCount++;
      remainingQueue.push(item);
    }
  }

  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remainingQueue));
  updateLastSyncTime();
  return { successCount, failedCount };
}
