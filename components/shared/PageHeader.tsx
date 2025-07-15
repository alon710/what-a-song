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
    <div className="text-center mb-4 sm:mb-6 md:mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">
          {subtitle}
        </p>
      )}
      {description && (
        <p className="text-sm sm:text-base text-gray-500">{description}</p>
      )}
      {children}
    </div>
  );
}
