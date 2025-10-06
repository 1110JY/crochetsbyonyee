
```
crochet-business
├─ app
│  ├─ about
│  │  └─ page.tsx
│  ├─ admin
│  │  ├─ categories
│  │  │  └─ page.tsx
│  │  ├─ inquiries
│  │  │  ├─ actions.ts
│  │  │  ├─ inquiries-list.tsx
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ products
│  │  │  ├─ actions.ts
│  │  │  ├─ new
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  ├─ settings
│  │  │  └─ page.tsx
│  │  └─ testimonials
│  │     └─ page.tsx
│  ├─ api
│  │  ├─ revalidate
│  │  │  └─ route.ts
│  │  └─ send-reply
│  │     └─ route.ts
│  ├─ auth
│  │  ├─ error
│  │  │  └─ page.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ sign-up
│  │  │  └─ page.tsx
│  │  └─ sign-up-success
│  │     └─ page.tsx
│  ├─ contact
│  │  └─ page.tsx
│  ├─ faq
│  │  └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ products
│  │  ├─ page.tsx
│  │  └─ [category]
│  │     ├─ page.tsx
│  │     ├─ [product]
│  │     │  └─ page.tsx
│  │     └─ [slug]
│  │        └─ page.tsx
│  └─ protected
│     └─ page.tsx
├─ components
│  ├─ admin
│  │  ├─ admin-header.tsx
│  │  └─ admin-nav.tsx
│  ├─ category-filter.tsx
│  ├─ navigation.tsx
│  ├─ product-card.tsx
│  ├─ theme-provider.tsx
│  └─ ui
│     ├─ accordion.tsx
│     ├─ alert-dialog.tsx
│     ├─ alert.tsx
│     ├─ aspect-ratio.tsx
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ breadcrumb.tsx
│     ├─ button.tsx
│     ├─ calendar.tsx
│     ├─ card.tsx
│     ├─ carousel.tsx
│     ├─ chart.tsx
│     ├─ checkbox.tsx
│     ├─ collapsible.tsx
│     ├─ command.tsx
│     ├─ context-menu.tsx
│     ├─ dialog.tsx
│     ├─ drawer.tsx
│     ├─ dropdown-menu.tsx
│     ├─ form.tsx
│     ├─ hover-card.tsx
│     ├─ input-otp.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ menubar.tsx
│     ├─ navigation-menu.tsx
│     ├─ pagination.tsx
│     ├─ popover.tsx
│     ├─ progress.tsx
│     ├─ radio-group.tsx
│     ├─ resizable.tsx
│     ├─ scroll-area.tsx
│     ├─ select.tsx
│     ├─ separator.tsx
│     ├─ sheet.tsx
│     ├─ sidebar.tsx
│     ├─ skeleton.tsx
│     ├─ slider.tsx
│     ├─ sonner.tsx
│     ├─ switch.tsx
│     ├─ table.tsx
│     ├─ tabs.tsx
│     ├─ textarea.tsx
│     ├─ toast.tsx
│     ├─ toaster.tsx
│     ├─ toggle-group.tsx
│     ├─ toggle.tsx
│     ├─ tooltip.tsx
│     ├─ use-mobile.tsx
│     └─ use-toast.ts
├─ components.json
├─ hooks
│  ├─ use-mobile.ts
│  └─ use-toast.ts
├─ lib
│  ├─ actions.ts
│  ├─ mock-data.ts
│  ├─ supabase
│  │  ├─ admin.ts
│  │  ├─ client.ts
│  │  ├─ content.ts
│  │  ├─ middleware.ts
│  │  ├─ products.ts
│  │  ├─ server.ts
│  │  ├─ settings.ts
│  │  └─ testimonials.ts
│  └─ utils.ts
├─ middleware.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.mjs
├─ public
│  ├─ crochet-gift-collection.png
│  ├─ crochet-item.png
│  ├─ custom-crochet-creations.png
│  ├─ elegant-crochet-home-decoration.png
│  ├─ Favicon.ico
│  ├─ Favicon.jpg
│  ├─ placeholder-logo.png
│  ├─ placeholder-logo.svg
│  ├─ placeholder-user.jpg
│  ├─ placeholder.jpg
│  ├─ placeholder.svg
│  ├─ seasonal-crochet-decorations.png
│  ├─ soft-baby-crochet-blanket.png
│  └─ stylish-crochet-accessories.png
├─ README.md
├─ scripts
│  ├─ 001_create_database_schema.sql
│  ├─ 002_create_admin_user_system.sql
│  ├─ 003_fix_rls_policies.sql
│  ├─ 004_simplify_rls_policies.sql
│  ├─ 005_disable_rls_for_public_data.sql
│  ├─ 006_remove_all_rls_policies.sql
│  ├─ 007_fix_public_data_access.sql
│  ├─ 008_restore_admin_access.sql
│  ├─ 009_fix_profile_policies.sql
│  ├─ 010_simplify_profile_access.sql
│  ├─ 011_create_testimonials_table.sql
│  ├─ 012_create_storage_bucket.sql
│  ├─ 013_add_inquiry_replies.sql
│  ├─ 014_fix_inquiry_read_status.sql
│  └─ 015_fix_contact_inquiries_table.sql
├─ styles
│  └─ globals.css
└─ tsconfig.json

```
```
crochet-business
├─ .eslintrc.json
├─ ADMIN_STYLE_GUIDE.md
├─ app
│  ├─ about
│  │  └─ page.tsx
│  ├─ admin
│  │  ├─ admin-error-override.css
│  │  ├─ announcements
│  │  │  ├─ content.tsx
│  │  │  ├─ new
│  │  │  │  ├─ form.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     ├─ edit
│  │  │     │  ├─ form.tsx
│  │  │     │  └─ page.tsx
│  │  │     └─ preview
│  │  │        └─ page.tsx
│  │  ├─ categories
│  │  │  └─ page.tsx
│  │  ├─ inquiries
│  │  │  ├─ actions.ts
│  │  │  ├─ inquiries-list.tsx
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ orders
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     └─ page.tsx
│  │  ├─ page.tsx
│  │  ├─ products
│  │  │  ├─ actions.ts
│  │  │  ├─ new
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]
│  │  │     └─ edit
│  │  │        └─ page.tsx
│  │  ├─ settings
│  │  │  └─ page.tsx
│  │  ├─ stripe-prices
│  │  │  └─ page.tsx
│  │  └─ testimonials
│  │     └─ page.tsx
│  ├─ api
│  │  ├─ admin
│  │  │  └─ product-prices
│  │  │     └─ [product_id]
│  │  │        └─ [currency]
│  │  │           └─ route.ts
│  │  ├─ announcements
│  │  │  ├─ active
│  │  │  │  └─ route.ts
│  │  │  ├─ route.ts
│  │  │  └─ [id]
│  │  │     └─ route.ts
│  │  ├─ exchange
│  │  │  └─ [target]
│  │  │     └─ route.ts
│  │  ├─ paypal
│  │  │  └─ create-order
│  │  │     └─ route.ts
│  │  ├─ products
│  │  │  └─ [slug]
│  │  │     └─ route.ts
│  │  ├─ revalidate
│  │  │  └─ route.ts
│  │  ├─ send-reply
│  │  │  └─ route.ts
│  │  ├─ stripe
│  │  │  ├─ checkout
│  │  │  │  └─ route.ts
│  │  │  └─ webhook
│  │  │     └─ route.ts
│  │  ├─ submit-review
│  │  │  └─ route.ts
│  │  └─ test-send-email
│  │     └─ route.ts
│  ├─ auth
│  │  ├─ error
│  │  │  └─ page.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ sign-up
│  │  │  └─ page.tsx
│  │  └─ sign-up-success
│  │     └─ page.tsx
│  ├─ contact
│  │  └─ page.tsx
│  ├─ faq
│  │  └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ products
│  │  ├─ page.tsx
│  │  ├─ [category]
│  │  │  ├─ page.tsx
│  │  │  └─ [productSlug]
│  │  │     ├─ page.tsx
│  │  │     ├─ page.tsx.new
│  │  │     └─ page.tsx.tmp
│  │  └─ [slug]
│  ├─ protected
│  │  └─ page.tsx
│  └─ test-announcements
│     └─ page.tsx
├─ COLOR_PALETTES.md
├─ components
│  ├─ admin
│  │  ├─ admin-body-attr.tsx
│  │  ├─ admin-header.tsx
│  │  └─ admin-nav.tsx
│  ├─ animations
│  │  ├─ fade-in.tsx
│  │  ├─ framer-animations.tsx
│  │  ├─ index.ts
│  │  └─ scroll-reveal.tsx
│  ├─ announcement-bar.tsx
│  ├─ announcement-popup.tsx
│  ├─ cart-aware-wrapper.tsx
│  ├─ cart-context.tsx
│  ├─ cart-drawer.tsx
│  ├─ category-filter.tsx
│  ├─ checkout-success-handler.tsx
│  ├─ conditional-announcement-bar.tsx
│  ├─ currency-converter.tsx
│  ├─ currency-disclaimer.tsx
│  ├─ currency-selector.tsx
│  ├─ email-template.tsx
│  ├─ emails
│  │  └─ order-confirmation.tsx
│  ├─ layout-wrapper.tsx
│  ├─ navigation.tsx
│  ├─ paypal-button.tsx
│  ├─ paypal-checkout-button.tsx
│  ├─ price-display.tsx
│  ├─ product-card.tsx
│  ├─ review-dialog.tsx
│  ├─ review-section.tsx
│  ├─ shipping-banner.tsx
│  ├─ shipping-info.tsx
│  ├─ sort-filter.tsx
│  ├─ static-announcement-bar.tsx
│  ├─ stripe-checkout-button.tsx
│  ├─ theme-provider.tsx
│  └─ ui
│     ├─ accordion.tsx
│     ├─ alert-dialog.tsx
│     ├─ alert.tsx
│     ├─ aspect-ratio.tsx
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ breadcrumb.tsx
│     ├─ button.tsx
│     ├─ calendar.tsx
│     ├─ card.tsx
│     ├─ carousel.tsx
│     ├─ chart.tsx
│     ├─ checkbox.tsx
│     ├─ collapsible.tsx
│     ├─ command.tsx
│     ├─ context-menu.tsx
│     ├─ dialog.tsx
│     ├─ drawer.tsx
│     ├─ dropdown-menu.tsx
│     ├─ form.tsx
│     ├─ hover-card.tsx
│     ├─ image-upload.tsx
│     ├─ input-otp.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ menubar.tsx
│     ├─ navigation-menu.tsx
│     ├─ pagination.tsx
│     ├─ popover.tsx
│     ├─ progress.tsx
│     ├─ radio-group.tsx
│     ├─ resizable.tsx
│     ├─ scroll-area.tsx
│     ├─ select.tsx
│     ├─ separator.tsx
│     ├─ sheet.tsx
│     ├─ sidebar.tsx
│     ├─ skeleton.tsx
│     ├─ slider.tsx
│     ├─ sonner.tsx
│     ├─ switch.tsx
│     ├─ table.tsx
│     ├─ tabs.tsx
│     ├─ textarea.tsx
│     ├─ toast.tsx
│     ├─ toaster.tsx
│     ├─ toggle-group.tsx
│     ├─ toggle.tsx
│     ├─ tooltip.tsx
│     ├─ use-mobile.tsx
│     └─ use-toast.ts
├─ components.json
├─ contexts
│  └─ currency-context.tsx
├─ docs
│  └─ STRIPE.md
├─ hooks
│  ├─ use-mobile.ts
│  └─ use-toast.ts
├─ lib
│  ├─ actions.ts
│  ├─ admin-style-examples.tsx
│  ├─ admin-styles.ts
│  ├─ admin-theme.ts
│  ├─ exchange.ts
│  ├─ mock-data.ts
│  ├─ supabase
│  │  ├─ admin.ts
│  │  ├─ announcements-client.ts
│  │  ├─ announcements.ts
│  │  ├─ client-products.ts
│  │  ├─ client.ts
│  │  ├─ content.ts
│  │  ├─ middleware.ts
│  │  ├─ products.ts
│  │  ├─ server.ts
│  │  ├─ service.ts
│  │  ├─ settings.ts
│  │  ├─ static.ts
│  │  └─ testimonials.ts
│  ├─ toast.ts
│  └─ utils.ts
├─ middleware.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.mjs
├─ public
│  ├─ Favicon.ico
│  ├─ logo.jpg
│  ├─ navlogo.png
│  ├─ placeholder-logo.png
│  ├─ placeholder-logo.svg
│  ├─ placeholder-user.jpg
│  ├─ placeholder.jpg
│  └─ placeholder.svg
├─ README.md
├─ scripts
│  ├─ 001_create_database_schema.sql
│  ├─ 002_create_admin_user_system.sql
│  ├─ 003_fix_rls_policies.sql
│  ├─ 004_simplify_rls_policies.sql
│  ├─ 005_disable_rls_for_public_data.sql
│  ├─ 006_remove_all_rls_policies.sql
│  ├─ 007_fix_public_data_access.sql
│  ├─ 008_restore_admin_access.sql
│  ├─ 009_fix_profile_policies.sql
│  ├─ 010_simplify_profile_access.sql
│  ├─ 011_create_testimonials_table.sql
│  ├─ 012_create_storage_bucket.sql
│  ├─ 013_add_inquiry_replies.sql
│  ├─ 014_fix_inquiry_read_status.sql
│  ├─ 015_fix_contact_inquiries_table.sql
│  ├─ 016_add_review_fields_to_testimonials.sql
│  ├─ 017_allow_anonymous_reviews.sql
│  ├─ 018_simple_anonymous_reviews.sql
│  ├─ 019_add_images_to_testimonials.sql
│  ├─ 020_create_product_prices_table.sql
│  ├─ 020_create_review_images_bucket.sql
│  ├─ 021_create_announcements_table.sql
│  ├─ 022_create_announcement_images_bucket.sql
│  └─ 022_create_orders_table.sql
├─ styles
│  └─ globals.css
├─ test-settings.js
├─ tsconfig.json
└─ types
   └─ react-email-render.d.ts

```