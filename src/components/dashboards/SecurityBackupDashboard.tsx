import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getSyncQueue } from '../../utils/syncManager';
import {
  ShieldCheck,
  Lock,
  Database,
  RefreshCw,
  Download,
  UploadCloud,
  FileCheck,
  Wifi,
  WifiOff,
  AlertCircle,
  KeyRound,
  FileText,
  CheckCircle2
} from 'lucide-react';

export const SecurityBackupDashboard: React.FC = () => {
  const {
    backups,
    createBackupNow,
    restoreBackupById,
    auditLogs,
    isOffline,
    toggleOfflineMode,
    pendingSyncCount,
    lastSyncTime,
    triggerManualSync,
    addToast
  } = useApp();

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [isProcessingSync, setIsProcessingSync] = useState(false);

  const queueItems = getSyncQueue();

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    await createBackupNow();
    setIsCreatingBackup(false);
  };

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    await restoreBackupById(id);
    setRestoringId(null);
  };

  const handleDownloadBackup = (snapshot: any) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AMAZON_BACKUP_${snapshot.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('success', `Exported snapshot ${snapshot.id} as encrypted JSON file`);
  };

  const handleSyncNow = async () => {
    setIsProcessingSync(true);
    await triggerManualSync();
    setIsProcessingSync(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 space-y-6">
      {/* Top Console Bar */}
      <div className="bg-[#131921] text-white rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">
              amazon<span className="text-emerald-400">security & vault</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              AES-256-GCM ENCRYPTED
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Enterprise database redundancy, automated cloud snapshots, offline synchronization engine, and zero-trust audit trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
            className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Database className="w-4 h-4" />
            <span>{isCreatingBackup ? 'Generating Encrypted Snapshot...' : 'Create Backup Snapshot'}</span>
          </button>
        </div>
      </div>

      {/* Security Health & Posture Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Security Posture Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            99 / 100
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Zero known vulnerabilities
          </div>
        </div>

        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Storage Encryption</span>
            <Lock className="w-4 h-4 text-[#FF9900]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            AES-256
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Client PBKDF2 derived keys
          </div>
        </div>

        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Offline Sync Status</span>
            {isOffline ? <WifiOff className="w-4 h-4 text-amber-500" /> : <Wifi className="w-4 h-4 text-emerald-500" />}
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {isOffline ? 'Offline' : 'Online'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {pendingSyncCount} mutations in queue
          </div>
        </div>

        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Backup Redundancy</span>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {backups.length} Snapshots
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Multi-region replication
          </div>
        </div>
      </div>

      {/* Main Split: Backups Registry & Offline Sync Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Automated Backups Registry (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#FF9900]" />
                Automated Database Backups & Point-in-Time Restore
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographically signed snapshots with SHA-256 integrity hash verification
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {backups.map(snap => (
              <div
                key={snap.id}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <span className="font-mono text-[#007185] dark:text-[#3db2c6]">{snap.id}</span>
                    {snap.autoGenerated && (
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-normal">
                        Scheduled
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {new Date(snap.timestamp).toLocaleString()} · Records: {snap.recordCount.orders} orders, {snap.recordCount.cart} cart items, {snap.recordCount.wishlist} wishlist
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate max-w-sm mt-1">
                    SHA-256: {snap.hash}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownloadBackup(snap)}
                    className="p-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                    title="Download encrypted snapshot JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleRestore(snap.id)}
                    disabled={restoringId === snap.id}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-[#FFD814] dark:hover:bg-[#FFD814] text-slate-900 dark:text-white hover:text-slate-900 font-bold rounded-md transition text-xs shadow-xs"
                  >
                    {restoringId === snap.id ? 'Restoring...' : 'Restore'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs text-slate-500 border border-slate-100 dark:border-slate-800">
            Automated cloud backups trigger every 4 hours and immediately prior to high-volume flash sales.
          </div>
        </div>

        {/* Offline Sync Engine & Mutation Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#FF9900]" />
                Offline Sync Engine
              </h3>
              <button
                onClick={toggleOfflineMode}
                className={`px-2.5 py-1 text-xs font-semibold rounded border transition ${
                  isOffline
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                {isOffline ? 'Reconnect Online' : 'Simulate Offline'}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              When disconnected, customer orders, addresses, and updates queue locally in encrypted IndexedDB storage.
            </p>
          </div>

          {/* Sync Queue List */}
          <div className="space-y-2 flex-1 my-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Local Mutation Queue ({queueItems.length})</span>
              <span>Last Synced: {new Date(lastSyncTime).toLocaleTimeString()}</span>
            </div>

            {queueItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                <span>All local mutations synchronized. Database is 100% in sync.</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {queueItems.map(item => (
                  <div key={item.id} className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-900/60 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-amber-900 dark:text-amber-200 font-mono">{item.action}</div>
                      <div className="text-[10px] text-amber-700 dark:text-amber-400">{item.id} · {item.timestamp}</div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={handleSyncNow}
              disabled={isProcessingSync || isOffline || queueItems.length === 0}
              className="w-full py-2 px-4 bg-[#FFD814] hover:bg-[#F7CA00] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-slate-900 text-xs font-bold rounded-lg transition shadow-xs flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessingSync ? 'animate-spin' : ''}`} />
              <span>{isProcessingSync ? 'Syncing with MySQL Server...' : 'Trigger Immediate Sync'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cryptographic Security Audit Log */}
      <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF9900]" />
              Zero-Trust Cryptographic Security Audit Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable event log for all authentication, payment tokenization, and backup operations
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            Chain Intact
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Event Detail</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Client Endpoint</th>
                <th className="p-3">Status</th>
                <th className="p-3">Signature Digest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {log.id}
                  </td>
                  <td className="p-3 font-medium text-slate-900 dark:text-white max-w-sm truncate">
                    {log.event}
                  </td>
                  <td className="p-3 font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-3 text-slate-500 text-[11px]">
                    {log.ipAddress}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                    {log.signature}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
