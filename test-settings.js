// Simple test script to check and update site settings
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testSettings() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  console.log('Testing site settings...')

  // First, let's see what's in the database
  const { data: allSettings, error: selectError } = await supabase
    .from('site_settings')
    .select('*')

  if (selectError) {
    console.error('Error selecting settings:', selectError)
    return
  }

  console.log('Current settings in database:')
  console.table(allSettings)

  // Try to update the hero subtitle
  const testSubtitle = `Updated at ${new Date().toISOString()}`
  
  const { data: updateData, error: updateError } = await supabase
    .from('site_settings')
    .upsert({
      key: 'hero_subtitle',
      value: testSubtitle,
      type: 'text',
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' })

  if (updateError) {
    console.error('Error updating settings:', updateError)
    return
  }

  console.log('Update successful, new subtitle:', testSubtitle)

  // Verify the update
  const { data: verifyData, error: verifyError } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'hero_subtitle')

  if (verifyError) {
    console.error('Error verifying update:', verifyError)
    return
  }

  console.log('Verified settings:')
  console.table(verifyData)
}

testSettings().catch(console.error)
