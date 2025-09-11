/**
 * Admin UI Utilities - Consistent styling patterns for the admin area
 * 
 * This file contains reusable class combinations and utility functions
 * for maintaining consistent styling across the admin interface.
 */

// =============================================================================
// BUTTON STYLES
// =============================================================================

export const adminButtonStyles = {
  // Primary action buttons (CTA, Save, Create)
  primary: "bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-500/20",
  
  // Secondary action buttons (Cancel, Back)
  secondary: "border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-900",
  
  // Destructive actions (Delete, Remove)
  destructive: "border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-900",
  
  // Ghost buttons for navigation
  ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-900",
  
  // Active navigation state
  navActive: "bg-purple-100 text-purple-900 hover:bg-purple-100 hover:text-purple-900 focus:bg-purple-100 focus:text-purple-900",
}

// =============================================================================
// FORM CONTROL STYLES
// =============================================================================

export const adminFormStyles = {
  // Input fields
  input: "border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 text-slate-900 placeholder:text-slate-500",
  
  // Textarea
  textarea: "border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 text-slate-900 placeholder:text-slate-500 resize-none",
  
  // Select components
  select: "border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 text-slate-900",
  
  // Labels
  label: "text-slate-700 font-medium",
  
  // Help text
  helpText: "text-sm text-slate-600",
  
  // Error text
  errorText: "text-sm text-slate-600",
  
  // Switch component
  switch: "data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-slate-200",
  
  // Checkbox component
  checkbox: "data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 border-slate-300",
}

// =============================================================================
// LAYOUT STYLES
// =============================================================================

export const adminLayoutStyles = {
  // Page containers
  pageContainer: "min-h-screen bg-slate-50",
  
  // Content area
  contentArea: "p-6",
  
  // Page header
  pageHeader: "mb-8",
  pageTitle: "text-2xl font-bold text-slate-900 mb-2",
  pageDescription: "text-slate-600",
  
  // Card containers
  card: "bg-white border-slate-200",
  cardSecondary: "bg-slate-50 border-slate-200",
  cardHeader: "pb-4",
  cardTitle: "text-slate-900",
  cardDescription: "text-sm text-slate-600",
  cardContent: "space-y-6",
  cardFooter: "flex justify-end gap-3 pt-6 border-t border-slate-200",
  
  // Grid layouts
  grid: "grid gap-6",
  gridCols1: "grid-cols-1",
  gridCols2: "md:grid-cols-2",
  gridCols3: "lg:grid-cols-3",
  
  // Spacing
  sectionSpacing: "space-y-6",
  elementSpacing: "space-y-4",
  tightSpacing: "space-y-2",
}

// =============================================================================
// STATUS & BADGE STYLES
// =============================================================================

export const adminStatusStyles = {
  // Badge variants
  badgeDefault: "bg-slate-100 text-slate-800",
  badgeEmphasis: "bg-slate-200 text-slate-800",
  badgeActive: "bg-purple-100 text-purple-800",
  
  // Semantic status badges (use proper colors for clarity)
  badgeSuccess: "bg-green-100 text-green-800 border-green-200",
  badgeWarning: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  badgeError: "bg-red-100 text-red-800 border-red-200",
  badgeInfo: "bg-blue-100 text-blue-800 border-blue-200",
  
  // Published/Draft states
  badgePublished: "bg-green-100 text-green-800",
  badgeDraft: "bg-gray-100 text-gray-800",
  badgePending: "bg-yellow-100 text-yellow-800",
  badgeArchived: "bg-gray-100 text-gray-600",
  
  // Order/Inquiry status
  badgeNew: "bg-blue-100 text-blue-800",
  badgeInProgress: "bg-yellow-100 text-yellow-800",
  badgeCompleted: "bg-green-100 text-green-800",
  badgeCancelled: "bg-red-100 text-red-800",
  
  // Priority levels
  badgeLow: "bg-gray-100 text-gray-800",
  badgeMedium: "bg-yellow-100 text-yellow-800",
  badgeHigh: "bg-orange-100 text-orange-800",
  badgeCritical: "bg-red-100 text-red-800",
  
  // Status indicators (dots/circles)
  statusActive: "bg-green-500",
  statusInactive: "bg-gray-300",
  statusPending: "bg-yellow-500",
  statusError: "bg-red-500",
  statusProcessing: "bg-blue-500",
}

// =============================================================================
// TEXT STYLES
// =============================================================================

export const adminTextStyles = {
  // Heading hierarchy
  h1: "text-3xl font-bold text-slate-900",
  h2: "text-2xl font-bold text-slate-900",
  h3: "text-xl font-semibold text-slate-900",
  h4: "text-lg font-semibold text-slate-900",
  h5: "text-base font-semibold text-slate-900",
  h6: "text-sm font-semibold text-slate-900",
  
  // Body text
  bodyLarge: "text-lg text-slate-700",
  body: "text-base text-slate-700",
  bodySmall: "text-sm text-slate-600",
  
  // Specialized text
  muted: "text-slate-500",
  emphasis: "font-semibold text-slate-900",
  code: "font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-800",
  link: "text-purple-600 hover:text-purple-800 underline",
}

// =============================================================================
// BORDER & SHADOW STYLES
// =============================================================================

export const adminBorderStyles = {
  // Border styles
  borderDefault: "border-slate-200",
  borderHover: "border-slate-300",
  borderAccent: "border-purple-500",
  
  // Dividers
  divider: "border-t border-slate-200",
  dividerVertical: "border-l border-slate-200",
  
  // Shadows
  shadowSm: "shadow-sm",
  shadowMd: "shadow-md",
  shadowLg: "shadow-lg",
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Combines admin styles with conditional logic
 */
export const combineAdminStyles = (...styles: (string | undefined | false)[]): string => {
  return styles.filter(Boolean).join(' ')
}

/**
 * Creates consistent spacing classes
 */
export const adminSpacing = {
  xs: "gap-1",
  sm: "gap-2", 
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  xxl: "gap-12",
}

/**
 * Responsive breakpoint utilities for admin
 */
export const adminBreakpoints = {
  sm: "sm:",
  md: "md:",
  lg: "lg:",
  xl: "xl:",
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Check if a className contains prohibited customer colors
 * Note: Semantic colors (red, green, yellow, blue) are allowed for status badges
 */
export const validateAdminStyles = (className: string): boolean => {
  const prohibitedPatterns = [
    /bg-primary/,
    /text-primary/,
    /border-primary/,
    /bg-pink-/,
    /text-pink-/,
    /border-pink-/,
    /bg-rose-/,
    /text-rose-/,
    /border-rose-/,
  ]
  
  return !prohibitedPatterns.some(pattern => pattern.test(className))
}

/**
 * Development-only style validator
 */
export const devValidateStyles = (className: string, componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    if (!validateAdminStyles(className)) {
      console.warn(`⚠️ Admin Style Warning: ${componentName} contains prohibited customer colors in className: "${className}"`)
    }
  }
}

export default {
  buttons: adminButtonStyles,
  forms: adminFormStyles,
  layout: adminLayoutStyles,
  status: adminStatusStyles,
  text: adminTextStyles,
  borders: adminBorderStyles,
  spacing: adminSpacing,
  breakpoints: adminBreakpoints,
  utils: {
    combine: combineAdminStyles,
    validate: validateAdminStyles,
    devValidate: devValidateStyles,
  },
}
