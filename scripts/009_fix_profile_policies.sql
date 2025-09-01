-- First, drop all existing policies on the profiles table
DROP POLICY IF EXISTS "profiles_own_read" ON profiles;
DROP POLICY IF EXISTS "profiles_own_update" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to view own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON profiles;

-- Temporarily disable RLS to ensure we can fix everything
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Make sure your specific user has a profile with admin role
INSERT INTO profiles (id, email, role)
VALUES ('ca1d3315-a0ab-4a1e-8d0a-45675cbb39b4', 'lapsap808@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows authenticated users to read their own profile
CREATE POLICY "read_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create a simple policy that allows admins to read all profiles
CREATE POLICY "admin_read_all_profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Grant necessary privileges
GRANT ALL ON profiles TO authenticated;
