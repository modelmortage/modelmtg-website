/**
 * Icon Mapping Utility
 * 
 * Maps icon names to React Icons components for consistent icon usage
 * across the application.
 */

import { IconType } from 'react-icons';
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaGift,
  FaUserTie,
  FaClock,
  FaBolt,
  FaCheckCircle,
  FaBalanceScale,
  FaUniversity,
  FaLock,
  FaGraduationCap,
  FaUserCheck,
  FaLightbulb,
  FaHandshake,
  FaStar,
  FaChartLine,
  FaHome,
  FaCalculator,
  FaUsers,
  FaBook,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckSquare,
  FaDollarSign,
  FaPercentage,
  FaFileAlt,
  FaShieldAlt,
  FaAward,
  FaHeart,
  FaThumbsUp,
} from 'react-icons/fa';

export const iconMap: Record<string, IconType> = {
  // User and People
  FaUser,
  FaUserTie,
  FaUserCheck,
  FaUsers,
  
  // Communication
  FaPhone,
  FaEnvelope,
  
  // Actions and Status
  FaCheckCircle,
  FaCheckSquare,
  FaBolt,
  FaGift,
  FaClock,
  FaStar,
  FaThumbsUp,
  FaHeart,
  
  // Business and Finance
  FaBalanceScale,
  FaUniversity,
  FaLock,
  FaChartLine,
  FaDollarSign,
  FaPercentage,
  FaShieldAlt,
  FaAward,
  
  // Education and Information
  FaGraduationCap,
  FaLightbulb,
  FaBook,
  FaInfoCircle,
  FaFileAlt,
  
  // Other
  FaHandshake,
  FaHome,
  FaCalculator,
  FaExclamationTriangle,
};

/**
 * Get an icon component by name
 * @param iconName - The name of the icon (e.g., 'FaUser')
 * @returns The icon component or undefined if not found
 */
export function getIcon(iconName: string): IconType | undefined {
  return iconMap[iconName];
}

export type IconName = keyof typeof iconMap;
