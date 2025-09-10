-- Create announcements table for popup announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  cta_label TEXT,
  cta_url TEXT,
  image_url TEXT,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  show_on_pages TEXT[] DEFAULT ARRAY['all'], -- 'homepage', 'all', 'products'
  display_frequency TEXT DEFAULT 'session' CHECK (display_frequency IN ('every_visit', 'session', 'once_per_user')),
  popup_style TEXT DEFAULT 'medium' CHECK (popup_style IN ('small', 'medium', 'full_banner')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create an index for active announcements
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active, start_date, end_date);

-- Create an index for page targeting
CREATE INDEX IF NOT EXISTS idx_announcements_pages ON announcements USING GIN(show_on_pages);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read active announcements
CREATE POLICY "Public can view active announcements"
ON announcements
FOR SELECT
TO public
USING (
  is_active = true 
  AND start_date <= NOW() 
  AND (end_date IS NULL OR end_date >= NOW())
);

-- Policy: Only admins can manage announcements
CREATE POLICY "Admins can manage announcements"
ON announcements
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_announcements_updated_at();