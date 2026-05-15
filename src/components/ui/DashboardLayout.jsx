import PageHeader from '@/components/ui/PageHeader';

export default function DashboardLayout({ title, description, children, action, actionLabel, onAction }) {
  return (
    <div className="min-h-screen bg-[#010409]">
      <PageHeader
        title={title}
        description={description}
        action={action}
        actionLabel={actionLabel}
        onAction={onAction}
      />
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {children}
      </div>
    </div>
  );
}
