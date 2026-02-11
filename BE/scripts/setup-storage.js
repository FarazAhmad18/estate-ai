require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setup() {
    // 1. Create avatars bucket (public)
    const { data: ab, error: abErr } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    })
    if (abErr && abErr.message !== 'The resource already exists') {
        console.error('Failed to create avatars bucket:', abErr.message)
    } else {
        console.log('avatars bucket:', ab ? 'created' : 'already exists')
    }

    // 2. Create property-images bucket (public)
    const { data: pb, error: pbErr } = await supabase.storage.createBucket('property-images', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    })
    if (pbErr && pbErr.message !== 'The resource already exists') {
        console.error('Failed to create property-images bucket:', pbErr.message)
    } else {
        console.log('property-images bucket:', pb ? 'created' : 'already exists')
    }

    // 3. Verify by listing all buckets
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets()
    if (listErr) {
        console.error('Failed to list buckets:', listErr.message)
    } else {
        console.log('\nAll buckets:')
        buckets.forEach(b => console.log(`  - ${b.name} (public: ${b.public})`))
    }
}

setup()
