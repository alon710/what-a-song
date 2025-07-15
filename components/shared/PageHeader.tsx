interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
      {subtitle && <p className="text-lg text-gray-600 mb-2">{subtitle}</p>}
      {description && <p className="text-gray-500">{description}</p>}
      {children}
    </div>
  );
}
