import PageHeader from '@/components/ui/PageHeader';

function PageBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#0058be]/[0.05] blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[#0058be]/[0.03] blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 w-[700px] h-[400px] rounded-full bg-[#0058be]/[0.02] blur-[120px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />
    </>
  );
}

export default function DashboardLayout({ title, description, children, action, actionLabel, onAction }) {
  return (
    <div className="min-h-screen bg-[var(--dark-bg-base)] relative">
      <PageBackground />
      <div className="relative z-10">
        <PageHeader
          title={title}
          description={description}
          action={action}
          actionLabel={actionLabel}
          onAction={onAction}
        />
        <div className="w-full px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
