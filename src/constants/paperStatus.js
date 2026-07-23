export const PAPER_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVOKED: 'REVOKED',
  TAKEN_DOWN: 'TAKEN_DOWN',
};

export const PAPER_STATUS_LABELS = {
  [PAPER_STATUS.PENDING]: 'Pending Review',
  [PAPER_STATUS.APPROVED]: 'Approved',
  [PAPER_STATUS.REJECTED]: 'Rejected',
  [PAPER_STATUS.REVOKED]: 'Revoked',
  [PAPER_STATUS.TAKEN_DOWN]: 'Taken Down',
};

export const PAPER_STATUS_STYLES = {
  [PAPER_STATUS.PENDING]: 'bg-amber-500/10 text-amber-400 border-2 border-amber-500/30',
  [PAPER_STATUS.APPROVED]: 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30',
  [PAPER_STATUS.REJECTED]: 'bg-red-500/10 text-red-400 border-2 border-red-500/30',
  [PAPER_STATUS.REVOKED]: 'bg-zinc-500/10 text-zinc-400 border-2 border-zinc-500/30',
  [PAPER_STATUS.TAKEN_DOWN]: 'bg-gray-700/20 text-gray-400 border-2 border-gray-600/30',
};
