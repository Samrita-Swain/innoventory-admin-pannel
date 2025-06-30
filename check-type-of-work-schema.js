import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();
const sql = neon(process.env.VITE_DATABASE_URL);

async function checkTypeOfWorkSchema() {
  try {
    console.log('🔍 Checking type_of_work table schema...');
    const schema = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'type_of_work' 
      ORDER BY ordinal_position
    `;
    
    console.log('📋 type_of_work table schema:');
    schema.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) default: ${col.column_default || 'none'}`);
    });

    // Try a simple insert to see what works
    console.log('\n🧪 Testing simple insert...');
    try {
      await sql`
        INSERT INTO type_of_work (name, description)
        VALUES ('Test Work Type', 'This is a test work type')
      `;
      console.log('✅ Simple insert successful');
      
      // Clean up
      await sql`DELETE FROM type_of_work WHERE name = 'Test Work Type'`;
      console.log('🧹 Test record cleaned up');
    } catch (insertError) {
      console.log('❌ Simple insert failed:', insertError.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTypeOfWorkSchema();
