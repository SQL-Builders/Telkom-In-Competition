import supabase from './config/supabase.js';

async function run() {
  try {
    const { data, error } = await supabase
      .from('user_pengguna')
      .select('id_user, name, email, role, status');
    
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }
    
    console.log('--- ALL USERS IN DB ---');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run();
