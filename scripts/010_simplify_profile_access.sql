-- First, completely remove all policies and RLS from profiles
DROP POLICY IF EXISTS "read_own_profile" ON profiles;
DROP POLICY IF EXISTS "admin_read_all_profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_own_read" ON profiles;
DROP POLICY IF EXISTS "profiles_own_update" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to view own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON profiles;

-- Disable RLS on profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Ensure the profiles table has the correct columns
ALTER TABLE profiles DROP COLUMN IF EXISTS updated_at;
ALTER TABLE profiles DROP COLUMN IF EXISTS created_at;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Clear and recreate your admin profile
DELETE FROM profiles WHERE id = 'ca1d3315-a0ab-4a1e-8d0a-45675cbb39b4';

INSERT INTO profiles (id, email, role, full_name)
VALUES (
  'ca1d3315-a0ab-4a1e-8d0a-45675cbb39b4',
  'lapsap808@gmail.com',
  'admin',
  'Admin User'
);

-- Grant access to authenticated users
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;
