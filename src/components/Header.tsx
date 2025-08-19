'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container } from './Container';
import { useTheme } from '@/providers/ThemeProvider';
import { tokens } from '@/design-system/tokens';
import { Moon, Sun, Stethoscope } from 'lucide-react';
import WorkFlow from '@/features/workflow/WorkFlow';
import { usePathname } from 'next/navigation';

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: ${tokens.zIndex.sticky};
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: ${tokens.borderWidth.thin} solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(8px);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;

const HeaderMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${tokens.fontWeight.bold};
  font-size: ${tokens.fontSize.xl};
`;

const ThemeToggle = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${tokens.radii.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: ${tokens.transitions.all};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const nonLandingPage = pathname !== '/';

  return (
    <HeaderWrapper>
      <Container>
        <HeaderContent>
          <Logo href="/">
            <Stethoscope size={24} />
            MedCode AI
          </Logo>
          <HeaderMenu>
            {nonLandingPage ? <WorkFlow /> : null}
            <ThemeToggle
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </ThemeToggle>
          </HeaderMenu>
        </HeaderContent>
      </Container>
    </HeaderWrapper>
  );
};
