# Admin Style Guide & Design System

## 🎨 **Design Philosophy**
The admin area follows a clean, professional design with consistent slate + lilac theming, completely separated from the customer-facing pink brand colors.

---

## 🔧 **Core Design Tokens**

### **Color System**
```css
/* Base Colors */
--admin-bg-primary: theme('colors.white');
--admin-bg-secondary: theme('colors.slate.50');
--admin-bg-tertiary: theme('colors.slate.100');

/* Text Colors */
--admin-text-primary: theme('colors.slate.900');
--admin-text-secondary: theme('colors.slate.700');
--admin-text-muted: theme('colors.slate.600');
--admin-text-subtle: theme('colors.slate.500');

/* Border Colors */
--admin-border-default: theme('colors.slate.200');
--admin-border-hover: theme('colors.slate.300');

/* Accent Colors (Lilac) */
--admin-accent-bg: theme('colors.purple.100');
--admin-accent-text: theme('colors.purple.900');
--admin-accent-active: theme('colors.purple.500');
--admin-accent-border: theme('colors.purple.500');

/* Interactive Colors */
--admin-button-primary: theme('colors.slate.900');
--admin-button-primary-hover: theme('colors.slate.800');
```

### **Spacing System**
```css
/* Consistent spacing scale */
--admin-space-xs: 0.25rem;   /* 4px */
--admin-space-sm: 0.5rem;    /* 8px */
--admin-space-md: 1rem;      /* 16px */
--admin-space-lg: 1.5rem;    /* 24px */
--admin-space-xl: 2rem;      /* 32px */
--admin-space-2xl: 3rem;     /* 48px */
```

---

## 🧩 **Component Patterns**

### **1. Buttons**
```tsx
// Primary Action Button (CTA)
<Button className="bg-slate-900 hover:bg-slate-800 text-white">
  Primary Action
</Button>

// Secondary Action Button (Outline)
<Button 
  variant="outline" 
  className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
>
  Secondary Action
</Button>

// Destructive Action (Delete/Remove)
<Button 
  variant="outline" 
  className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
>
  Delete
</Button>
```

### **2. Navigation Items**
```tsx
// Active Navigation State
<Button
  variant="ghost"
  className="bg-purple-100 text-purple-900 hover:bg-purple-100 hover:text-purple-900"
>
  Active Nav Item
</Button>

// Inactive Navigation State
<Button
  variant="ghost"
  className="text-slate-600 hover:text-slate-900 hover:bg-slate-50"
>
  Inactive Nav Item
</Button>
```

### **3. Form Controls**

#### **Input Fields**
```tsx
<Input 
  className="border-slate-200 focus:border-purple-500 focus:ring-purple-500/20" 
/>
```

#### **Switches**
```tsx
<Switch 
  className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-slate-200"
/>
```

#### **Checkboxes**
```tsx
<Checkbox 
  className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
/>
```

### **4. Status & Badges**
```tsx
// General Status Badge
<Badge className="bg-slate-100 text-slate-800">
  General Status
</Badge>

// Emphasis Badge
<Badge className="bg-slate-200 text-slate-800">
  Important
</Badge>

// Active State Badge
<Badge className="bg-purple-100 text-purple-800">
  Active
</Badge>

// Semantic Status Badges (use proper colors for clarity)
<Badge className="bg-green-100 text-green-800 border-green-200">
  Success / Published
</Badge>

<Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
  Warning / Pending
</Badge>

<Badge className="bg-red-100 text-red-800 border-red-200">
  Error / Failed
</Badge>

<Badge className="bg-blue-100 text-blue-800 border-blue-200">
  Info / New
</Badge>
```

### **5. Cards & Panels**
```tsx
// Standard Card
<Card className="bg-white border-slate-200">
  <CardContent className="p-6">
    Content
  </CardContent>
</Card>

// Secondary Panel
<Card className="bg-slate-50 border-slate-200">
  <CardContent className="p-6">
    Content
  </CardContent>
</Card>
```

---

## 📱 **Layout Patterns**

### **Page Structure**
```tsx
// Standard Admin Page
<div className="min-h-screen bg-slate-50">
  <div className="p-6">
    {/* Page Header */}
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Title</h1>
      <p className="text-slate-600">Page description</p>
    </div>
    
    {/* Main Content */}
    <div className="space-y-6">
      {/* Content sections */}
    </div>
  </div>
</div>
```

### **Form Layout**
```tsx
// Standard Form Container
<Card className="bg-white border-slate-200">
  <CardHeader className="pb-4">
    <CardTitle className="text-slate-900">Form Title</CardTitle>
    <p className="text-sm text-slate-600">Form description</p>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* Form fields */}
  </CardContent>
  <CardFooter className="flex justify-end gap-3 pt-6 border-t border-slate-200">
    {/* Action buttons */}
  </CardFooter>
</Card>
```

---

## 🚫 **Prohibited Patterns**

### **Colors to Never Use in Admin**
- ❌ `bg-primary` / `text-primary` (pink customer colors)
- ❌ `bg-pink-*` / `text-pink-*` / `border-pink-*`
- ❌ `bg-rose-*` / `text-rose-*` / `border-rose-*`
- ❌ Default Button variant without explicit styling
- ❌ CSS variables that reference customer theme

### **Semantic Colors (ALLOWED for Status/Labels)**
- ✅ Green (`green-*`) for success, published, completed states
- ✅ Yellow (`yellow-*`) for warnings, pending, in-progress states  
- ✅ Red (`red-*`) for errors, failed, cancelled states
- ✅ Blue (`blue-*`) for information, new, neutral states
- ✅ Gray (`gray-*`) for inactive, archived, disabled states

### **Component Anti-Patterns**
```tsx
// ❌ NEVER: Default button (inherits pink)
<Button>Action</Button>

// ❌ NEVER: Primary color usage
<div className="bg-primary text-primary-foreground">

// ❌ NEVER: Mixed color schemes
<Badge className="bg-blue-100 text-green-800">
```

---

## 🔄 **Migration & Maintenance**

### **Quick Color Audit Commands**
```bash
# Search for prohibited colors in admin area
grep -r "bg-primary\|text-primary\|bg-pink\|text-pink\|bg-rose\|text-rose" app/admin/

# Find buttons without explicit styling
grep -r "<Button[^>]*>" app/admin/ | grep -v "className\|variant"
```

### **Component Update Checklist**
- [ ] Uses slate base colors
- [ ] Uses purple/lilac for accents and active states
- [ ] No pink/rose/primary color references
- [ ] Consistent hover and focus states
- [ ] Follows spacing system
- [ ] Accessible contrast ratios

### **Future-Proofing Guidelines**
1. **Always use explicit styling** - Never rely on default component variants
2. **Stick to the color tokens** - Use the defined CSS custom properties
3. **Test in isolation** - Verify components work independently
4. **Document variations** - Add new patterns to this guide
5. **Consistent naming** - Use the established class naming conventions

---

## 📚 **Quick Reference**

### **Most Common Classes**
```css
/* Backgrounds */
.admin-bg-primary { @apply bg-white; }
.admin-bg-secondary { @apply bg-slate-50; }
.admin-bg-accent { @apply bg-purple-100; }

/* Text */
.admin-text-primary { @apply text-slate-900; }
.admin-text-secondary { @apply text-slate-600; }
.admin-text-accent { @apply text-purple-900; }

/* Buttons */
.admin-btn-primary { @apply bg-slate-900 hover:bg-slate-800 text-white; }
.admin-btn-secondary { @apply border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50; }

/* Interactive */
.admin-accent-active { @apply bg-purple-500; }
.admin-nav-active { @apply bg-purple-100 text-purple-900 hover:bg-purple-100 hover:text-purple-900; }
```

---

## 🎯 **Implementation Status**

### **✅ Completed Components**
- Navigation (AdminNav)
- Buttons (all variants)
- Form controls (Switch, Checkbox)
- Status badges
- Cards and panels
- Page layouts

### **🔄 Future Enhancements**
- Custom CSS utility classes
- Tailwind plugin for admin tokens
- Storybook documentation
- Automated testing for color compliance

---

*Last Updated: September 11, 2025*
*Admin Design System v1.0*
