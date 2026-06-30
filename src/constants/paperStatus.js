export const PAPER_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const PAPER_STATUS_LABELS = {
  [PAPER_STATUS.PENDING]: 'Pending Review',
  [PAPER_STATUS.APPROVED]: 'Approved',
  [PAPER_STATUS.REJECTED]: 'Rejected',
};

export const PAPER_STATUS_STYLES = {
  [PAPER_STATUS.PENDING]: 'bg-amber-500/10 text-amber-400 border-2 border-amber-500/30',
  [PAPER_STATUS.APPROVED]: 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30',
  [PAPER_STATUS.REJECTED]: 'bg-red-500/10 text-red-400 border-2 border-red-500/30',
};
