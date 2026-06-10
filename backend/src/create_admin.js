import bcrypt from 'bcryptjs';
import supabase from './config/supabase.js';

const SALT_ROUNDS = 12;

async function createAdmin() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('\nUsage: node src/create_admin.js <email> <password> "<full_name>"');
    console.log('Example: node src/create_admin.js myname@gmail.com mypassword123 "My Full Name"\n');
    process.exit(1);
  }

  const [email, password, fullName] = args;
  const username = email.split('@')[0];

  console.log(`Creating admin account for ${email}...`);

  try {
    // 1. Check if email already exists
    const { data: existingUser } = await supabase
      .from('user_pengguna')
      .select('id_user')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      console.log(`User with email "${email}" already exists. Promoting to admin instead...`);
      const { error: updateError } = await supabase
        .from('user_pengguna')
        .update({ role: 'admin' })
        .eq('email', email);

      if (updateError) {
        console.error('Error promoting user:', updateError);
      } else {
        console.log(`Success! User "${email}" has been promoted to Admin.`);
      }
      return;
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Insert the admin user
    const { data, error } = await supabase
      .from('user_pengguna')
      .insert({
        name: username,
        email: email,
        password: hashedPassword,
        nama_lengkap: fullName,
        no_telepon: null,
        role: 'admin',
        tgl_daftar: new Date().toISOString(),
        status: 'active'
      })
      .select('id_user, name, email, role, nama_lengkap');

    if (error) {
      console.error('Error inserting admin user:', error);
    } else {
      console.log('\n========================================');
      console.log('Admin User Created Successfully!');
      console.log('========================================');
      console.log('ID       :', data[0].id_user);
      console.log('Name     :', data[0].name);
      console.log('Email    :', data[0].email);
      console.log('Full Name:', data[0].nama_lengkap);
      console.log('Role     :', data[0].role);
      console.log('========================================\n');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createAdmin();
