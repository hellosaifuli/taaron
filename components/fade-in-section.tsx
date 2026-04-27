interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: string;
}

export default function FadeInSection({
  children,
  className = "",
}: FadeInSectionProps) {
  return <div className={className}>{children}</div>;
}
