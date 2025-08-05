import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// Step 1: Only get actual icon components
type LucideIconComponent = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<LucideProps> & React.RefAttributes<SVGSVGElement>
>;

export type IconNames = {
  [K in keyof typeof LucideIcons]: (typeof LucideIcons)[K] extends LucideIconComponent ? K : never;
}[keyof typeof LucideIcons];

interface AppIconProps {
  name: IconNames;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
  [key: string]: unknown;
}

// Step 2: Render safely
const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 2,
  ...props
}) => {
  const IconComponent = LucideIcons[name] as LucideIconComponent;

  if (!IconComponent) {
    return (
      <HelpCircle
        size={size}
        color="gray"
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
};

export default AppIcon;
