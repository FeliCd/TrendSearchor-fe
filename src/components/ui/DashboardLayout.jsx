import PageHeader from '@/components/ui/PageHeader';

function PageBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
      style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '64px 64px' }}
    />
  );
}

export default function DashboardLayout({ title, description, children, action, actionLabel, onAction }) {
  return (
    <div className="min-h-screen bg-[#151515] relative">
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
